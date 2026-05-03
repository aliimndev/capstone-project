"use client";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Error state component for failed data fetches
 * Displays error message with optional retry button
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center">
        {/* Error Icon */}
        <div className="mb-4 inline-block">
          <svg
            className="w-12 h-12 text-special-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0-6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <p className="text-text-secondary text-base mb-6 max-w-md">
          {message}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-primary-orange hover:bg-interactive-hover text-primary-black font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary-orange/30"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
