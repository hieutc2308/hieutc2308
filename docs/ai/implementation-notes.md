# Implementation Notes

## Next.js

- Application code lives under `src/`; root files are mostly configuration and docs.
- `src/app/globals.css` uses Tailwind v4 with `@import "tailwindcss"`.
- Do not add `bg-background` to page-level `<main>` elements because `GlobalGrid` is fixed behind all pages.
- `/api/suggest` and `/api/verify-pin` are dynamic routes and should not depend on build-time secrets.

## Imports

- `@/*` resolves to `src/*`.
- Shared UI imports use `@/shared/ui/...`.
- Shared utilities use `@/shared/lib/...`.
- Portfolio components use `@/features/portfolio/components/...`.
- Places components and services use `@/features/places/...`.

## Known Constraints

- `RadialOrbitalTimeline` can be sensitive to hydration and animation state; verify Skills after navigation changes.
- Supabase client creation should remain lazy enough that builds can run with placeholder env values.
- `lucide-react` does not provide all brand icons used by the app; use `src/shared/ui/icons.tsx`.
- Framer Motion transition `type` values may need literal typing if type errors appear.

## Testing

- Functional tests cover route behavior, navigation, back-button restoration, and places/project flows.
- Visual snapshots are environment-sensitive; scrollbar stabilization lives in visual specs.
- Update snapshots only when intended rendered output changes.
- Playwright writes local output under `.tmp/playwright/`.
- Private import inputs belong under `.tmp/saved-places/` or an external `LOCAL_SAVED_PLACES_DIR`.
