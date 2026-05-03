import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full bg-primary-black text-text-secondary">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8 text-sm">
        {/* Bagian Kiri */}
        <div>
          &copy; 2026 WeMovies AI
        </div>

        {/* Bagian Kanan */}
        <div className="flex items-center gap-3">
          <Link href="/contact" className="transition hover:text-text-primary">
            Contact
          </Link>

          <span className="text-text-muted">|</span>

          <Link href="/privacy" className="transition hover:text-text-primary">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
