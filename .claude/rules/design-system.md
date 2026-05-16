# Design System — Tran Chi Hieu Portfolio

Inspired by best practices from: Cal.com, Expo, Framer, Figma, Linear.app, Lovable, Vercel

---

## 1. Visual Theme & Atmosphere

Dark-mode-native portfolio. The canvas is near-black zinc-950 (`#09090b`) — deep but not pure black, with a cool undertone. Content emerges from darkness through subtle luminance stepping. A single accent (blue-500 `#3B82F6`) is used sparingly and intentionally — only for primary labels, CTAs, and interactive highlights. The overall impression is precision-built: compressed headings, generous section spacing, and shadow-based elevation.

**Key characteristics:**
- Always dark mode — no light mode toggle
- Single accent color (blue-500) used for ≤3 items per section
- Shadow-based borders: `rgba(255,255,255,0.08)` ring instead of opaque CSS borders
- Inter Variable with negative letter-spacing on headings
- 8px base spacing grid, section padding at `py-24 md:py-32`
- Executive portfolio scan pattern: lead with outcome/value, then proof metrics, then scannable project/skill cards

---

## 2. Color Palette

| Token | Value | Role |
|---|---|---|
| `--background` | `#09090b` | Page background (zinc-950) |
| `--card` | `#18181b` | Card surfaces (zinc-900) |
| `--secondary` | `#27272a` | Elevated surfaces (zinc-800) |
| `--border` | `rgba(255,255,255,0.08)` | Default border / shadow-border |
| `--foreground` | `#fafafa` | Primary text |
| `--muted-foreground` | `#a1a1aa` | Secondary text (zinc-400) |
| `--primary` | `#3B82F6` | Accent — use sparingly |

