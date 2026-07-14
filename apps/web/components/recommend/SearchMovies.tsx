'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { searchMovies, discoverMoviesByGenre } from './movieApi';
import { mapMoviesForDisplay } from './mapMovie';
import { StarIcon, CheckIcon } from '@/components/ui/Icons';
import type { DisplayMovie } from './movieTypes';
import type { RatedMovie } from '@/features/recommendation/types';

export type { DisplayMovie as Movie } from './movieTypes';

interface Genre {
  id: number;
  name: string;
}

const SUGGESTED_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 878, name: 'Sci-Fi' },
  { id: 27, name: 'Horror' },
  { id: 18, name: 'Drama' },
  { id: 35, name: 'Comedy' },
  { id: 10749, name: 'Romance' }
];

function dedupeMoviesById<T extends { id: number }>(movies: T[]): T[] {
  return Array.from(new Map(movies.map((movie) => [movie.id, movie])).values());
}

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
      const uniqueMovies = dedupeMoviesById(moviesFromApi);
      const formattedMovies = mapMoviesForDisplay(uniqueMovies.slice(0, 12), {
        posterSize: 'card',
      });

      setSearchResults(formattedMovies);
      setHasSearched(true);
    } catch (error) {
      setSearchResults([]);
      setHasSearched(true);
      setSearchError(
        error instanceof Error ? error.message : 'Search failed. Give it another shot.'
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

  const fetchGenreResults = useCallback(async (genreId: number) => {
    try {
      setIsLoading(true);
      setSearchError(null);

      const moviesFromApi = await discoverMoviesByGenre(genreId);
      const uniqueMovies = dedupeMoviesById(moviesFromApi);
      const formattedMovies = mapMoviesForDisplay(uniqueMovies.slice(0, 12), {
        posterSize: 'card',
      });

      setSearchResults(formattedMovies);
      setHasSearched(true);
    } catch (error) {
      setSearchResults([]);
      setHasSearched(true);
      setSearchError(
        error instanceof Error ? error.message : 'Genre discovery failed. Give it another shot.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenreClick = (genre: Genre) => {
    fetchGenreResults(genre.id);
  };

  const isRated = (movieId: number) =>
    ratedMovies.some((m) => m.tmdbId === movieId || m.id === movieId);

  return (
    <section className="w-full bg-transparent py-10 md:py-14 px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Discover &amp; Rate Movies
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
            Search any movie from our library - then rate exactly {maxRatedMovies}{' '}
            films to unlock personalized recommendations.
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
              placeholder="Search any movie title or explore genres below..."
              className="w-full pl-12 pr-4 py-4 bg-[#091020]/50 backdrop-blur-sm border border-white/10 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20 transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.05)]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-2 mt-4"
          >
            {SUGGESTED_GENRES.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => handleGenreClick(genre)}
                className="px-3 py-1.5 text-sm rounded-full border border-white/10 bg-white/5 text-text-secondary hover:text-white hover:border-[#00d2ff]/40 hover:bg-[#00d2ff]/10 transition-colors"
              >
                {genre.name}
              </button>
            ))}
          </motion.div>
        </div>

        {!hasSearched && searchQuery.trim().length < 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-center rounded-xl border border-dashed border-white/10 bg-[#091020]/30 px-6 py-10"
          >
            <p className="text-text-secondary text-sm md:text-base mb-2">
              Just start typing a movie name above
            </p>
            <p className="text-text-muted text-xs md:text-sm">
              Or instantly explore one of our top suggestions
            </p>
          </motion.div>
        )}

        {isLoading && (
          <div className="text-center text-text-secondary py-12">
            Hunting down results...
          </div>
        )}

        {searchError && !isLoading && (
          <div className="max-w-xl mx-auto text-center rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-red-300">
            {searchError}
          </div>
        )}

        {!isLoading && hasSearched && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-text-secondary text-sm mb-4 text-center">
              {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''} found — click any to rate
            </p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5"
            >
              {searchResults.map((movie) => {
                const rated = isRated(movie.id);
                const hasRating = typeof movie.rating === 'number' && movie.rating > 0;

                return (
                  <motion.button
                    key={movie.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                    }}
                    type="button"
                    onClick={() => handleMovieSelect(movie)}
                    className="group text-left"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-900 mb-3 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#00d2ff]/10 transition-all duration-300">
                      {movie.posterUrl ? (
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm px-4 text-center bg-gradient-to-br from-gray-800 to-gray-900">
                          No poster
                        </div>
                      )}

                      {rated && (
                        <div className="absolute top-2.5 left-2.5 z-20 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                          <CheckIcon className="w-3 h-3 text-[#00d2ff]" />
                          <span>Rated</span>
                        </div>
                      )}

                      {hasRating && (
                        <div className="absolute top-2.5 right-2.5 z-20 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                          <StarIcon className="w-3 h-3 text-yellow-400" />
                          <span>{movie.rating?.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-[#00d2ff] transition-colors duration-200">
                        {movie.title}
                      </h3>
                      {movie.year && (
                        <p className="text-gray-500 text-xs mt-1">{movie.year}</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {!isLoading && hasSearched && searchQuery.trim().length >= 2 && searchResults.length === 0 && !searchError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl mx-auto text-center rounded-xl border border-white/10 bg-[#091020]/30 px-6 py-10"
          >
            <p className="text-text-secondary">
              No matches for &quot;{searchQuery}&quot; in our collection.
            </p>
            <p className="text-text-muted text-sm mt-2">
              Try a different title or pick a suggestion above.
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default SearchMovies;
