"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type TrendingMovie = {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  releaseYear: number | null;
  rating: number | null;
};

type TrendingMoviesResponse = {
  movies?: TrendingMovie[];
  message?: string;
};

export function TrendingMovies() {
  const [movies, setMovies] = useState<TrendingMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadTrendingMovies() {
      try {
        const response = await fetch("/api/trending-movies");
        const data = (await response.json()) as TrendingMoviesResponse;

        if (!response.ok) {
          throw new Error(data.message ?? "Failed to load trending movies.");
        }

        if (isActive) {
          setMovies(data.movies ?? []);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load trending movies.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadTrendingMovies();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="py-16 bg-[#000000]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-[#ffffff]">
            Trending Movies
          </h2>
          <p className="text-white/60 mt-2 text-lg">
            Popular picks you might like
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[2/3] rounded-2xl bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" />
                  <div className="mx-auto mt-4 h-4 w-3/4 rounded-full bg-white/10" />
                </div>
              ))
            : movies.map((movie) => (
                <div key={movie.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all group-hover:shadow-[0_0_36px_rgba(0,153,255,0.22)]">
                    <Image
                      src={movie.posterUrl}
                      alt={`${movie.title} poster`}
                      fill
                      sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="line-clamp-2 text-sm font-medium text-white/80">
                      {movie.title}
                    </p>
                    <p className="mt-1 text-xs text-white/45">
                      {[
                        movie.releaseYear,
                        movie.rating !== null ? `${movie.rating}/10` : null,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        {!isLoading && error ? (
          <p className="mt-8 text-sm text-red-300">{error}</p>
        ) : null}

        {!isLoading && !error && movies.length === 0 ? (
          <p className="mt-8 text-sm text-white/60">
            No trending movies available right now.
          </p>
        ) : null}
      </div>
    </section>
  );
}