### Text Hierarchy
- **Primary**: `text-zinc-100` (#f4f4f5) — headings, card titles
- **Body**: `text-zinc-300` (#d4d4d8) — paragraph text, descriptions
- **Secondary**: `text-zinc-400` (#a1a1aa) — metadata, labels, secondary info
- **Muted**: `text-zinc-500` (#71717a) — timestamps, disabled, hints
- **Accent label**: `text-blue-400` — section labels, project numbers, icons

### Accent discipline rule
Blue (`#3B82F6` / `blue-400`/`blue-500`) appears for:
1. Section label spans (e.g. "About", "Work", "Credentials")
2. Project card index numbers
3. Primary CTA button
4. Bullet dots within expanded content

**Never use** multiple hue accents in a single view (no cyan + blue + emerald combinations).

---

## 3. Typography

**Font**: Inter (Google Fonts, variable) — loaded via `next/font/google`

| Role | Size | Weight | Letter Spacing | Line Height |
|---|---|---|---|---|
| Display / Hero | 72px (text-7xl) | 700 | -0.025em (`tracking-tight`) | 1.1 |
| Section heading | 48px (text-5xl) | 700 | -0.05em (`--heading-tracking`) | 1.1 |
| Card title | 18-20px | 700 | -0.05em | snug |
| Body paragraph | 16-18px | 400 | -0.02em (`--body-tracking`) | relaxed (1.625) |
| Section label | 12px | 600 | `tracking-widest` | — |
| Tech tag / badge | 12px | 500 | normal | — |

**CSS Variables (globals.css):**
```css
--heading-tracking: -0.05em;  /* applied to h1-h6 */
--body-tracking: -0.02em;     /* applied to body */
```

---

## 4. Component Patterns

### Section label
```tsx
<span className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4 block">
  Section Name
</span>
```

### Cards (dark surface)
- Background: `bg-zinc-900`
- Border: `border border-zinc-800` (maps to `rgba(255,255,255,0.08)` ring)
- Radius: `rounded-2xl`
- Hover: `hover:border-zinc-700 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]`
- Transition: `transition-all duration-200`

### Buttons (primary CTA)
- Uses `FlipButton` — blue front, dark back, spring flip on hover
- Social icon buttons: `rounded-full border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-all duration-200`

### Section nav
- Right-side dot navigation is a desktop/tablet affordance only.
- Hide below the `md` breakpoint to prevent overlap with hero text and mobile content.
- Preserve accessible `aria-label` values for every section button.

### Portfolio cards
- Project cards should expose the project name, short outcome/description, and top stack tags without requiring hover.
- Skill cards should group tools by category so the page remains useful without interacting with the orbital visualization.
- Testimonial cards should be static and scannable; avoid rendering repeated hidden carousel copies unless a carousel is explicitly required.

### Tech tags / badges
```tsx
<span className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
  Tag
</span>
```

---

## 5. Elevation / Depth System

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, `#09090b` bg | Page background |
| Surface | `bg-zinc-900` + `border border-zinc-800` | Cards, sections |
| Elevated | Surface + `shadow-[0_8px_24px_rgba(0,0,0,0.4)]` on hover | Hovered cards |
| Floating | `bg-zinc-900/80 backdrop-blur-sm border border-white/10` | Navigation pill |
| Ambient | `bg-blue-600/15 blur-[120px]` | Hero background glow |

**Shadow philosophy (from Linear + Cal.com):**
On dark surfaces, use background luminance stepping and ambient shadows rather than opaque drop-shadows. Keep shadow opacity ≤ 0.4.

---

## 6. Animation / Motion

**Library**: Framer Motion v12

| Pattern | Spec |
|---|---|
| Section entrance | `opacity: 0 → 1, y: 20-30 → 0`, `once: true` via `useInView` |
| Stagger delay | `0.05-0.1s` between items |
| Easing | `cubic-bezier(0.6, 0, 0.25, 1)` — `--ease-smooth` |
| Duration | `0.6-0.7s` for entrance, `0.2s` for hover transitions |
| Hero title cycle | Spring physics, `stiffness: 50`, interval: 2s |
| Nav pill | `layout` spring, `damping: 26, stiffness: 300` |
| Card expand | `height: 0 → auto, opacity: 0 → 1`, `0.35s` |

**Motion philosophy (from Framer + Linear):**
- Animations are purposeful, not decorative
- All entrance animations use `viewport: { once: true }` — never re-trigger on scroll back
- Hover transitions ≤ 200ms (snappy, not sluggish)
- Section-level entrance: 600-700ms (deliberate but not slow)

---

## 7. Layout

- **Max content width**: `max-w-4xl` (896px) for text sections, `max-w-5xl` (1024px) for grid sections
- **Section padding**: `py-24 md:py-32` (96px / 128px) — generous vertical breathing
- **Horizontal padding**: `px-6`
- **Grid**: Bento 3-col for projects (`grid-cols-3`) with variable `col-span`

---

## 8. Do's and Don'ts

### Do
- Use `text-zinc-300` for body paragraphs (not zinc-400 — too dim for long-form reading)
- Use single blue accent per section — max 3 blue elements visible at once
- Use shadow elevation on hover instead of just border color change
- Apply `transition-all duration-200` consistently on interactive elements
- Keep `once: true` on all `useInView` hooks — no re-animation on scroll back

### Don't
- Don't use multiple hue accents in one section (no cyan + blue + indigo arrays)
- Don't use `text-blue-500` for stat numbers or large display text — white (`text-zinc-100`) reads better at large sizes
- Don't add warm colors to the interface chrome (oranges, yellows, greens)
- Don't use blue-tinted gradients on dark cards — use neutral zinc gradients
- Don't remove `ssr: false` from `RadialOrbitalTimeline` — hydration mismatch will occur
- Don't add `bg-background` to page `<main>` — it blocks the `GlobalGrid` fixed background

---

## 9. Gotchas

See `CLAUDE.md` for all project-level gotchas. Key ones:
- `RadialOrbitalTimeline` requires `dynamic(() => ..., { ssr: false })`
- `Linkedin`/`Github` and other custom icons live in `components/ui/icons.tsx` — import from there, never redefine locally (lucide-react doesn't include them)
- Tailwind v4 uses `@import "tailwindcss"`, not `@tailwind` directives
- All content driven by `data/resume.json`
