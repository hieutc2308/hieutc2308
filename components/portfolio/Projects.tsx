"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import resume from "@/data/resume.json";

const MotionLink = motion.create(Link);

type Project = (typeof resume.projects)[number];

function ProjectCard({ project, index, isInView }: { project: Project; index: number; isInView: boolean }) {
  const featured = index === 0;

  return (
    <MotionLink
      href={project.slug ? `/projects/${project.slug}` : "#"}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.6, 0, 0.25, 1] }}
      className={[
        "group relative flex min-h-[320px] overflow-hidden rounded-2xl border border-white/[0.08]",
        "bg-zinc-950/70 p-6 transition-[border-color,box-shadow,transform] duration-300",
        "hover:-translate-y-1 hover:border-blue-500/35 hover:shadow-[0_24px_70px_rgba(0,0,0,0.42)]",
        featured ? "md:col-span-2 md:min-h-[390px] md:p-8" : "md:min-h-[390px]",
      ].join(" ")}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            "radial-gradient(circle at 18% 0%, rgba(59,130,246,0.13), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.035), transparent 42%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.55), transparent)" }}
      />

      <div className="relative z-10 flex min-h-full w-full flex-col justify-between">
        <div>
          <div className="mb-8 flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors duration-200 group-hover:border-blue-500/40 group-hover:text-blue-300">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <h3 className={featured ? "max-w-xl text-3xl font-extrabold leading-tight text-zinc-100 md:text-4xl" : "text-2xl font-extrabold leading-tight text-zinc-100"}>
            {project.name}
          </h3>
          <p className={featured ? "mt-5 max-w-2xl text-base leading-relaxed text-zinc-400" : "mt-4 text-sm leading-relaxed text-zinc-400"}>
            {project.description}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {project.tech.slice(0, featured ? 6 : 5).map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </MotionLink>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="relative py-24 md:py-32 px-6">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div ref={ref} className="mb-12 max-w-2xl">
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
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.6, 0, 0.25, 1] }}
            className="mt-4 text-base leading-relaxed text-zinc-400"
          >
            Selected work focused on analytics platforms, governance, and operational reporting.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {resume.projects.slice(0, 5).map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
