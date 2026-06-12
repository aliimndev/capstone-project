from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from app.schemas.recommend import RecommendedMovie
from .recommender.model_loader import ModelLoader
from .recommender.id_mapper import IDMapper
from .recommender.engine import InferenceEngine
from .recommender.enricher import TMDBEnricher


class RecommenderService:
    """Facade for the recommendation system, integrating model loading, ID mapping, and inference."""

    def __init__(self) -> None:
        self.model_loader = ModelLoader()
        self.id_mapper = IDMapper()
        self.engine = InferenceEngine(self.model_loader, self.id_mapper)
        self.enricher = TMDBEnricher(self.id_mapper)

    @property
    def is_loaded(self) -> bool:
        """Check if the recommender model has been loaded."""
        return self.model_loader.is_loaded

    def load(self, artifact_path: Optional[Path] = None) -> None:
        """Load the ML model artifacts and build ID mappings."""
        if self.is_loaded:
            return

        self.model_loader.load(artifact_path)

        if self.model_loader.art:
            self.id_mapper.build_mappings(
                self.model_loader.art["links"], self.model_loader.catalog_ids
            )

    def is_tmdb_in_catalog(self, tmdb_id: int) -> bool:
        """Check if a TMDB ID exists in the MovieLens catalog."""
        return self.id_mapper.is_tmdb_in_catalog(tmdb_id)

    def debug_log_tmdb_lookups(self, raw_rated_movies: List[Dict[str, Any]]) -> None:
        """Log TMDB to MovieLens resolution for debugging purposes."""
        self.engine.debug_log_tmdb_lookups(raw_rated_movies)

    def recommend_from_ratings(
        self,
        rated_movies: List[Dict[str, Any]],
        top_n: int = 10,
        raw_rated_movies: Optional[List[Dict[str, Any]]] = None,
    ) -> Tuple[List[RecommendedMovie], Dict[str, Any]]:
        """Generate personalized recommendations based on rated movies."""
        return self.engine.recommend_from_ratings(rated_movies, top_n, raw_rated_movies)

    def get_standalone_top_trending_recommendations(
        self,
        top_n: int = 10,
    ) -> List[RecommendedMovie]:
        """Get top trending movies from the catalog as a fallback."""
        return self.engine.get_standalone_top_trending_recommendations(top_n)

    def enrich_recommendations_with_tmdb(
        self,
        recommendations: List[RecommendedMovie],
        tmdb_service: Any,
    ) -> List[RecommendedMovie]:
        """Fetch and enrich recommendations with TMDB metadata (poster, overview, etc)."""
        return self.enricher.enrich_recommendations(recommendations, tmdb_service)


_recommender_service: Optional[RecommenderService] = None


def get_recommender_service() -> RecommenderService:
    """Dependency injection provider for RecommenderService."""
    global _recommender_service
    if _recommender_service is None:
        _recommender_service = RecommenderService()
    return _recommender_service
