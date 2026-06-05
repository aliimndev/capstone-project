"use client";

// components/sections/HowItWorks.tsx

import { motion } from "motion/react";

const steps = [
  { id: 1, title: "Pick Your Favorites" },
  { id: 2, title: "We Analyze Your Preferences" },
  { id: 3, title: "Get Personalized Recommendations" },
  { id: 4, title: "Refine Your Results" },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-transparent overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center md:text-right mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            How It Works
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-[#00d2ff] to-transparent ml-auto md:mr-0 mr-auto hidden md:block rounded-full" />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-[#091020]/50 backdrop-blur-sm rounded-3xl p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_40px_rgba(0,210,255,0.18)] transition-all duration-500 border border-white/5 hover:border-[#00d2ff]/50 min-h-[260px] flex flex-col overflow-hidden"
            >
              {/* Decorative Number */}
              <div className="absolute -top-4 -right-4 text-[120px] font-black text-white/5 group-hover:text-[#00d2ff]/10 transition-colors duration-500 select-none">
                {step.id}
              </div>
              
              <div className="flex-1 flex items-center justify-center relative z-10">
                <h3 className="text-xl font-medium text-white text-center">
                  {step.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
