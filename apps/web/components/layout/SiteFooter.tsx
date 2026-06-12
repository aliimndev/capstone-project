import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full bg-transparent border-t border-white/10 text-white/60 relative z-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8 text-sm">
        <div>&copy; 2026 WeMovies AI</div>

        <div className="flex items-center gap-3">
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
