"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const ADVANCE_MS = 3500;

const STACK_POSITIONS = [
  { tx: 0,  scale: 1,    opacity: 1,    zIndex: 4 },
  { tx: 22, scale: 0.95, opacity: 0.60, zIndex: 3 },
  { tx: 40, scale: 0.90, opacity: 0.28, zIndex: 2 },
  { tx: 56, scale: 0.86, opacity: 0,    zIndex: 1 },
] as const;

const CARDS = [
  { num: "01 / 04", value: "6+", label: "Years of Experience" },
  { num: "02 / 04", value: "5+", label: "Projects Delivered" },
  { num: "03 / 04", value: "3",  label: "Certifications" },
  { num: "04 / 04", value: "3",  label: "Industry Verticals" },
] as const;

// ─── Card 01: Live waveform ────────────────────────────────────────────────────

function WaveformViz() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tRef   = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const W = 200, H = 80, N = 22;

    function wave(x: number, t: number) {
      return H * 0.72
        - Math.sin((x / W) * Math.PI * 2 + t) * H * 0.26
        - Math.sin((x / W) * Math.PI * 3.5 + t * 1.4) * H * 0.10;
    }

    function frame() {
      const svg = svgRef.current;
      if (!svg) return;
      const xs = Array.from({ length: N }, (_, i) => (i / (N - 1)) * W);
      const ys = xs.map(x => wave(x, tRef.current));
      const pts = xs
        .map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`)
        .join(" ");
      svg.querySelector<SVGPathElement>("#wf-line")!.setAttribute("d", pts);
      svg.querySelector<SVGPathElement>("#wf-area")!.setAttribute("d", `${pts} L ${W} ${H} L 0 ${H} Z`);
      const dot = svg.querySelector<SVGCircleElement>("#wf-dot")!;
      dot.setAttribute("cx", xs[N - 1].toFixed(1));
      dot.setAttribute("cy", ys[N - 1].toFixed(1));
      tRef.current += 0.022;
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <svg ref={svgRef} className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wf-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path id="wf-area" fill="url(#wf-grad)" />
      <path id="wf-line" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle id="wf-dot" r="4" fill="#60A5FA" stroke="#09090b" strokeWidth="2" />
    </svg>
  );
}

// ─── Card 02: Bar chart ────────────────────────────────────────────────────────

const BAR_HEIGHTS = [55, 72, 60, 88, 100];

function BarsViz({ isActive }: { isActive: boolean }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setCycle(c => c + 1), 2600);
    return () => clearInterval(t);
  }, [isActive]);

  return (
    <div className="flex items-end gap-2 h-full">
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={`${i}-${cycle}`}
          className="flex-1 rounded-t"
          style={{
            background: "linear-gradient(to top, #1D4ED8, #3B82F6)",
            transformOrigin: "bottom",
            height: 0,
            ["--bar-h" as string]: `${h}%`,
            animation: isActive
              ? `barUp 2.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s forwards`
              : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── CardViz dispatcher ────────────────────────────────────────────────────────

function CardViz({ idx, isActive }: { idx: number; isActive: boolean }) {
  if (idx === 0) return <WaveformViz />;
  if (idx === 1) return <BarsViz isActive={isActive} />;
  return <div className="flex-1 flex items-center justify-center text-zinc-700 text-xs">viz {idx}</div>;
}

// ─── StatCardStack ─────────────────────────────────────────────────────────────

export function StatCardStack() {
  const [queue, setQueueState] = useState([0, 1, 2, 3]);
  const [flyingIdx, setFlyingIdx] = useState<number | null>(null);

  const queueRef  = useRef([0, 1, 2, 3]);
  const busyRef   = useRef(false);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const setQueue = useCallback((updater: (q: number[]) => number[]) => {
    setQueueState(q => {
      const next = updater(q);
      queueRef.current = next;
      return next;
    });
  }, []);

  const advance = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const current = queueRef.current[0];
    setFlyingIdx(current);
    setTimeout(() => {
      setFlyingIdx(null);
      setQueue(q => [...q.slice(1), q[0]]);
      busyRef.current = false;
    }, 440);
  }, [setQueue]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, ADVANCE_MS);
  }, [advance]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const handleClick = () => {
    if (busyRef.current) return;
    startTimer();
    advance();
  };

  const goTo = useCallback((target: number) => {
    if (busyRef.current) return;
    busyRef.current = true;
    const current = queueRef.current[0];
    if (current === target) { busyRef.current = false; return; }
    setFlyingIdx(current);
    setTimeout(() => {
      setFlyingIdx(null);
      setQueue(q => {
        const idx = q.indexOf(target);
        return [...q.slice(idx), ...q.slice(0, idx)];
      });
      busyRef.current = false;
    }, 440);
    startTimer();
  }, [setQueue, startTimer]);

  return (
    <div>
      {/* Clip wrapper — hides the peeking cards' overflow on the right */}
      <div
        className="overflow-hidden rounded-2xl cursor-pointer"
        style={{ paddingRight: 52, marginRight: -52 }}
        onClick={handleClick}
      >
        <div className="relative h-60">
          {queue.map((cardIdx, pos) => {
            const { tx, scale, opacity, zIndex } = STACK_POSITIONS[pos];
            const isFlying = flyingIdx === cardIdx;
            return (
              <div
                key={cardIdx}
                className="absolute inset-0 rounded-2xl border border-white/[0.09] bg-[#111113] p-6 flex flex-col overflow-hidden"
                style={{
                  zIndex,
                  pointerEvents: pos === 0 ? "auto" : "none",
                  ...(isFlying
                    ? {
                        transform: "translateX(-115%) rotate(-6deg) scale(0.88)",
                        opacity: 0,
                        transition: "transform 420ms cubic-bezier(0.4,0,0.8,0), opacity 420ms cubic-bezier(0.4,0,0.8,0)",
                      }
                    : {
                        transform: `translateX(${tx}px) scale(${scale})`,
                        opacity,
                        boxShadow: pos === 0 ? "0 12px 40px rgba(0,0,0,0.55)" : "none",
                        transition: "transform 550ms cubic-bezier(0.16,1,0.3,1), opacity 550ms cubic-bezier(0.16,1,0.3,1), box-shadow 550ms",
                      }),
                }}
              >
                {/* Top accent border */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)" }}
                />
                {/* Scan line */}
                <div
                  className="absolute left-0 right-0 h-px pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)",
                    animation: "scanLine 3s linear infinite",
                  }}
                />
                <div className="text-[9px] font-bold text-blue-400 tracking-[0.22em] uppercase mb-1.5">
                  {CARDS[cardIdx].num}
                </div>
                <div className="text-5xl font-extrabold text-zinc-100 tracking-[-0.05em] leading-none mb-1">
                  {CARDS[cardIdx].value}
                </div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-[0.1em] mb-4">
                  {CARDS[cardIdx].label}
                </div>
                <div className="flex-1 min-h-0">
                  <CardViz idx={cardIdx} isActive={pos === 0 && flyingIdx === null} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center mt-3">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); goTo(i); }}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: queue[0] === i ? "#3B82F6" : "rgba(255,255,255,0.12)",
              transform: queue[0] === i ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
