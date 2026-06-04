from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
# pyrefly: ignore [missing-import]
from app.schemas.recommend import MovieBase


class WeWatchService:
    """Service untuk rekomendasi berbasis wewatch_backend.

    Catatan:
    - Saat ini implementasi hanya membutuhkan mekanisme untuk mengembalikan Top-N movie.
    - wewatch_backend menyimpan index/embedding hybrid + metadata movie.

    Untuk menjaga kompatibilitas dengan build yang ada, loader dibuat toleran terhadap variasi format.
    """

    def __init__(self) -> None:
        base_dir = Path(__file__).resolve().parents[2] / "wewatch_backend"

        self.index_path = base_dir / "faiss_index.bin"
        self.hybrid_matrix_path = base_dir / "hybrid_matrix.npy"
        self.lookups_path = base_dir / "lookups.pkl"
        self.movies_csv_path = base_dir / "movies_metadata.csv"
        self.movies_parquet_path = base_dir / "movies_metadata.parquet"
        self.sbert_embeddings_path = base_dir / "sbert_embeddings.npy"
        self.tfidf_svd_path = base_dir / "tfidf_svd.npy"

        # Lazy-loaded caches
        self._movies_df: Optional[pd.DataFrame] = None
        self._lookups: Optional[Dict[str, Any]] = None

        self._hybrid_matrix: Optional[np.ndarray] = None
        self._movie_vectors: Optional[np.ndarray] = None

        # Loading heavy artifacts lazily
        self._loaded = False

    def _ensure_loaded(self) -> None:
        if self._loaded:
            return

        # Load metadata
        self._movies_df = self._load_movies_df()

        # Load lookups.pkl
        # lookups.pkl kemungkinan berisi mapping id/indices -> movie_id, dan/atau mapping internal index.
        # Karena formatnya tidak dijamin, kita simpan sebagai dict hasil pickle (di-load via pandas.read_pickle).
        try:
            import pandas as _pd

            self._lookups = _pd.read_pickle(self.lookups_path)
        except Exception:
            # Fallback: kosong
            self._lookups = {}

        # Load vectors untuk scoring sederhana via cosine similarity.
        # hybrid_matrix.npy / sbert_embeddings.npy / tfidf_svd.npy ukuran bervariasi.
        # Kita akan gunakan salah satu yang tersedia.
        try:
            if self.hybrid_matrix_path.exists():
                self._hybrid_matrix = np.load(self.hybrid_matrix_path)
            else:
                self._hybrid_matrix = None
        except Exception:
            self._hybrid_matrix = None

        self._movie_vectors = self._hybrid_matrix
        self._loaded = True

    def _load_movies_df(self) -> pd.DataFrame:
        if self.movies_parquet_path.exists():
            df = pd.read_parquet(self.movies_parquet_path)
        else:
            df = pd.read_csv(self.movies_csv_path)

        # Normalisasi kolom umum
        # Beberapa dataset memakai kolom: movieId / id / title / poster_path
        # Kita bikin aman agar rekomendasi bisa membentuk MovieBase.
        col_map = {c.lower(): c for c in df.columns}

        def pick(*cands: str) -> Optional[str]:
            for c in cands:
                if c.lower() in col_map:
                    return col_map[c.lower()]
            return None

        title_col = pick("title", "name")
        poster_col = pick("poster_path", "poster", "poster_url")
        overview_col = pick("overview", "plot")
        release_col = pick("release_date", "year")
        vote_col = pick("vote_average", "rating", "imdb_rating")
        id_col = pick("tmdbid", "tmdb_id", "movie_id", "movieid", "id")

        if id_col is None:
            raise RuntimeError("movies_metadata: tidak menemukan kolom id/movie_id")

        # Bentuk dataframe standar
        df_std = pd.DataFrame({
            "id": df[id_col],
            "title": df[title_col] if title_col else "",
            "overview": df[overview_col] if overview_col else None,
            "poster_path": df[poster_col] if poster_col else None,
            "release_date": df[release_col] if release_col else None,
            "vote_average": df[vote_col] if vote_col else None,
        })
        return df_std

    @staticmethod
    def _clean(val: Any) -> Any:
        """Convert pandas NaN / NaT / numpy nan to Python None."""
        if val is None:
            return None
        try:
            if pd.isna(val):
                return None
        except (TypeError, ValueError):
            pass
        return val

    def _build_poster_url(self, poster_path: Optional[str]) -> Optional[str]:
        if not poster_path:
            return None
        if isinstance(poster_path, str) and poster_path.startswith("http"):
            return poster_path
        # default tmdb poster base
        return f"https://image.tmdb.org/t/p/w500{poster_path}"

    def recommend_from_selected(self, movie_ids: List[int], top_n: int = 3) -> List[MovieBase]:
        """Rekomendasi top-N berdasarkan pilihan user.

        Pendekatan:
        - Ambil vektor untuk movie selected dari hybrid_matrix (jika tersedia)
        - Buat user profile vector = rata-rata vektor selected
        - Hitung similarity dengan semua movie
        - Buang selected movie_id

        Jika vektor tidak tersedia, fallback: ambil movie paling populer / random dari metadata.
        """
        self._ensure_loaded()
        assert self._movies_df is not None

        movie_ids_set = set(int(x) for x in movie_ids if x is not None)

        # Jika tidak ada vector, fallback
        if self._movie_vectors is None:
            candidates = self._movies_df[~self._movies_df["id"].isin(list(movie_ids_set))]
            candidates = candidates.head(top_n)
            out: List[MovieBase] = []
            for _, row in candidates.iterrows():
                out.append(
                    MovieBase(
                        id=int(row["id"]),
                        title=str(row["title"]) if self._clean(row["title"]) else "Unknown",
                        overview=self._clean(row["overview"]),
                        poster_path=self._clean(row["poster_path"]),
                        release_date=str(row["release_date"]) if self._clean(row["release_date"]) else None,
                        vote_average=float(row["vote_average"]) if self._clean(row["vote_average"]) is not None else None,
                    )
                )
            return out[:top_n]

        vectors = self._movie_vectors

        # Kita asumsikan urutan vectors align dengan dataframe rows.
        # Jika lookups punya mapping, nanti bisa diperbaiki; untuk sekarang dibuat robust.
        # Build mapping movie_id -> row index
        id_to_index: Dict[int, int] = {}
        for idx, mid in enumerate(self._movies_df["id"].tolist()):
            try:
                id_to_index[int(mid)] = idx
            except Exception:
                continue

        indices = [id_to_index[mid] for mid in movie_ids_set if mid in id_to_index]
        if not indices:
            candidates = self._movies_df[~self._movies_df["id"].isin(list(movie_ids_set))]
            candidates = candidates.head(top_n)
            out: List[MovieBase] = []
            for _, row in candidates.iterrows():
                out.append(
                    MovieBase(
                        id=int(row["id"]),
                        title=str(row["title"]) if self._clean(row["title"]) else "Unknown",
                        overview=self._clean(row["overview"]),
                        poster_path=self._clean(row["poster_path"]),
                        release_date=str(row["release_date"]) if self._clean(row["release_date"]) else None,
                        vote_average=float(row["vote_average"]) if self._clean(row["vote_average"]) is not None else None,
                    )
                )
            return out[:top_n]

        selected_vecs = vectors[indices]
        if selected_vecs.ndim == 1:
            selected_vecs = selected_vecs.reshape(1, -1)

        user_vec = selected_vecs.mean(axis=0)

        # cosine similarity
        vec_norm = np.linalg.norm(vectors, axis=1) + 1e-12
        user_norm = float(np.linalg.norm(user_vec)) + 1e-12
        sims = (vectors @ user_vec) / (vec_norm * user_norm)

        # Rank by similarity
        ranked_idx = np.argsort(-sims)

        out: List[MovieBase] = []
        for idx in ranked_idx:
            movie_row = self._movies_df.iloc[int(idx)]
            mid = int(movie_row["id"])
            if mid in movie_ids_set:
                continue

            out.append(
                MovieBase(
                    id=mid,
                    title=str(movie_row["title"]) if self._clean(movie_row["title"]) else "Unknown",
                    overview=self._clean(movie_row["overview"]),
                    poster_path=self._clean(movie_row["poster_path"]),
                    release_date=str(movie_row["release_date"]) if self._clean(movie_row["release_date"]) else None,
                    vote_average=float(movie_row["vote_average"]) if self._clean(movie_row["vote_average"]) is not None else None,
                )
            )
            if len(out) >= top_n:
                break

        return out


def get_wewatch_service() -> WeWatchService:
    return WeWatchService()

