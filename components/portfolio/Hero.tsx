"use client";

import { motion } from "framer-motion";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { BorderGlowButton } from "@/components/ui/border-glow-button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center">
      {/* Plasma: top-right corner (page start) + bottom-left (Hero/About boundary) */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <div className="absolute right-[-15%] top-[-5%] w-[45%] h-[55%] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute left-[-15%] bottom-[-5%] w-[45%] h-[55%] rounded-full bg-blue-600/12 blur-[140px]" />
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, 0, 0.25, 1] }}
          className="mb-6"
        >
          <span className="inline-block text-sm font-medium text-blue-400 border border-blue-500/30 rounded-full px-4 py-1.5 bg-blue-500/10 tracking-wide uppercase">
            Hanoi, Vietnam
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.6, 0, 0.25, 1] }}
          className="mb-8"
        >
          <AnimatedHero
            prefix="Tran Chi Hieu"
            titles={["BI Developer", "Data Analyst", "Analytic Engineer"]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.6, 0, 0.25, 1] }}
          className="relative text-lg md:text-xl max-w-3xl mb-10"
        >
          <p className="text-zinc-400 leading-relaxed">
            6+ years bridging raw data and business strategy. Building data models, optimizing DAX, and automating Power BI solutions that drive operational efficiency.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.6, 0, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <BorderGlowButton
            animated
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          >
            See My Work
          </BorderGlowButton>

          <div className="flex items-center gap-3">
            <BorderGlowButton
              href="https://www.linkedin.com/in/hieutc2308/"
              target="_blank"
              rel="noopener noreferrer"
              className="bgb-icon text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <LinkedinIcon />
            </BorderGlowButton>
            <BorderGlowButton
              href="https://github.com/hieutc"
              target="_blank"
              rel="noopener noreferrer"
              className="bgb-icon text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <GithubIcon />
            </BorderGlowButton>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator — mouse wheel style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-zinc-600">
          Scroll
        </span>
        {/* Mouse outline */}
        <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center pt-1.5">
          <motion.div
            className="w-0.5 h-1.5 rounded-full bg-zinc-400"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
