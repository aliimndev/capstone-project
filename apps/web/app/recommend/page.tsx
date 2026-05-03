// app/recommend/page.tsx
'use client';

import { useState } from 'react';
import { SiteFooter } from "@/components/layout/SiteFooter";
import SearchMovies from "@/components/recommend/SearchMovies";
import SelectionSummary, { type Movie } from "@/components/recommend/SelectionSummary";
import TrendingMovies from "@/components/recommend/TrendingMovies";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function RecommendPage() {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);

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

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}