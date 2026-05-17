# Design System

## Theme

The product is always dark mode. The visual language is a restrained executive portfolio: near-black canvas, zinc surfaces, a single blue accent, high readability, and controlled motion.

## Tokens

| Role | Value |
| --- | --- |
| Background | `#09090b` |
| Card | `#18181b` |
| Elevated surface | `#27272a` |
| Border | `rgba(255,255,255,0.08)` |
| Primary text | `#fafafa` |
| Secondary text | `#a1a1aa` |
| Muted text | `#71717a` |
| Accent | `#3B82F6` |
| Font | Inter via `next/font/google` |

## Component Conventions

- Use `text-zinc-300` for long-form body copy.
- Use blue only for section labels, primary CTAs, project numbers, and focused interactive accents.
- Keep cards on neutral zinc surfaces; avoid multi-hue gradients.
- Keep section spacing at `py-24 md:py-32` unless a specific layout requires otherwise.
- Use shared icons from `src/shared/ui/icons.tsx` for GitHub, LinkedIn, Gmail, Next.js, Tailwind, and Vercel.
- Use `rounded-2xl` for major cards and `rounded-full` for pills/icon buttons.
- Keep section content near `max-w-6xl`; use narrower measures only for long text.
- Hide section navigation below `md` so mobile hero/content is not crowded.
- Keep tech tags as small neutral zinc pills with subtle borders.
- Do not add `bg-background` to page-level `<main>` elements; it blocks the fixed global grid.

## Motion

- Framer Motion section entrances should be purposeful and one-time.
- Avoid hiding SSR content behind client-only animation state.
- Keep hover transitions short, usually `duration-200`.
- Preserve accessibility labels for navigation controls and icon links.
