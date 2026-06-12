#!/usr/bin/env python3
"""Download, inspect, and test recommender_artifacts.pkl from Hugging Face."""

from __future__ import annotations

import hashlib
import json
import pickle
import shutil
import sys
import traceback
from pathlib import Path
from typing import Any

import requests

HF_URL = (
    "https://huggingface.co/aliimndev/recommender_artifacts.pkl/"
    "resolve/main/recommender_artifacts.pkl"
)
HF_API_TREE = (
    "https://huggingface.co/api/models/aliimndev/recommender_artifacts.pkl/tree/main"
)
EXPECTED_SHA256 = "f2e7760f90a9d982e617b58d67764b78e2148090d0a57b9c59e3658e47f3723c"
EXPECTED_SIZE = 225756909

API_ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = API_ROOT / "model"
MODEL_PATH = MODEL_DIR / "recommender_artifacts.pkl"
HF_DOWNLOAD_PATH = MODEL_DIR / "recommender_artifacts.pkl.hf_download"
BACKUP_PATH = MODEL_DIR / "recommender_artifacts.pkl.local_backup"

E2E_PAYLOAD = {
    "rated_movies": [
        {"movie_id": 550, "reaction": "loved it"},
        {"movie_id": 278, "reaction": "like it"},
        {"movie_id": 680, "reaction": "just normal"},
    ]
}

ENGINE_ARTIFACTS = [
    "movie_latent_matrix",
    "content_features",
    "movie_to_index",
    "index_to_movie",
    "reaction_weights",
    "n_components",
    "alpha_cf",
    "alpha_cb",
    "movies_filtered",
    "links",
    "top_trending",
]


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def describe_value(value: Any, depth: int = 0) -> Any:
    if depth > 1:
        return type(value).__name__
    if hasattr(value, "shape"):
        return {"type": type(value).__name__, "shape": tuple(value.shape)}
    if isinstance(value, dict):
        items = list(value.items())
        if len(items) > 5:
            items = items[:5]
            suffix = f"... +{len(value) - 5} more keys"
        else:
            suffix = None
        out = {str(k): describe_value(v, depth + 1) for k, v in items}
        if suffix:
            out[suffix] = f"total_keys={len(value)}"
        return out
    if isinstance(value, (list, tuple)):
        preview = [describe_value(v, depth + 1) for v in value[:3]]
        if len(value) > 3:
            preview.append(f"... +{len(value) - 3} more")
        return preview
    try:
        import pandas as pd

        if isinstance(value, pd.DataFrame):
            return {
                "type": "DataFrame",
                "shape": value.shape,
                "columns": list(value.columns),
            }
    except ImportError:
        pass
    return {"type": type(value).__name__, "repr": repr(value)[:120]}


def download_model() -> tuple[bool, str]:
    try:
        with requests.get(
            HF_URL,
            stream=True,
            timeout=600,
            headers={"User-Agent": "wemovies-verify/1.0"},
        ) as response:
            response.raise_for_status()
            with open(HF_DOWNLOAD_PATH, "wb") as out:
                for chunk in response.iter_content(1024 * 1024):
                    if chunk:
                        out.write(chunk)
        return True, "Downloaded via requests"
    except Exception as exc:
        return False, str(exc)


