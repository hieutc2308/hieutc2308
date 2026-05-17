# Architecture Notes

## Modules

The app is organized around Next.js App Router routes under `src/app` and domain code under `src/features`.

- Portfolio home uses `src/features/portfolio/components` and `src/content/resume.json`.
- Project detail pages use `src/content/resume.json` plus `src/content/portfolio-projects.ts`.
- Places uses `src/features/places/components`, `src/features/places/services`, Supabase, Voyage embeddings, and Anthropic.

## Routes

- `/` renders the portfolio sections in order: Hero, About, Experience, TechMarquee, Skills, Projects, Testimonials, Certifications, Contact, Footer.
- `/places` renders a PIN-gated place finder.
- `/projects/[slug]` renders a reusable case-study template for slugs listed in `src/content/resume.json`.
- `/api/suggest` accepts a text query, embeds it, searches Supabase, and asks Anthropic to choose recommendations.
- `/api/verify-pin` validates the places PIN.

## Content

- `src/content/resume.json` is the main portfolio content source.
- `src/content/portfolio-projects.ts` contains project detail metadata and rendered folder paths.
- `content/projects/` stores editable project source material, notes, documents, screenshots, and repo references.
- `.tmp/saved-places/` is the default ignored local Google Takeout input folder used by `npm run import-places`.
- Set `LOCAL_SAVED_PLACES_DIR` to read place CSVs from another local folder.

## Environment Variables

```bash
ANTHROPIC_API_KEY=
VOYAGE_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PLACES_PIN=
```

`/places` and import scripts need real values. CI may use placeholder Supabase URL variables for portfolio-only checks.
