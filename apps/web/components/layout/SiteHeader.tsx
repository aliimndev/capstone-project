import Link from "next/link";
import Image from "next/image";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#091020]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="WeMovies AI home">
          {/* Replace text "WM" with PNG logo */}
          <div className="relative h-9 w-9">
            <Image
              src="/logo/logo-header.png"
              alt="WeMovies AI Logo"
              fill
              className="object-contain"
              sizes="40px"
              priority
            />
          </div>
          <span className="text-lg font-semibold text-text-primary">WeMovies AI</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Navigasi utama">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-[#00d2ff]/10 hover:text-[#00d2ff]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}