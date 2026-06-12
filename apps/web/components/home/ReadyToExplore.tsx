"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

export function ReadyToExplore() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00d2ff]/10 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl px-6 text-center relative z-10"
      >
        <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Ready to find your next movie?
        </h2>
        
        <p className="mt-6 text-xl text-white/60 max-w-2xl mx-auto">
          Get personalized recommendations in just a few clicks. Powered by advanced AI to find exactly what you&apos;re craving.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <Link
            href="/recommend"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-lg px-8 py-4 transition-all hover:bg-white/90 active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Start Exploring
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-[2px]" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
