import logging
import pickle
import time
from pathlib import Path
from typing import Any, Dict, Optional, Set

from sklearn.preprocessing import normalize

logger = logging.getLogger(__name__)


class ModelLoader:
    def __init__(self) -> None:
        self.art: Optional[Dict[str, Any]] = None
        self.is_loaded: bool = False
        self.catalog_ids: Set[int] = set()

    def load(self, artifact_path: Optional[Path] = None) -> None:
        if self.is_loaded:
            logger.info("Recommender model already loaded, skipping reload")
            return

        if artifact_path is None:
            artifact_path = (
                Path(__file__).resolve().parents[3]
                / "model"
                / "recommender_artifacts.pkl"
            )

        logger.info("Loading recommender model from %s", artifact_path)

        if not artifact_path.exists():
            raise FileNotFoundError(f"Model artifact not found: {artifact_path}")

        file_size_mb = artifact_path.stat().st_size / 1024 / 1024
        load_start = time.perf_counter()

        with open(artifact_path, "rb") as f:
            art = pickle.load(f)

        art["movie_latent_norm"] = normalize(art["movie_latent_matrix"], norm="l2")

        self.catalog_ids = set(art["movies_filtered"]["movieId"].astype(int).tolist())
        self.art = art
        self.is_loaded = True

        load_ms = (time.perf_counter() - load_start) * 1000
        logger.info(
            "Model loaded in %.1fms | size=%.1fMB | catalog=%d movies | "
            "latent_shape=%s | content_shape=%s",
            load_ms,
            file_size_mb,
            len(self.catalog_ids),
            art["movie_latent_matrix"].shape,
            art["content_features"].shape,
        )
