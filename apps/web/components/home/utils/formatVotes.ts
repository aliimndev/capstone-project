/**
 * Format vote/popularity counts to human-readable format
 * @param count - The number to format
 * @returns Formatted string (e.g., "1.2K", "3.5M")
 */
export function formatVotes(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Format rating to one decimal place
 * @param rating - The rating value
 * @returns Formatted rating string
 */
export function formatRating(rating: number | null): string {
  if (rating === null) return "N/A";
  return rating.toFixed(1);
}

/**
 * Get rank badge with leading zeros
 * @param index - The array index
 * @returns Formatted rank string (e.g., "01", "02")
 */
export function getRankBadge(index: number): string {
  return String(index + 1).padStart(2, "0");
}
