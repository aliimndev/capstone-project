import json
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import ValidationError
from app.schemas.recommend import (
    RecommendationRequest,
    RecommendationResponse,
    RecommendationMeta,
    TrendingMoviesResponse,
    SearchMoviesResponse,
    MovieBase,
)
from app.services.tmdb_service import get_tmdb_service, TMDBService
from app.services.recommender_service import RecommenderService, get_recommender_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/recommendations", tags=["recommendations"])


def _movie_base_from_tmdb(movie: dict) -> MovieBase:
    return MovieBase(
        id=movie.get("id"),
        title=movie.get("title", "Unknown"),
        overview=movie.get("overview"),
        poster_path=movie.get("poster_path"),
        release_date=movie.get("release_date"),
        vote_average=movie.get("vote_average"),
        vote_count=movie.get("vote_count"),
    )


def _movie_base_from_recommended(movie) -> MovieBase:
    return MovieBase(
        id=movie.tmdbId or movie.movieId,
        title=movie.title,
        overview=movie.overview,
        poster_path=movie.poster_path,
        release_date=movie.release_date,
        vote_average=movie.vote_average,
        vote_count=None,
    )


def _trending_movies_with_poster(
    tmdb_results: list, limit: int = 10
) -> list[MovieBase]:
    """Return the first TMDB trending movies that have a poster_path."""
    movies_data: list[MovieBase] = []
    for movie in tmdb_results:
        if not movie.get("poster_path"):
            continue
        movies_data.append(_movie_base_from_tmdb(movie))
        if len(movies_data) >= limit:
            break
    return movies_data


@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(
    http_request: Request,
    tmdb_service: TMDBService = Depends(get_tmdb_service),
    recommender_service: RecommenderService = Depends(get_recommender_service),
):
    """Get movie recommendations based on rated movies."""
    raw_body_bytes = await http_request.body()
    raw_body_str = raw_body_bytes.decode("utf-8")
    logger.debug("raw request body: %s", raw_body_str)

    try:
        request_data = json.loads(raw_body_str) if raw_body_str else {}
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=400, detail=f"Invalid JSON body: {exc}"
        ) from exc

    raw_rated_movies = request_data.get("rated_movies")
    if raw_rated_movies is not None:
        logger.debug("rated_movies payload: %s", raw_rated_movies)
        if recommender_service.is_loaded:
            recommender_service.debug_log_tmdb_lookups(raw_rated_movies)

    try:
        request = RecommendationRequest.model_validate(request_data)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=exc.errors()) from exc

    try:
        if len(request.rated_movies) != 3:
            raise HTTPException(
                status_code=400,
                detail="Exactly 3 rated movies are required",
            )

        if not recommender_service.is_loaded:
            raise HTTPException(
                status_code=503,
                detail="Recommendation model is not available",
            )

        rated_payload = [
            {"movie_id": item.movie_id, "reaction": item.reaction}
            for item in request.rated_movies
        ]

        recs, meta = recommender_service.recommend_from_ratings(
            rated_payload,
            top_n=10,
            raw_rated_movies=raw_rated_movies or [],
        )

        if meta.get("used_model_fallback"):
            recs = recommender_service.get_standalone_top_trending_recommendations(
                top_n=10
            )
            recs = recommender_service.enrich_recommendations_with_tmdb(
                recs, tmdb_service
            )
            message = (
                f"Found {len(recs)} recommendations "
                "(top trending dari recommender_artifacts.pkl — "
                "film pilihan belum ada di katalog MovieLens)"
            )
            meta = {
                **meta,
                "fallback_count": len(recs),
                "total_count": len(recs),
            }
        else:
            recs = recommender_service.enrich_recommendations_with_tmdb(
                recs, tmdb_service
            )
            message = f"Found {len(recs)} recommendations dari model ML"
            if meta["fallback_count"] > 0:
                message += (
                    f" ({meta['inference_count']} dari inference, "
                    f"{meta['fallback_count']} dari top_trending fallback)"
                )

        return RecommendationResponse(
            status="success",
            message=message,
            movies=recs,
            meta=RecommendationMeta(
                inference_count=meta["inference_count"],
                fallback_count=meta["fallback_count"],
                total_count=len(recs),
                inference_time_ms=meta["inference_time_ms"],
                total_time_ms=meta["total_time_ms"],
                used_model_fallback=meta.get("used_model_fallback", False),
                unmapped_tmdb_ids=meta.get("unmapped_tmdb_ids"),
            ),
        )

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error getting recommendations: {str(e)}"
        )


