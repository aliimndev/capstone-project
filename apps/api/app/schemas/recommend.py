from pydantic import BaseModel, Field
from typing import Optional, List, Literal

ReactionType = Literal["loved it", "like it", "just normal", "dislike"]


class MovieBase(BaseModel):
    id: int
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None


class RecommendedMovie(BaseModel):
    movieId: int
    tmdbId: Optional[int] = None
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None
    genres: Optional[str] = None
    source: Optional[str] = None


class RatedMovieInput(BaseModel):
    movie_id: int = Field(..., description="TMDB movie ID")
    reaction: ReactionType


class RecommendationRequest(BaseModel):
    rated_movies: List[RatedMovieInput]


class RecommendationMeta(BaseModel):
    inference_count: int
    fallback_count: int
    total_count: int
    inference_time_ms: float
    total_time_ms: float
    used_model_fallback: bool = False
    unmapped_tmdb_ids: Optional[List[int]] = None


class RecommendationResponse(BaseModel):
    status: str
    message: str
    movies: List[RecommendedMovie]
    meta: Optional[RecommendationMeta] = None


class TrendingMoviesResponse(BaseModel):
    status: str
    movies: List[MovieBase]


class SearchMoviesResponse(BaseModel):
    status: str
    query: str
    movies: List[MovieBase]
