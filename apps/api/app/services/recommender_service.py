from __future__ import annotations

import logging
import pickle
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix, issparse
from sklearn.preprocessing import normalize

from app.schemas.recommend import RecommendedMovie

logger = logging.getLogger(__name__)

REACTION_KEYS = {"loved it", "like it", "just normal", "dislike"}
DEFAULT_TOP_N = 10


class RecommenderService:
    """Loads recommender_artifacts.pkl once and runs hybrid CF+CB inference."""

    def __init__(self) -> None:
        self._art: Optional[Dict[str, Any]] = None
        self._tmdb_to_movie_id: Dict[int, int] = {}
        self._movie_id_to_tmdb: Dict[int, int] = {}
        self._loaded = False
        self._artifact_path: Optional[Path] = None

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    def load(self, artifact_path: Optional[Path] = None) -> None:
        if self._loaded:
            logger.info("Recommender model already loaded, skipping reload")
            return

        if artifact_path is None:
            artifact_path = (
                Path(__file__).resolve().parents[2] / "model" / "recommender_artifacts.pkl"
            )

        self._artifact_path = artifact_path
        logger.info("Loading recommender model from %s", artifact_path)

        if not artifact_path.exists():
            raise FileNotFoundError(f"Model artifact not found: {artifact_path}")

        file_size_mb = artifact_path.stat().st_size / 1024 / 1024
        load_start = time.perf_counter()

        with open(artifact_path, "rb") as f:
            art = pickle.load(f)

        art["movie_latent_norm"] = normalize(art["movie_latent_matrix"], norm="l2")

        catalog_ids = set(art["movies_filtered"]["movieId"].astype(int).tolist())
        self._build_id_mappings(art["links"], catalog_ids)

        self._art = art
        self._loaded = True

        load_ms = (time.perf_counter() - load_start) * 1000
        logger.info(
            "Model loaded in %.1fms | size=%.1fMB | catalog=%d movies | "
            "tmdb_mappings=%d | latent_shape=%s | content_shape=%s",
            load_ms,
            file_size_mb,
            len(catalog_ids),
            len(self._tmdb_to_movie_id),
            art["movie_latent_matrix"].shape,
            art["content_features"].shape,
        )

    def _build_id_mappings(self, links: pd.DataFrame, catalog_ids: Set[int]) -> None:
        logger.info("Building TMDB <-> MovieLens ID mappings from links table")

        links = links.copy()
        links["tmdbId_num"] = pd.to_numeric(links["tmdbId"], errors="coerce")
        valid = links[links["tmdbId_num"].notna()].copy()
        valid["tmdbId_int"] = valid["tmdbId_num"].astype(int)
        valid["movieId_int"] = valid["movieId"].astype(int)

        tmdb_to_movie: Dict[int, int] = {}
        duplicate_tmdb = 0
        for _, row in valid.iterrows():
            tmdb_id = int(row["tmdbId_int"])
            movie_id = int(row["movieId_int"])
            if movie_id not in catalog_ids:
                continue
            if tmdb_id in tmdb_to_movie and tmdb_to_movie[tmdb_id] != movie_id:
                duplicate_tmdb += 1
                continue
            tmdb_to_movie[tmdb_id] = movie_id

        movie_to_tmdb: Dict[int, int] = {}
        for tmdb_id, movie_id in tmdb_to_movie.items():
            if movie_id not in movie_to_tmdb:
                movie_to_tmdb[movie_id] = tmdb_id

        self._tmdb_to_movie_id = tmdb_to_movie
        self._movie_id_to_tmdb = movie_to_tmdb

        logger.info(
            "ID mappings built | tmdb_to_movieId=%d | movieId_to_tmdb=%d | "
            "duplicate_tmdb_skipped=%d",
            len(self._tmdb_to_movie_id),
            len(self._movie_id_to_tmdb),
            duplicate_tmdb,
        )

    def enrich_recommendations_with_tmdb(
        self,
        recommendations: List[RecommendedMovie],
        tmdb_service: Any,
    ) -> List[RecommendedMovie]:
        """Map MovieLens IDs to TMDB and enrich each recommendation with TMDB metadata."""
        enriched: List[RecommendedMovie] = []
        enriched_count = 0
        fallback_count = 0

        for rec in recommendations:
            tmdb_id = rec.tmdbId or self._movie_id_to_tmdb.get(rec.movieId)
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
                genres_str = " | ".join(
                    g["name"]
                    for g in genres_list
                    if isinstance(g, dict) and g.get("name")
                ) or rec.genres

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

    def _lookup_tmdb_raw(self, movie_id_raw: Any) -> Optional[int]:
        """Resolve raw movie_id value to MovieLens movieId via links table only."""
        if movie_id_raw is None:
            return None
        try:
            tmdb_id = int(movie_id_raw)
        except (TypeError, ValueError):
            return None
        return self._tmdb_to_movie_id.get(tmdb_id)

    def debug_log_tmdb_lookups(self, raw_rated_movies: List[Dict[str, Any]]) -> None:
        """Log request movie_id values and TMDB lookup results before inference mapping."""
        logger.debug("rated_movies payload: %s", raw_rated_movies)

        for entry in raw_rated_movies:
            movie_id_raw = entry.get("movie_id")
            mapped_movie_id = self._lookup_tmdb_raw(movie_id_raw)

            logger.debug("movie_id=%r", movie_id_raw)
            logger.debug("type=%s", type(movie_id_raw).__name__)
            logger.debug("mapped_movieId=%s", mapped_movie_id)

    def resolve_tmdb_to_movie_id(self, tmdb_id: int) -> Optional[int]:
        """Map TMDB ID to MovieLens movieId via links table only."""
        movie_id = self._tmdb_to_movie_id.get(int(tmdb_id))
        if movie_id is not None:
            logger.info("TMDB mapping: tmdbId=%d -> movieId=%d", tmdb_id, movie_id)
        else:
            logger.warning("TMDB mapping failed: tmdbId=%d not found in links catalog", tmdb_id)
        return movie_id

    def _lookup_movie_index(self, movie_id: int) -> Optional[int]:
        if self._art is None:
            return None
        movie_to_index = self._art["movie_to_index"]
        idx = movie_to_index.get(int(movie_id))
        if idx is None:
            idx = movie_to_index.get(np.int32(movie_id))
        return int(idx) if idx is not None else None

    def _build_movie_result(self, movie_id: int, source: str) -> Optional[RecommendedMovie]:
        if self._art is None:
            return None

        movies_df = self._art["movies_filtered"]
        row_df = movies_df[movies_df["movieId"] == movie_id]
        if row_df.empty:
            return None

        row = row_df.iloc[0]
        tmdb_id = self._movie_id_to_tmdb.get(movie_id)

        return RecommendedMovie(
            movieId=movie_id,
            tmdbId=tmdb_id,
            title=str(row["title"]),
            genres=str(row["genres"]) if pd.notna(row.get("genres")) else None,
            source=source,
        )

    def _fill_from_top_trending(
        self,
        results: List[RecommendedMovie],
        excluded_movie_ids: Set[int],
        top_n: int,
    ) -> Tuple[List[RecommendedMovie], int]:
        """
        Fallback: append movies from top_trending until top_n is reached.

        Skips duplicates and any movieId already in excluded_movie_ids or results.
        """
        if self._art is None:
            return results, 0

        existing_ids = excluded_movie_ids | {r.movieId for r in results}
        top_trending = self._art["top_trending"]
        added = 0

        logger.info(
            "Applying top_trending fallback | current=%d | target=%d | excluded=%d",
            len(results),
            top_n,
            len(existing_ids),
        )

        for _, row in top_trending.iterrows():
            if len(results) >= top_n:
                break

            movie_id = int(row["movieId"])
            if movie_id in existing_ids:
                continue

            item = RecommendedMovie(
                movieId=movie_id,
                tmdbId=self._movie_id_to_tmdb.get(movie_id),
                title=str(row["title"]),
                genres=str(row["genres"]) if pd.notna(row.get("genres")) else None,
                source="top_trending_fallback",
            )
            results.append(item)
            existing_ids.add(movie_id)
            added += 1
            logger.debug(
                "Fallback added movieId=%d title=%s",
                movie_id,
                item.title,
            )

        if added:
            logger.info("top_trending fallback added %d movies", added)
        else:
            logger.info("top_trending fallback added 0 movies")

        return results, added

    def get_standalone_top_trending_recommendations(
        self,
        top_n: int = DEFAULT_TOP_N,
    ) -> List[RecommendedMovie]:
        """Return popular catalog movies from recommender_artifacts.pkl top_trending."""
        results, _ = self._fill_from_top_trending(
            [],
            excluded_movie_ids=set(),
            top_n=top_n,
        )
        logger.info(
            "Standalone top_trending from recommender_artifacts.pkl returned %d movies",
            len(results),
        )
        return results

    def recommend_from_ratings(
        self,
        rated_movies: List[Dict[str, Any]],
        top_n: int = DEFAULT_TOP_N,
        raw_rated_movies: Optional[List[Dict[str, Any]]] = None,
    ) -> Tuple[List[RecommendedMovie], Dict[str, Any]]:
        if not self._loaded or self._art is None:
            raise RuntimeError("Recommender model is not loaded")

        inference_start = time.perf_counter()
        logger.info("Starting recommendation generation for %d rated movies", len(rated_movies))

        art = self._art
        alpha_cf = float(art.get("alpha_cf", 0.65))
        alpha_cb = float(art.get("alpha_cb", 0.35))

        movie_latent = art["movie_latent_matrix"]
        movie_latent_norm = art["movie_latent_norm"]
        content_feat = art["content_features"]
        movie_to_index = art["movie_to_index"]
        index_to_movie = art["index_to_movie"]
        reaction_w = art["reaction_weights"]
        n_comp = art["n_components"]

        cf_profile = np.zeros(n_comp, dtype="float32")
        if issparse(content_feat):
            cb_profile = csr_matrix((1, content_feat.shape[1]), dtype="float32")
        else:
            cb_profile = np.zeros(content_feat.shape[1], dtype="float32")

        input_movie_ids: Set[int] = set()
        mapping_log: List[Dict[str, Any]] = []
        selected_tmdb_ids = [int(item["movie_id"]) for item in rated_movies]

        for item in rated_movies:
            tmdb_id = int(item["movie_id"])
            reaction = str(item["reaction"]).lower().strip()

            if reaction not in REACTION_KEYS:
                raise ValueError(f"Invalid reaction: {reaction}")

            movie_id = self.resolve_tmdb_to_movie_id(tmdb_id)
            mapping_log.append(
                {
                    "tmdbId": tmdb_id,
                    "movieId": movie_id,
                    "reaction": reaction,
                    "mapped": movie_id is not None,
                }
            )

            if movie_id is None:
                continue

            idx = self._lookup_movie_index(movie_id)
            if idx is None:
                logger.warning(
                    "movieId=%d (tmdbId=%d) not found in movie_to_index",
                    movie_id,
                    tmdb_id,
                )
                continue

            weight = float(reaction_w.get(reaction, 0.1))
            cf_profile += movie_latent[idx] * weight

            if issparse(content_feat):
                cb_profile = cb_profile + content_feat[idx] * weight
            else:
                cb_profile += content_feat[idx] * weight

            input_movie_ids.add(movie_id)
            logger.info(
                "Included in profile | tmdbId=%d -> movieId=%d | index=%d | reaction=%s | weight=%.2f",
                tmdb_id,
                movie_id,
                idx,
                reaction,
                weight,
            )

        mapped_movielens_ids = sorted(input_movie_ids)
        unmapped_tmdb_ids = [
            entry["tmdbId"]
            for entry in mapping_log
            if not entry.get("mapped")
        ]

        logger.info(
            "Pre-inference mapping | selected_tmdb_ids=%s | mapped_movielens_ids=%s | "
            "number_of_valid_movies=%d | unmapped_tmdb_ids=%s",
            selected_tmdb_ids,
            mapped_movielens_ids,
            len(input_movie_ids),
            unmapped_tmdb_ids,
        )

        if not input_movie_ids:
            total_ms = (time.perf_counter() - inference_start) * 1000
            logger.warning(
                "Skipping personalized inference — no MovieLens mapping for rated TMDB IDs: %s. "
                "Will use top_trending from recommender_artifacts.pkl",
                unmapped_tmdb_ids,
            )
            meta = {
                "inference_count": 0,
                "fallback_count": 0,
                "total_count": 0,
                "inference_time_ms": 0.0,
                "total_time_ms": round(total_ms, 2),
                "input_movie_ids": [],
                "mappings": mapping_log,
                "used_model_fallback": True,
                "unmapped_tmdb_ids": unmapped_tmdb_ids,
            }
            return [], meta

        logger.info(
            "Entering model inference using recommender_artifacts.pkl | valid_movies=%d",
            len(input_movie_ids),
        )

        score_start = time.perf_counter()

        cf_norm = cf_profile / (np.linalg.norm(cf_profile) + 1e-10)
        cf_scores = movie_latent_norm.dot(cf_norm)

        if issparse(content_feat):
            cb_norm = cb_profile / (np.linalg.norm(cb_profile.toarray()) + 1e-10)
            cb_scores = content_feat.dot(cb_norm.T).toarray().flatten()
        else:
            cb_norm = cb_profile / (np.linalg.norm(cb_profile) + 1e-10)
            cb_scores = np.dot(content_feat, cb_norm)

        scores = alpha_cf * cf_scores + alpha_cb * cb_scores

        for mid in input_movie_ids:
            idx = self._lookup_movie_index(mid)
            if idx is not None:
                scores[idx] = -np.inf

        ranked_idx = np.argsort(-scores)
        score_ms = (time.perf_counter() - score_start) * 1000

        results: List[RecommendedMovie] = []
        for idx in ranked_idx:
            if len(results) >= top_n:
                break
            if scores[idx] == -np.inf:
                continue

            movie_id = int(index_to_movie[int(idx)])
            item = self._build_movie_result(movie_id, source="inference")
            if item is None:
                continue
            results.append(item)

        inference_count = len(results)
        fallback_count = 0

        if len(results) < top_n:
            results, fallback_count = self._fill_from_top_trending(
                results,
                excluded_movie_ids=input_movie_ids,
                top_n=top_n,
            )

        total_ms = (time.perf_counter() - inference_start) * 1000

        meta = {
            "inference_count": inference_count,
            "fallback_count": fallback_count,
            "total_count": len(results),
            "inference_time_ms": round(score_ms, 2),
            "total_time_ms": round(total_ms, 2),
            "input_movie_ids": sorted(input_movie_ids),
            "mappings": mapping_log,
            "used_model_fallback": False,
            "unmapped_tmdb_ids": unmapped_tmdb_ids or None,
        }

        logger.info(
            "Recommendation generation complete | inference=%d | fallback=%d | total=%d | "
            "score_time=%.1fms | total_time=%.1fms",
            inference_count,
            fallback_count,
            len(results),
            score_ms,
            total_ms,
        )

        return results[:top_n], meta


_recommender_service: Optional[RecommenderService] = None


def get_recommender_service() -> RecommenderService:
    global _recommender_service
    if _recommender_service is None:
        _recommender_service = RecommenderService()
    return _recommender_service
