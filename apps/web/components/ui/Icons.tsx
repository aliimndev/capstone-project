/**
 * Reusable SVG icon components used across the application.
 * Centralised here to eliminate duplication in MovieCard, SearchMovies, and RecommendedMovies.
 */

interface IconProps {
  className?: string;
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 01.208 1.04l-6.75 10.5a.75.75 0 01-1.202.082l-3.75-3.75a.75.75 0 111.06-1.06l3.112 3.111 6.252-9.726a.75.75 0 011.04-.208z"
        clipRule="evenodd"
      />
    </svg>
  );
}
