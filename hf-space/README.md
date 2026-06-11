---
title: WeMovies API
emoji: 🎬
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# WeMovies AI — Recommendation API

FastAPI backend with hybrid ML recommender (CF + CB) for the [WeMovies](https://wemovies.vercel.app) frontend.

## Endpoints

- `GET /health` — API and model status
- `POST /api/v1/recommendations/` — Get 10 movie recommendations
- `GET /api/v1/recommendations/trending` — Trending movies
- `GET /api/v1/recommendations/search?q=` — Search movies
- `GET /api/docs` — Swagger UI

## Secrets

Set `TMDB_API_KEY` in Space settings for TMDB enrichment.
