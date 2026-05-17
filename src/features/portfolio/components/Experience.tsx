"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { useRef } from "react";
import { useRevealInView } from "@/shared/ui/use-reveal-in-view";

const roles = [
  {
    company: "Sun* Inc.",
    title: "Data Analyst",
    period: "Apr 2025 - Present",
    location: "Hanoi, Hybrid",
    bullets: [
      "Built Power BI reporting for clearer operational visibility.",
      "Automated reporting workflows with Power Query and DAX.",
      "Modeled business metrics for faster decision support.",
    ],
    chips: ["Power BI", "Power Query", "DAX", "Power Pivot"],
  },
  {
    company: "TeKnowledge",
    title: "Workforce Management Analyst",
    period: "Aug 2023 - Mar 2025",
    location: "Hanoi, Hybrid",
    bullets: [
      "Improved staffing plans with demand and capacity analysis.",
      "Delivered MIS reporting for BPO performance reviews.",
      "Tracked workforce KPIs to support service-level decisions.",
    ],
    chips: ["MIS", "BPO", "workforce management", "Power BI"],
  },
  {
    company: "TeKnowledge",
    title: "Workforce Management Coordinator",
    period: "Aug 2022 - Jul 2023",
    location: "Hanoi",
    bullets: [
      "Coordinated schedules to protect coverage and attendance.",
      "Maintained workforce data for accurate daily operations.",
      "Supported reporting routines for frontline performance.",
    ],
    chips: ["workforce management", "MIS", "BPO"],
  },
];

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useRevealInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="experience" className="relative px-6 py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <motion.span
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.6, 0, 0.25, 1] }}
            className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" />
            </svg>
            <span className="shine-text">Timeline</span>
          </motion.span>
          <motion.h2
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.6, 0, 0.25, 1] }}
            className="text-4xl font-bold text-zinc-100 md:text-5xl"
          >
            Experience
          </motion.h2>
        </div>

        <div className="relative">
          <div className="absolute bottom-8 left-4 top-4 w-px bg-gradient-to-b from-blue-500/70 via-zinc-700 to-zinc-900 md:left-1/2" />

          <div className="space-y-8">
            {roles.map((role, index) => (
              <motion.article
                key={`${role.company}-${role.title}`}
                initial={false}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: index * 0.08, ease: [0.6, 0, 0.25, 1] }}
                className="relative pl-12 md:grid md:grid-cols-2 md:gap-12 md:pl-0"
              >
                <div className="absolute left-0 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-blue-500/45 bg-zinc-950 text-blue-300 shadow-[0_0_24px_rgba(59,130,246,0.22)] md:left-1/2 md:-translate-x-1/2">
                  <BriefcaseBusiness className="h-4 w-4" aria-hidden />
                </div>

                <div
                  className={`rounded-lg border border-white/[0.08] bg-zinc-950/70 p-6 transition-colors duration-300 hover:border-blue-500/35 ${
                    index % 2 === 0 ? "" : "md:col-start-2"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-100">{role.company}</h3>
                      <p className="mt-1 text-sm font-semibold text-blue-300">{role.title}</p>
                    </div>
                    <div className="space-y-2 text-sm text-zinc-400 sm:text-right">
                      <p className="flex items-center gap-2 sm:justify-end">
                        <CalendarDays className="h-4 w-4 text-zinc-500" aria-hidden />
                        {role.period}
                      </p>
                      <p className="flex items-center gap-2 sm:justify-end">
                        <MapPin className="h-4 w-4 text-zinc-500" aria-hidden />
                        {role.location}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2 text-sm leading-relaxed text-zinc-400">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {role.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