def main() -> int:
    report: dict[str, Any] = {
        "download_successful": "NO",
        "model_loaded": "NO",
        "pickle_structure": None,
        "recommendation_test_result": "NOT RUN",
        "errors": [],
    }

    print("=" * 60)
    print("Hugging Face Recommender Model Verification")
    print("=" * 60)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    print("\n[1] Downloading from Hugging Face...")
    ok, detail = download_model()
    if ok:
        report["download_successful"] = "YES"
        print(f"    OK: {detail}")
        active_model = HF_DOWNLOAD_PATH
    else:
        report["errors"].append(f"Download failed: {detail}")
        print(f"    FAILED: {detail}")
        if MODEL_PATH.exists():
            digest = sha256_file(MODEL_PATH)
            if digest == EXPECTED_SHA256:
                shutil.copy2(MODEL_PATH, HF_DOWNLOAD_PATH)
                report["errors"].append(
                    "Using local copy verified against HF API SHA256 "
                    f"({EXPECTED_SHA256}) because direct download was blocked."
                )
                active_model = HF_DOWNLOAD_PATH
                print("    Fallback: local file matches HF SHA256; copied for testing.")
            else:
                print("    No verified local fallback available.")
                print_report(report)
                return 1
        else:
            print_report(report)
            return 1

    size = active_model.stat().st_size
    digest = sha256_file(active_model)
    print(f"    Size: {size:,} bytes (expected {EXPECTED_SIZE:,})")
    print(f"    SHA256: {digest}")

    if size != EXPECTED_SIZE or digest != EXPECTED_SHA256:
        report["errors"].append("Downloaded file failed integrity check")
        print("    INTEGRITY CHECK FAILED")
        print_report(report)
        return 1

    print("    Integrity check: PASSED")

    print("\n[2] Replacing local model with downloaded artifact...")
    if MODEL_PATH.exists() and not BACKUP_PATH.exists():
        shutil.copy2(MODEL_PATH, BACKUP_PATH)
        print(f"    Backed up existing model to {BACKUP_PATH.name}")
    shutil.copy2(active_model, MODEL_PATH)
    print(f"    Active model path: {MODEL_PATH}")

    print("\n[3] Loading pickle and inspecting structure...")
    try:
        with open(MODEL_PATH, "rb") as f:
            art = pickle.load(f)
        report["model_loaded"] = "YES"
    except Exception as exc:
        report["errors"].append(f"Pickle load failed: {exc}")
        print(f"    FAILED: {exc}")
        traceback.print_exc()
        print_report(report)
        return 1

    print(f"    Object type: {type(art).__name__}")
    if isinstance(art, dict):
        keys = sorted(art.keys())
        print(f"    Available keys ({len(keys)}): {keys}")
        structure = {k: describe_value(art[k]) for k in keys}
        report["pickle_structure"] = structure
        print("    Internal structure:")
        print(json.dumps(structure, indent=2, default=str, sort_keys=True))

        missing = [k for k in ENGINE_ARTIFACTS if k not in art]
        present = [k for k in ENGINE_ARTIFACTS if k in art]
        print("\n[4] Artifacts used by RecommenderService:")
        for key in present:
            print(f"    - {key}")
        if missing:
            print(f"    MISSING expected keys: {missing}")
            report["errors"].append(f"Missing engine artifacts: {missing}")
    else:
        report["errors"].append(f"Expected dict, got {type(art).__name__}")
        print_report(report)
        return 1

    print("\n[5] Running recommendation inference...")
    sys.path.insert(0, str(API_ROOT))
    try:
        from app.services.recommender_service import RecommenderService

        service = RecommenderService()
        service.load(MODEL_PATH)
        recs, meta = service.recommend_from_ratings(E2E_PAYLOAD["rated_movies"])

        print(f"    Recommendations returned: {len(recs)}")
        print(f"    Meta: {meta}")
        for i, rec in enumerate(recs, 1):
            print(
                f"      {i:02d}. movieId={rec.movieId} tmdbId={rec.tmdbId} "
                f"source={rec.source} | {rec.title}"
            )

        if len(recs) == 10 and meta.get("inference_count", 0) > 0:
            report["recommendation_test_result"] = (
                "SUCCESS — 10 recommendations from inference"
            )
        elif len(recs) == 10:
            report["recommendation_test_result"] = (
                "SUCCESS — 10 recommendations (with fallback)"
            )
        else:
            report["recommendation_test_result"] = (
                f"PARTIAL — only {len(recs)} recommendations"
            )
    except Exception as exc:
        report["recommendation_test_result"] = f"FAILED — {exc}"
        report["errors"].append(f"Recommendation test failed: {exc}")
        traceback.print_exc()

    print("\n[6] Running HTTP e2e via FastAPI TestClient...")
    try:
        from fastapi.testclient import TestClient
        from app.main import app
        from app.services import recommender_service as rs_module

        rs_module._recommender_service = None
        with TestClient(app) as client:
            health = client.get("/health")
            rec_resp = client.post("/api/v1/recommendations/", json=E2E_PAYLOAD)
        print(f"    /health -> {health.status_code} {health.json()}")
        print(f"    POST /api/v1/recommendations/ -> {rec_resp.status_code}")
        if rec_resp.status_code == 200:
            body = rec_resp.json()
            print(
                f"    status={body.get('status')} movies={len(body.get('movies', []))}"
            )
            if body.get("status") == "success" and len(body.get("movies", [])) == 10:
                report["recommendation_test_result"] += " | HTTP e2e PASSED"
            else:
                report["errors"].append("HTTP e2e returned unexpected body")
        else:
            report["errors"].append(f"HTTP e2e failed: {rec_resp.text[:300]}")
    except Exception as exc:
        report["errors"].append(f"HTTP e2e failed: {exc}")
        traceback.print_exc()

    print_report(report)
    return (
        0
        if report["model_loaded"] == "YES"
        and "FAILED" not in report["recommendation_test_result"]
        else 1
    )


def print_report(report: dict[str, Any]) -> None:
    print("\n" + "=" * 60)
    print("FINAL REPORT")
    print("=" * 60)
    print(f"Download successful: {report['download_successful']}")
    print(f"Model loaded: {report['model_loaded']}")
    print(f"Recommendation test result: {report['recommendation_test_result']}")
    if report["errors"]:
        print("Errors encountered:")
        for err in report["errors"]:
            print(f"  - {err}")
    print("=" * 60)


if __name__ == "__main__":
    raise SystemExit(main())
