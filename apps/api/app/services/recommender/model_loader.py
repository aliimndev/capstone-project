import hashlib
import logging
import pickle
import time
from pathlib import Path
from typing import Any, Dict, Optional, Set

import requests
from sklearn.preprocessing import normalize

logger = logging.getLogger(__name__)


class ModelLoader:
    def __init__(self) -> None:
        self.art: Optional[Dict[str, Any]] = None
        self.is_loaded: bool = False
        self.catalog_ids: Set[int] = set()

    # ------------------------------------------------------------------
    # Internal: download from Hugging Face and verify integrity
    # ------------------------------------------------------------------

    def _download_model(self, artifact_path: Path) -> None:
        """Stream recommender_artifacts.pkl from Hugging Face to *artifact_path*.

        Steps:
          1. Stream download to a sibling *.pkl.tmp* file so a failed or
             interrupted download never leaves a corrupt artifact in place.
          2. Verify SHA-256 if ``HF_MODEL_SHA256`` is configured.
          3. Atomically rename the temp file to the final path.

        Raises on any network, HTTP, or integrity error so the caller can
        decide how to handle a missing model (FastAPI lifespan logs and
        continues; the /api/v1/recommendations/ endpoint returns 503).
        """
        from core.config import get_settings

        settings = get_settings()
        url = settings.HF_MODEL_URL
        timeout = settings.HF_DOWNLOAD_TIMEOUT
        expected_sha256 = settings.HF_MODEL_SHA256

        artifact_path.parent.mkdir(parents=True, exist_ok=True)
        tmp_path = artifact_path.with_suffix(".pkl.tmp")

        logger.info(
            "Model artifact not found locally — downloading from Hugging Face | url=%s",
            url,
        )

        try:
            response = requests.get(
                url,
                stream=True,
                timeout=timeout,
                headers={"User-Agent": "wemovies-api/1.0"},
            )
            response.raise_for_status()

            downloaded_bytes = 0
            with open(tmp_path, "wb") as fh:
                for chunk in response.iter_content(chunk_size=1024 * 1024):  # 1 MB
                    if chunk:
                        fh.write(chunk)
                        downloaded_bytes += len(chunk)

            logger.info(
                "Download complete: %.1f MB saved to %s",
                downloaded_bytes / 1024 / 1024,
                tmp_path.name,
            )

            # --- SHA-256 integrity check ---
            if expected_sha256:
                logger.info("Verifying SHA-256 integrity...")
                h = hashlib.sha256()
                with open(tmp_path, "rb") as fh:
                    for chunk in iter(lambda: fh.read(1024 * 1024), b""):
                        h.update(chunk)
                actual_sha256 = h.hexdigest()

                if actual_sha256 != expected_sha256:
                    tmp_path.unlink(missing_ok=True)
                    raise ValueError(
                        f"SHA-256 integrity check FAILED — "
                        f"expected={expected_sha256} actual={actual_sha256}"
                    )
                logger.info("SHA-256 integrity check PASSED (%s)", actual_sha256)
            else:
                logger.warning(
                    "HF_MODEL_SHA256 is not configured — skipping integrity verification"
                )

            # Atomic promotion: temp → final path
            tmp_path.rename(artifact_path)
            logger.info("Model artifact cached at %s", artifact_path)

        except Exception:
            # Always clean up the temp file on any failure
            if tmp_path.exists():
                tmp_path.unlink(missing_ok=True)
            raise

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

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

        # Download from Hugging Face on first run (or after cache is cleared).
        if not artifact_path.exists():
            self._download_model(artifact_path)

        logger.info("Loading recommender model from %s", artifact_path)

        file_size_mb = artifact_path.stat().st_size / 1024 / 1024
        load_start = time.perf_counter()

        with open(artifact_path, "rb") as fh:
            art = pickle.load(fh)

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
