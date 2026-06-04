// app/recommend/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

import RecommendedMovies from "@/components/recommend/RecommendedMovies";
import type { RecommendedMovie } from "@/components/recommend/RecommendedMovies";


import { SiteFooter } from "@/components/layout/SiteFooter";
import SearchMovies from "@/components/recommend/SearchMovies";
import SelectionSummary, { type Movie } from "@/components/recommend/SelectionSummary";
import TrendingMovies from "@/components/recommend/TrendingMovies";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function RecommendPage() {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<RecommendedMovie[]>([]);

  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);



  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovies(prev => {
      const isAlreadySelected = prev.find(m => m.id === movie.id);
      
      if (isAlreadySelected) {
        return prev.filter(m => m.id !== movie.id);
      }
      
      if (prev.length >= 3) {
        alert('You can only select up to 3 movies');
        return prev;
      }
      
      return [...prev, movie];
    });
  };

  const handleRemoveMovie = (movieId: string | number) => {
    setSelectedMovies(prev => prev.filter(m => m.id !== movieId));
  };

  const selectedIds = useMemo(() => {
    return selectedMovies.map((m) => Number(m.id)).filter((x) => !Number.isNaN(x));
  }, [selectedMovies]);

  useEffect(() => {
    const run = async () => {
      if (selectedIds.length !== 3) {
        setRecommended([]);
        setRecommendError(null);
        setRecommendLoading(false);
        return;
      }

      try {
        setRecommendLoading(true);
        setRecommendError(null);

        const res = await fetch('http://localhost:8000/api/v1/recommendations/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movie_ids: selectedIds }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed: ${res.status}`);
        }

        const data = await res.json();
        // backend returns { movies: MovieBase[] }
        setRecommended(data?.movies || []);
      } catch (e) {
        setRecommendError(e instanceof Error ? e.message : 'Failed to get recommendations');
        setRecommended([]);
      } finally {
        setRecommendLoading(false);
      }
    };

    run();
  }, [selectedIds]);

  return (

    <div className="min-h-screen bg-primary-black text-text-primary flex flex-col">
      <SiteHeader />
      
      {/* Main Content */}
      <main className="flex-1 pb-8">
        <SearchMovies onSelectMovie={handleSelectMovie} />
        <TrendingMovies 
          onSelectMovie={handleSelectMovie}
          selectedMovies={selectedMovies}
        />
      </main>

      {/* Selection Summary - Tidak fixed, tapi di atas Footer */}
      <div className="bg-primary-black z-50">
        <SelectionSummary
          selectedMovies={selectedMovies}
          onRemoveMovie={handleRemoveMovie}
          maxSelection={3}
        />
      </div>

      <RecommendedMovies
        loading={recommendLoading}
        error={recommendError}
        movies={recommended}
      />


      {/* Footer */}
      <SiteFooter />
    </div>
  );
}