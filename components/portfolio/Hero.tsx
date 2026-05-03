"use client";

import { motion } from "framer-motion";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { BorderGlowButton } from "@/components/ui/border-glow-button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] w-full items-center justify-center px-6 py-28 sm:py-32">
      {/* Plasma: top-right corner (page start) + bottom-left (Hero/About boundary) */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <div className="absolute right-[-15%] top-[-5%] w-[45%] h-[55%] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute left-[-15%] bottom-[-5%] w-[45%] h-[55%] rounded-full bg-blue-600/12 blur-[140px]" />
      </div>
      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
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
          className="relative mb-8 max-w-3xl text-base sm:text-lg md:text-xl"
        >
          <p className="leading-relaxed text-zinc-300">
            I design governed Power BI models, executive dashboards, and automated reporting pipelines that turn operational data into decisions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.6, 0, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            className="rounded-full border border-blue-500/35 bg-blue-500/10 px-8 py-3 text-sm font-semibold text-blue-100 transition-colors duration-200 hover:border-blue-400/60 hover:bg-blue-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          >
            See My Work
          </button>

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
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
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
