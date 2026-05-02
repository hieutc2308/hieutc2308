"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Analytics Manager @ Microsoft",
    avatar: "/testimonials/sarah.png",
    quote:
      "Hieu completely transformed how our team consumes data. He rebuilt our entire Power BI environment from scratch — clean semantic models, lightning-fast DAX, and dashboards our execs actually understand. The time we used to spend wrangling reports is now spent on decisions.",
  },
  {
    id: 2,
    name: "James Rodriguez",
    title: "Head of BI @ Deloitte Vietnam",
    avatar: "/testimonials/james.png",
    quote:
      "Working with Hieu was a turning point for our analytics practice. His ability to translate complex business requirements into elegant data models is rare. He delivered a multi-source reporting suite in half the time we projected — and the quality was exceptional.",
  },
  {
    id: 3,
    name: "Nguyen Thi Mai",
    title: "CFO @ VinGroup",
    avatar: "/testimonials/mai.png",
    quote:
      "Hieu built our financial reporting layer entirely in Power BI with DAX measures I didn't think were possible. Real-time variance analysis, rolling forecasts, drill-through P&L — things that used to take our finance team days now happen instantly. Exceptional work.",
  },
  {
    id: 4,
    name: "David Park",
    title: "Director of Data Strategy @ McKinsey",
    avatar: "/testimonials/david.png",
    quote:
      "Few analysts have Hieu's combination of technical depth and business intuition. He doesn't just build dashboards — he asks the right questions first. His data models are production-ready on day one, and he mentors junior team members with genuine patience and clarity.",
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="relative w-full px-6 py-24 md:py-32">
      <div ref={ref} className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.6, 0, 0.25, 1] }}
          >
            <span className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" />
              </svg>
              <span className="shine-text">Testimonials</span>
            </span>

            <h2 className="text-4xl font-bold text-zinc-100 md:text-5xl">
              Trusted by teams that depend on clean data.
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
              Feedback from analytics, finance, and strategy partners who needed reporting that executives could use without translation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.article
                key={testimonial.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.6, 0, 0.25, 1] }}
                className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 transition-colors duration-200 hover:border-blue-500/30"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-100">{testimonial.name}</p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{testimonial.title}</p>
                  </div>
                </div>
                <blockquote className="text-sm leading-relaxed text-zinc-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
