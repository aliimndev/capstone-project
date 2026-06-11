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
from app.services.wewatch_service import WeWatchService, get_wewatch_service
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


def _trending_movies_with_poster(tmdb_results: list, limit: int = 10) -> list[MovieBase]:
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
    wewatch_service: WeWatchService = Depends(get_wewatch_service),
    recommender_service: RecommenderService = Depends(get_recommender_service),
):

    """Get movie recommendations based on rated movies, selected movies, or legacy query."""
    movies_data = []

    raw_body_bytes = await http_request.body()
    raw_body_str = raw_body_bytes.decode("utf-8")
    logger.debug("raw request body: %s", raw_body_str)

    try:
        request_data = json.loads(raw_body_str) if raw_body_str else {}
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid JSON body: {exc}") from exc

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
        # 1) Preferred: recommendations based on 3 rated movies
        if request.rated_movies and len(request.rated_movies) > 0:
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
                recs = recommender_service.get_standalone_top_trending_recommendations(top_n=10)
                recs = recommender_service.enrich_recommendations_with_tmdb(recs, tmdb_service)
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
                recs = recommender_service.enrich_recommendations_with_tmdb(recs, tmdb_service)
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

        # 2) Legacy: recommendations based on 3 selected movies (no ratings)
        if request.movie_ids and len(request.movie_ids) > 0:
            legacy_recs = wewatch_service.recommend_from_selected(
                [int(x) for x in request.movie_ids], top_n=10
            )
            return RecommendationResponse(
                status="success",
                message=f"Found {len(legacy_recs)} recommendations",
                movies=[
                    {
                        "movieId": m.id,
                        "tmdbId": m.id,
                        "title": m.title,
                        "genres": None,
                        "source": "legacy_wewatch",
                    }
                    for m in legacy_recs
                ],
            )

        # 3) Legacy: If movie_id provided, get recommendations for that movie (TMDB)
        if request.movie_id:
            result = tmdb_service.get_movie_recommendations(request.movie_id)

            if not result or "results" not in result:
                raise HTTPException(status_code=404, detail="No movies found")

            for movie in result.get("results", [])[:3]:
                movies_data.append(
                    {
                        "movieId": movie.get("id"),
                        "tmdbId": movie.get("id"),
                        "title": movie.get("title", "Unknown"),
                        "genres": None,
                        "source": "legacy_tmdb",
                    }
                )

            return RecommendationResponse(
                status="success",
                message="Found 3 recommendations",
                movies=movies_data,
            )

        # 4) Legacy: If query provided, search for movies (TMDB)
        if request.query:
            result = tmdb_service.search_movies(request.query)

            if not result or "results" not in result:
                raise HTTPException(status_code=404, detail="No movies found")

            for movie in result.get("results", [])[:3]:
                movies_data.append(
                    {
                        "movieId": movie.get("id"),
                        "tmdbId": movie.get("id"),
                        "title": movie.get("title", "Unknown"),
                        "genres": None,
                        "source": "legacy_tmdb_search",
                    }
                )

            return RecommendationResponse(
                status="success",
                message="Found 3 recommendations",
                movies=movies_data,
            )

        raise HTTPException(
            status_code=400,
            detail="Please provide rated_movies, movie_ids, movie_id, or query parameter",
        )

    
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting recommendations: {str(e)}"
        )

@router.get("/trending", response_model=TrendingMoviesResponse)
async def get_trending(
    time_window: str = "week",
    tmdb_service: TMDBService = Depends(get_tmdb_service),
):
    """Get trending movies directly from TMDB (browse only, no catalog filter)."""
    try:
        result = tmdb_service.get_trending_movies(time_window, page=1)

        if not result or "results" not in result:
            raise HTTPException(
                status_code=404,
                detail="No trending movies found",
            )

        movies_data = _trending_movies_with_poster(result.get("results", []), limit=10)

        if not movies_data:
            raise HTTPException(
                status_code=404,
                detail="No trending movies with posters found",
            )

        logger.info("TMDB trending returned %d movies with poster_path", len(movies_data))

        return TrendingMoviesResponse(
            status="success",
            movies=movies_data,
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting trending movies: {str(e)}"
        )

@router.get("/search", response_model=SearchMoviesResponse)
async def search_movies(
    q: str,
    tmdb_service: TMDBService = Depends(get_tmdb_service),
):
    """Search movies directly from TMDB (discovery only, no catalog filter)."""
    if not q or len(q.strip()) < 2:
        raise HTTPException(
            status_code=400,
            detail="Query must be at least 2 characters"
        )
    
    try:
        result = tmdb_service.search_movies(q)
        
        if not result or "results" not in result:
            raise HTTPException(
                status_code=404,
                detail="No movies found"
            )
        
        movies_data = [
            _movie_base_from_tmdb(movie)
            for movie in result.get("results", [])
        ]

        if not movies_data:
            raise HTTPException(
                status_code=404,
                detail="No movies found for this search query",
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
        raise HTTPException(
            status_code=500,
            detail=f"Error searching movies: {str(e)}"
        )
