'use client';

import React from 'react';
import Image from 'next/image';
import { REACTION_OPTIONS, type ReactionKey } from '@/features/recommendation/types';

export interface PendingMovie {
  id: string | number;
  title: string;
  posterUrl: string;
}

interface RatingPanelProps {
  movie: PendingMovie;
  onRate: (reaction: ReactionKey) => void;
  onCancel: () => void;
}

const RatingPanel: React.FC<RatingPanelProps> = ({ movie, onRate, onCancel }) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="bg-[#091020]/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,210,255,0.15)]">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-white/5">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 text-center leading-tight">
                  No poster
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-sm">How did you feel about</p>
              <h3 className="text-white font-semibold text-lg truncate">{movie.title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Cancel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {REACTION_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => onRate(option.key)}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-[#00d2ff]/15 border border-white/10 hover:border-[#00d2ff]/40 transition-all duration-200 hover:scale-[1.02]"
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-white text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingPanel;
