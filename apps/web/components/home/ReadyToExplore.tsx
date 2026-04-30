// components/sections/ReadyToExplore.tsx

import Link from "next/link";

export function ReadyToExplore() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Ready to find your next movie?
        </h2>
        
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
          Get personalized recommendations in just a few clicks.
        </p>

        <div className="mt-10">
          <Link
            href="/recommend"
            className="inline-flex h-14 items-center justify-center rounded-full bg-slate-900 px-10 text-lg font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.97]"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </section>
  );
}