import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/recommend", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="RekoFilm home">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-rose-600 text-sm font-bold text-white">
            RF
          </span>
          <span className="text-lg font-semibold text-slate-950">RekoFilm</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Navigasi utama">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
