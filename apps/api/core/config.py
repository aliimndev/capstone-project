import os
from functools import lru_cache

from pydantic_settings import BaseSettings

_DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://wemovies.vercel.app",
]


def _parse_allowed_origins() -> list[str]:
    extra = os.getenv("ALLOWED_ORIGINS", "")
    origins = list(_DEFAULT_ORIGINS)
    if extra:
        origins.extend(part.strip() for part in extra.split(",") if part.strip())
    return list(dict.fromkeys(origins))


class Settings(BaseSettings):
    # API Configuration
    API_TITLE: str = "RekoFilm API"
    API_VERSION: str = "1.0.0"

    # Backend URL (untuk frontend mengetahui URL API)
    API_URL: str = os.getenv("API_URL", "http://localhost:8000")

    # TMDB Configuration
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "")
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"

    # CORS Configuration
    ALLOWED_ORIGINS: list = _parse_allowed_origins()
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()
