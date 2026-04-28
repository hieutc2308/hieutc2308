"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn, hexToRgba } from "@/lib/utils";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import resume from "@/data/resume.json";

const GLOW_COLORS = ["#3B82F6", "#1D4ED8"];

const glowVars = {
  "--glow-color":    hexToRgba(GLOW_COLORS[0], 1.0),
  "--glow-color-60": hexToRgba(GLOW_COLORS[0], 0.6),
  "--glow-color-50": hexToRgba(GLOW_COLORS[0], 0.5),
  "--glow-color-40": hexToRgba(GLOW_COLORS[0], 0.4),
  "--glow-color-30": hexToRgba(GLOW_COLORS[0], 0.3),
  "--glow-color-b":    hexToRgba(GLOW_COLORS[1], 1.0),
  "--glow-color-b-60": hexToRgba(GLOW_COLORS[1], 0.6),
  "--cone-spread": "30",
  "--border-radius": "16px",
} as React.CSSProperties;


const colSpans = [2, 1, 1, 2, 3];

function GlowCard({ children, index, isInView, span, onClick }: {
  children: React.ReactNode;
  index: number;
  isInView: boolean;
  span: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx, dy = y - cy;
    const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
    const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
    const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1) * 100;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    el.style.setProperty("--edge-proximity", proximity.toFixed(2));
    el.style.setProperty("--cursor-angle", `${angle.toFixed(2)}deg`);
  }, []);

  const handlePointerLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--edge-proximity", "0");
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.6, 0, 0.25, 1] }}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer",
        "bg-zinc-900 transition-all duration-200",
        "hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
        span === 3 ? "md:col-span-3" : span === 2 ? "md:col-span-2" : "col-span-1"
      )}
      style={glowVars}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="bgb-edge-light" />
      {children}
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="projects" className="relative py-24 md:py-32 px-6">


      <div className="relative z-10 max-w-6xl mx-auto">
        <div ref={ref} className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.6, 0, 0.25, 1] }}
            className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" /></svg>
            <span className="shine-text">Work</span>
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

            return (
              <GlowCard
                key={project.name}
                index={index}
                isInView={isInView}
                span={span}
                onClick={() => setExpanded(isExpanded ? null : index)}
              >
                {/* Dot pattern on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[length:4px_4px]" />
                </div>

                <div className="relative p-6">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-2">
                      {project.slug && (
                        <a
                          href={`/projects/${project.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-zinc-600 hover:text-zinc-300 transition-colors duration-150"
                          aria-label={`View details for ${project.name}`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </motion.div>
                    </div>
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
                        transition={{ duration: 0.6, ease: [0.6, 0, 0.25, 1] }}
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
              </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
