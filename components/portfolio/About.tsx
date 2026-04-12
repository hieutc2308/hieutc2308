"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.6, 0, 0.25, 1] }}
          >
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 block">
              About
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
              Data professional
              <br />
              <span className="text-zinc-500">based in Hanoi.</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Analytical and results-driven BI Developer with 6+ years of experience
              bridging the gap between raw data and business strategy. I specialize in
              designing robust data models, optimizing DAX, and automating Power BI
              solutions at scale.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              My work spans multi-tenant clinic analytics, fashion retail platforms, and
              workforce intelligence systems — always focused on turning messy data into
              insights that actually move the needle.
            </p>

            <div className="flex gap-3 mt-8">
              {["Power BI", "dbt", "SQL", "Python", "Azure"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats — slide in from right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.6, 0, 0.25, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { number: "6+", label: "Years of Experience" },
              { number: "5+", label: "Projects Delivered" },
              { number: "3", label: "Certifications" },
              { number: "3", label: "Industry Verticals" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="text-4xl font-bold text-blue-500 mb-1">{stat.number}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
