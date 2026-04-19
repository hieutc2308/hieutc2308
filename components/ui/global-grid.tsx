"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";

export function GlobalGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const handleMouseMove = (e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.4) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.4) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base faint grid — always visible */}
      <div className="absolute inset-0 opacity-[0.04]">
        <GridPattern id="base-grid" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      {/* Mouse-revealed brighter grid */}
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern id="hover-grid" offsetX={gridOffsetX} offsetY={gridOffsetY} strokeColor="#60A5FA" />
      </motion.div>
    </div>
  );
}

function GridPattern({ id, offsetX, offsetY, strokeColor = "rgba(255, 255, 255, 0.8)" }: { id: string; offsetX: any; offsetY: any; strokeColor?: string }) {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={id}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.8"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
