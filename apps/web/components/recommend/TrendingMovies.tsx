// components/recommend/TrendingMovies.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { fetchTrendingMovies } from './movieApi';
import { mapMoviesForDisplay } from './mapMovie';
import type { DisplayMovie } from './movieTypes';

export type { DisplayMovie as Movie, TmdbMovie } from './movieTypes';

interface TrendingMoviesProps {
  movies?: DisplayMovie[];
  limit?: number;
  onMovieClick?: (movie: DisplayMovie) => void;
  ratedMovies?: Array<{ id: string | number; tmdbId?: number }>;
}

interface MovieCardProps {
  movie: DisplayMovie;
  onClick?: (movie: DisplayMovie) => void;
  isRated?: boolean;
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
);

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, isRated }) => {
  return (
    <div
      className={`group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-out
        ${isRated
          ? 'ring-2 ring-cyan-400 scale-[1.02] shadow-xl shadow-cyan-500/20'
          : 'hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/40'
        }`}
      onClick={() => onClick?.(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(movie);
        }
      }}
      aria-pressed={isRated}
      aria-label={`Rate movie ${movie.title}`}
    >
      {movie.posterUrl ? (
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm px-2 text-center bg-secondary-medium">
          No poster
        </div>
      )}

      {isRated && (
        <div className="absolute top-2.5 right-2.5 z-20 bg-cyan-400 text-black rounded-full p-1.5 shadow-lg">
          <CheckIcon className="w-3.5 h-3.5" />
        </div>
      )}

      {movie.rank && (
        <div className="absolute top-2.5 left-2.5 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
          #{movie.rank}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-12">
        <h3 className={`text-white font-semibold text-sm line-clamp-2 mb-1 transition-colors duration-200 ${isRated ? 'text-cyan-300' : 'group-hover:text-cyan-300'}`}>
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-yellow-400" />
            <span className="text-white/90 font-medium">
              {movie.rating && movie.rating > 0 ? movie.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          {movie.year && (
            <span className="text-white/60 font-medium">{movie.year}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/50 animate-pulse relative">
      <div className="absolute inset-x-0 bottom-0 p-3 pt-12 bg-gradient-to-t from-black/80 to-transparent">
        <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-zinc-700 rounded w-1/2" />
      </div>
    </div>
  );
};

const TrendingMovies: React.FC<TrendingMoviesProps> = ({
  movies,
  limit = 10,
  onMovieClick,
  ratedMovies = [],
}) => {
  const usesPropMovies = Boolean(movies && movies.length > 0);
  const propMovieData = useMemo(
    () => (usesPropMovies ? movies!.slice(0, limit) : []),
    [movies, limit, usesPropMovies]
  );

  const [fetchedMovieData, setFetchedMovieData] = useState<DisplayMovie[]>([]);
  const [loading, setLoading] = useState(!usesPropMovies);
  const [error, setError] = useState<string | null>(null);

  const movieData = usesPropMovies ? propMovieData : fetchedMovieData;

  if (process.env.NODE_ENV === 'development' && !loading && movieData.length > 0) {
    console.log('RENDER_COUNT', movieData.length);
  }

  const loadTrendingMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const moviesFromApi = await fetchTrendingMovies();
      if (process.env.NODE_ENV === 'development') {
        console.log('API_COUNT', moviesFromApi.length);
      }
      const formattedMovies = mapMoviesForDisplay(moviesFromApi.slice(0, limit), {
        posterSize: 'card',
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('STATE_COUNT', formattedMovies.length);
      }

      setFetchedMovieData(formattedMovies);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setFetchedMovieData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (usesPropMovies) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);

      try {
        const moviesFromApi = await fetchTrendingMovies();
        if (cancelled) return;

        if (process.env.NODE_ENV === 'development') {
          console.log('API_COUNT', moviesFromApi.length);
        }
        const formattedMovies = mapMoviesForDisplay(moviesFromApi.slice(0, limit), {
          posterSize: 'card',
        });
        if (process.env.NODE_ENV === 'development') {
          console.log('STATE_COUNT', formattedMovies.length);
        }

        setFetchedMovieData(formattedMovies);
      } catch (err) {
        if (cancelled) return;

        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setFetchedMovieData([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [usesPropMovies, limit]);

  if (error && !loading) {
    return (
      <section className="w-full py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-zinc-900/50 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-red-400 text-lg font-semibold mb-2">Unable to Load Movies</h3>
          <p className="text-zinc-400 text-sm mb-6">{error}</p>
          <button
            onClick={loadTrendingMovies}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
              Trending Movies
            </h2>
            <p className="text-zinc-400 text-sm md:text-base">
              Click a movie and rate it. Rate exactly 3 movies to get recommendations.
            </p>
          </div>
          {ratedMovies.length > 0 && (
            <div className="text-sm text-zinc-300 bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-700/50 self-start sm:self-auto">
              <span className="text-cyan-400 font-bold">{ratedMovies.length}</span>/3 Rated
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <MovieCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : movieData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movieData.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={onMovieClick}
                isRated={ratedMovies.some((m) => m.id === movie.id || m.tmdbId === movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500">
            No trending movies found at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingMovies;
