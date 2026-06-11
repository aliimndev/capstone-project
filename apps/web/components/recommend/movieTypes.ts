/** Canonical TMDB movie shape returned by FastAPI trending/search endpoints. */
export interface TmdbMovie {
  id: number;
  title: string;
  overview?: string | null;
  poster_path?: string | null;
  vote_average?: number | null;
  vote_count?: number | null;
  release_date?: string | null;
}

/** Display-ready movie used by TrendingMovies and SearchMovies UI. */
export interface DisplayMovie extends TmdbMovie {
  posterUrl: string;
  rating?: number;
  votes?: number;
  year?: number;
  rank?: number;
}

export interface MoviesApiResponse {
  status: string;
  movies: TmdbMovie[];
}

export interface SearchMoviesApiResponse extends MoviesApiResponse {
  query: string;
}

/** Raw movie object returned by POST /api/v1/recommendations/ */
export interface RecommendationApiMovie {
  movieId: number;
  tmdbId?: number | null;
  title: string;
  overview?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
  genres?: string | null;
  source?: string | null;
}

export interface RecommendationApiMeta {
  inference_count?: number;
  fallback_count?: number;
  total_count?: number;
  inference_time_ms?: number;
  total_time_ms?: number;
  used_model_fallback?: boolean;
  unmapped_tmdb_ids?: number[] | null;
}

export interface RecommendationApiResponse {
  status: string;
  message: string;
  movies: RecommendationApiMovie[];
  meta?: RecommendationApiMeta;
}
