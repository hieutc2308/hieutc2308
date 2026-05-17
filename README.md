# Hieu Portfolio

Personal Next.js portfolio for Tran Chi Hieu with two modules:

- `/` - animated BI/Data portfolio
- `/places` - private AI place finder powered by saved places, Supabase, Voyage embeddings, and Anthropic

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase
- Anthropic SDK + Voyage embeddings
- Playwright functional and visual tests

## Structure

```text
src/
  app/              Next.js routes, layouts, API handlers, global CSS
  content/          Runtime content imported by the app
  features/         Domain-specific UI and services
  shared/           Shared UI primitives and utilities
content/projects/  Editable case-study source material
docs/ai/           Agent-facing architecture and implementation guidance
tests/             Playwright functional and visual suites
scripts/           Data import and embedding utilities
.tmp/              Ignored local workspace for private inputs and generated artifacts
```

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` when running `/places` or import scripts:

```bash
ANTHROPIC_API_KEY=
VOYAGE_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PLACES_PIN=
```

Portfolio pages build without real keys, but Next build expects Supabase URL variables to exist in CI.

## Scripts

```bash
npm run lint
npm run build
npm test
npm run test:visual
npm run import-places
npm run generate-embeddings
```

## Local Data

Place-import CSVs are local private data. Put Google Maps Takeout CSVs in:

```text
.tmp/saved-places/
```

Or set `LOCAL_SAVED_PLACES_DIR=/absolute/path/to/csv-folder` before running `npm run import-places`.

## Agent Notes

Use `AGENTS.md` for the current development workflow and `docs/ai/` for deeper architecture, design, and implementation guidance.
