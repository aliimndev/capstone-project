"use client";

/**
 * Empty state component for when no movies are found
 * Displays a user-friendly message when data is unavailable
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        {/* Empty Icon */}
        <div className="mb-4 inline-block">
          <svg
            className="w-12 h-12 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4v16m0-16L3 8m4 0l4-4m10 0v16m0-16l4-4m-4 0l-4-4"
            />
          </svg>
        </div>

        {/* Empty Message */}
        <p className="text-text-secondary text-base">
          No trending movies available right now.
        </p>
        <p className="text-text-muted text-sm mt-2">
          Please try again later.
        </p>
      </div>
    </div>
  );
}
