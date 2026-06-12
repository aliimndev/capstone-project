'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { StarIcon } from '@/components/ui/Icons';
import { resolveDisplayPosterUrl } from './mapMovie';
import type { DisplayMovie } from './movieTypes';

export type { DisplayMovie as RecommendedMovie } from './movieTypes';

/* ─── Helpers ──────────────────────────────────────────────────────────── */

/** Derive a synthetic "Match %" from a 1-based rank (purely frontend). */
function matchPercentage(rank: number): number {
  // #1 → 98%, linearly decreasing ~1.4pp per rank, floored at 85%
  return Math.max(85, Math.round(98 - (rank - 1) * 1.4));
}

/** Build a shareable text block from the recommendation list. */
function buildShareText(movies: DisplayMovie[]): string {
  const lines = movies.map(
    (m, i) => `${i + 1}. ${m.title}${m.year ? ` (${m.year})` : ''}`
  );
  return [
    '🎬 My Top Movie Recommendations',
    '',
    ...lines,
    '',
    'Powered by WeWatch',
  ].join('\n');
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

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

/* ─── Share Button ─────────────────────────────────────────────────────── */

function ShareButton({ movies }: { movies: DisplayMovie[] }) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const text = buildShareText(movies);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Fallback: textarea select + execCommand for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
    }
  }, [movies]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300
        border-white/10 bg-white/5 text-text-secondary hover:text-white hover:border-[#00d2ff]/40 hover:bg-[#00d2ff]/10 backdrop-blur-sm"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-400">Copied! ✓</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share</span>
        </>
      )}
    </button>
  );
}

/* ─── Movie Modal ──────────────────────────────────────────────────────── */

function MovieModal({
  movie,
  matchPct,
  onClose,
}: {
  movie: DisplayMovie;
  matchPct: number;
  onClose: () => void;
}) {
  const [showTrailer, setShowTrailer] = useState(false);
  const posterUrl = resolveDisplayPosterUrl(movie, 'card');

  // ESC key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const trailerQuery = encodeURIComponent(`${movie.title} official trailer`);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0a1020]/95 border border-white/10 shadow-2xl shadow-black/60"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Poster */}
          <div className="relative w-full sm:w-64 flex-shrink-0 aspect-[2/3] sm:aspect-auto sm:min-h-[380px] bg-secondary-medium rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 256px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-sm bg-gradient-to-br from-secondary-medium to-secondary-dark">
                No poster available
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                {movie.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {/* Match badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                  {matchPct}% Match
                </span>

                {movie.year && (
                  <span className="text-text-secondary text-sm">{movie.year}</span>
                )}

                {movie.rating && movie.rating > 0 && (
                  <span className="inline-flex items-center gap-1 text-sm text-yellow-400">
                    <StarIcon className="w-3.5 h-3.5" />
                    {movie.rating.toFixed(1)}
                  </span>
                )}

                {movie.release_date && (
                  <span className="text-text-muted text-xs">
                    Released {movie.release_date}
                  </span>
                )}
              </div>
            </div>

            {/* Overview */}
            {movie.overview && (
              <p className="text-text-secondary text-sm leading-relaxed">
                {movie.overview}
              </p>
            )}

            {/* Trailer section */}
            <div className="mt-auto pt-4">
              {!showTrailer ? (
                <button
                  type="button"
                  onClick={() => setShowTrailer(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                    bg-red-600 hover:bg-red-500 text-white transition-colors duration-200 shadow-lg shadow-red-600/20"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <a
                    href={`https://www.youtube.com/results?search_query=${trailerQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                      bg-red-600 hover:bg-red-500 text-white transition-colors duration-200 shadow-lg shadow-red-600/20 w-fit"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch on YouTube
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Movie Card ───────────────────────────────────────────────────────── */

function RecommendedMovieCard({
  movie,
  index,
  onSelect,
}: {
  movie: DisplayMovie;
  index: number;
  onSelect: (movie: DisplayMovie) => void;
}) {
  const posterUrl = resolveDisplayPosterUrl(movie, 'card');
  const pct = matchPercentage(movie.rank ?? index + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
      onClick={() => onSelect(movie)}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-secondary-medium mb-3 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#00d2ff]/10">
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

        {/* Match % badge — bottom-left */}
        <div className="absolute bottom-2.5 left-2.5 z-20 inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          {pct}% Match
        </div>
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

/* ─── Main Component ───────────────────────────────────────────────────── */

const RecommendedMovies: React.FC<RecommendedMoviesProps> = ({ loading, error, movies, message }) => {
  const [selectedMovie, setSelectedMovie] = useState<DisplayMovie | null>(null);

  const hasMovies = movies && movies.length > 0;

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
            {movies.slice(0, 10).map((movie, index) => (
              <RecommendedMovieCard
                key={movie.id}
                movie={movie}
                index={index}
                onSelect={setSelectedMovie}
              />
            ))}
          </div>
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