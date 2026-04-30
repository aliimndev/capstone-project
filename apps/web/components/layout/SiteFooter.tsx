import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold text-white">RekoFilm</p>
          <p className="mt-1 text-sm text-slate-400">
            Temukan film yang pas dengan mood dan preferensimu.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/recommend" className="transition hover:text-white">
            Rekomendasi
          </Link>
        </div>
      </div>
    </footer>
  );
}
