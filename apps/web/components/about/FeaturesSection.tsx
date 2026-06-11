"use client";

// components/FeaturesSection.tsx
import React from 'react';
import { motion } from "motion/react";

interface FeatureProps {
  title: string;
  description: string;
  align?: 'left' | 'right';
}

const Feature: React.FC<FeatureProps> = ({ title, description, align = 'left' }) => {
  if (align === 'right') {
    return (
      <div className="flex gap-6 justify-end">
        <div className="flex-1 max-w-2xl text-right">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="w-1 h-full min-h-[150px] bg-[#00d2ff] flex-shrink-0 shadow-[0_0_20px_rgba(0,210,255,0.5)]" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 justify-start">
      <div className="w-1 h-full min-h-[150px] bg-[#00d2ff] flex-shrink-0 shadow-[0_0_20px_rgba(0,210,255,0.5)]" />
      
      <div className="flex-1 max-w-2xl text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "No pressure. Just better picks.",
      description:
        "Choosing what to watch can be overwhelming. With so many movies available across different platforms, users often spend more time scrolling than actually watching. This leads to frustration and decision fatigue, making the experience less enjoyable.",
      align: 'left' as const,
    },
    {
      title: "We make it personal.",
      description:
        "By selecting just a few movies you like, the system quickly learns your preferences and identifies patterns in your choices. It then recommends movies that closely match your taste, helping you find something enjoyable without wasting time.",
      align: 'right' as const,
    },
  ];

  return (
    <section 
      className="w-full bg-transparent py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative z-10"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-20 md:space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center"
            >
              <Feature
                title={feature.title}
                description={feature.description}
                align={feature.align}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;