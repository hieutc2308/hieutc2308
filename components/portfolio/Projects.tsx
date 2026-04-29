"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import resume from "@/data/resume.json";

type GlowConfig = {
  w: number;
  h: number;
  opacity: number;
  right?: string;
  left?: string;
  top?: string;
  bottom?: string;
};

const GALLERY_CONFIG: {
  col: string;
  row: string;
  gradient: string;
  glow: GlowConfig;
  titleSize: string;
  viz: React.ReactNode;
}[] = [
  {
    col: "md:[grid-column:1/3]",
    row: "md:[grid-row:1/2]",
    gradient: "linear-gradient(135deg, #0c1e45 0%, #1a3a7a 50%, #0a1530 100%)",
    glow: { w: 260, h: 260, opacity: 0.22, right: "-60px", top: "-80px" },
    titleSize: "text-lg md:text-xl",
    viz: (
      <svg className="absolute right-6 bottom-14 opacity-[0.18]" width="80" height="50" viewBox="0 0 80 50">
        <rect x="0"  y="30" width="12" height="20" rx="2" fill="#3B82F6" />
        <rect x="17" y="18" width="12" height="32" rx="2" fill="#3B82F6" />
        <rect x="34" y="24" width="12" height="26" rx="2" fill="#3B82F6" />
        <rect x="51" y="10" width="12" height="40" rx="2" fill="#3B82F6" />
        <rect x="68" y="4"  width="12" height="46" rx="2" fill="#3B82F6" />
      </svg>
    ),
  },
  {
    col: "md:[grid-column:3/4]",
    row: "md:[grid-row:1/3]",
    gradient: "linear-gradient(200deg, #071428 0%, #0f2554 55%, #060e1c 100%)",
    glow: { w: 160, h: 160, opacity: 0.20, left: "-40px", bottom: "-20px" },
    titleSize: "text-base",
    viz: (
      <svg className="absolute right-3 top-5 opacity-[0.18]" width="60" height="80" viewBox="0 0 60 80">
        <polyline points="10,70 20,52 30,38 40,25 50,12" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
        {([10,20,30,40,50] as number[]).map((x, i) => (
          <circle key={i} cx={x} cy={([70,52,38,25,12] as number[])[i]} r="3" fill="#3B82F6" />
        ))}
      </svg>
    ),
  },
  {
    col: "md:[grid-column:1/2]",
    row: "md:[grid-row:2/4]",
    gradient: "linear-gradient(160deg, #101e48 0%, #0e285e 50%, #080f28 100%)",
    glow: { w: 180, h: 180, opacity: 0.18, right: "-50px", top: "40px" },
    titleSize: "text-base",
    viz: (
      <svg className="absolute left-4 top-5 opacity-[0.18]" width="54" height="54" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r="20" fill="none" stroke="#3B82F6" strokeWidth="6" strokeDasharray="50 76" strokeDashoffset="-6" />
        <circle cx="27" cy="27" r="20" fill="none" stroke="#1D4ED8" strokeWidth="6" strokeDasharray="38 88" strokeDashoffset="-62" />
        <circle cx="27" cy="27" r="20" fill="none" stroke="#93C5FD" strokeWidth="6" strokeDasharray="32 94" strokeDashoffset="-104" />
      </svg>
    ),
  },
  {
    col: "md:[grid-column:2/3]",
    row: "md:[grid-row:2/3]",
    gradient: "linear-gradient(115deg, #0a1c3e 0%, #152f6a 55%, #070e22 100%)",
    glow: { w: 100, h: 100, opacity: 0.22, left: "-20px", top: "-20px" },
    titleSize: "text-sm",
    viz: (
      <svg className="absolute right-3 top-3 opacity-[0.18]" width="48" height="48" viewBox="0 0 48 48">
        {([[8,38],[16,28],[22,32],[30,18],[36,22],[42,10]] as [number,number][]).map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r={i%2===0?2.5:2} fill="#3B82F6" />
        ))}
      </svg>
    ),
  },
  {
    col: "md:[grid-column:2/4]",
    row: "md:[grid-row:3/4]",
    gradient: "linear-gradient(150deg, #08111f 0%, #0c1e40 45%, #111e42 100%)",
    glow: { w: 200, h: 200, opacity: 0.16, left: "-40px", top: "-60px" },
    titleSize: "text-base",
    viz: (
      <svg className="absolute right-5 top-4 opacity-[0.18]" width="110" height="40" viewBox="0 0 110 40">
        <rect x="0"  y="14" width="22" height="12" rx="4" fill="#1D4ED8" />
        <line x1="22" y1="20" x2="32" y2="20" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="32" y="14" width="22" height="12" rx="4" fill="#2563EB" />
        <line x1="54" y1="20" x2="64" y2="20" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="64" y="14" width="22" height="12" rx="4" fill="#3B82F6" />
        <line x1="86" y1="20" x2="96" y2="20" stroke="#60A5FA" strokeWidth="1.5" />
        <rect x="96" y="14" width="14" height="12" rx="4" fill="#60A5FA" />
      </svg>
    ),
  },
];

type GalleryCardProps = {
  project: (typeof resume.projects)[number];
  config: {
    col: string;
    row: string;
    gradient: string;
    glow: GlowConfig;
    titleSize: string;
    viz: React.ReactNode;
  };
  index: number;
  isInView: boolean;
};

function GalleryCard({ project, config, index, isInView }: GalleryCardProps) {
  const { col, row, gradient, glow, titleSize, viz } = config;

  const glowStyle: React.CSSProperties = {
    width: glow.w,
    height: glow.h,
    background: "#3B82F6",
    filter: "blur(50px)",
    opacity: glow.opacity,
    right:  glow.right,
    left:   glow.left,
    top:    glow.top,
    bottom: glow.bottom,
  };

  return (
    <motion.a
      href={project.slug ? `/projects/${project.slug}` : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.6, 0, 0.25, 1] }}
      className={cn(
        "group relative rounded-[14px] overflow-hidden cursor-pointer",
        "transition-[transform,box-shadow] duration-[450ms]",
        "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)]",
        col, row,
      )}
      style={{ background: gradient }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Glow blob */}
      <div className="absolute rounded-full pointer-events-none" style={glowStyle} />
      {/* Static viz motif */}
      {viz}
      {/* Content overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }}
      />
      {/* Top border glow on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #3B82F6, transparent)" }}
      />
      {/* Arrow */}
      <div
        className="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
        style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(96,165,250,0.3)" }}
      >
        <ArrowUpRight className="w-3.5 h-3.5 text-blue-300" />
      </div>
      {/* Card content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-[18px]">
        <div className="text-[9px] font-bold text-blue-400 tracking-[0.22em] uppercase mb-[5px]">
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className={cn("font-extrabold text-white tracking-[-0.025em] leading-tight mb-2", titleSize)}>
          {project.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map(t => (
            <span
              key={t}
              className="text-[9px] rounded px-1.5 py-0.5"
              style={{
                background: "rgba(59,130,246,0.18)",
                border: "1px solid rgba(96,165,250,0.25)",
                color: "rgba(147,197,253,0.9)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" />
            </svg>
            <span className="shine-text">Work</span>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.6, 0, 0.25, 1] }}
            className="text-4xl md:text-5xl font-bold text-zinc-100"
          >
            Projects
          </motion.h2>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-[10px]"
          style={{ gridTemplateRows: "200px 140px 160px" }}
        >
          {resume.projects.slice(0, 5).map((project, i) => (
            <GalleryCard
              key={project.name}
              project={project}
              config={GALLERY_CONFIG[i]}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
