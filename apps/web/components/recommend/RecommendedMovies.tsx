'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { StarIcon } from '@/components/ui/Icons';
import { resolveDisplayPosterUrl } from './mapMovie';
import type { DisplayMovie } from './movieTypes';

export type { DisplayMovie as RecommendedMovie } from './movieTypes';

interface RecommendedMoviesProps {
  loading?: boolean;
  error?: string | null;
  movies?: DisplayMovie[];
  message?: string | null;
}

function Skeleton() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse">
      <div className="relative aspect-[2/3] bg-secondary-medium/50 rounded-xl" />
      <div className="pt-3 space-y-2">
        <div className="h-4 bg-secondary-medium/50 rounded w-3/4" />
        <div className="h-3 bg-secondary-medium/50 rounded w-1/2" />
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-secondary-dark/30 border border-special-error/20">
      <div className="w-16 h-16 rounded-full bg-special-error/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-special-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-special-error text-center font-medium mb-2">Unable to load recommendations</p>
      <p className="text-text-secondary text-sm text-center">{message}</p>
    </div>
  );
}

function EmptyPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-secondary-dark/30 border border-interactive-border/50">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <StarIcon className="w-8 h-8 text-primary" />
      </div>
      <p className="text-text-primary text-center font-semibold text-lg mb-2">
        Rate movies to get started
      </p>
      <p className="text-text-secondary text-center text-sm max-w-md">
        Rate at least 3 movies to unlock personalized recommendations just for you.
      </p>
    </div>
  );
}

function RecommendedMovieCard({ movie, index }: { movie: DisplayMovie; index: number }) {
  const posterUrl = resolveDisplayPosterUrl(movie, 'card');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-secondary-medium mb-3">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm px-4 text-center bg-gradient-to-br from-secondary-medium to-secondary-dark">
            No poster
          </div>
        )}

        {movie.rank && (
          <div className="absolute top-2.5 left-2.5 z-20 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-md">
            #{movie.rank}
          </div>
        )}

        {movie.rating && movie.rating > 0 && (
          <div className="absolute top-2.5 right-2.5 z-20 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-yellow-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-text-primary font-medium text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {movie.title}
        </h3>
        {movie.year && (
          <p className="text-text-secondary text-xs mt-0.5">{movie.year}</p>
        )}
      </div>
    </motion.div>
  );
}

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ loading, error, movies, message }) => {
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
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary flex items-center gap-4">
            Recommended for you
            <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent hidden sm:block" />
          </h2>
          <p className="text-text-secondary mt-3 text-lg">
            {message ?? 'Top 10 picks based on your ratings'}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : error ? (
          <ErrorBanner message={error} />
        ) : !movies || movies.length === 0 ? (
          <EmptyPrompt />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
            {movies.slice(0, 10).map((movie, index) => (
              <RecommendedMovieCard
                key={movie.id}
                movie={movie}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedMovies;