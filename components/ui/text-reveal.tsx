"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

export function TextRevealByWord({ text, className }: TextRevealByWordProps) {
  const targetRef = useRef<HTMLParagraphElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    // "start 85%" -> animation starts when the top of the element hits 85% of the viewport height.
    // "end 50%" -> animation ends when the bottom of the element hits 50% of the viewport height.
    offset: ["start 85%", "end 50%"],
  });

  const words = text.split(" ");

  return (
    <p ref={targetRef} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        // The word will reach full opacity halfway through its "turn" to overlap smoothly
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word = ({ children, progress, range }: WordProps) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative mr-[0.25em] mt-[0.1em]">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }} className="text-zinc-100">
        {children}
      </motion.span>
    </span>
  );
}
