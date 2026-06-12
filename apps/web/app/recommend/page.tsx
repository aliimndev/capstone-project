'use client';

import { useEffect, useMemo, useState } from 'react';

import RecommendedMovies from '@/components/recommend/RecommendedMovies';
import RatingPanel from '@/components/recommend/RatingPanel';
import SearchMovies from '@/components/recommend/SearchMovies';
import SelectionSummary from '@/components/recommend/SelectionSummary';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { fetchRecommendations } from '@/features/recommendation/api';
import type { RatedMovie, ReactionKey } from '@/features/recommendation/types';
import type { DisplayMovie } from '@/components/recommend/movieTypes';

const MAX_RATED_MOVIES = 3;

export default function RecommendPage() {
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [pendingMovie, setPendingMovie] = useState<DisplayMovie | null>(null);
  const [recommended, setRecommended] = useState<DisplayMovie[]>([]);
  const [recommendMessage, setRecommendMessage] = useState<string | null>(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  const handleMovieClick = (movie: DisplayMovie) => {
    const existing = ratedMovies.find((m) => m.tmdbId === movie.id);
    if (existing) {
      setPendingMovie(movie);
      return;
    }

    if (ratedMovies.length >= MAX_RATED_MOVIES) {
      alert('You have already rated 3 movies. Remove one to rate another.');
      return;
    }

    setPendingMovie(movie);
  };

  const handleRate = (reaction: ReactionKey) => {
    if (!pendingMovie) return;

    setRatedMovies((prev) => {
      const existingIndex = prev.findIndex((m) => m.tmdbId === pendingMovie.id);
      const rated: RatedMovie = {
        id: pendingMovie.id,
        tmdbId: pendingMovie.id,
        title: pendingMovie.title,
        posterUrl: pendingMovie.posterUrl,
        year: pendingMovie.year,
        rating: pendingMovie.rating,
        reaction,
      };

      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = rated;
        return next;
      }

      if (prev.length >= MAX_RATED_MOVIES) return prev;
      return [...prev, rated];
    });

    setPendingMovie(null);
  };

  const handleRemoveMovie = (movieId: string | number) => {
    setRatedMovies((prev) => prev.filter((m) => m.tmdbId !== movieId && m.id !== movieId));
    setRecommended([]);
    setRecommendMessage(null);
    setRecommendError(null);
  };

  const ratedPayloadKey = useMemo(
    () => JSON.stringify(ratedMovies.map((m) => ({ tmdbId: m.tmdbId, reaction: m.reaction }))),
    [ratedMovies]
  );

  useEffect(() => {
    const run = async () => {
      if (ratedMovies.length !== MAX_RATED_MOVIES) {
        setRecommended([]);
        setRecommendMessage(null);
        setRecommendError(null);
        setRecommendLoading(false);
        return;
      }

      try {
        setRecommendLoading(true);
        setRecommendError(null);
        const result = await fetchRecommendations(ratedMovies);
        setRecommended(result.movies);
        if (result.usedModelFallback) {
          setRecommendMessage(
            'Film pilihan belum ada di katalog model. Coba cari judul klasik seperti Fight Club, Inception, atau The Matrix.'
          );
        } else if (result.unmappedTmdbIds?.length) {
          setRecommendMessage(
            `${result.message} Beberapa film tidak dikenali model dan diabaikan.`
          );
        } else {
          setRecommendMessage(result.message);
        }
      } catch (e) {
        setRecommendError(e instanceof Error ? e.message : 'Failed to get recommendations');
        setRecommended([]);
        setRecommendMessage(null);
      } finally {
        setRecommendLoading(false);
      }
    };

    run();
  }, [ratedPayloadKey, ratedMovies]);

  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col relative z-10">
      <SiteHeader />

      <main className="flex-1 pb-8">
        <SearchMovies
          onMovieClick={handleMovieClick}
          ratedMovies={ratedMovies}
          maxRatedMovies={MAX_RATED_MOVIES}
        />
      </main>

      <div className="bg-[#091020]/80 backdrop-blur-md z-50">
        <SelectionSummary
          ratedMovies={ratedMovies}
          onRemoveMovie={handleRemoveMovie}
          maxSelection={MAX_RATED_MOVIES}
        />
      </div>

      {pendingMovie && (
        <RatingPanel
          movie={pendingMovie}
          onRate={handleRate}
          onCancel={() => setPendingMovie(null)}
        />
      )}

      <RecommendedMovies
        loading={recommendLoading}
        error={recommendError}
        movies={recommended}
        message={recommendMessage}
      />

      <SiteFooter />
    </div>
  );
}
