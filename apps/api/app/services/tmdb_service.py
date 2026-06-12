import logging
from typing import Any, Optional

import requests

from core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()


class TMDBService:
    """Thin wrapper around the TMDB REST API."""

    def __init__(self) -> None:
        self.api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL

    def search_movies(self, query: str, page: int = 1) -> Optional[dict[str, Any]]:
        """Search movies by query."""
        try:
            endpoint = f"{self.base_url}/search/movie"
            params = {
                "api_key": self.api_key,
                "query": query,
                "page": page,
                "language": "en-US",
            }
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            logger.exception("Error searching movies for query=%r", query)
            return None

    def get_movie_details(self, movie_id: int) -> Optional[dict[str, Any]]:
        """Get detailed information about a specific movie."""
        try:
            endpoint = f"{self.base_url}/movie/{movie_id}"
            params = {
                "api_key": self.api_key,
                "language": "en-US",
            }
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            logger.exception("Error getting movie details for id=%d", movie_id)
            return None

    def get_trending_movies(
        self, time_window: str = "week", page: int = 1
    ) -> Optional[dict[str, Any]]:
        """Get trending movies for a given time window."""
        try:
            endpoint = f"{self.base_url}/trending/movie/{time_window}"
            params = {
                "api_key": self.api_key,
                "language": "en-US",
                "page": page,
            }
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            logger.exception("Error getting trending movies")
            return None




def get_tmdb_service() -> TMDBService:
    return TMDBService()
