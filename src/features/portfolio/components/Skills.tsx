"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import RadialOrbitalTimeline, { type OrbitalItem } from "@/shared/ui/radial-orbital-timeline";
import { useRevealInView } from "@/shared/ui/use-reveal-in-view";
import {
  BarChart3,
  Code2,
  Database,
  Cloud,
  GitBranch,
} from "lucide-react";

const skillsData: OrbitalItem[] = [
  {
    id: 1,
    title: "BI & Visualization",
    date: "6+ years",
    content: "Power BI, DAX, Data Modeling, Tableau. Building embedded dashboards, multi-tenant analytics, and web-style BI UIs.",
    category: "Business Intelligence",
    icon: BarChart3,
    relatedIds: [2, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 2,
    title: "Languages",
    date: "Daily use",
    content: "SQL, DAX, Python, M (Power Query), PySpark. From ad-hoc analysis to production pipelines.",
    category: "Languages",
    icon: Code2,
    relatedIds: [1, 3, 5],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Databases",
    date: "Production",
    content: "SQL Server, PostgreSQL, MySQL. Schema design, query optimization, and data validation.",
    category: "Databases",
    icon: Database,
    relatedIds: [2, 4],
    status: "completed",
    energy: 85,
  },
  {
    id: 4,
    title: "Data Warehouse",
    date: "Enterprise",
    content: "Snowflake, Google BigQuery, Microsoft Fabric. Cloud-scale storage and analytics.",
    category: "Data Warehousing",
    icon: Cloud,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 78,
  },
  {
    id: 5,
    title: "Data Transform",
    date: "Pipelines",
    content: "dbt, Fabric Notebook, Fabric Dataflow, Dagster. Orchestrating clean, tested data pipelines.",
    category: "Data Transform",
    icon: GitBranch,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 82,
  },
];

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useRevealInView(ref, { once: true, margin: "-100px" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section ref={ref} id="skills" className="relative py-24 md:py-32 px-6">


      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-6">
          <motion.span
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" /></svg>
            <span className="shine-text">Expertise</span>
          </motion.span>
          <motion.h2
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-zinc-100 mb-2"
          >
            Skills
          </motion.h2>
        </div>

        <motion.div
          initial={false}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {mounted ? (
            <RadialOrbitalTimeline timelineData={skillsData} />
          ) : (
            <div className="grid min-h-[360px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skillsData.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-lg border border-white/[0.08] bg-zinc-950/70 p-5"
                >
                  <p className="text-sm font-semibold text-zinc-100">{skill.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">{skill.content}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
