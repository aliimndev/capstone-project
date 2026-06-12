"use client";

import { motion } from "motion/react";
import { useState } from "react";

const steps = [
  { id: 1, title: "Pick Your Favorites" },
  { id: 2, title: "We Analyze Your Preferences" },
  { id: 3, title: "Get Personalized Recommendations" },
  { id: 4, title: "Refine Your Results" },
];

export function HowItWorks() {
  const [isHovered, setIsHovered] = useState(false);

  const SPREAD_DISTANCE = 280;

  return (
    <section className="py-20 bg-transparent overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">

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


        <div 
          className="relative ml-auto"
          style={{ 
            width: isHovered ? `${SPREAD_DISTANCE * (steps.length - 1) + 320}px` : '320px',
            height: '320px',
            transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {steps.map((step, index) => {
            const xOffset = isHovered ? index * SPREAD_DISTANCE : 0;
            
            const rotation = isHovered ? 0 : (index - 1.5) * 4;
            
            const scale = isHovered ? 1 : 1 - (steps.length - 1 - index) * 0.03;
            
            const zIndex = isHovered ? index : steps.length - 1 - index;

            return (
              <motion.div
                key={step.id}
                className="absolute top-0 left-0 w-[320px] h-[320px] bg-[#091020]/50 backdrop-blur-sm rounded-3xl p-8 border border-white/5 flex flex-col overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_40px_rgba(0,210,255,0.18)] hover:border-[#00d2ff]/50 transition-shadow duration-500"
                style={{ zIndex }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                animate={{
                  x: xOffset,
                  rotate: rotation,
                  scale: scale,
                }}
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25, mass: 1 },
                  rotate: { type: "spring", stiffness: 200, damping: 25, mass: 1 },
                  scale: { type: "spring", stiffness: 200, damping: 25, mass: 1 },
                  opacity: { duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                {/* Decorative Number */}
                <div className="absolute -top-4 -right-4 text-[120px] font-black text-white/5 hover:text-[#00d2ff]/10 transition-colors duration-500 select-none pointer-events-none">
                  {step.id}
                </div>
                
                <div className="flex-1 flex items-center justify-center relative z-10">
                  <h3 className="text-xl font-medium text-white text-center">
                    {step.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}