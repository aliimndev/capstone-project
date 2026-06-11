// components/SelectionSummary.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import type { RatedMovie } from '@/features/recommendation/types';
import { REACTION_OPTIONS } from '@/features/recommendation/types';

interface SelectionSummaryProps {
  ratedMovies: RatedMovie[];
  onRemoveMovie: (movieId: string | number) => void;
  maxSelection?: number;
}

const reactionLabel = (reaction: RatedMovie['reaction']) =>
  REACTION_OPTIONS.find((r) => r.key === reaction)?.label ?? reaction;

const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  ratedMovies,
  onRemoveMovie,
  maxSelection = 3,
}) => {
  const ratedCount = ratedMovies.length;

  const slots = Array.from({ length: maxSelection }, (_, index) => {
    return ratedMovies[index] || null;
  });

  return (
    <section className="py-12 bg-transparent relative z-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Your Selection
            </h2>
            <span className="text-[#00d2ff] font-semibold text-lg">
              {ratedCount}/{maxSelection}
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            Rate exactly {maxSelection} movies to get personalized recommendations
          </p>
        </div>

        <div className="flex flex-wrap gap-6 md:gap-8">
          {slots.map((movie, index) => (
            <div
              key={index}
              className="group relative aspect-[2/3] w-32 md:w-40 cursor-pointer"
            >
              {movie ? (
                <>
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 128px, 160px"
                    />

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                      <p className="text-xs text-[#00d2ff] font-semibold truncate">
                        {reactionLabel(movie.reaction)}
                      </p>
                    </div>

                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        onClick={() => onRemoveMovie(movie.id)}
                        className="p-2.5 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-lg"
                        title={`Remove ${movie.title}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-white font-medium text-sm line-clamp-1">
                      {movie.title}
                    </h3>
                    {movie.year && (
                      <p className="text-gray-500 text-xs mt-0.5">{movie.year}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-full h-full rounded-xl border-2 border-dashed border-gray-700 bg-gray-900/30 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-600 text-sm">Empty slot</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {ratedCount === maxSelection && (
          <div className="mt-8 p-4 bg-[#00d2ff]/10 border border-[#00d2ff]/20 rounded-lg">
            <p className="text-sm text-[#00d2ff] font-medium">
              ✓ All {maxSelection} movies rated — fetching recommendations...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectionSummary;