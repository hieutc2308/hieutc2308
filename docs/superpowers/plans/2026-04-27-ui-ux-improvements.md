# UI/UX Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign About's stat cards as a horizontal stack carousel, replace the Projects bento grid with an asymmetric photo gallery, and standardise the site-wide motion system across 4 files.

**Architecture:** Three independently-shippable steps in order: (1) new `StatCardStack` component with live data viz replaces About's 2×2 chart grid, (2) surgical motion-token fixes across Projects/Certs/Contact + one About container timing fix, (3) Projects section rewritten as a CSS-grid gallery with blue gradient covers and static SVG data viz motifs.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Framer Motion v12

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| **Create** | `components/portfolio/StatCardStack.tsx` | Horizontal card stack with 4 live-animated stat cards |
| **Modify** | `components/portfolio/About.tsx` | Delete 5 chart functions, import StatCardStack, fix right-col delay |
| **Modify** | `app/globals.css` | Add `@keyframes barUp` and `@keyframes scanLine` |
| **Modify** | `components/portfolio/Projects.tsx` | Rewrite as asymmetric gallery, fix label motion |
| **Modify** | `components/portfolio/Certifications.tsx` | Fix label ease + row stagger |
| **Modify** | `components/portfolio/Contact.tsx` | Fix x offset ±40 → ±50 |

---

## Task 1 — StatCardStack: shell, queue logic, stack layout

**Files:**
- Create: `components/portfolio/StatCardStack.tsx`
- Modify: `app/globals.css` (add keyframes)

- [ ] **Step 1: Add keyframes to globals.css**

Open `app/globals.css`. After the closing `}` of the `.shine-text` block (line ~200), add:

```css
/* StatCardStack animations */
@keyframes barUp {
  0%      { height: 0%;       opacity: 0.3; }
  35%     { height: var(--bar-h); opacity: 1; }
  85%     { height: var(--bar-h); opacity: 1; }
  85.01%  { height: 0%;       opacity: 0.3; }
  100%    { height: 0%;       opacity: 0.3; }
}

@keyframes scanLine {
  from { top: 0%; }
  to   { top: 100%; }
}
```

- [ ] **Step 2: Create the StatCardStack shell with queue logic**

Create `components/portfolio/StatCardStack.tsx`:

