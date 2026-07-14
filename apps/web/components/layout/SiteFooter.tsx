import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full bg-transparent border-t border-white/10 text-white/60 relative z-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">

        <div className="flex flex-col items-center gap-1 text-xs sm:flex-row sm:gap-2 sm:text-sm">
          <span>&copy; 2026 WeMovies AI</span>

          <span className="hidden sm:inline text-white/20">—</span>

          <span className="text-white/50">
            Pijak in collaboration with IBM SkillsBuild
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <Link href="/contact" className="transition hover:text-[#00d2ff]">
            Contact
          </Link>
          <span className="text-text-muted">|</span>
          <Link href="/privacy-policy" className="transition hover:text-[#00d2ff]">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
