import React from 'react';
import { StarIcon } from '@/components/ui/Icons';

export function Skeleton() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse">
      <div className="relative aspect-[2/3] bg-secondary-medium/50 rounded-xl" />
      <div className="pt-3 space-y-2">
        <div className="h-4 bg-secondary-medium/50 rounded w-3/4" />
        <div className="h-3 bg-secondary-medium/50 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-secondary-dark/30 border border-special-error/20">
      <div className="w-16 h-16 rounded-full bg-special-error/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-special-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-special-error text-center font-medium mb-2">Unable to load recommendations</p>
      <p className="text-text-secondary text-sm text-center">{message}</p>
    </div>
  );
}

export function EmptyPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-secondary-dark/30 border border-interactive-border/50">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <StarIcon className="w-8 h-8 text-primary" />
      </div>
      <p className="text-text-primary text-center font-semibold text-lg mb-2">
        Rate movies to get started
      </p>
      <p className="text-text-secondary text-center text-sm max-w-md">
        Rate at least 3 movies to unlock personalized recommendations just for you.
      </p>
    </div>
  );
}
