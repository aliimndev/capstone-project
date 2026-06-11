import type { RatedMovie } from './types';
import { mapRecommendationsForDisplay } from '@/components/recommend/mapMovie';
import type { DisplayMovie, RecommendationApiResponse } from '@/components/recommend/movieTypes';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export interface RecommendationResult {
  movies: DisplayMovie[];
  message: string;
  usedModelFallback?: boolean;
  unmappedTmdbIds?: number[];
}

export async function fetchRecommendations(
  ratedMovies: RatedMovie[]
): Promise<RecommendationResult> {
  const payload = {
    rated_movies: ratedMovies.map((m) => ({
      movie_id: m.tmdbId,
      reaction: m.reaction,
    })),
  };

  if (process.env.NODE_ENV === 'development') {
    console.debug('[recommendations] request payload:', payload);
  }

  const res = await fetch(`${API_BASE}/api/v1/recommendations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const data: RecommendationApiResponse = await res.json();
  const apiMovies = data.movies ?? [];

  if (process.env.NODE_ENV === 'development') {
    console.log('API_COUNT', apiMovies.length);
  }

  const mapped = mapRecommendationsForDisplay(apiMovies);

  if (process.env.NODE_ENV === 'development') {
    console.log('MAPPED_COUNT', mapped.length);
  }

  return {
    movies: mapped,
    message: data.message ?? `Found ${mapped.length} recommendations`,
    usedModelFallback: data.meta?.used_model_fallback,
    unmappedTmdbIds: data.meta?.unmapped_tmdb_ids ?? undefined,
  };
}
