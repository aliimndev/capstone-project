"use client";

import React from 'react';
import { motion } from "motion/react";

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-[#091020]/50 backdrop-blur-sm hover:bg-[#00d2ff]/10 hover:border-[#00d2ff]/50 hover:shadow-[0_0_20px_rgba(0,210,255,0.2)] transition-all duration-300 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 w-full max-w-2xl mx-auto border border-white/10">
      <div className="shrink-0 text-[#00d2ff]">
        <span className="block h-4 w-4 sm:h-5 sm:w-5">
          {icon}
        </span>
      </div>
      <span className="text-white text-xs sm:text-sm md:text-base font-medium leading-snug">
        {text}
      </span>
    </div>
  );
};

const WhyUseSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      text: "Personalized recommendations based on your favorite movies",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      ),
      text: "Discover movies similar to what you already enjoy",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          />
        </svg>
      ),
      text: "Find what to watch quickly and easily",
    },
  ];

  return (
    <section
      className="w-full bg-transparent py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      aria-labelledby="why-use-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          id="why-use-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-10 md:mb-12"
        >
          Why Use This?
        </motion.h2>

        {/* Features List */}
        <div className="space-y-3 sm:space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <FeatureItem
                icon={feature.icon}
                text={feature.text}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUseSection;
