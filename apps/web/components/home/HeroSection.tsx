"use client";

import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const gradientStyle = {
    backgroundImage: 'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    filter: 'url(#c3-noise)'
  };

  return (
    <section className="relative pt-16 md:pt-28 pb-20 text-center flex flex-col items-center justify-center px-6 min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background is now handled globally in layout.tsx */}

      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.9]"
        >
          <span className="block text-white">What do you want to</span>
          <span className="block text-white">watch today?</span>
          <span className="block animate-shiny mt-3" style={gradientStyle}>WeMovies AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-white/80 max-w-md text-base leading-[1.5]"
        >
          Find your next favorite movie. We MoveisAi powerful AI to organize, prioritize, and refine your recommendations into total clarity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <Link href="/recommend" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-sm px-6 py-3.5 transition-all hover:bg-white/90 active:scale-[0.98]">

            Get Started
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[2px]" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}