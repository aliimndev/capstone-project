"use client";

import { ReactNode } from "react";

interface MarqueeRowProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: number; // duration in seconds
}

export function MarqueeRow({
  children,
  direction = "left",
  speed = 40,
}: MarqueeRowProps) {
  const animationDirection = direction === "left" ? "normal" : "reverse";

  return (
    <div className="relative w-full overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#091020] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#091020] to-transparent" />

      <div
        className="flex w-max gap-6 sm:gap-8"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: animationDirection,
        }}
      >
        {/* Original content */}
        {children}
        {/* Duplicate for seamless loop */}
        {children}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}