import logging
from typing import Any, Dict, Optional, Set

import pandas as pd

logger = logging.getLogger(__name__)


class IDMapper:
    def __init__(self) -> None:
        self.tmdb_to_movie_id: Dict[int, int] = {}
        self.movie_id_to_tmdb: Dict[int, int] = {}

    def build_mappings(self, links: pd.DataFrame, catalog_ids: Set[int]) -> None:
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

        self.tmdb_to_movie_id = tmdb_to_movie
        self.movie_id_to_tmdb = movie_to_tmdb

        logger.info(
            "ID mappings built | tmdb_to_movieId=%d | movieId_to_tmdb=%d | "
            "duplicate_tmdb_skipped=%d",
            len(self.tmdb_to_movie_id),
            len(self.movie_id_to_tmdb),
            duplicate_tmdb,
        )

    def is_tmdb_in_catalog(self, tmdb_id: int) -> bool:
        return int(tmdb_id) in self.tmdb_to_movie_id

    def resolve_tmdb_to_movie_id(self, tmdb_id: int) -> Optional[int]:
        movie_id = self.tmdb_to_movie_id.get(int(tmdb_id))
        if movie_id is not None:
            logger.info("TMDB mapping: tmdbId=%d -> movieId=%d", tmdb_id, movie_id)
        else:
            logger.warning(
                "TMDB mapping failed: tmdbId=%d not found in links catalog", tmdb_id
            )
        return movie_id

    def resolve_movie_to_tmdb_id(self, movie_id: int) -> Optional[int]:
        return self.movie_id_to_tmdb.get(int(movie_id))

    def lookup_tmdb_raw(self, movie_id_raw: Any) -> Optional[int]:
        if movie_id_raw is None:
            return None
        try:
            tmdb_id = int(movie_id_raw)
        except (TypeError, ValueError):
            return None
        return self.tmdb_to_movie_id.get(tmdb_id)
