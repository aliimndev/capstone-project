import type { DisplayMovie } from './movieTypes';

/** Derive a synthetic "Match %" from a 1-based rank (purely frontend). */
export function matchPercentage(rank: number): number {
  // #1 → 98%, linearly decreasing ~1.4pp per rank, floored at 85%
  return Math.max(85, Math.round(98 - (rank - 1) * 1.4));
}

/** Build a shareable text block from the recommendation list. */
export function buildShareText(movies: DisplayMovie[]): string {
  const lines = movies.map(
    (m, i) => `${i + 1}. ${m.title}${m.year ? ` (${m.year})` : ''}`
  );
  return [
    '🎬 My Top Movie Recommendations',
    '',
    ...lines,
    '',
    'Powered by WeWatch',
  ].join('\n');
}
