import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/recommend", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#000000]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="RekoFilm home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0099ff] text-sm font-bold text-[#ffffff] shadow-[0_0_24px_rgba(0,153,255,0.35)]">
            RF
          </span>
          <span className="text-lg font-semibold text-[#ffffff]">RekoFilm</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Navigasi utama">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-[#ffffff]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
