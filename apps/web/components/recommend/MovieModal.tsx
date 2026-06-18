'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { StarIcon } from '@/components/ui/Icons';
import { resolveDisplayPosterUrl } from './mapMovie';
import type { DisplayMovie } from './movieTypes';

interface Props {
  movie: DisplayMovie;
  matchPct: number;
  onClose: () => void;
}

export function MovieModal({ movie, matchPct, onClose }: Props) {
  const [showTrailer, setShowTrailer] = useState(false);
  const posterUrl = resolveDisplayPosterUrl(movie, 'card');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

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
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
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

      <motion.div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0a1020]/95 border border-white/10 shadow-2xl shadow-black/60"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full h-56 sm:h-auto sm:min-h-[380px] sm:w-64 flex-shrink-0 bg-secondary-medium rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden">
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

          <div className="flex-1 p-5 sm:p-8 flex flex-col gap-4">
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

            {movie.overview && (
              <p className="text-text-secondary text-sm leading-relaxed max-h-40 overflow-y-auto pr-1">
                {movie.overview}
              </p>
            )}

            <div className="mt-auto pt-4">
              {!showTrailer ? (
                <button
                  type="button"
                  onClick={() => setShowTrailer(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                    bg-red-600 hover:bg-red-500 text-white transition-colors duration-200 shadow-lg shadow-red-600/20
                    w-full sm:w-fit"
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
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                      bg-red-600 hover:bg-red-500 text-white transition-colors duration-200 shadow-lg shadow-red-600/20
                      w-full sm:w-fit"
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
