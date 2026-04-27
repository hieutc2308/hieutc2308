# UI/UX Improvements — Design Spec

**Date:** 2026-04-27  
**Scope:** Global motion system audit + About section redesign + Projects section redesign  
**Sections untouched:** Hero, Skills, Testimonials, Certifications, Contact, /places

---

## 1. Global Motion System

### Problem
The site's animations were assembled from different sources. The easing identity (`cubic-bezier(0.6,0,0.25,1)`) is already consistent throughout, but six specific issues make it feel unpolished:

1. Section labels (`Projects`, `Certifications`) have no explicit `ease` — they fall back to the browser's default `ease` curve.
2. Five different durations in use: `0.5s`, `0.6s`, `0.7s`, `0.8s`, `1.1s`.
3. Four different stagger intervals: `0.07`, `0.08×index`, `0.10`, `0.15`.
4. Cert icon entrance uses `type: "spring"` — inconsistent with every other entrance animation.
5. `x` offset mismatch: About uses `±50px`, Contact uses `±40px`.
6. Line chart path animation uses `"easeInOut"` — diverges from the site-wide curve.

### Fix — Standardised Motion Tokens

| Token | Value | Used for |
|---|---|---|
| `EASE` | `[0.6, 0, 0.25, 1]` | All entrance animations, data viz draws |
| `DUR_STD` | `0.6s` | Standard element entrances |
| `DUR_SECTION` | `0.7s` | Two-column section containers (About, Contact) |
| `STAGGER` | `0.08s` | Delay between staggered siblings |
| `X_OFFSET` | `50px` | Horizontal slide for two-column layouts |
| `Y_OFFSET` | `20px` | Vertical slide for single-column layouts |

### Changes per file

**`components/portfolio/About.tsx`**
- `LineChartCard`, `BarChartCard`, `CertCard` — **skip these fixes**; all three are deleted as part of Section 2 (StatCardStack).
- Section container left col: duration `0.7` ✓ (keep), ease already correct ✓
- Section container right col: duration `0.7` ✓, delay `0.15` → `0.08` (one stagger unit)

**`components/portfolio/Projects.tsx`**
- Section label: add `ease: [0.6,0,0.25,1]`; duration `0.5` → `0.6`
- Card stagger: `delay: 0.08 * index` ✓ (already correct — keep)

**`components/portfolio/Certifications.tsx`**
- Section label: add `ease: [0.6,0,0.25,1]`; duration `0.5` → `0.6`
- Row stagger: `delay: 0.1 + i * 0.07` → `delay: i * 0.08`

**`components/portfolio/Contact.tsx`**
- Left col `x: -40` → `x: -50`
- Right col `x: 40` → `x: 50`

---

## 2. About Section — Horizontal Stack Cards

### Problem
The right column displays four animated stat cards simultaneously. They feel disconnected from each other and from the rest of the page.

### Solution — Sequential Horizontal Card Stack

Replace the `2×2` grid of stat cards with a single large card that cycles through all four stats. Cards stack horizontally (Android-style), with inactive cards peeking to the right.

### Layout

```
[ Active card — full size, full opacity ]
                                         [ Card +1: translateX(22px) scale(0.95) opacity(0.60) ]
                                                  [ Card +2: translateX(40px) scale(0.90) opacity(0.28) ]
                                                           [ Card +3: translateX(56px) scale(0.86) opacity(0) ]
```

Left column (bio text) is unchanged.

### Interaction

- **Auto-advance**: every 3.5s, the active card flies out and the next slides forward.
- **Click to advance**: clicking anywhere on the stack immediately advances.
- **Dot navigation**: 4 dots below the stack for direct card access.
- **Exit animation**: active card flies to `translateX(-115%) rotate(-6deg)` over `420ms` with `cubic-bezier(0.4,0,0.8,0)`.
- **Enter animation**: remaining cards transition to new positions via CSS transition `0.55s cubic-bezier(0.16,1,0.3,1)`.

### Four Card Designs

**Card 01 — Years of Experience (`6+`)**
- Viz: live waveform line chart, animates continuously with `requestAnimationFrame`
- SVG path + filled area gradient, dot tracking the live end point

**Card 02 — Projects Delivered (`5+`)**
- Viz: 5 bar chart columns
- Bars animate `height: 0% → target` with `cubic-bezier(0.16,1,0.3,1)`, staggered `0.12s`
- At 85% of cycle, bars **snap instantly** back to `0%` (no slide-down) then regrow
- Only animates when card is `data-pos="0"` (active)

**Card 03 — Certifications (`3`)**
- Viz: 3 orbiting icon rings
- Each icon: outer dashed ring + inner solid ring rotating in opposite directions
- Pulse `scale(1 → 1.1 → 1)` on `3s ease-in-out infinite`, staggered `0.9s`
- Entrance: `duration: 0.6, ease: [0.6,0,0.25,1]` (replacing spring — per Section 1)

**Card 04 — Industry Verticals (`3`)**
- Viz: donut chart with 3 arc segments (`r=26, cx=35, cy=35, gapDeg=12`)
- Segment sizes: Healthcare 40%, Retail 30%, HR 30%
- Animation: each arc draws itself via `stroke-dashoffset: length → 0`, staggered `0.25s`
- Easing: `cubic-bezier(0.6,0,0.25,1)`, duration `0.8s` per segment (mirrors original)
- Fade-out: all three fade `opacity 1→0` together over `0.5s` at 70% of cycle
- Reset: dashoffset snaps back while opacity is 0 (invisible reset, no jank)
- Cycle total: `4.0s`
- Only animates when card is active

