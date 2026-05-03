"use client";

import { motion } from "framer-motion";

const METRICS = [
  {
    value: "6+",
    label: "Years Experience",
    detail: "BI, analytics, and reporting delivery",
  },
  {
    value: "5+",
    label: "Projects Delivered",
    detail: "Across operational and executive analytics",
  },
  {
    value: "3",
    label: "Certifications",
    detail: "Verified analytics and BI credentials",
  },
  {
    value: "3",
    label: "Industries",
    detail: "HealthTech, retail, and workforce data",
  },
] as const;

export function StatCardStack() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {METRICS.map((metric, index) => (
        <motion.div
          key={metric.label}
          data-testid="about-metric-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: index * 0.06, ease: [0.6, 0, 0.25, 1] }}
          className="relative min-h-40 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/65 p-5"
        >
          <div
            className="absolute inset-x-0 top-0 h-px opacity-70"
            style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.55), transparent)" }}
          />
          <div
            className="absolute right-[-20%] top-[-35%] h-28 w-28 rounded-full bg-blue-500/10 blur-3xl"
            aria-hidden
          />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="text-5xl font-extrabold leading-none tracking-[-0.04em] text-zinc-100">
                {metric.value}
              </div>
              <div className="mt-3 text-sm font-semibold text-zinc-100">
                {metric.label}
              </div>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-zinc-500">
              {metric.detail}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
