"use client";

import Image from "next/image";
import { formatRating, formatVotes, getRankBadge } from "./utils/formatVotes";

interface MovieCardProps {
  id: number;
  title: string;
  posterUrl: string;
  rating: number | null;
  releaseYear: number | null;
  voteCount?: number;
  index: number;
}

/**
 * Individual movie card component with rank badge, rating, and hover effects
 * Displays movie poster with metadata and interactive hover state
 */
export function MovieCard({
  id,
  title,
  posterUrl,
  rating,
  releaseYear,
  voteCount = 0,
  index,
}: MovieCardProps) {
  const rankBadge = getRankBadge(index);
  const formattedRating = formatRating(rating);
  const formattedVotes = formatVotes(voteCount);
  const hasRating = rating !== null && rating > 0;

  return (
    <div key={id} className="group cursor-pointer h-full flex flex-col">
      {/* Movie Poster Container */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary-dark shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:shadow-[0_0_36px_rgba(0,210,255,0.22)] group-hover:border group-hover:border-[#00d2ff]/50 group-hover:scale-110">
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 z-20 bg-[#00d2ff]/90 backdrop-blur-sm px-3 py-2 rounded-lg">
          <span className="text-sm font-bold text-[#091020]">{rankBadge}</span>
        </div>

        {/* Poster Image */}
        <Image
          src={posterUrl}
          alt={`${title} poster`}
          fill
          sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-115"
          priority={index < 3}
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge (Top Right) */}
        {hasRating && (
          <div className="absolute top-3 right-3 z-20 bg-secondary-dark/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-special-success text-sm">⭐</span>
            <span className="text-text-primary font-semibold text-sm">
              {formattedRating}
            </span>
          </div>
        )}
      </div>

      {/* Movie Information */}
      <div className="mt-4 flex-1 flex flex-col">
        {/* Title */}
        <p className="line-clamp-2 text-sm font-semibold text-text-primary group-hover:text-[#00d2ff] transition-colors duration-300">
          {title}
        </p>

        {/* Meta Information */}
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-text-muted">
          {releaseYear && <span>{releaseYear}</span>}
          {releaseYear && voteCount > 0 && (
            <span className="text-secondary-light">•</span>
          )}
          {voteCount > 0 && <span>{formattedVotes} votes</span>}
        </div>
      </div>
    </div>
  );
}