### Implementation Notes

- `overflow: hidden` + `padding-right: 52px; margin-right: -52px` on outer wrapper to clip peeking cards cleanly
- Active card index tracked via React `useState<number>` — drives which card is at `pos 0` and which data viz animations run
- `useEffect` with `setInterval` handles auto-advance; `clearInterval` on click/dot interaction
- Progress dots sync from state: `activeIndex === dotIndex`
- Queue rotation: `setQueue(q => [...q.slice(1), q[0]])` shifts front to back

### Component

New file: `components/portfolio/StatCardStack.tsx` (client component).  
In `components/portfolio/About.tsx`: delete the four chart card functions (`LineChartCard`, `BarChartCard`, `CertCard`, `DonutCard`, `arcPath`), import and render `<StatCardStack />` in place of the `grid grid-cols-2 gap-4` div.

---

## 3. Projects Section — Asymmetric Gallery

### Problem
The current bento grid with `colSpans=[2,1,1,2,3]` and pointer-tracking glow is visually interesting but doesn't give the projects enough visual weight or identity. It reads as a list, not a portfolio showcase.

### Solution — Asymmetric Photo Gallery Layout

Replace the bento grid with a CSS grid gallery where each card has a distinct shape and a unique visual identity through blue-gradient covers and embedded data viz motifs.

### Grid Layout

```
┌─────────────────────────┬──────────────┐
│  01 — HealthTech        │              │
│  (col 1–2, row 1)       │  02 — Admin  │
│  WIDE                   │  (col 3)     │
├──────────────┬──────────┤  TALL        │
│              │  04 —    ├──────────────┤
│  03 — HR     │  Retail  │              │
│  (col 1)     │  (col 2) │  05 — Finance│
│  TALL        │  SQUARE  │  (col 2–3)   │
│              │          │  WIDE        │
└──────────────┴──────────┴──────────────┘
```

Grid spec: `grid-template-columns: 1fr 1fr 1fr`, `grid-template-rows: 200px 140px 160px`, `gap: 10px`

| Card | `grid-column` | `grid-row` | Gradient | Viz motif |
|---|---|---|---|---|
| 01 HealthTech | 1 / 3 | 1 / 2 | `135deg, #0c1e45 → #1a3a7a` | Bar chart (SVG) |
| 02 Admin Monitor | 3 / 4 | 1 / 3 | `200deg, #071428 → #0f2554` | Line chart (SVG) |
| 03 HR Analytics | 1 / 2 | 2 / 4 | `160deg, #101e48 → #0e285e` | Donut arc (SVG) |
| 04 Retail BI | 2 / 3 | 2 / 3 | `115deg, #0a1c3e → #152f6a` | Scatter dots (SVG) |
| 05 Financial | 2 / 4 | 3 / 4 | `150deg, #08111f → #0c1e40` | Pipeline flow (SVG) |

### Card Anatomy

Each card contains:
1. **Background gradient** — unique depth/angle per card, all within blue family
2. **Grid texture overlay** — `::before` pseudo-element, `background-size: 22px 22px`, `opacity: 0.025`
3. **Glow blob** — `position: absolute`, `filter: blur(50px)`, `background: #3B82F6`, unique position/size per card
4. **Data viz motif** — inline SVG, `position: absolute`, `opacity: 0.18`, unique position per card
5. **Content overlay** — `position: absolute; inset: 0`, gradient `to top` from `rgba(0,0,0,0.72)` to transparent
6. **Project number** — `text-xs font-bold text-blue-400 tracking-widest`
7. **Title** — `font-bold text-white`, size varies by card span
8. **Tags** — translucent blue pills: `bg: rgba(59,130,246,0.18)`, `border: rgba(96,165,250,0.25)`
9. **Arrow** — `position: absolute; top: 14px; right: 14px`, appears on hover

### Interactions

- **Hover**: `translateY(-4px) scale(1.01)`, `box-shadow: 0 16px 40px rgba(0,0,0,0.6)`, top border glow via `::after` (`opacity: 0 → 1`)
- **Transition**: `0.45s cubic-bezier(0.16,1,0.3,1)`
- **Click**: navigate to `/projects/[slug]` (existing slug routing)

### Entrance Animation

Cards enter with staggered `y: 20 → 0, opacity: 0 → 1` using the Section 1 motion tokens:
- Duration: `0.6s`
- Ease: `[0.6,0,0.25,1]`  
- Stagger: `0.08s × index`
- Trigger: `useInView` with `once: true, margin: "-80px"`

### Removal

- Delete the `GlowCard` component and all pointer-tracking logic (`handlePointerMove`, `handlePointerLeave`, CSS variables for glow cone)
- Delete `colSpans` array
- Keep `resume.json` as data source — no content changes

### Implementation Notes

- Data viz motifs are static inline SVGs per card — not animated (keeps performance clean)
- Tags: `project.tech.slice(0, 4)` for all cards (no `spanTwo` logic needed)
- The `ArrowUpRight` link to `/projects/[slug]` is kept; wraps the entire card as a link
- Mobile: `grid-template-columns: 1fr` on `< md`, all cards full width stacked

---

## Execution Order

1. Build `StatCardStack` component (`components/portfolio/StatCardStack.tsx`), replace About right column — this also resolves the 3 About-specific motion fixes (LineChart, BarChart, CertCard) since those components are deleted
2. Apply remaining global motion token fixes (5 changes across 3 files: Projects, Certifications, Contact + About section container delay)
3. Rewrite `Projects` section with asymmetric gallery

Each step is independently shippable and testable.
