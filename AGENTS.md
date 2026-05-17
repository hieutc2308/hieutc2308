# Agent Guidance

## Purpose

This is a personal web app for Tran Chi Hieu. It has two user-facing modules:

- `/` - BI/Data portfolio homepage with animated sections and project case-study links.
- `/places` - private AI place finder using saved Google Maps places.

## Working Rules

- Preserve behavior during structural refactors unless the user explicitly asks for product changes.
- Keep changes surgical: do not redesign UI, alter copy, or remove features while doing architecture cleanup.
- Update docs in the same change when structure, paths, env vars, or workflows change.
- Treat `src/content/resume.json` as the source of truth for portfolio content.
- Treat `content/projects/` as the source workspace for project case-study material.

## Current Structure

- `src/app/` - Next.js App Router routes, layouts, API routes, and `globals.css`.
- `src/features/portfolio/` - portfolio-specific components.
- `src/features/places/` - places-specific UI, services, and types.
- `src/shared/ui/` - reusable UI primitives and shared visual components.
- `src/shared/lib/` - generic utilities.
- `src/content/` - runtime content imported by app code.
- `docs/ai/` - architecture, design-system, and implementation notes for agents.

## Development Checks

Run the narrowest useful checks while iterating, then before completion run:

```bash
npm run lint
npm run build
npm test
```

Run `npm run test:visual` when UI, layout, animation, or screenshot baselines may be affected.

## Key References

- `docs/ai/architecture.md` - routes, data flow, env vars, and module boundaries.
- `docs/ai/design-system.md` - visual tokens and UI conventions.
- `docs/ai/implementation-notes.md` - Next.js, Tailwind, Framer Motion, and testing gotchas.
