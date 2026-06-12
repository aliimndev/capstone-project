"use client";

export function MovieSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] rounded-2xl bg-gradient-to-br from-secondary-medium to-secondary-dark shadow-[0_0_0_1px_rgba(255,255,255,0.08)]" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-secondary-dark rounded-full w-3/4 mx-auto" />
        <div className="h-3 bg-secondary-medium rounded-full w-1/2 mx-auto" />
      </div>
    </div>
  );
}
