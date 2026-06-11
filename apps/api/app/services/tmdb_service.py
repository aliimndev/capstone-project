import requests
from typing import Optional, List, Dict, Any
from core.config import get_settings

settings = get_settings()

class TMDBService:
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL
        
    def search_movies(self, query: str, page: int = 1) -> Optional[Dict[str, Any]]:
        """Search movies by query"""
        try:
            endpoint = f"{self.base_url}/search/movie"
            params = {
                "api_key": self.api_key,
                "query": query,
                "page": page,
                "language": "en-US"
            }
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error searching movies: {e}")
            return None
    
    def get_movie_details(self, movie_id: int) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific movie"""
        try:
            endpoint = f"{self.base_url}/movie/{movie_id}"
            params = {
                "api_key": self.api_key,
                "language": "en-US"
            }
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting movie details: {e}")
            return None
    
    def get_trending_movies(
        self, time_window: str = "week", page: int = 1
    ) -> Optional[Dict[str, Any]]:
        """Get trending movies"""
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
        except requests.exceptions.RequestException as e:
            print(f"Error getting trending movies: {e}")
            return None
    
    def get_movie_recommendations(self, movie_id: int) -> Optional[Dict[str, Any]]:
        """Get movie recommendations based on a specific movie"""
        try:
            endpoint = f"{self.base_url}/movie/{movie_id}/recommendations"
            params = {
                "api_key": self.api_key,
                "language": "en-US"
            }
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting recommendations: {e}")
            return None

def get_tmdb_service() -> TMDBService:
    return TMDBService()
