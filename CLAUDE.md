# Hieu Portfolio — Project Brief

## Documentation Update Rule

Whenever changes are made that affect project structure, architecture, or developer guidance, update the relevant docs **in the same session** before finishing:

- **`CLAUDE.md`** — new/removed components, changed file paths, new gotchas, updated tech stack, new env vars
- **`.claude/` rules** (e.g. `design-system.md`, `design-matching.md`) — changes to design tokens, patterns, or component conventions
- **`README.md`** — if it exists and the change affects setup, deployment, or feature overview

Do not wait until asked. If a change touches `components/`, `lib/`, `app/`, or `package.json` in a meaningful way, check these files and update them proactively.

---

## What This Is

A personal webapp with two modules:
1. **`/` — Work Portfolio**: Dark-mode animated portfolio showcasing Tran Chi Hieu's BI/Data career
2. **`/places` — AI Place Suggester**: Natural-language search through Google Maps saved places, powered by Gemini + Supabase

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.2.3 (App Router) + TypeScript | |
| Styling | Tailwind CSS v4 | Uses `@import "tailwindcss"` — NOT `@tailwind` directives |
| Animations | Framer Motion v12 | |
| UI Components | shadcn (Nova preset, Tailwind v4 mode) + custom 21st.dev components | |
| Database | Supabase | Stores Google Maps saved places |
| AI | Anthropic Claude via `@anthropic-ai/sdk` | |
| Deployment | Vercel | |

---

## Project Structure

```
app/
  layout.tsx           ← Inter font, AnimatedNav, GlobalGrid + FloatingParticles (global bg layers)
  page.tsx             ← Portfolio home: Hero → About → Skills → Projects → Certifications → Footer
  globals.css          ← Tailwind v4 imports, CSS variables, dark design tokens
  places/
    page.tsx           ← AI place suggester UI (server component, no bg-background on main)
  api/suggest/
    route.ts           ← POST: query → Supabase places → Gemini → suggestions JSON

components/
  ui/
    global-grid.tsx          ← Fixed scrolling grid bg (position:fixed, covers ALL pages)
    section-nav.tsx          ← Fixed right-side dot section navigator with IntersectionObserver
    navigation-menu.tsx      ← Collapse-to-pill nav on scroll (AnimatedNav)
    animated-hero.tsx        ← Rotating title words with spring physics
    border-glow-button.tsx   ← Animated glow CTA button (used in Hero)
    flip-button.tsx          ← Flip animation CTA button
    radial-orbital-timeline.tsx  ← Skills orbital widget (loaded with ssr:false — see gotchas)
    hyper-text-paragraph.tsx ← Interactive highlighted text with hover pill; supports paragraphs prop
    text-reveal.tsx          ← Scroll-based word-by-word opacity reveal
    icons.tsx                ← Shared SVG icons: GithubIcon, LinkedinIcon, GmailIcon, NextIcon, TailwindIcon, VercelIcon
    badge.tsx, button.tsx, card.tsx  ← shadcn primitives
    chatgpt-prompt-input.tsx ← Places search textarea
  portfolio/
    Hero.tsx           ← Full-viewport hero; plasma glow blobs (right top + left bottom); no bg-background on section
    About.tsx          ← Two-column: HyperTextParagraph text (left), animated stat cards (right)
    Skills.tsx         ← Radial orbital timeline (dynamic import, ssr:false)
    Projects.tsx       ← Bento 3-col grid (colSpans=[2,1,1,2,3]), expandable cards
    Certifications.tsx ← 3 cert cards + education row, gradient card backgrounds
    Footer.tsx         ← Name, LinkedIn + GitHub icons, link to /places
  places/
    PlaceSearch.tsx    ← Search input + triggers API call
    PlaceCard.tsx      ← Individual place result card

data/
  resume.json          ← SOURCE OF TRUTH for all portfolio content (projects, skills, certs, education)

lib/
  supabase.ts          ← Lazy client init (getSupabaseClient / createServerClient)
  claude.ts            ← Anthropic Claude API client (server-only)
  places.ts            ← searchPlacesByEmbedding() + normalizePlaces() + detectLocationPattern() from Supabase
  utils.ts             ← cn() (clsx + tailwind-merge) + hexToRgba() helpers
```

---

## Design System

