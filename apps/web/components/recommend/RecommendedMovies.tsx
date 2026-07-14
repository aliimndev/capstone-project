'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { DisplayMovie } from './movieTypes';

import { matchPercentage } from './recommendUtils';
import { ShareButton } from './ShareButton';
import { MovieModal } from './MovieModal';
import { RecommendedMovieCard } from './RecommendedMovieCard';
import { Skeleton, ErrorBanner, EmptyPrompt } from './RecommendationStates';

export type { DisplayMovie as RecommendedMovie } from './movieTypes';

interface RecommendedMoviesProps {
  loading?: boolean;
  error?: string | null;
  movies?: DisplayMovie[];
  message?: string | null;
}

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ loading, error, movies, message }) => {
  const [selectedMovie, setSelectedMovie] = useState<DisplayMovie | null>(null);

  const hasMovies = movies && movies.length > 0;

  return (
    <section className="py-20 bg-transparent relative z-10">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary flex items-center gap-4">
              Recommended for you
              <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent hidden sm:block" />
            </h2>

            {hasMovies && !loading && <ShareButton movies={movies} />}
          </div>

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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8"
          >
            {movies.slice(0, 10).map((movie, index) => (
              <RecommendedMovieCard
                key={movie.id}
                movie={movie}
                index={index}
                onSelect={setSelectedMovie}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            matchPct={matchPercentage(selectedMovie.rank ?? 1)}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecommendedMovies;