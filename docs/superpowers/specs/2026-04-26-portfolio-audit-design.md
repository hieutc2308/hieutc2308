# Portfolio Audit & Design System — Implementation Design

**Date:** 2026-04-26  
**Approach:** Code-first (bugs → dead code → location gaps), then DESIGN.md creation and validation

---

## 1. Bug Fixes

### 1.1 Stale metadata in `places/page.tsx`
- **File:** `app/places/page.tsx`, line 9
- **Change:** Update metadata `description` from "Powered by Gemini AI" to "Powered by Claude"
- **Why:** The app migrated from Gemini to Claude (commit `3b23929`). The metadata was never updated.

### 1.2 Missing error handling in `verify-pin/route.ts`
- **File:** `app/api/verify-pin/route.ts`
- **Change:** Wrap `request.json()` in try/catch. Return `400` with `{ error: "Invalid request body" }` on parse failure.
- **Why:** Malformed JSON body currently causes an unhandled rejection and a 500 with no useful error message.

### 1.3 Outdated CLAUDE.md section nav docs
- **File:** `CLAUDE.md`
- **Change:** Update section nav from 4 dots (About → Skills → Projects → Certs) to 6 (About → Skills → Projects → Testimonials → Certs → Contact)
- **Why:** Testimonials and Contact sections were added but docs never updated.

---

## 2. Dead Code Removal

### 2.1 Unused `PlaceCard` component in `PlaceCard.tsx`
- **File:** `components/places/PlaceCard.tsx`
- **Change:** Delete the `PlaceCard` function export. Keep only the `PlaceSuggestion` interface.
- **Why:** `ResultCarousel.tsx` renders its own internal card. `PlaceSearch.tsx` imports only the `PlaceSuggestion` type. The component export is never rendered anywhere.

### 2.2 Unused `getAllPlaces()` in `lib/places.ts`
- **File:** `lib/places.ts`
- **Change:** Remove the `getAllPlaces()` function and its unused import of `createServerClient` if it becomes the sole caller.
- **Why:** No API route, component, or script calls `getAllPlaces()`. Only `searchPlacesByEmbedding()` is used in the suggest route.

---

## 3. Missing Location Patterns

- **File:** `lib/places.ts`, `LOCATION_MAP` array
- **Change:** Add 5 new entries:

| City | Keywords | Pattern |
|---|---|---|
| Hải Phòng | "hải phòng", "hai phong" | `"hoa phượng"` |
| Huế | "huế", "hue" | `"huế"` |
| Ninh Bình | "ninh bình", "ninh binh" | `"ninh bình"` |
| Sapa | "sapa", "sa pa" | `"sapa"` |
| Quảng Bình | "quảng bình", "quang binh" | `"quảng bình"` |

- **Why:** These cities all have saved list data but the location detector ignores queries mentioning them, so AI suggestions aren't filtered to the right city.

---

## 4. DESIGN.md Creation & Validation

### 4.1 Create `.claude/DESIGN.md`
- Source tokens from `.claude/rules/design-system.md`
- Format: YAML frontmatter (colors, typography, spacing, rounded, components) + markdown prose sections
- Sections: Overview, Colors, Typography, Layout, Components, Do's and Don'ts

### 4.2 Lint and fix
- Run `npx @google/design.md lint .claude/DESIGN.md`
- Fix any errors (broken refs, structural issues) and warnings (contrast, orphaned tokens, missing sections)

---

## Execution Order

1. Fix metadata bug (`places/page.tsx`)
2. Fix error handling (`verify-pin/route.ts`)
3. Update CLAUDE.md docs
4. Remove `PlaceCard` component
5. Remove `getAllPlaces()`
6. Add missing location patterns to `LOCATION_MAP`
7. Create `.claude/DESIGN.md`
8. Run linter and fix findings
