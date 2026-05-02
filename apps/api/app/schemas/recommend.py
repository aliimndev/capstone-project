from pydantic import BaseModel
from typing import Optional, List

class MovieBase(BaseModel):
    id: int
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None

class RecommendationRequest(BaseModel):
    movie_id: Optional[int] = None
    query: Optional[str] = None
    user_preference: Optional[str] = None

class RecommendationResponse(BaseModel):
    status: str
    message: str
    movies: List[MovieBase]
    recommendation_text: Optional[str] = None

class TrendingMoviesResponse(BaseModel):
    status: str
    movies: List[MovieBase]
