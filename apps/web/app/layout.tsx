import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full text-text-primary overflow-x-hidden relative">
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <video autoPlay loop muted playsInline
            className="w-full h-full object-cover pointer-events-none opacity-60"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
          {/* Gradient overlay to blend with the rest of the dark theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#091020]/80 to-[#091020] z-10" />
          <div className="absolute inset-0 bg-[#091020]/40 z-10" />
        </div>
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
