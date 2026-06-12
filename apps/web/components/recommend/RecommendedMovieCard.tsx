'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { StarIcon } from '@/components/ui/Icons';
import { resolveDisplayPosterUrl } from './mapMovie';
import { matchPercentage } from './recommendUtils';
import type { DisplayMovie } from './movieTypes';

interface Props {
  movie: DisplayMovie;
  index: number;
  onSelect: (movie: DisplayMovie) => void;
}

export function RecommendedMovieCard({ movie, index, onSelect }: Props) {
  const posterUrl = resolveDisplayPosterUrl(movie, 'card');
  const pct = matchPercentage(movie.rank ?? index + 1);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
        },
      }}
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
