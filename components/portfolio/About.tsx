"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Trophy, BadgeCheck } from "lucide-react";
import { HyperTextParagraph } from "@/components/ui/hyper-text-paragraph";

// Card 1: Line chart — Years of Experience
function LineChartCard({ isInView }: { isInView: boolean }) {
  const years = ["'21", "'22", "'23", "'24", "'25", "'26"];
  const points: [number, number][] = [
    [0, 52], [20, 44], [40, 33], [60, 22], [80, 13], [100, 5],
  ];
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L 100 60 L 0 60 Z`;

  return (
    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
      <div className="text-3xl font-bold text-zinc-100">6+</div>
      <div className="text-xs text-zinc-500 mt-0.5 mb-3">Years of Experience</div>
      <svg viewBox="0 0 100 65" className="w-full h-14" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Subtle grid lines */}
        {[20, 40, 60].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#27272a" strokeWidth="0.5" />
        ))}
        <motion.path
          d={areaPath}
          fill="url(#lineAreaGrad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: "easeInOut" }}
        />
        {/* Data points */}
        {points.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r="2"
            fill="#1D4ED8"
            stroke="#60A5FA"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.25, delay: 0.3 + i * 0.15 }}
          />
        ))}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-1">
        {years.map(y => (
          <span key={y} className="text-[9px] text-zinc-600">{y}</span>
        ))}
      </div>
    </div>
  );
}

// Card 2: Bar chart — Projects Delivered
function BarChartCard({ isInView }: { isInView: boolean }) {
  const bars = [55, 70, 60, 85, 100];
  const labels = ["P1", "P2", "P3", "P4", "P5"];
  return (
    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
      <div className="text-3xl font-bold text-zinc-100">5+</div>
      <div className="text-xs text-zinc-500 mt-0.5 mb-3">Projects Delivered</div>
      <div className="flex items-end gap-1.5 h-14">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${(h / 100) * 56}px`,
              transformOrigin: "bottom",
              background: `rgba(59,130,246,${0.4 + (i / bars.length) * 0.6})`,
            }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.6, 0, 0.25, 1] }}
          />
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {labels.map(l => (
          <span key={l} className="flex-1 text-center text-[9px] text-zinc-600">{l}</span>
        ))}
      </div>
    </div>
  );
}

// Card 3: Animated cert icons — Certifications
function CertCard({ isInView }: { isInView: boolean }) {
  const certs = [
    { icon: Trophy,     label: "Microsoft",  color: "#60A5FA" },
    { icon: Award,      label: "Power BI",   color: "#3B82F6" },
    { icon: BadgeCheck, label: "Azure",      color: "#1D4ED8" },
  ];

  return (
    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
      <div className="text-3xl font-bold text-zinc-100">3</div>
      <div className="text-xs text-zinc-500 mt-0.5 mb-4">Certifications</div>
      <div className="flex justify-between gap-2">
        {certs.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            className="flex flex-col items-center gap-1.5 flex-1"
            initial={{ opacity: 0, scale: 0.4, y: 8 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.4, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 + i * 0.15 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${color}18`, border: `1px solid ${color}40` }}
              animate={isInView ? { boxShadow: [`0 0 0px ${color}00`, `0 0 12px ${color}40`, `0 0 0px ${color}00`] } : {}}
              transition={{ duration: 2, delay: 0.6 + i * 0.2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Icon size={18} style={{ color }} strokeWidth={1.5} />
            </motion.div>
            <span className="text-[9px] text-zinc-500 text-center leading-tight">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const rad = (d: number) => (d - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(rad(startDeg));
  const y1 = cy + r * Math.sin(rad(startDeg));
  const x2 = cx + r * Math.cos(rad(endDeg));
  const y2 = cy + r * Math.sin(rad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// Card 4: Donut chart — Industry Verticals
function DonutCard({ isInView }: { isInView: boolean }) {
  const r = 26;
  const cx = 35;
  const cy = 35;
  const gapDeg = 12;
  const industries = [
    { label: "Healthcare",     pct: 0.40, color: "#1D4ED8" },
    { label: "Retail",         pct: 0.30, color: "#3B82F6" },
    { label: "HR / Workforce", pct: 0.30, color: "#60A5FA" },
  ];

  let startDeg = 0;
  return (
    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
      <div className="text-3xl font-bold text-zinc-100">3</div>
      <div className="text-xs text-zinc-500 mt-0.5 mb-3">Industry Verticals</div>
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 70 70" className="w-14 h-14 shrink-0">
          {industries.map(({ pct, color }, i) => {
            const sweepDeg = pct * 360 - gapDeg;
            const d = arcPath(cx, cy, r, startDeg + gapDeg / 2, startDeg + gapDeg / 2 + sweepDeg);
            startDeg += pct * 360;
            return (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="7"
                strokeLinecap="butt"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.25, ease: [0.6, 0, 0.25, 1] }}
              />
            );
          })}
        </svg>
        <div className="flex flex-col gap-2">
          {industries.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-zinc-400 leading-none">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 md:py-32 px-6">


      <div className="relative z-10 max-w-6xl mx-auto">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.6, 0, 0.25, 1] }}
          >
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z" fill="currentColor" /></svg>
              <span className="shine-text">About</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
              Data professional
              <br />
              <span className="text-zinc-500">based in Hanoi.</span>
            </h2>
            <HyperTextParagraph
              className="text-base md:text-lg leading-relaxed mt-8"
              paragraphs={[
                "With over 6 years of experience, I translate complex, messy data into clear Power BI solutions that drive real results.",
                "From optimizing DAX to building robust data models, I'm passionate about bridging the gap between raw numbers and the strategic insights that help businesses move forward.",
              ]}
              highlightWords={["6 years of experience", "Power BI solutions", "strategic insights"]}
            />
          </motion.div>

          {/* Chart cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.6, 0, 0.25, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            <LineChartCard isInView={isInView} />
            <BarChartCard isInView={isInView} />
            <CertCard isInView={isInView} />
            <DonutCard isInView={isInView} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
