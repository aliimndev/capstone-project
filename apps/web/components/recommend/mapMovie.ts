import type { DisplayMovie, RecommendationApiMovie, TmdbMovie } from './movieTypes';

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_POSTER_SEARCH = 'https://image.tmdb.org/t/p/w200';

export function resolveDisplayPosterUrl(
  movie: Pick<TmdbMovie, 'poster_path'> & { posterUrl?: string },
  posterSize: 'card' | 'search' = 'card'
): string {
  if (movie.posterUrl) {
    return movie.posterUrl;
  }
  if (movie.poster_path) {
    const posterBase = posterSize === 'search' ? TMDB_POSTER_SEARCH : TMDB_POSTER_BASE;
    return `${posterBase}${movie.poster_path}`;
  }
  return '';
}

export function mapMovieForDisplay(
  movie: TmdbMovie,
  options?: { rank?: number; posterSize?: 'card' | 'search' }
): DisplayMovie {
  return {
    ...movie,
    posterUrl: resolveDisplayPosterUrl(movie, options?.posterSize ?? 'card'),
    rating: movie.vote_average ?? undefined,
    votes: movie.vote_count ?? undefined,
    year: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : undefined,
    rank: options?.rank,
  };
}

export function mapMoviesForDisplay(
  movies: TmdbMovie[],
  options?: { posterSize?: 'card' | 'search' }
): DisplayMovie[] {
  const mapped = movies.map((movie, index) =>
    mapMovieForDisplay(movie, { rank: index + 1, posterSize: options?.posterSize })
  );

  return mapped;
}

function parseYearFromTitle(title: string): number | undefined {
  const match = title.match(/\((\d{4})\)/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Normalize POST /api/v1/recommendations/ items into DisplayMovie.
 * API returns movieId/tmdbId/genres — not the TMDB browse shape.
 */
export function mapRecommendationForDisplay(
  movie: RecommendationApiMovie,
  rank?: number
): DisplayMovie {
  const id = movie.tmdbId ?? movie.movieId;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : parseYearFromTitle(movie.title);

  const displayMovie: DisplayMovie = {
    id,
    title: movie.title,
    overview: movie.overview ?? movie.genres ?? null,
    poster_path: movie.poster_path ?? null,
    vote_average: movie.vote_average ?? null,
    vote_count: null,
    release_date: movie.release_date ?? (year ? `${year}-01-01` : null),
    posterUrl: '',
    rating: movie.vote_average ?? undefined,
    votes: undefined,
    year,
    rank,
  };
  displayMovie.posterUrl = resolveDisplayPosterUrl(displayMovie, 'card');
  return displayMovie;
}

export function mapRecommendationsForDisplay(
  movies: RecommendationApiMovie[]
): DisplayMovie[] {
  return movies.map((movie, index) => mapRecommendationForDisplay(movie, index + 1));
}
