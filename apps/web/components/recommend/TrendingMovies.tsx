// components/recommend/TrendingMovies.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

/**
 * Movie interface for trending movies display in recommendation selection
 */
export interface Movie {
  id: string | number;
  rank?: number;
  title: string;
  posterUrl: string;
  rating?: number;
  votes?: number;
  year?: number;
  releaseDate?: string;
}

interface TrendingMoviesProps {
  movies?: Movie[];
  limit?: number;
  onSelectMovie?: (movie: Movie) => void;
  selectedMovies?: Movie[];
}

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
  isSelected?: boolean;
}

/**
 * Movie card component with selection capability
 * Used in recommendation flow to allow users to select movies
 */
const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect, isSelected }) => {
  return (
    <div 
      className={`group relative overflow-hidden rounded-lg cursor-pointer 
        transition-all duration-300 
        ${isSelected 
          ? 'ring-2 ring-primary-orange shadow-lg shadow-primary-orange/50 scale-105' 
          : 'hover:shadow-[0_0_36px_rgba(255,107,0,0.22)] hover:scale-105'
        }`}
      onClick={() => onSelect?.(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect?.(movie);
        }
      }}
    >
      {/* Rank Badge */}
      {movie.rank && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-primary-orange text-primary-black text-xs font-bold px-3 py-2 rounded-lg shadow-lg">
            {String(movie.rank).padStart(2, '0')}
          </div>
        </div>
      )}

      {/* Poster Container */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-secondary-dark">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(min-width: 768px) 20vw, (min-width: 640px) 25vw, 50vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info Section */}
      <div className="p-3 bg-secondary-dark border-t border-interactive-border">
        {/* Title */}
        <h3 className="text-text-primary font-semibold text-sm md:text-base mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary-orange transition-colors">
          {movie.title}
        </h3>
        
        {/* Rating & Votes */}
        <div className="flex items-center justify-between gap-2">
          {movie.rating ? (
            <div className="flex items-center gap-1.5">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-special-success fill-current" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-text-secondary text-sm font-semibold">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          ) : null}

          {movie.votes ? (
            <span className="text-text-muted text-xs">
              {movie.votes >= 1000 ? `${(movie.votes / 1000).toFixed(1)}K` : movie.votes}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton loader for movie cards
 */
const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="bg-secondary-dark rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-secondary-medium" />
      <div className="p-3 space-y-2 bg-secondary-dark">
        <div className="h-4 bg-secondary-medium rounded w-3/4" />
        <div className="h-3 bg-secondary-medium rounded w-1/2" />
      </div>
    </div>
  );
};

/**
 * TMDB Movie interface for API responses
 */
interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  posterUrl?: string;
  rating?: number;
  vote_average?: number;
  votes?: number;
  vote_count?: number;
  year?: number;
  release_date?: string;
}

/**
 * Mock data provider for fallback/testing
 */
function getMockData(): Movie[] {
  return [
    { id: 1, rank: 1, title: "Violet Evergarden", posterUrl: "https://image.tmdb.org/t/p/w500/yFpAKU8zzVUT3MOpgx03yO0kQN1.jpg", rating: 9.0 },
    { id: 2, rank: 2, title: "A Silent Voice", posterUrl: "https://image.tmdb.org/t/p/w500/drlyxSKbs1uVshxZ9K6FNKzqKv.jpg", rating: 8.9 },
    { id: 3, rank: 3, title: "Your Name", posterUrl: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg", rating: 9.5 },
    { id: 4, rank: 4, title: "Your Lie in April", posterUrl: "https://image.tmdb.org/t/p/w500/9R7YKCNqKxh0xPNPM0VlK8zKQZV.jpg", rating: 8.8 },
    { id: 5, rank: 5, title: "Josee, the Tiger and the Fish", posterUrl: "https://image.tmdb.org/t/p/w500/1M1vJdH6lkdXlCJkJTlJJlJJlJJ.jpg", rating: 8.7 },
    { id: 6, rank: 6, title: "From Up on Poppy Hill", posterUrl: "https://image.tmdb.org/t/p/w500/xtPBZYzWkH0M0xJlJJlJJlJJlJJ.jpg", rating: 8.6 },
    { id: 7, rank: 7, title: "Howl's Moving Castle", posterUrl: "https://image.tmdb.org/t/p/w500/TkTPELWinKXvBzjWIgGy5qHbOQ.jpg", rating: 8.9 },
    { id: 8, rank: 8, title: "Kiki's Delivery Service", posterUrl: "https://image.tmdb.org/t/p/w500/7nO5DUMnGUuXrA4cH6llGyWlIRh.jpg", rating: 9.3 },
    { id: 9, rank: 9, title: "My Neighbor Totoro", posterUrl: "https://image.tmdb.org/t/p/w500/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg", rating: 8.8 },
    { id: 10, rank: 10, title: "Spirited Away", posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUKhGbHldv.jpg", rating: 9.6 },
  ];
}

/**
 * Main TrendingMovies component for recommendation page
 * Allows users to select up to 3 movies with visual feedback
 */
const TrendingMovies: React.FC<TrendingMoviesProps> = ({ 
  movies, 
  limit = 10,
  onSelectMovie,
  selectedMovies = [],
}) => {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch trending movies from API
   */
  const fetchTrendingMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/trending-movies');
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending movies');
      }

      const data = await response.json();
      
      // Handle various response structures
      const moviesArray = data.results || data.movies || data.data || data;
      
      if (!Array.isArray(moviesArray)) {
        throw new Error('Invalid data format received');
      }
      
// Format data according to interface
      const formattedMovies: Movie[] = moviesArray
        .filter((movie: TMDBMovie) => movie.poster_path || movie.posterUrl)
        .slice(0, limit)
        .map((movie: TMDBMovie, index: number) => ({
          id: movie.id,
          rank: index + 1,
          title: movie.title || movie.name || 'Untitled',
          posterUrl: movie.posterUrl 
            ? movie.posterUrl
            : `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          rating: movie.rating || movie.vote_average,
          votes: movie.votes || movie.vote_count,
          year: movie.year || (movie.release_date?.split('-')[0] ? parseInt(movie.release_date.split('-')[0]) : undefined),
        }));

      if (formattedMovies.length === 0) {
        throw new Error('No movies with posters found');
      }

      setMovieData(formattedMovies);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Fallback to mock data for development
      setMovieData(getMockData());
    } finally {
      setLoading(false);
    }
  }, [limit]);

  /**
   * Initialize data on mount or when props change
   */
  useEffect(() => {
    if (movies && movies.length > 0) {
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setMovieData(movies.slice(0, limit));
        setLoading(false);
      }, 0);
      
      return () => clearTimeout(timer);
    } else {
      // Also wrap fetchTrendingMovies in setTimeout to avoid synchronous setState
      const timer = setTimeout(() => {
        fetchTrendingMovies();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [movies, limit, fetchTrendingMovies]);

  const handleSelectMovie = (movie: Movie) => {
    onSelectMovie?.(movie);
  };

  // Error state
  if (error && !loading) {
    return (
      <section className="w-full bg-primary-black py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-special-error mb-6">{error}</p>
          <button 
            onClick={fetchTrendingMovies}
            className="px-6 py-3 bg-primary-orange hover:bg-interactive-hover text-primary-black font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary-orange/30"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-primary-black py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Trending Movies
          </h2>
          <p className="text-text-secondary text-sm md:text-base">
            Select up to 3 movies that you like
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: limit }).map((_, index) => (
              <MovieCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            movieData.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={handleSelectMovie}
                isSelected={selectedMovies.some(m => m.id === movie.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingMovies;
