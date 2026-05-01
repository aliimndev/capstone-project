import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] bg-[#000000] flex items-center justify-center overflow-hidden">
      {/* Optional subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#000000] to-[#00111f]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-[#ffffff] sm:text-6xl lg:text-7xl">
          What do you want to<br className="hidden sm:block" /> watch today?
        </h1>

        <p className="mt-6 text-xl text-white/70">
          Find your next favorite movie
        </p>

        <div className="mt-12">
          <Link
            href="/recommend"
            className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-full bg-[#0099ff] px-10 text-lg font-semibold text-[#ffffff] shadow-[0_0_36px_rgba(0,153,255,0.35)] transition-all hover:bg-[#008ae6] hover:shadow-[0_0_44px_rgba(0,153,255,0.45)] active:scale-[0.97]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
