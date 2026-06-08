'use client';

import React from 'react';
import Image from 'next/image';
import { resolveDisplayPosterUrl } from './mapMovie';
import type { DisplayMovie } from './movieTypes';

export type { DisplayMovie as RecommendedMovie } from './movieTypes';

interface RecommendedMoviesProps {
  loading?: boolean;
  error?: string | null;
  movies?: DisplayMovie[];
  message?: string | null;
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ loading, error, movies, message }) => {
  if (process.env.NODE_ENV === 'development' && movies) {
    console.log('RENDER_COUNT', movies.length);
  }

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
          <p className="text-text-secondary">Rate 3 movies to get recommendations.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-transparent py-8 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Recommended for you</h2>
        <p className="text-text-secondary text-sm md:text-base mb-6">
          {message ?? 'Top 10 picks based on your ratings.'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => {
            const posterUrl = resolveDisplayPosterUrl(movie, 'card');

            return (
              <div
                key={movie.id}
                className="rounded-xl overflow-hidden bg-secondary-dark border border-interactive-border"
              >
                <div className="relative aspect-[2/3] bg-secondary-medium">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm px-2 text-center">
                      No poster
                    </div>
                  )}

                  {movie.rank && (
                    <div className="absolute top-2.5 left-2.5 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
                      #{movie.rank}
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-interactive-border">
                  <h3 className="text-text-primary font-semibold text-sm md:text-base line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-text-secondary">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-3 h-3 text-yellow-400" />
                      <span>
                        {movie.rating && movie.rating > 0 ? movie.rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    {movie.year && <span>{movie.year}</span>}
                  </div>
                  {movie.overview && (
                    <p className="text-text-secondary text-[10px] mt-1 line-clamp-1">{movie.overview}</p>
                  )}
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
