"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

const steps = [
  { id: 1, title: "Pick Your Favorites" },
  { id: 2, title: "We Analyze Your Preferences" },
  { id: 3, title: "Get Personalized Recommendations" },
  { id: 4, title: "Refine Your Results" },
];

export function HowItWorks() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const DESKTOP_SPREAD = 280;
  const MOBILE_SPREAD = 200;
  const MOBILE_CARD_WIDTH = 280;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerWidth = isMobile 
    ? (isHovered ? `${MOBILE_SPREAD * (steps.length - 1) + MOBILE_CARD_WIDTH}px` : `${MOBILE_CARD_WIDTH}px`)
    : (isHovered ? `${DESKTOP_SPREAD * (steps.length - 1) + 320}px` : '320px');

  return (
    <section className="py-16 md:py-20 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center md:text-right mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            How It Works
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-[#00d2ff] to-transparent mx-auto md:ml-auto md:mr-0 rounded-full" />
        </motion.div>

        <div 
          className={`w-full ${isMobile ? 'overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'overflow-visible'}`}
        >
          <div 
            className="relative md:ml-auto"
            style={{ 
              width: containerWidth,
              height: isMobile ? '280px' : '320px',
              transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            onClick={() => isMobile && setIsHovered(!isHovered)}
          >
            {steps.map((step, index) => {
              const spread = isMobile ? MOBILE_SPREAD : DESKTOP_SPREAD;
              const cardWidth = isMobile ? MOBILE_CARD_WIDTH : 320;
              
              const xOffset = isHovered ? index * spread : 0;
              const rotation = isHovered ? 0 : (index - 1.5) * (isMobile ? 5 : 4);
              const scale = isHovered ? 1 : 1 - (steps.length - 1 - index) * (isMobile ? 0.04 : 0.03);
              const zIndex = isHovered ? index : steps.length - 1 - index;

              return (
                <motion.div
                  key={step.id}
                  className="absolute top-0 left-0 bg-[#091020]/50 backdrop-blur-sm rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_40px_rgba(0,210,255,0.18)] hover:border-[#00d2ff]/50 transition-shadow duration-500"
                  style={{ 
                    zIndex,
                    width: `${cardWidth}px`,
                    height: isMobile ? '280px' : '320px',
                  }}
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
                  <div 
                    className="absolute -top-4 -right-4 font-black text-white/5 hover:text-[#00d2ff]/10 transition-colors duration-500 select-none pointer-events-none"
                    style={{ fontSize: isMobile ? '80px' : '120px' }}
                  >
                    {step.id}
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center relative z-10 p-6 md:p-8">
                    <h3 className="font-medium text-white text-center leading-snug"
                        style={{ fontSize: isMobile ? '1.125rem' : '1.25rem' }}>
                      {step.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}