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
    <section className="w-full bg-transparent py-6 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#091020]/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 md:p-7 shadow-[0_0_30px_rgba(0,210,255,0.05)]">
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[#00d2ff] font-bold text-xl">
                {ratedCount}/{maxSelection}
              </span>
              <span className="text-white font-semibold ml-2">rated</span>
              <p className="text-gray-500 text-sm mt-1">
                Rate exactly {maxSelection} movies to get personalized recommendations
              </p>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-5">
              {slots.map((movie, index) => (
                <div
                  key={index}
                  className={`relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300
                    ${movie
                      ? 'ring-2 ring-[#00d2ff] shadow-lg shadow-[#00d2ff]/20'
                      : 'ring-2 ring-white/20 ring-dashed bg-[#091020]/50 backdrop-blur-sm'
                    }`}
                >
                  <div className="w-28 md:w-36 h-full">
                    {movie ? (
                      <>
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 112px, 144px"
                        />

                        <div className="absolute bottom-0 inset-x-0 bg-black/80 px-2 py-1.5">
                          <p className="text-[10px] text-[#00d2ff] font-semibold truncate">
                            {reactionLabel(movie.reaction)}
                          </p>
                        </div>

                        <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                          <button
                            onClick={() => onRemoveMovie(movie.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg"
                            title={`Remove ${movie.title}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-600"
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
                    )}
                  </div>
                </div>
              ))}
            </div>

            {ratedCount === maxSelection && (
              <p className="text-sm text-[#00d2ff]/80">
                All {maxSelection} movies rated — fetching recommendations...
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectionSummary;
