"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { MovieCard } from "./MovieCard";
import { MovieSkeleton } from "./MovieSkeleton";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { MarqueeRow } from "./MarqueeRow";

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

export function TrendingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    let isActive = true;

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

  const firstRowMovies = movies.slice(0, 5);
  const secondRowMovies = movies.slice(5, 10);

  return (
    <section className="py-20 bg-transparent relative z-10">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-4">
            Trending Movies
            <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent hidden sm:block" />
          </h2>
          <p className="text-white/60 mt-3 text-lg">
            Popular picks you might like
          </p>
        </motion.div>

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
          <div className="space-y-6 sm:space-y-8">
            {/* First row - moves to the right */}
            <MarqueeRow direction="right" speed={45}>
              {firstRowMovies.map((movie, index) => (
                <div key={movie.id} className="w-[200px] sm:w-[240px] flex-shrink-0">
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    posterUrl={movie.posterUrl}
                    rating={movie.rating}
                    releaseYear={movie.releaseYear}
                    voteCount={movie.voteCount}
                    index={index}
                  />
                </div>
              ))}
            </MarqueeRow>

            {/* Second row - moves to the left */}
            {secondRowMovies.length > 0 && (
              <MarqueeRow direction="left" speed={50}>
                {secondRowMovies.map((movie, index) => (
                  <div key={movie.id} className="w-[200px] sm:w-[240px] flex-shrink-0">
                    <MovieCard
                      id={movie.id}
                      title={movie.title}
                      posterUrl={movie.posterUrl}
                      rating={movie.rating}
                      releaseYear={movie.releaseYear}
                      voteCount={movie.voteCount}
                      index={index + 5}
                    />
                  </div>
                ))}
              </MarqueeRow>
            )}
          </div>
        )}
      </div>
    </section>
  );
}