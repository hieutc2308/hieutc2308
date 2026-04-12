"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import resume from "@/data/resume.json";

const accentColors = [
  "text-blue-400",
  "text-cyan-400",
  "text-indigo-400",
  "text-emerald-400",
  "text-purple-400",
];

const colSpans = [2, 1, 1, 2, 3];

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="projects" className="relative py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 block"
          >
            Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-zinc-100"
          >
            Projects
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {resume.projects.map((project, index) => {
            const isExpanded = expanded === index;
            const span = colSpans[index];
            const spanTwo = span >= 2;
            const color = accentColors[index];

            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.08 * index,
                  ease: [0.6, 0, 0.25, 1],
                }}
                className={cn(
                  "group relative rounded-2xl overflow-hidden cursor-pointer",
                  "border border-zinc-800 bg-zinc-900 transition-all duration-300",
                  "hover:border-zinc-700 hover:-translate-y-0.5",
                  span === 3 ? "md:col-span-3" : span === 2 ? "md:col-span-2" : "col-span-1"
                )}
                onClick={() => setExpanded(isExpanded ? null : index)}
              >
                {/* Dot pattern on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[length:4px_4px]" />
                </div>

                {/* Gradient border accent */}
                <div className={`absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative p-6">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-zinc-100 text-base md:text-lg mb-2 leading-snug group-hover:text-white transition-colors">
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-500 leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.tech.slice(0, spanTwo ? 6 : 4).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                    {project.tech.length > (spanTwo ? 6 : 4) && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-600">
                        +{project.tech.length - (spanTwo ? 6 : 4)}
                      </span>
                    )}
                  </div>

                  {/* Expandable bullets */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.6, 0, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-zinc-800 space-y-2">
                          {project.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                              <span className="flex-shrink-0 w-1 h-1 rounded-full bg-blue-500 mt-2" />
                              {bullet}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Explore hint */}
                  <div className="mt-3 text-xs text-zinc-700 group-hover:text-zinc-500 transition-colors">
                    {isExpanded ? "Click to collapse ↑" : "Click to expand →"}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
