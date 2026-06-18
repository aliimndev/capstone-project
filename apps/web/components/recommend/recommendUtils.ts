import type { DisplayMovie } from './movieTypes';

export function matchPercentage(rank: number): number {
  return Math.max(85, Math.round(98 - (rank - 1) * 1.4));
}

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
