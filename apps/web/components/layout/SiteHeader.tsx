import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },

];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#000000]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="RekoFilm home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-orange text-sm font-bold text-primary-black shadow-[0_0_24px_rgba(255,107,0,0.35)]">
            WM
          </span>
          <span className="text-lg font-semibold text-text-primary">WeMovies AI</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Navigasi utama">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-secondary-medium hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
