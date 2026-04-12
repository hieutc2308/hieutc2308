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
        <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tight font-bold leading-[1.1]">
          <span className="text-foreground">{prefix}</span>
          <span className="relative flex w-full justify-center text-center md:pb-4 md:pt-1" style={{ clipPath: "inset(0 -100vw)" }}>
            &nbsp;
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 whitespace-nowrap"
                style={{ fontSize: "clamp(1.5rem, 6vw, 4.5rem)", lineHeight: 1.3 }}
                initial={{ opacity: 0, y: "-100" }}
                transition={{ type: "spring", stiffness: 50 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : {
                      y: titleNumber > index ? -150 : 150,
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
