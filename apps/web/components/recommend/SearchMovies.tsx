// components/recommend/SearchMovies.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { searchMovies } from './movieApi';
import { mapMoviesForDisplay } from './mapMovie';
import type { DisplayMovie } from './movieTypes';
import type { RatedMovie } from '@/features/recommendation/types';

export type { DisplayMovie as Movie } from './movieTypes';

const SUGGESTED_SEARCHES = [
  'Fight Club',
  'Inception',
  'The Matrix',
  'The Godfather',
  'Pulp Fiction',
  'Interstellar',
];

interface SearchMoviesProps {
  onMovieClick?: (movie: DisplayMovie) => void;
  ratedMovies?: RatedMovie[];
  maxRatedMovies?: number;
}

const SearchMovies: React.FC<SearchMoviesProps> = ({
  onMovieClick,
  ratedMovies = [],
  maxRatedMovies = 3,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DisplayMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchSearchResults = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setSearchError(null);

      const moviesFromApi = await searchMovies(query);
      const formattedMovies = mapMoviesForDisplay(moviesFromApi.slice(0, 12), {
        posterSize: 'card',
      });

      setSearchResults(formattedMovies);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setHasSearched(true);
      setSearchError(
        error instanceof Error ? error.message : 'Gagal mencari film. Coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
        setHasSearched(false);
        setSearchError(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSearchResults]);

  const handleMovieSelect = (movie: DisplayMovie) => {
    onMovieClick?.(movie);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const isRated = (movieId: number) =>
    ratedMovies.some((m) => m.tmdbId === movieId || m.id === movieId);

  return (
    <section className="w-full bg-transparent py-10 md:py-14 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Cari & Rate Film
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
            Cari film di katalog model, pilih reaksimu, dan rate tepat {maxRatedMovies} film
            untuk mendapat rekomendasi personal.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik judul film, mis. Fight Club..."
              className="w-full pl-12 pr-4 py-4 bg-[#091020]/50 backdrop-blur-sm border border-white/10 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20 transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.05)]"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {SUGGESTED_SEARCHES.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm rounded-full border border-white/10 bg-white/5 text-text-secondary hover:text-white hover:border-[#00d2ff]/40 hover:bg-[#00d2ff]/10 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {!hasSearched && searchQuery.trim().length < 2 && (
          <div className="max-w-2xl mx-auto text-center rounded-xl border border-dashed border-white/10 bg-[#091020]/30 px-6 py-10">
            <p className="text-text-secondary text-sm md:text-base mb-2">
              Mulai dengan mengetik judul film di atas
            </p>
            <p className="text-text-muted text-xs md:text-sm">
              Atau klik salah satu saran populer untuk langsung mencari
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-text-secondary py-12">Mencari film...</div>
        )}

        {searchError && !isLoading && (
          <div className="max-w-xl mx-auto text-center rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-red-300">
            {searchError}
          </div>
        )}

        {!isLoading && hasSearched && searchResults.length > 0 && (
          <div>
            <p className="text-text-secondary text-sm mb-4 text-center">
              {searchResults.length} film ditemukan di katalog model — klik untuk rate
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {searchResults.map((movie) => {
                const rated = isRated(movie.id);

                return (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => handleMovieSelect(movie)}
                    className={`group text-left rounded-xl overflow-hidden border transition-all duration-300 ${
                      rated
                        ? 'border-[#00d2ff] ring-2 ring-[#00d2ff]/40 shadow-lg shadow-[#00d2ff]/10'
                        : 'border-white/10 hover:border-[#00d2ff]/40 hover:shadow-xl hover:shadow-black/30'
                    }`}
                  >
                    <div className="relative aspect-[2/3] bg-secondary-medium">
                      {movie.posterUrl ? (
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-xs px-2 text-center">
                          No poster
                        </div>
                      )}

                      {rated && (
                        <div className="absolute top-2 right-2 z-10 bg-[#00d2ff] text-black text-[10px] font-bold px-2 py-1 rounded-full">
                          Rated
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-[#091020]/80 border-t border-white/10">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#00d2ff] transition-colors">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-text-secondary mt-1">
                        {movie.year && <span>{movie.year}</span>}
                        {movie.rating && movie.rating > 0 && (
                          <span>{movie.rating.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && hasSearched && searchQuery.trim().length >= 2 && searchResults.length === 0 && !searchError && (
          <div className="max-w-xl mx-auto text-center rounded-xl border border-white/10 bg-[#091020]/30 px-6 py-10">
            <p className="text-text-secondary">
              Tidak ada film &quot;{searchQuery}&quot; di katalog model.
            </p>
            <p className="text-text-muted text-sm mt-2">
              Coba judul lain atau gunakan saran di atas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchMovies;

