"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import resume from "@/data/resume.json";

const rows = [
  ...resume.certifications.map((c) => ({
    name: c.title,
    meta: c.issuer,
    href: c.credentialUrl,
  })),
  {
    name: resume.education[0].institution,
    meta: `${resume.education[0].degree} · ${resume.education[0].area}`,
    href: undefined,
  },
];

export function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" className="py-24 md:py-32 px-6">


      <div ref={ref} className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">

        {/* Left: heading */}
        <div className="md:w-64 shrink-0">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" />
            </svg>
            <span className="shine-text">Credentials</span>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-zinc-100 leading-tight"
          >
            Certs &amp;
            <br />
            Education
          </motion.h2>
        </div>

        {/* Right: list */}
        <div className="flex-1">
          {rows.map((row, i) => (
            <motion.div
              key={row.name}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.6, 0, 0.25, 1] }}
            >
              {i === 0 && <div className="border-t border-zinc-800" />}
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-5 hover:pl-2 transition-all duration-200"
                >
                  <span className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {row.name}
                  </span>
                  <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400 uppercase tracking-wider transition-colors shrink-0 ml-6">
                    {row.meta}
                  </span>
                </a>
              ) : (
                <div className="flex items-center justify-between py-5">
                  <span className="font-semibold text-zinc-100">{row.name}</span>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider shrink-0 ml-6">
                    {row.meta}
                  </span>
                </div>
              )}
              <div className="border-t border-zinc-800" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
