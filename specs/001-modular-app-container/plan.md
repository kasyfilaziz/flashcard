# Implementation Plan: Modular App Container

**Branch**: `001-modular-app-container` | **Date**: 2026-03-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-modular-app-container/spec.md`

## Summary

Transform the existing flashcard app into a modular container platform where the flashcard app becomes the first registered "workout app". The container provides a hub UI for app selection, shared services (theme, navigation), and an auto-discovery pattern that detects new apps from folder structure without manual registration.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Svelte 4.x  
**Primary Dependencies**: Svelte 4.x, TailwindCSS 3.x, idb 8.x, vite-plugin-pwa  
**Storage**: IndexedDB via idb library (local-first)  
**Testing**: No test framework currently configured  
**Target Platform**: Web browser (PWA-capable, mobile-first)  
**Project Type**: Single-page web application  
**Performance Goals**: Theme toggle <100ms, initial load <2s  
**Constraints**: Offline-first, static deployment only, no backend server, spinner for any app loading  
**Scale/Scope**: Single user, local storage, up to 10 workout apps  

## Clarifications Incorporated

From spec clarifications (2026-03-17):
- Auto-discovery: Apps in `src/apps/[app-id]/index.js` auto-detected
- Migration: Each app exports migration function, container calls on version change
- Hub first: Always shows hub on launch regardless of registered app count
- Loading: Simple spinner shown during app switching (no time limit)

## Constitution Check

| Constitution Principle | Status | Notes |
|------------------------|--------|-------|
| Local-First Data Architecture | ✅ PASS | All data stored in IndexedDB via idb |
| Static Deployment Only | ✅ PASS | Built with Vite as static site |
| Progressive Web App | ✅ PASS | Uses vite-plugin-pwa |
| Extensible Brain Workout Platform | ✅ PASS | Auto-discovery pattern enables extensibility |
| Data Portability | ✅ PASS | Existing JSON/CSV import/export preserved |
| App Migration | ✅ PASS | Each app manages own migrations |

**Gate Result**: All constitutional gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-modular-app-container/
├── plan.md              # This file
├── research.md          # Phase 0 output (research on modular patterns)
├── data-model.md        # Phase 1 output (entity definitions)
├── quickstart.md        # Phase 1 output (developer guide)
├── contracts/           # Phase 1 output (app interface contracts)
│   └── app-contract.md  # Workout app registration interface
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── main.js                    # Entry point (unchanged)
├── App.svelte                 # Root component → becomes container
├── app.css                    # Global styles
├── lib/
│   ├── components/            # Shared UI components
│   │   ├── Hub.svelte         # NEW: App launcher hub
│   │   ├── AppCard.svelte     # NEW: Hub app card
│   │   └── LoadingSpinner.svelte # NEW: Simple spinner for app loading
│   ├── stores/                # Shared stores
│   │   ├── apps.js            # NEW: App registry with auto-discovery
│   │   ├── navigation.js      # NEW: Container navigation store
│   │   ├── theme.js           # EXISTING: Theme store
│   │   └── settings.js        # EXISTING: Settings store
│   └── utils/
│       ├── db.js              # EXISTING: DB utilities
│       ├── sm2.js             # EXISTING: SM-2 algorithm
│       └── export.js          # EXISTING: Import/export
└── apps/
    └── flashcard/              # NEW: Flashcard app module
        ├── index.js           # App registration & exports (includes migrate function)
        ├── stores/            # App-specific stores
        │   ├── decks.js       # EXISTING: Deck store
        │   └── flashcards.js  # EXISTING: Flashcard store
        └── components/        # EXISTING: All flashcard UI components
```

**Structure Decision**: Reorganize from flat component structure to `apps/` directory where each workout app is a self-contained module. Container auto-discovers apps from `src/apps/*/index.js`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations. The modular structure follows the constitution's "Extensible Brain Workout Platform" principle.

---

## Phase 0: Research Complete ✅

Research documented in [research.md](./research.md):
- Modular architecture pattern decision (component-based with auto-discovery)
- Data isolation strategy (IndexedDB store prefixes per app)
- Shared services scope (theme, navigation, settings)
- App registration pattern (auto-discovery via folder conventions)

---

## Phase 1: Design Complete ✅

Generated artifacts:
- [data-model.md](./data-model.md) - Entity definitions
- [contracts/app-contract.md](./contracts/app-contract.md) - App interface contract
- [quickstart.md](./quickstart.md) - Developer onboarding guide

---

## Next Steps

Run `/speckit.tasks` to generate implementation tasks from this plan.