**Always dark mode.** No light mode toggle.

| Token | Value |
|---|---|
| Background | `#09090b` (zinc-950) |
| Surface / cards | `#18181b` (zinc-900) |
| Surface elevated | `#27272a` (zinc-800) |
| Border | `rgba(255,255,255,0.08)` |
| Text primary | `#fafafa` |
| Text secondary | `#a1a1aa` (zinc-400) |
| Text muted | `#71717a` (zinc-500) |
| **Accent** | `#3B82F6` (blue-500) — used for highlights, CTAs, labels |
| Font | Inter (next/font/google) |
| Easing | `cubic-bezier(0.6, 0, 0.25, 1)` — used throughout |
| Card radius | `rounded-2xl` |

CSS variables live in `app/globals.css`. Key ones: `--primary: #3B82F6`, `--ring: #3B82F6`.

**Section label pattern**: small `text-xs font-semibold text-blue-400 uppercase tracking-widest` span above each `h2`.

---

## Page Structure (`/`)

Section order (top → bottom):
1. **Hero** — full viewport, rotating title ("BI Developer" / "Data Analyst" / "Power BI Expert"), mouse-wheel scroll indicator, LinkedIn + GitHub icons (LinkedIn first)
2. **About** — `id="about"`, text slides from left, stats from right
3. **Skills** — `id="skills"`, radial orbital timeline
4. **Projects** — `id="projects"`, bento 3-col grid
5. **Certifications** — `id="certifications"`, 3 cards + education row
6. **Footer**

Section nav dots (right side, `SectionNav`): About → Skills → Projects → Testimonials → Certs → Contact

---

## Global Background

`GlobalGrid` is rendered in `app/layout.tsx` — it applies to **every page** including `/places`. It is `position: fixed, z-0, pointer-events-none`. Two layers: faint base grid (opacity 0.04) + mouse-spotlight brighter grid (opacity 0.30, masked by radial-gradient at cursor position).

**Important:** Any page `<main>` must NOT have `bg-background` or it will block the fixed grid. The `body` in layout already sets the background color.

---

## Known Gotchas & Decisions

### 1. RadialOrbitalTimeline — SSR disabled
`Skills.tsx` uses `dynamic(() => import(...), { ssr: false })` for the orbital component. This is required because `Math.cos`/`Math.sin` produce different float precision on server vs client, causing React hydration mismatches. Do not remove the `dynamic` import.

### 2. Supabase — lazy client init
`lib/supabase.ts` uses lazy factory functions (`getSupabaseClient()`, `createServerClient()`) instead of eagerly calling `createClient()` at module level. This prevents build-time crashes when env vars aren't present.

### 3. API route — force dynamic
`app/api/suggest/route.ts` has `export const dynamic = "force-dynamic"` at the top to prevent Next.js from trying to statically render the route at build time (which would fail without env vars).

### 4. Tailwind v4 syntax
CSS uses `@import "tailwindcss"` not `@tailwind base/components/utilities`. Shadcn was initialized with `--css-variables` in Tailwind v4 mode.

### 5. lucide-react — no Linkedin/Github icons
`Linkedin` and `Github` icons don't exist in lucide-react. All custom SVG icons (`LinkedinIcon`, `GithubIcon`, `GmailIcon`, `NextIcon`, `TailwindIcon`, `VercelIcon`) live in `components/ui/icons.tsx` — import from there, do not redefine locally.

### 6. Framer Motion Variants type errors
All `type:` values in transition objects need `as const` (e.g. `"spring" as const`) to satisfy TypeScript.

### 7. chatgpt-prompt-input.tsx — onSubmit conflict
Uses `Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit">` to avoid type conflict with the custom `onSubmit` prop.

---

## Environment Variables

```
# .env.local
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Supabase Schema

```sql
create table places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  note text,
  google_maps_url text,
  tags text,
  comment text,
  list_name text,
  created_at timestamptz default now()
);
```

Data sourced from Google Maps Takeout (CSV files, one per saved list).

---

## Owner

**Tran Chi Hieu** — BI Developer / Data Analyst, Hanoi, Vietnam
- LinkedIn: https://www.linkedin.com/in/hieutc2308/
- GitHub: https://github.com/hieutc
- All portfolio content is driven by `data/resume.json` — edit that file to update projects, skills, certifications, or education.
