"""
End-to-end test for rated-movie recommendations.

Uses verified artifact schema with TMDB IDs:
  - Fight Club (550)
  - Shawshank Redemption (278)
  - Pulp Fiction (680)

Expects HTTP 200 and exactly 10 recommendations.
"""

from __future__ import annotations

import logging
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.recommender_service import get_recommender_service

ARTIFACT_PATH = (
    Path(__file__).resolve().parents[1] / "model" / "recommender_artifacts.pkl"
)

E2E_PAYLOAD = {
    "rated_movies": [
        {"movie_id": 550, "reaction": "loved it"},
        {"movie_id": 278, "reaction": "like it"},
        {"movie_id": 680, "reaction": "just normal"},
    ]
}


@pytest.fixture(scope="module", autouse=True)
def load_model():
    if not ARTIFACT_PATH.exists():
        pytest.skip(f"Artifact not found: {ARTIFACT_PATH}")

    service = get_recommender_service()
    if not service.is_loaded:
        service.load(ARTIFACT_PATH)

    yield service


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health_model_loaded(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["model_loaded"] is True


UNMAPPED_TRENDING_PAYLOAD = {
    "rated_movies": [
        {"movie_id": 1122573, "reaction": "loved it"},
        {"movie_id": 1430077, "reaction": "like it"},
        {"movie_id": 1358005, "reaction": "just normal"},
    ]
}


def test_recommendations_fallback_when_no_movielens_mapping(client: TestClient, caplog):
    """Rated TMDB movies absent from links.csv should return top_trending from artifact."""
    caplog.set_level(logging.INFO)

    response = client.post("/api/v1/recommendations/", json=UNMAPPED_TRENDING_PAYLOAD)

    assert response.status_code == 200, response.text
    body = response.json()

    assert body["status"] == "success"
    assert len(body["movies"]) == 10
    assert all(m["source"] == "top_trending_fallback" for m in body["movies"])
    assert body["meta"]["used_model_fallback"] is True
    assert body["meta"]["inference_count"] == 0
    assert set(body["meta"]["unmapped_tmdb_ids"]) == {1122573, 1430077, 1358005}


def test_recommendations_e2e_fight_club_shawshank_pulp_fiction(
    client: TestClient, caplog
):
    caplog.set_level(logging.INFO)

    response = client.post("/api/v1/recommendations/", json=E2E_PAYLOAD)

    assert response.status_code == 200, response.text
    body = response.json()

    assert body["status"] == "success"
    assert "movies" in body
    assert len(body["movies"]) == 10, f"Expected 10 movies, got {len(body['movies'])}"

    for movie in body["movies"]:
        assert "movieId" in movie
        assert "title" in movie
        assert "tmdbId" in movie
        assert "poster_path" in movie
        assert "overview" in movie
        assert "release_date" in movie
        assert "vote_average" in movie
        assert "genres" in movie
        assert movie["title"]
        assert movie["source"] in ("inference", "top_trending_fallback")

    returned_movie_ids = {m["movieId"] for m in body["movies"]}
    assert len(returned_movie_ids) == 10, "Duplicate movieIds in response"

    input_movie_ids = {2959, 318, 296}
    assert returned_movie_ids.isdisjoint(
        input_movie_ids
    ), "Rated input movies must not appear in recommendations"

    if body.get("meta"):
        assert body["meta"]["total_count"] == 10
        assert body["meta"]["inference_time_ms"] >= 0
        assert body["meta"]["total_time_ms"] >= 0

    print("\n--- E2E Response Summary ---")
    print(f"message: {body['message']}")
    if body.get("meta"):
        print(f"meta: {body['meta']}")
    for i, m in enumerate(body["movies"], 1):
        print(
            f"  {i:02d}. movieId={m['movieId']} tmdbId={m.get('tmdbId')} "
            f"source={m.get('source')} | {m['title']}"
        )
