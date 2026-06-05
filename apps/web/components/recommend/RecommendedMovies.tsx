'use client';

import React from 'react';
import Image from 'next/image';

export interface RecommendedMovie {
  id: string | number;
  title: string;
  poster_path?: string | null;
  posterUrl?: string;
}

interface RecommendedMoviesProps {
  loading?: boolean;
  error?: string | null;
  movies?: RecommendedMovie[];
}

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ loading, error, movies }) => {
  if (loading) {
    return (
      <section className="w-full bg-transparent py-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Recommended for you</h2>
          <p className="text-text-secondary">Loading recommendations...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-transparent py-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Recommended for you</h2>
          <p className="text-special-error mb-4">{error}</p>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <section className="w-full bg-transparent py-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Recommended for you</h2>
          <p className="text-text-secondary">Pick 3 movies to get recommendations.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-transparent py-8 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Recommended for you</h2>
        <p className="text-text-secondary text-sm md:text-base mb-6">Top picks based on your selected movies.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
          {movies.map((m) => {
            const posterUrl =
              m.posterUrl ||
              (m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : undefined);

            return (
              <div key={String(m.id)} className="rounded-lg overflow-hidden bg-secondary-dark border border-interactive-border">
                <div className="relative aspect-[2/3] bg-secondary-medium">
                  {posterUrl ? (
                    <Image src={posterUrl} alt={m.title} fill className="object-cover" sizes="33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm">
                      No poster
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-interactive-border">
                  <h3 className="text-text-primary font-semibold text-sm md:text-base line-clamp-2">{m.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedMovies;

