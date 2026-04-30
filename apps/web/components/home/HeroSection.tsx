import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center overflow-hidden">
      {/* Optional subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-slate-950 sm:text-6xl lg:text-7xl">
          What do you want to<br className="hidden sm:block" /> watch today?
        </h1>

        <p className="mt-6 text-xl text-slate-600">
          Find your next favorite movie
        </p>

        <div className="mt-12">
          <Link
            href="/recommend"
            className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-full bg-rose-600 px-10 text-lg font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700 hover:shadow-xl active:scale-[0.97]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}