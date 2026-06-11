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

const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

export function MovieCard({
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
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-900 mb-3">
        <Image
          src={posterUrl}
          alt={title}
          fill
          sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
          priority={index < 3}
        />

        <div className="absolute top-2.5 left-2.5 z-20 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-md">
          #{rankBadge}
        </div>

        {hasRating && (
          <div className="absolute top-2.5 right-2.5 z-20 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-yellow-400" />
            <span>{formattedRating}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-[#00d2ff] transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          {releaseYear && <span>{releaseYear}</span>}
          {releaseYear && voteCount > 0 && <span>•</span>}
          {voteCount > 0 && <span>{formattedVotes} votes</span>}
        </div>
      </div>
    </div>
  );
}