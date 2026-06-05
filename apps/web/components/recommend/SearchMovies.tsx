// components/recommend/SearchMovies.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

export interface Movie {
  id: string | number;
  title: string;
  posterUrl: string;
  year?: number;
  rating?: number;
  releaseDate?: string;
}

interface SearchMoviesProps {
  onSelectMovie?: (movie: Movie) => void;
}

// Define the expected shape of a movie from the backend API
interface RawMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  posterUrl?: string;
  release_date?: string;
  vote_average?: number;
}

const SearchMovies: React.FC<SearchMoviesProps> = ({ onSelectMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchSearchResults = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      
      // Ganti dengan API route Anda
      const response = await fetch('http://localhost:8000/api/v1/recommendations/search?q=' + encodeURIComponent(query));
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Search failed');
      }

      const data = await response.json();
      
      const moviesArray: RawMovie[] = data?.movies ?? data?.results ?? [];

      const formattedMovies: Movie[] = moviesArray
        .filter((movie: RawMovie) => movie.poster_path || movie.posterUrl)
        .slice(0, 5)
        .map((movie: RawMovie) => ({
          id: movie.id,
          title: movie.title || movie.name || 'Untitled',
          posterUrl:
            movie.posterUrl ||
            (movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : ''),
          year: movie.release_date?.split('-')[0]
            ? parseInt(movie.release_date.split('-')[0])
            : undefined,
          rating: movie.vote_average,
          releaseDate: movie.release_date,
        }));

      setSearchResults(formattedMovies);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSearchResults]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleMovieSelect = (movie: Movie) => {
    onSelectMovie?.(movie);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <section className="w-full bg-transparent py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-4">
          Search Movies
        </h1>

        {/* Subtext */}
        <p className="text-text-secondary text-center text-base md:text-lg mb-8">
          Search or explore trending movies, then select up to 3 that you like.
        </p>

        {/* Search Container */}
        <div ref={searchRef} className="relative">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
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
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search for a movie..."
              className="w-full pl-12 pr-4 py-4 bg-[#091020]/50 backdrop-blur-sm border border-white/10 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20 transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.05)]"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#091020]/90 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,210,255,0.1)] z-50">
              {isLoading ? (
                <div className="p-4 text-center text-text-secondary">
                  Searching...
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => handleMovieSelect(movie)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-[#00d2ff]/10 hover:text-white transition-colors border-b border-white/10 last:border-b-0"
                    >
                      {/* Movie Poster */}
                      <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded relative">
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>

                      {/* Movie Info */}
                      <div className="flex-1 text-left">
                        <h3 className="text-text-primary font-semibold text-sm md:text-base">
                          {movie.title}
                        </h3>
                        {movie.year && (
                          <p className="text-text-secondary text-sm">{movie.year}</p>
                        )}
                      </div>

                      {/* Add Icon */}
                      <div className="text-[#00d2ff]">
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
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {showResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isLoading && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#091020]/90 backdrop-blur-md border border-white/10 rounded-lg p-4 text-center text-text-secondary z-50">
              No movies found
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchMovies;