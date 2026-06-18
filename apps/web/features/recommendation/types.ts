export type ReactionKey = 'loved it' | 'like it' | 'just normal' | 'dislike';

export interface RatedMovie {
  /** TMDB movie ID — sent to backend as movie_id */
  id: number;
  tmdbId: number;
  title: string;
  posterUrl: string;
  year?: number;
  rating?: number;
  reaction: ReactionKey;
}

export interface RecommendationRequest {
  rated_movies: Array<{
    movie_id: number;
    reaction: ReactionKey;
  }>;
}

export const REACTION_OPTIONS: Array<{
  key: ReactionKey;
  label: string;
  hoverClasses: string;
}> = [
  {
    key: 'loved it',
    label: 'Loved It',
    hoverClasses: 'hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-400/10',
  },
  {
    key: 'like it',
    label: 'Liked It',
    hoverClasses: 'hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10',
  },
  {
    key: 'just normal',
    label: 'Normal',
    hoverClasses: 'hover:border-gray-400 hover:text-gray-400 hover:bg-gray-400/10',
  },
  {
    key: 'dislike',
    label: 'Dislike',
    hoverClasses: 'hover:border-red-400 hover:text-red-400 hover:bg-red-400/10',
  },
];
