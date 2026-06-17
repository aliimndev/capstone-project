"use client";

import { motion } from "motion/react";
import { ArrowRight, Code } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const teamMembers = [
    { name: "Member 1", url: "https://github.com/Sadeez7" },
    { name: "Member 2", url: "https://github.com/rizkidwifrb" },
    { name: "Member 3", url: "https://github.com/Joshuachriss" },
    { name: "Member 4", url: "https://github.com/arindasr" },
    { name: "Member 5", url: "https://github.com/aliimndev" },
  ];

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
    <section className="relative pt-20 md:pt-28 pb-20 flex flex-col items-center justify-center px-6 min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="relative z-20 flex flex-col items-center text-center w-full max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-2 mb-6"
        >
          <div className="flex -space-x-2.5">
            {teamMembers.map((member, i) => (
              <a
                key={i}
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-7 w-7 items-center justify-center rounded-full bg-[#091020] border border-white/10 text-white/60 transition-all hover:z-10 hover:scale-110 hover:border-[#00d2ff] hover:text-[#00d2ff]"
                title={member.name}
              >
                <Code className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
          <span className="text-xs font-medium text-white/80 tracking-wide">
          Our Team, Our Thanks
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95]"
        >
          <motion.span
            className="block text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Stop guessing
          </motion.span>

          <motion.span
            className="block mt-1 animate-shiny"
            style={gradientStyle}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Find your film
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-white/70 max-w-lg text-base md:text-lg leading-relaxed"
        >
          Tell us what you love
          <br className="hidden md:block" />
          Instant AI recommendations
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/recommend"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-sm px-8 py-3.5 transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Find My Movie
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50"
        >
          <span>No sign-up required</span>
          <div className="w-px h-3 bg-white/15" />
          <span>Instant AI matching</span>
          <div className="w-px h-3 bg-white/15 hidden sm:block" />
          <span className="hidden sm:inline">50,000+ films</span>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#091020] to-transparent pointer-events-none z-10" />
    </section>
  );
}
