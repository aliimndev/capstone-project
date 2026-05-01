// components/sections/ReadyToExplore.tsx

import Link from "next/link";

export function ReadyToExplore() {
  return (
    <section className="py-24 bg-[#000000]">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-[#ffffff] sm:text-6xl">
          Ready to find your next movie?
        </h2>
        
        <p className="mt-4 text-xl text-white/70 max-w-2xl mx-auto">
          Get personalized recommendations in just a few clicks.
        </p>

        <div className="mt-10">
          <Link
            href="/recommend"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#0099ff] px-10 text-lg font-semibold text-[#ffffff] shadow-[0_0_36px_rgba(0,153,255,0.35)] transition hover:bg-[#008ae6] active:scale-[0.97]"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </section>
  );
}
