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
  emoji: string;
}> = [
  { key: 'loved it', label: 'Loved It', emoji: '❤️' },
  { key: 'like it', label: 'Liked It', emoji: '👍' },
  { key: 'just normal', label: 'Normal', emoji: '😐' },
  { key: 'dislike', label: 'Dislike', emoji: '👎' },
];
