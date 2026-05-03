"use client";

import { useEffect, useState, useCallback } from "react";
import { MovieCard } from "./MovieCard";
import { MovieSkeleton } from "./MovieSkeleton";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseYear: number | null;
  rating: number | null;
  voteCount?: number;
}

interface TrendingMoviesResponse {
  movies?: Movie[];
  message?: string;
}

/**
 * TrendingMovies component displays a grid of trending movies from TMDB
 * Features: lazy loading, error handling, rank badges, ratings, and hover effects
 */
export function TrendingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch trending movies from API endpoint
   */
  const loadTrendingMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/trending-movies");
      const data = (await response.json()) as TrendingMoviesResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to load trending movies.");
      }

      setMovies(data.movies ?? []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load trending movies.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load movies on component mount
   */
  useEffect(() => {
    let isActive = true;

    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      if (isActive) {
        loadTrendingMovies();
      }
    }, 0);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [loadTrendingMovies]);

  return (
    <section className="py-16 bg-primary-black">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
            Trending Movies
          </h2>
          <p className="text-text-secondary mt-3 text-lg">
            Popular picks you might like
          </p>
        </div>

        {/* Movies Grid or Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
            {Array.from({ length: 10 }).map((_, index) => (
              <MovieSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={loadTrendingMovies} />
        ) : movies.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                rating={movie.rating}
                releaseYear={movie.releaseYear}
                voteCount={movie.voteCount}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
