"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number; color: string }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Jumlah partikel menyesuaikan ukuran layar
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.4 + 0.05,
          // 10% partikel berwarna hangat (orange lembut) untuk menyatu dengan tombol
          color: Math.random() > 0.9 ? "rgba(255, 160, 80," : "rgba(255, 255, 255,",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.opacity})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        // Pantulan halus di tepi layar
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] bg-[#000000] flex items-center justify-center overflow-hidden">
      {/* Canvas Background Sinematik */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Gradient Overlay agar teks tetap mudah dibaca */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-[#00111f]/80 pointer-events-none z-10" />

      {/* Film Grain Halus (Nuansa Layar Bioskop) */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Konten Utama */}
      <div className="relative mx-auto max-w-3xl px-6 text-center z-20">
        <h1 className="text-5xl font-bold tracking-tighter text-[#ffffff] sm:text-6xl lg:text-7xl">
          What do you want to<br className="hidden sm:block" /> watch today?
        </h1>

        <p className="mt-6 text-xl text-white/70">
          Find your next favorite movie
        </p>

        <div className="mt-12">
          <Link
            href="/recommend"
            className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-full bg-primary-orange px-10 text-lg font-semibold text-primary-black shadow-[0_0_36px_rgba(255,107,0,0.35)] transition-all hover:bg-interactive-hover hover:shadow-[0_0_44px_rgba(255,107,0,0.45)] active:scale-[0.97]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}