```tsx
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

// ─── Placeholder viz (replaced in Task 2–3) ───────────────────────────────────

function CardViz({ idx, isActive }: { idx: number; isActive: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center text-zinc-700 text-xs">
      viz {idx}
    </div>
  );
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

  const handleClick = () => { startTimer(); advance(); };

  const goTo = useCallback((target: number) => {
    if (busyRef.current) return;
    setQueue(q => {
      const idx = q.indexOf(target);
      return [...q.slice(idx), ...q.slice(0, idx)];
    });
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
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors in `StatCardStack.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/portfolio/StatCardStack.tsx app/globals.css
git commit -m "feat: add StatCardStack shell with horizontal stack layout"
```

---

## Task 2 — StatCardStack: Card 01 (Waveform) + Card 02 (Bars)

**Files:**
- Modify: `components/portfolio/StatCardStack.tsx`

- [ ] **Step 1: Replace placeholder `CardViz` with real implementations**

In `StatCardStack.tsx`, delete the placeholder `CardViz` function and add the following components, then a new `CardViz` at the bottom. Insert after the `CARDS` constant:

```tsx
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
```

Replace the placeholder `CardViz` with:

```tsx
function CardViz({ idx, isActive }: { idx: number; isActive: boolean }) {
  if (idx === 0) return <WaveformViz />;
  if (idx === 1) return <BarsViz isActive={isActive} />;
  return <div className="flex-1 flex items-center justify-center text-zinc-700 text-xs">viz {idx}</div>;
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Dev server smoke check**

```bash
npm run dev
```

Open http://localhost:3000. Go to the About section. The right column should still show the old grid (StatCardStack isn't wired up yet — that's Task 4). No console errors.

- [ ] **Step 4: Commit**

```bash
git add components/portfolio/StatCardStack.tsx
git commit -m "feat: add waveform and bars viz to StatCardStack"
```

---

## Task 3 — StatCardStack: Card 03 (Orbiting certs) + Card 04 (Donut arcs)

**Files:**
- Modify: `components/portfolio/StatCardStack.tsx`

- [ ] **Step 1: Add Framer Motion import**

At the top of `StatCardStack.tsx`, add `motion` to the existing imports:

```tsx
import { motion } from "framer-motion";
```

- [ ] **Step 2: Add cert icons viz after `BarsViz`**

```tsx
// ─── Card 03: Orbiting cert rings ─────────────────────────────────────────────

const CERT_ICONS = [
  { bg: "rgba(29,78,216,0.15)",  border: "rgba(29,78,216,0.35)",  dot: "#1D4ED8", spinDur: 4,   reverse: false },
  { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)",  dot: "#3B82F6", spinDur: 3.5, reverse: false },
  { bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.3)",  dot: "#60A5FA", spinDur: 5,   reverse: true  },
] as const;

function CertsViz() {
  return (
    <div className="flex justify-around items-center h-full">
      {CERT_ICONS.map(({ bg, border, dot, spinDur, reverse }, i) => (
        <motion.div
          key={i}
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center relative"
          style={{ background: bg, border: `1px solid ${border}` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, ease: "easeInOut" as const, repeat: Infinity, delay: i * 0.9 }}
        >
          {/* Outer dashed ring */}
          <motion.div
            className="absolute inset-[-10px] rounded-full"
            style={{ border: "1px dashed rgba(59,130,246,0.18)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 8, ease: "linear" as const, repeat: Infinity }}
          />
          {/* Inner solid ring */}
          <motion.div
            className="absolute inset-[-4px] rounded-full"
            style={{ border: "1.5px solid rgba(59,130,246,0.45)" }}
            animate={{ rotate: reverse ? -360 : 360 }}
            transition={{ duration: spinDur, ease: "linear" as const, repeat: Infinity }}
          />
          <div className="w-4 h-4 rounded-full relative z-10" style={{ background: dot }} />
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Add donut viz after `CertsViz`**

```tsx
// ─── Card 04: Donut arc draw ───────────────────────────────────────────────────

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const rad = (d: number) => (d - 90) * (Math.PI / 180);
  const x1 = (cx + r * Math.cos(rad(startDeg))).toFixed(2);
  const y1 = (cy + r * Math.sin(rad(startDeg))).toFixed(2);
  const x2 = (cx + r * Math.cos(rad(endDeg))).toFixed(2);
  const y2 = (cy + r * Math.sin(rad(endDeg))).toFixed(2);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

const DONUT_SEGS = [
  { pct: 0.40, color: "#1D4ED8", label: "Healthcare" },
  { pct: 0.30, color: "#3B82F6", label: "Retail" },
  { pct: 0.30, color: "#93C5FD", label: "HR / Workforce" },
] as const;

// cx=35, cy=35, r=26, gapDeg=12 — mirrors original About.tsx DonutCard exactly
const CX = 35, CY = 35, R = 26, GAP = 12;

function buildDonutPaths(): { d: string; color: string; label: string }[] {
  let startDeg = 0;
  return DONUT_SEGS.map(({ pct, color, label }) => {
    const sweepDeg = pct * 360 - GAP;
    const d = arcPath(CX, CY, R, startDeg + GAP / 2, startDeg + GAP / 2 + sweepDeg);
    startDeg += pct * 360;
    return { d, color, label };
  });
}

const DONUT_PATHS = buildDonutPaths();

function DonutViz({ isActive }: { isActive: boolean }) {
  const [cycle, setCycle]   = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!isActive) { setFading(false); return; }
    setFading(false);
    const fadeT  = setTimeout(() => setFading(true),              2800);
    const cycleT = setTimeout(() => setCycle(c => c + 1),         3300);
    return () => { clearTimeout(fadeT); clearTimeout(cycleT); };
  }, [isActive, cycle]);

  return (
    <div className="flex items-center justify-center gap-3 h-full">
      <svg
        width="70" height="70" viewBox="0 0 70 70"
        style={{ transition: "opacity 0.5s", opacity: fading ? 0 : 1 }}
      >
        {DONUT_PATHS.map(({ d, color }, i) => (
          <motion.path
            key={`${i}-${cycle}`}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="butt"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isActive ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{
              pathLength: { duration: 0.8, delay: 0.1 + i * 0.25, ease: [0.6, 0, 0.25, 1] as [number,number,number,number] },
              opacity:    { duration: 0.1, delay: 0.1 + i * 0.25 },
            }}
          />
        ))}
      </svg>
      <div className="flex flex-col gap-1.5">
        {DONUT_PATHS.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-zinc-400 leading-none">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Update `CardViz` to use all four viz components**

Replace the current `CardViz` function:

```tsx
function CardViz({ idx, isActive }: { idx: number; isActive: boolean }) {
  if (idx === 0) return <WaveformViz />;
  if (idx === 1) return <BarsViz isActive={isActive} />;
  if (idx === 2) return <CertsViz />;
  return <DonutViz isActive={isActive} />;
}
```

- [ ] **Step 5: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/portfolio/StatCardStack.tsx
git commit -m "feat: add cert orbits and donut arc draw viz to StatCardStack"
```

---

## Task 4 — Wire StatCardStack into About.tsx

**Files:**
- Modify: `components/portfolio/About.tsx`

- [ ] **Step 1: Delete old chart card code from About.tsx**

Open `components/portfolio/About.tsx`. Delete the following in full:
- The `LineChartCard` function (lines ~9–72)
- The `BarChartCard` function (lines ~74–105)
- The `CertCard` function (lines ~107–142)
- The `arcPath` function (lines ~144–152)
- The `DonutCard` function (lines ~154–203)
- The `Award`, `Trophy`, `BadgeCheck` imports from `lucide-react` (they're only used by the deleted `CertCard`)

The file should now have only the `About` export function remaining, plus its imports (`motion`, `useInView`, `useRef`, `HyperTextParagraph`).

- [ ] **Step 2: Import StatCardStack**

At the top of `About.tsx`, add:

```tsx
import { StatCardStack } from "@/components/portfolio/StatCardStack";
```

- [ ] **Step 3: Replace the chart cards grid with StatCardStack**

Inside the `About` function, find the right-column `motion.div` that currently renders the 2×2 stat grid:

```tsx
// BEFORE — find this block and replace it:
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
```

Replace with — note the delay changes from `0.15` to `0.08` per spec:

```tsx
<motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={isInView ? { opacity: 1, x: 0 } : {}}
  transition={{ duration: 0.7, delay: 0.08, ease: [0.6, 0, 0.25, 1] }}
>
  <StatCardStack />
</motion.div>
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors. (If `Award`, `Trophy`, `BadgeCheck` import is still present, remove it now.)

- [ ] **Step 5: Visual check in browser**

```bash
npm run dev
```

Open http://localhost:3000. Scroll to the About section. Verify:
- Right column shows a single tall card with `6+` / `Years of Experience` and the waveform
- Cards visible stacked to the right (peek effect)
- Click advances to next card with fly-out
- Dots below the stack are interactive
- Donut card: arcs draw sequentially then fade out and loop

- [ ] **Step 6: Commit**

```bash
git add components/portfolio/About.tsx
git commit -m "feat: replace About stat grid with StatCardStack"
```

---

## Task 5 — Global motion fixes: Projects, Certifications, Contact

**Files:**
- Modify: `components/portfolio/Projects.tsx`
- Modify: `components/portfolio/Certifications.tsx`
- Modify: `components/portfolio/Contact.tsx`

- [ ] **Step 1: Fix Projects.tsx section label**

In `components/portfolio/Projects.tsx`, find the section label motion span (around line 92):

```tsx
// BEFORE:
transition={{ duration: 0.5 }}
// AFTER:
transition={{ duration: 0.6, ease: [0.6, 0, 0.25, 1] }}
```

(The card stagger `delay: 0.08 * index` is already correct — leave it.)

- [ ] **Step 2: Fix Certifications.tsx section label and row stagger**

In `components/portfolio/Certifications.tsx`:

Find the section label motion span (around line 33):
```tsx
// BEFORE:
transition={{ duration: 0.5 }}
// AFTER:
transition={{ duration: 0.6, ease: [0.6, 0, 0.25, 1] }}
```

Find the row stagger (around line 62):
```tsx
// BEFORE:
transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.6, 0, 0.25, 1] }}
// AFTER:
transition={{ duration: 0.6, delay: i * 0.08, ease: [0.6, 0, 0.25, 1] }}
```

- [ ] **Step 3: Fix Contact.tsx x offsets**

In `components/portfolio/Contact.tsx`:

Left column (around line 34):
```tsx
// BEFORE:
initial={{ opacity: 0, x: -40 }}
// AFTER:
initial={{ opacity: 0, x: -50 }}
```

Right column (around line 55):
```tsx
// BEFORE:
initial={{ opacity: 0, x: 40 }}
// AFTER:
initial={{ opacity: 0, x: 50 }}
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/portfolio/Projects.tsx components/portfolio/Certifications.tsx components/portfolio/Contact.tsx
git commit -m "fix: standardise motion tokens across Projects, Certifications, Contact"
```

---

## Task 6 — Projects: asymmetric gallery

**Files:**
- Modify: `components/portfolio/Projects.tsx`

- [ ] **Step 1: Replace Projects.tsx entirely**

Replace the full contents of `components/portfolio/Projects.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import resume from "@/data/resume.json";

// ─── Gallery card configuration ───────────────────────────────────────────────
// One entry per project — order matches resume.projects[0..4]

const GALLERY_CONFIG = [
  {
    // 0 — HealthTech (wide top-left)
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
    // 1 — Admin Monitor (tall right)
    col: "md:[grid-column:3/4]",
    row: "md:[grid-row:1/3]",
    gradient: "linear-gradient(200deg, #071428 0%, #0f2554 55%, #060e1c 100%)",
    glow: { w: 160, h: 160, opacity: 0.20, left: "-40px", bottom: "-20px" },
    titleSize: "text-base",
    viz: (
      <svg className="absolute right-3 top-5 opacity-[0.18]" width="60" height="80" viewBox="0 0 60 80">
        <polyline points="10,70 20,52 30,38 40,25 50,12" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
        {[10,20,30,40,50].map((x, i) => (
          <circle key={i} cx={x} cy={[70,52,38,25,12][i]} r="3" fill="#3B82F6" />
        ))}
      </svg>
    ),
  },
  {
    // 2 — HR Analytics (tall left)
    col: "md:[grid-column:1/2]",
    row: "md:[grid-row:2/4]",
    gradient: "linear-gradient(160deg, #101e48 0%, #0e285e 50%, #080f28 100%)",
    glow: { w: 180, h: 180, opacity: 0.18, right: "-50px", top: "40px" },
    titleSize: "text-base",
    viz: (
      <svg className="absolute left-4 top-5 opacity-[0.18]" width="54" height="54" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r="20" fill="none" stroke="#3B82F6"  strokeWidth="6" strokeDasharray="50 76"  strokeDashoffset="-6" />
        <circle cx="27" cy="27" r="20" fill="none" stroke="#1D4ED8"  strokeWidth="6" strokeDasharray="38 88"  strokeDashoffset="-62" />
        <circle cx="27" cy="27" r="20" fill="none" stroke="#93C5FD" strokeWidth="6" strokeDasharray="32 94"  strokeDashoffset="-104" />
      </svg>
    ),
  },
  {
    // 3 — Retail BI (small square mid)
    col: "md:[grid-column:2/3]",
    row: "md:[grid-row:2/3]",
    gradient: "linear-gradient(115deg, #0a1c3e 0%, #152f6a 55%, #070e22 100%)",
    glow: { w: 100, h: 100, opacity: 0.22, left: "-20px", top: "-20px" },
    titleSize: "text-sm",
    viz: (
      <svg className="absolute right-3 top-3 opacity-[0.18]" width="48" height="48" viewBox="0 0 48 48">
        {[[8,38],[16,28],[22,32],[30,18],[36,22],[42,10]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r={i%2===0?2.5:2} fill="#3B82F6" />
        ))}
      </svg>
    ),
  },
  {
    // 4 — Financial (wide bottom)
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
] as const;

// ─── GalleryCard ──────────────────────────────────────────────────────────────

type GalleryCardProps = {
  project: (typeof resume.projects)[number];
  config: (typeof GALLERY_CONFIG)[number];
  index: number;
  isInView: boolean;
};

function GalleryCard({ project, config, index, isInView }: GalleryCardProps) {
  const { col, row, gradient, glow, titleSize, viz } = config;

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
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: glow.w,
          height: glow.h,
          background: "#3B82F6",
          filter: "blur(50px)",
          opacity: glow.opacity,
          ...("right" in glow ? { right: glow.right } : { left: (glow as { left: string }).left }),
          ...("top" in glow ? { top: glow.top } : { bottom: (glow as { bottom: string }).bottom }),
        }}
      />
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
      <div className="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
        style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(96,165,250,0.3)" }}>
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

// ─── Projects ─────────────────────────────────────────────────────────────────

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

        {/* Asymmetric gallery grid */}
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
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors. If there is a type error on the `glow` spread (left vs right), fix by using explicit conditionals:

```tsx
// For glow positioning, replace the spread with:
left:   "left"   in glow ? glow.left   : undefined,
right:  "right"  in glow ? glow.right  : undefined,
top:    "top"    in glow ? glow.top    : undefined,
bottom: "bottom" in glow ? glow.bottom : undefined,
```

- [ ] **Step 3: Visual check in browser**

```bash
npm run dev
```

Open http://localhost:3000, scroll to Projects. Verify:
- 5 cards in asymmetric layout (wide top-left, tall right, tall left, small square, wide bottom)
- Each card has unique blue gradient + grid texture + glow blob + data viz motif
- Hover lifts the card, top border glows, arrow appears
- Tags are translucent blue pills
- Clicking navigates to `/projects/[slug]`
- On mobile (resize browser): all cards stack vertically, full width

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: build succeeds with no errors. (The `export const dynamic = "force-dynamic"` in the API route is already in place — no change needed.)

- [ ] **Step 5: Commit**

```bash
git add components/portfolio/Projects.tsx
git commit -m "feat: replace Projects bento grid with asymmetric gallery"
```

---

## Self-Review Checklist

- [x] **Spec section 1** (motion fixes): covered in Task 5 (Projects label, Certs label + stagger, Contact x offset) and Task 4 (About container delay)
- [x] **Spec section 2** (StatCardStack): Tasks 1–4
  - Queue logic: Task 1
  - Waveform + bars: Task 2
  - Certs + donut: Task 3
  - Integration into About: Task 4
- [x] **Spec section 3** (Projects gallery): Task 6
- [x] **Removal**: `GlowCard`, `handlePointerMove`, `handlePointerLeave`, `glowVars`, `colSpans` — all deleted in Task 6's full file replacement
- [x] **Mobile**: `grid-cols-1` on mobile in Task 6
- [x] **Slug routing**: `ArrowUpRight` kept, card wrapped in `<motion.a>` in Task 6
- [x] **Tags limit**: `project.tech.slice(0, 4)` in Task 6
- [x] **Static viz motifs**: inline SVGs, not animated
- [x] **donutCycle key trick**: implemented in Task 3's `DonutViz`
- [x] **barCycle key trick**: implemented in Task 2's `BarsViz`
