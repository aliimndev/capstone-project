from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.recommend import (
    RecommendationRequest,
    RecommendationResponse,
    TrendingMoviesResponse,
    MovieBase
)
from app.services.tmdb_service import get_tmdb_service, TMDBService
from app.services.wewatch_service import WeWatchService, get_wewatch_service


router = APIRouter(prefix="/api/v1/recommendations", tags=["recommendations"])

@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    tmdb_service: TMDBService = Depends(get_tmdb_service),
    wewatch_service: WeWatchService = Depends(get_wewatch_service),
):

    """Get movie recommendations based on query or movie ID"""
    movies_data = []
    
    try:
        # 1) Preferred: recommendations based on 3 selected movies
        if request.movie_ids and len(request.movie_ids) > 0:
            recs = wewatch_service.recommend_from_selected([int(x) for x in request.movie_ids], top_n=3)
            return RecommendationResponse(
                status="success",
                message="Found 3 recommendations",
                movies=recs,
            )

        # 2) Legacy: If movie_id provided, get recommendations for that movie (TMDB)
        if request.movie_id:
            result = tmdb_service.get_movie_recommendations(request.movie_id)

            if not result or "results" not in result:
                raise HTTPException(status_code=404, detail="No movies found")

            for movie in result.get("results", [])[:3]:
                movies_data.append(
                    MovieBase(
                        id=movie.get("id"),
                        title=movie.get("title", "Unknown"),
                        overview=movie.get("overview"),
                        poster_path=movie.get("poster_path"),
                        release_date=movie.get("release_date"),
                        vote_average=movie.get("vote_average"),
                    )
                )

            return RecommendationResponse(
                status="success",
                message="Found 3 recommendations",
                movies=movies_data,
            )

        # 3) Legacy: If query provided, search for movies (TMDB)
        if request.query:
            result = tmdb_service.search_movies(request.query)

            if not result or "results" not in result:
                raise HTTPException(status_code=404, detail="No movies found")

            for movie in result.get("results", [])[:3]:
                movies_data.append(
                    MovieBase(
                        id=movie.get("id"),
                        title=movie.get("title", "Unknown"),
                        overview=movie.get("overview"),
                        poster_path=movie.get("poster_path"),
                        release_date=movie.get("release_date"),
                        vote_average=movie.get("vote_average"),
                    )
                )

            return RecommendationResponse(
                status="success",
                message="Found 3 recommendations",
                movies=movies_data,
            )

        raise HTTPException(
            status_code=400,
            detail="Please provide movie_ids (selected movies) or movie_id or query parameter",
        )

    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting recommendations: {str(e)}"
        )

@router.get("/trending", response_model=TrendingMoviesResponse)
async def get_trending(
    time_window: str = "week",
    tmdb_service: TMDBService = Depends(get_tmdb_service)
):
    """Get trending movies"""
    try:
        result = tmdb_service.get_trending_movies(time_window)
        
        if not result or "results" not in result:
            raise HTTPException(
                status_code=404,
                detail="No trending movies found"
            )
        
        movies_data = []
        for movie in result.get("results", [])[:10]:  # Limit to 10 movies
            movies_data.append(MovieBase(
                id=movie.get("id"),
                title=movie.get("title", "Unknown"),
                overview=movie.get("overview"),
                poster_path=movie.get("poster_path"),
                release_date=movie.get("release_date"),
                vote_average=movie.get("vote_average")
            ))
        
        return TrendingMoviesResponse(
            status="success",
            movies=movies_data
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting trending movies: {str(e)}"
        )

@router.get("/search")
async def search_movies(
    q: str,
    tmdb_service: TMDBService = Depends(get_tmdb_service)
):
    """Search for movies by title"""
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
        
        movies_data = []
        for movie in result.get("results", [])[:10]:
            movies_data.append(MovieBase(
                id=movie.get("id"),
                title=movie.get("title", "Unknown"),
                overview=movie.get("overview"),
                poster_path=movie.get("poster_path"),
                release_date=movie.get("release_date"),
                vote_average=movie.get("vote_average")
            ))
        
        return {
            "status": "success",
            "query": q,
            "movies": movies_data
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching movies: {str(e)}"
        )
