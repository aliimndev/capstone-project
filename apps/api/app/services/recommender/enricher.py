import logging
from typing import Any, List

from app.schemas.recommend import RecommendedMovie
from .id_mapper import IDMapper

logger = logging.getLogger(__name__)


class TMDBEnricher:
    def __init__(self, id_mapper: IDMapper) -> None:
        self.id_mapper = id_mapper

    def enrich_recommendations(
        self,
        recommendations: List[RecommendedMovie],
        tmdb_service: Any,
    ) -> List[RecommendedMovie]:
        enriched: List[RecommendedMovie] = []
        enriched_count = 0
        fallback_count = 0

        for rec in recommendations:
            tmdb_id = rec.tmdbId or self.id_mapper.resolve_movie_to_tmdb_id(rec.movieId)
            if tmdb_id is None:
                logger.warning(
                    "MovieLens->TMDB mapping failed: movieId=%d has no tmdbId in links",
                    rec.movieId,
                )
                enriched.append(
                    rec.model_copy(
                        update={
                            "poster_path": None,
                            "overview": None,
                        }
                    )
                )
                fallback_count += 1
                continue

            logger.info(
                "MovieLens->TMDB mapping: movieId=%d -> tmdbId=%d",
                rec.movieId,
                tmdb_id,
            )
            detail = tmdb_service.get_movie_details(int(tmdb_id))

            if detail:
                genres_list = detail.get("genres") or []
                genres_str = (
                    " | ".join(
                        g["name"]
                        for g in genres_list
                        if isinstance(g, dict) and g.get("name")
                    )
                    or rec.genres
                )

                enriched.append(
                    rec.model_copy(
                        update={
                            "tmdbId": int(detail.get("id", tmdb_id)),
                            "title": detail.get("title", rec.title),
                            "overview": detail.get("overview"),
                            "poster_path": detail.get("poster_path"),
                            "release_date": detail.get("release_date"),
                            "vote_average": detail.get("vote_average"),
                            "genres": genres_str,
                        }
                    )
                )
                enriched_count += 1
            else:
                logger.warning(
                    "TMDB enrichment failed for movieId=%d tmdbId=%d — keeping recommendation",
                    rec.movieId,
                    tmdb_id,
                )
                enriched.append(
                    rec.model_copy(
                        update={
                            "tmdbId": int(tmdb_id),
                            "poster_path": None,
                            "overview": None,
                        }
                    )
                )
                fallback_count += 1

        logger.info(
            "TMDB enrichment complete | total=%d | enriched=%d | fallback=%d",
            len(recommendations),
            enriched_count,
            fallback_count,
        )
        return enriched
