"use client";

// components/HeroSection.tsx
import Link from 'next/link';
import { motion } from "motion/react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center bg-transparent px-6 py-12 md:px-16 lg:px-24 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl text-left ml-8 md:ml-16 lg:ml-24"
      >
        {/* Subtitle */}
        <p className="text-text-secondary text-lg mb-4 font-medium">
          About CineMatch
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
          Smarter movie recommendations,
          <br />
          made simple.
        </h1>

        {/* Description */}
        <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
          This system learns your preferences from a few movies you choose,
          then suggests films that match your taste—so you can spend less time
          searching and more time watching.
        </p>

        {/* CTA Button */}
        <Link
            href="/recommend"
            className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-full bg-[#00d2ff] px-10 text-lg font-semibold text-[#091020] shadow-[0_0_36px_rgba(0,210,255,0.35)] transition-all hover:bg-[#00d2ff]/80 hover:shadow-[0_0_44px_rgba(0,210,255,0.45)] active:scale-[0.97]"
          >
            Get Started
          </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;