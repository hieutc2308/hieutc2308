"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedHeroProps {
  prefix?: string;
  titles: string[];
  description?: string;
}

function AnimatedHero({ prefix = "I am a", titles, description }: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="flex gap-4 flex-col items-center text-center">
        <h1 className="w-full max-w-5xl text-[3rem] sm:text-6xl md:text-7xl tracking-tight font-bold leading-[1.05] sm:leading-[1.1]">
          <span className="text-foreground">{prefix}</span>
          <span
            className="relative mt-3 flex h-[3.35rem] w-full items-center justify-center overflow-visible text-center sm:h-[4.5rem] md:h-[5.8rem]"
          >
            &nbsp;
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute whitespace-nowrap bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text px-1 font-extrabold text-transparent"
                style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", lineHeight: 1.05 }}
                initial={{ opacity: 0, y: -16 }}
                transition={{ type: "spring", stiffness: 50 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : {
                      y: titleNumber > index ? -18 : 18,
                      opacity: 0,
                    }
                }
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h1>
        {description && (
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export { AnimatedHero };
