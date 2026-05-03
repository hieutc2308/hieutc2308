"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HyperTextParagraph } from "@/components/ui/hyper-text-paragraph";
import { StatCardStack } from "@/components/portfolio/StatCardStack";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 md:py-32 px-6">


      <div className="relative z-10 max-w-6xl mx-auto">
        <div ref={ref} className="grid grid-cols-1 gap-14 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.6, 0, 0.25, 1] }}
          >
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" /></svg>
              <span className="shine-text">About</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
              Data professional
              <br />
              <span className="text-zinc-500">based in Hanoi.</span>
            </h2>
            <HyperTextParagraph
              className="text-base md:text-lg leading-relaxed mt-8 text-justify"
              paragraphs={[
                "With over 6 years of experience, I translate complex, messy data into clear Power BI solutions that drive real results.",
                "From optimizing DAX to building robust data models, I'm passionate about bridging the gap between raw numbers and the strategic insights that help businesses move forward.",
              ]}
              highlightWords={["6 years of experience", "Power BI solutions", "strategic insights"]}
            />

          </motion.div>

          {/* Stat card stack */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.6, 0, 0.25, 1] }}
            className="md:pl-2"
          >
            <StatCardStack />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
