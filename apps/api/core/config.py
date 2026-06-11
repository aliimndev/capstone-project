import os
from functools import lru_cache

from pydantic_settings import BaseSettings

_DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://wemovies.vercel.app",
    "https://wemoviesai.vercel.app",
]


class Settings(BaseSettings):
    # API Configuration
    API_TITLE: str = "RekoFilm API"
    API_VERSION: str = "1.0.0"

    # Backend URL (untuk frontend mengetahui URL API)
    API_URL: str = os.getenv("API_URL", "http://localhost:8000")

    # TMDB Configuration
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "")
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"

    # Comma-separated extra CORS origins (e.g. preview deploy URLs)
    EXTRA_CORS_ORIGINS: str = ""

    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        origins = list(_DEFAULT_ORIGINS)
        if self.EXTRA_CORS_ORIGINS:
            origins.extend(
                part.strip()
                for part in self.EXTRA_CORS_ORIGINS.split(",")
                if part.strip()
            )
        return list(dict.fromkeys(origins))

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()
