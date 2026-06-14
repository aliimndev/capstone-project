import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BackgroundVideo } from "@/components/layout/BackgroundVideo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "wemovies",
  description: "Aplikasi rekomendasi film berdasarkan preferensi pengguna.",
  icons: {
    icon: "/logo/logo-search.svg",
    shortcut: "/logo/logo-search.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full text-text-primary overflow-x-hidden relative">
        <BackgroundVideo />
        <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[-1]" />
        <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[-1]" />

        <svg className="fixed w-0 h-0 pointer-events-none">
          <filter id="c3-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </svg>

        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
