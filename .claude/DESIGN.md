---
name: Tran Chi Hieu Portfolio
description: Dark-mode personal portfolio for a BI Developer & Data Analyst. Single blue accent on near-black zinc canvas.
version: alpha
colors:
  primary: "#3B82F6"
  background: "#09090b"
  surface: "#18181b"
  elevated: "#27272a"
  foreground: "#fafafa"
  muted: "#a1a1aa"
  subtle: "#71717a"
typography:
  display:
    fontFamily: Inter
    fontSize: 4.5rem
    fontWeight: 700
  h1:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: 700
  h2:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
  label:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 600
rounded:
  sm: 8px
  md: 12px
  lg: 16px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: 12px 24px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  badge:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
  section-label:
    backgroundColor: "transparent"
    textColor: "#60a5fa"
    rounded: "{rounded.sm}"
---

## Overview

Dark-mode-native portfolio. The canvas is zinc-950 (`#09090b`) — deep but not pure black, with a cool undertone. Content surfaces through subtle luminance stepping. A single accent color (blue-500 `#3B82F6`) is used sparingly for primary labels, CTAs, and interactive highlights. The overall impression is precision-built: compressed headings, generous section spacing, and shadow-based elevation.

Always dark mode. No light mode toggle.

## Colors

The palette is rooted in cool near-black zinc with a single blue accent.

- **Primary (`#3B82F6`):** Blue-500 — used exclusively for section labels, primary CTAs, and interactive highlights. Never used for large text or decorative purposes.
- **Background (`#09090b`):** Zinc-950 — the base canvas. Not pure black; the cool undertone prevents harshness.
- **Surface (`#18181b`):** Zinc-900 — card backgrounds and section surfaces.
- **Elevated (`#27272a`):** Zinc-800 — hover states and elevated UI elements.
- **Foreground (`#fafafa`):** Near-white primary text — headings and key content.
- **Muted (`#a1a1aa`):** Zinc-400 — secondary text, metadata, labels.
- **Subtle (`#71717a`):** Zinc-500 — timestamps, hints, de-emphasized content.

Border color is `rgba(255,255,255,0.08)` — a translucent white ring rather than an opaque border.

## Typography

Font: **Inter** (Google Fonts, variable) loaded via `next/font/google`.

Heading letter-spacing: `--heading-tracking: -0.05em`. Body letter-spacing: `--body-tracking: -0.02em`. These are applied via CSS custom properties in `app/globals.css`.

- **Display (4.5rem, 700):** Hero headline — rotating job titles
- **H1 (3rem, 700):** Page-level headings
- **H2 (2rem, 700):** Section headings — About, Skills, Projects, etc.
- **Body-lg (1.125rem, 400):** Long-form paragraph text
- **Body (1rem, 400):** Standard UI text, card descriptions
- **Label (0.75rem, 600, uppercase, tracking-widest):** Section label spans above each h2

## Layout

Max content width: `max-w-4xl` (896px) for text sections, `max-w-5xl` (1024px) for grid sections. Horizontal padding: `px-6`. Section vertical padding: `py-24 md:py-32` (96px / 128px).

Page sections (top to bottom): Hero → About → TechMarquee → Skills → Projects → Testimonials → Certifications → Contact → Footer.

The `GlobalGrid` background is fixed-position and covers all pages. Page `<main>` elements must not have `bg-background` or they will block it.

## Components

- **button-primary:** Blue-500 background, white text, 8px radius, 12px 24px padding. Uses the `FlipButton` component with spring animation on hover.
- **card:** Zinc-900 background, `border border-zinc-800`, `rounded-2xl` (16px). Hover: `hover:border-zinc-700 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]`.
- **badge:** Zinc-800 background, zinc-300 text, `rounded-full`, `px-3 py-1.5`. Used for tech tags.
- **section-label:** Transparent background, blue-400 text (`#60a5fa`), `text-xs font-semibold uppercase tracking-widest`. Appears above each section h2.

## Do's and Don'ts

Use `text-zinc-300` for body paragraphs (not zinc-400 — too dim). Use a single blue accent per section — maximum 3 blue elements visible at once. Apply `transition-all duration-200` consistently on interactive elements. Keep `once: true` on all `useInView` hooks — no re-animation on scroll back.

Do not use multiple hue accents in one section. Do not use `text-blue-500` for large display text — white reads better at large sizes. Do not add warm colors (orange, yellow, green) to the interface chrome. Do not add `bg-background` to page `<main>` — it blocks the GlobalGrid fixed background.
