// components/SelectionSummary.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface Movie {
  id: string | number;
  title: string;
  posterUrl: string;
  year?: number;
  rating?: number;
}

interface SelectionSummaryProps {
  selectedMovies: Movie[];
  onRemoveMovie: (movieId: string | number) => void;
  maxSelection?: number;
}

const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  selectedMovies,
  onRemoveMovie,
  maxSelection = 3,
}) => {
  const selectedCount = selectedMovies.length;
  const isDisabled = selectedCount === 0;

  const slots = Array.from({ length: maxSelection }, (_, index) => {
    return selectedMovies[index] || null;
  });

  return (
    <section className="w-full bg-black py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black rounded-xl p-5 md:p-7">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
            
            {/* Left: Counter & Movie Slots */}
            <div className="flex-1">
              {/* Counter Text */}
              <div className="mb-5">
                <span className="text-orange-500 font-bold text-xl">
                  {selectedCount}/{maxSelection}
                </span>
                <span className="text-white font-semibold ml-2">
                  selected
                </span>
                <p className="text-gray-500 text-sm mt-1">
                  Pick up to {maxSelection} movies
                </p>
              </div>

              {/* Movie Slots - POSTER LEBIH BESAR */}
              <div className="flex flex-wrap gap-4 md:gap-5">
                {slots.map((movie, index) => (
                  <div
                    key={index}
                    className={`relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300
                      ${movie 
                        ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' 
                        : 'ring-2 ring-gray-700 ring-dashed bg-[#111111]'
                      }`}
                  >
                    {/* Ukuran poster diperbesar: w-28 md:w-36 (112px - 144px) */}
                    <div className="w-28 md:w-36 h-full">
                      {movie ? (
                        <>
                          {/* Movie Poster */}
                          <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 112px, 144px"
                          />
                          
                          {/* Remove Button Overlay */}
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
                        // Empty Slot dengan Plus Icon
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
            </div>

            {/* Right: Get Recommendation Button */}
            <div className="w-full md:w-auto">
              {isDisabled ? (
                <button
                  disabled
                  className="w-full md:w-auto px-8 py-4 bg-[#1A1A1A] text-gray-500 font-semibold rounded-xl cursor-not-allowed border border-gray-700"
                >
                  Get Rekomendation
                </button>
              ) : (
                <Link
                  href="/recommendations"
                  className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-600/40 hover:scale-105"
                >
                  Get Rekomendation
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectionSummary;