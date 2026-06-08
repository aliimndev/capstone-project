import type { MoviesApiResponse, SearchMoviesApiResponse, TmdbMovie } from './movieTypes';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function fetchTrendingMovies(): Promise<TmdbMovie[]> {
  const response = await fetch(`${API_BASE}/api/v1/recommendations/trending`);

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies (${response.status})`);
  }

  const data: MoviesApiResponse = await response.json();

  if (!Array.isArray(data.movies)) {
    throw new Error('Invalid trending response: missing movies array');
  }

  return data.movies;
}

export async function searchMovies(query: string): Promise<TmdbMovie[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/recommendations/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Search failed (${response.status})`);
  }

  const data: SearchMoviesApiResponse = await response.json();

  if (!Array.isArray(data.movies)) {
    throw new Error('Invalid search response: missing movies array');
  }

  return data.movies;
}