@router.get("/trending", response_model=TrendingMoviesResponse)
async def get_trending(
    time_window: str = "week",
    catalog_only: bool = False,
    limit: int = 10,
    tmdb_service: TMDBService = Depends(get_tmdb_service),
    recommender_service: RecommenderService = Depends(get_recommender_service),
):
    """Get browse movies. With catalog_only=true, only return movies known to the ML model."""
    try:
        safe_limit = max(1, min(limit, 30))

        if catalog_only:
            if not recommender_service.is_loaded:
                raise HTTPException(
                    status_code=503,
                    detail="Recommendation model is not available",
                )

            recs = recommender_service.get_standalone_top_trending_recommendations(
                top_n=safe_limit
            )
            recs = recommender_service.enrich_recommendations_with_tmdb(
                recs, tmdb_service
            )
            movies_data = [_movie_base_from_recommended(rec) for rec in recs]

            if not movies_data:
                raise HTTPException(
                    status_code=404,
                    detail="No catalog movies found",
                )

            logger.info(
                "Catalog browse returned %d movies from recommender top_trending",
                len(movies_data),
            )

            return TrendingMoviesResponse(
                status="success",
                movies=movies_data[:safe_limit],
            )

        result = tmdb_service.get_trending_movies(time_window, page=1)

        if not result or "results" not in result:
            raise HTTPException(
                status_code=404,
                detail="No trending movies found",
            )

        movies_data = _trending_movies_with_poster(
            result.get("results", []), limit=safe_limit
        )

        if not movies_data:
            raise HTTPException(
                status_code=404,
                detail="No trending movies with posters found",
            )

        logger.info(
            "TMDB trending returned %d movies with poster_path", len(movies_data)
        )

        return TrendingMoviesResponse(
            status="success",
            movies=movies_data,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error getting trending movies: {str(e)}"
        )


@router.get("/search", response_model=SearchMoviesResponse)
async def search_movies(
    q: str,
    catalog_only: bool = False,
    tmdb_service: TMDBService = Depends(get_tmdb_service),
    recommender_service: RecommenderService = Depends(get_recommender_service),
):
    """Search movies from TMDB. With catalog_only=true, only return movies known to the ML model."""
    if not q or len(q.strip()) < 2:
        raise HTTPException(
            status_code=400, detail="Query must be at least 2 characters"
        )

    try:
        result = tmdb_service.search_movies(q)

        if not result or "results" not in result:
            raise HTTPException(status_code=404, detail="No movies found")

        movies_data = [
            _movie_base_from_tmdb(movie) for movie in result.get("results", [])
        ]

        if catalog_only and recommender_service.is_loaded:
            before = len(movies_data)
            movies_data = [
                movie
                for movie in movies_data
                if recommender_service.is_tmdb_in_catalog(movie.id)
            ]
            logger.info(
                "Catalog search filter for %r | before=%d | after=%d",
                q,
                before,
                len(movies_data),
            )

        if not movies_data:
            raise HTTPException(
                status_code=404,
                detail=(
                    "No catalog movies found for this search query"
                    if catalog_only
                    else "No movies found for this search query"
                ),
            )

        logger.info("TMDB search for %r returned %d movies", q, len(movies_data))

        return SearchMoviesResponse(
            status="success",
            query=q,
            movies=movies_data,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching movies: {str(e)}")
