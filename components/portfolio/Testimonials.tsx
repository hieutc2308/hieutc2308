"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── data ─────────────────────────────────────────────────────────────── */
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

const ORBIT_DURATION_S = 15;
const AVATAR_SIZE = 84; // px — total SVG canvas
const RING_R = 38;        // circle radius
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

/* ─── SVG progress ring ─────────────────────────────────────────────────── */
function ProgressRing({ progress }: { progress: number }) {
  const offset = CIRCUMFERENCE * (1 - Math.min(progress, 1));
  const center = AVATAR_SIZE / 2;

  return (
    <svg
      width={AVATAR_SIZE}
      height={AVATAR_SIZE}
      viewBox={`0 0 ${AVATAR_SIZE} ${AVATAR_SIZE}`}
      className="absolute inset-0"
      style={{ transform: "rotate(-90deg)", pointerEvents: "none" }}
    >
      {/* dim track */}
      <circle
        cx={center} cy={center} r={RING_R}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="2"
      />
      {/* blue arc */}
      <circle
        cx={center} cy={center} r={RING_R}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

/* ─── main ──────────────────────────────────────────────────────────────── */
const MULTIPLIER = 5;
const n = TESTIMONIALS.length;
const EXTENDED_TESTIMONIALS = Array.from({ length: MULTIPLIER }).flatMap((_, chunkIdx) =>
  TESTIMONIALS.map((t) => ({ ...t, uiId: `${chunkIdx}-${t.id}` }))
);

export function Testimonials() {
  const [virtualCurrent, setVirtualCurrent] = useState(2 * n);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const navigateTo = (nextVirtualIdx: number) => {
    cancelAnimationFrame(rafRef.current);
    if (!isTransitioning) setIsTransitioning(true);
    setVirtualCurrent(nextVirtualIdx);
    setProgress(0);
  };

  const handleTransitionEnd = () => {
    // If we have strayed out of the middle chunk (indices 8 to 11 for n=4), gently snap back
    if (virtualCurrent < 2 * n || virtualCurrent >= 3 * n) {
      setIsTransitioning(false);
      const remainder = ((virtualCurrent % n) + n) % n;
      setVirtualCurrent(2 * n + remainder);
    }
  };

  /* rAF progress loop */
  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now: number) => {
      const p = (now - startRef.current) / (ORBIT_DURATION_S * 1000);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // auto-advance
        navigateTo(virtualCurrent + 1);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [virtualCurrent]);

  const actualIndex = ((virtualCurrent % n) + n) % n;

  return (
    <section id="testimonials" className="relative w-full py-24 px-6 overflow-hidden">
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-center">

        {/* ── Left ── */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" />
              </svg>
              <span className="shine-text">Testimonials</span>
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            What others<br />say
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            I&apos;ve worked with some amazing people over the years, here is their kind words about me.
          </p>
        </div>

        {/* ── Right — carousel ── */}
        <div className="flex flex-col min-w-0 w-full">
          <div 
            className="overflow-hidden w-full relative -mr-6 pr-6 lg:mr-0 lg:pr-0 pb-4"
            style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}
          >
          <div
            className="flex"
            onTransitionEnd={handleTransitionEnd}
            style={{
              gap: "1.5rem",
              transform: `translateX(calc(7.5% - ${virtualCurrent} * (85% + 1.5rem)))`,
              transition: isTransitioning ? "transform 700ms cubic-bezier(0.25,1,0.5,1)" : "none",
            }}
          >
            {EXTENDED_TESTIMONIALS.map((t, idx) => (
              <div
                key={t.uiId}
                className="w-[85%] shrink-0 testimonial-card"
              >
                <div 
                  className={`transition-opacity duration-700 ${
                    idx === virtualCurrent ? "opacity-100" : "opacity-40 pointer-events-none"
                  }`}
                >
                  {/* avatar + ring */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="relative shrink-0"
                      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                    >
                      {/* avatar image */}
                      <div className="absolute rounded-full overflow-hidden"
                        style={{ inset: 4 }}>
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80px, 80px"
                        />
                      </div>
                      {/* progress ring on top */}
                      {idx === virtualCurrent && <ProgressRing progress={progress} />}
                    </div>

                    <div className="min-w-0">
                      <p className="text-zinc-100 font-semibold text-base md:text-lg leading-tight truncate">{t.name}</p>
                      <p className="text-zinc-400 text-[13px] md:text-sm mt-0.5 truncate">{t.title}</p>
                    </div>
                  </div>

                  {/* quote */}
                  <blockquote className="text-zinc-300 text-[15px] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* navigation */}
          <div className="flex items-center justify-end gap-5 mt-2 lg:mr-[7.5%]">
            <button
              id="testimonial-prev"
              onClick={() => navigateTo(virtualCurrent - 1)}
              aria-label="Previous testimonial"
              className="w-10 h-10 shrink-0 rounded-full border border-zinc-700 flex items-center justify-center
                         text-zinc-400 hover:border-blue-500/60 hover:text-blue-500 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
            </button>
            
            <span className="text-sm font-medium text-zinc-400 tabular-nums">
              {String(actualIndex + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>

            <button
              id="testimonial-next"
              onClick={() => navigateTo(virtualCurrent + 1)}
              aria-label="Next testimonial"
              className="w-10 h-10 shrink-0 rounded-full border border-zinc-700 flex items-center justify-center
                         text-zinc-400 hover:border-blue-500/60 hover:text-blue-500 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .testimonial-card {
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 1rem;
          padding: 1.5rem 1.75rem;
        }
      `}</style>
    </section>
  );
}
