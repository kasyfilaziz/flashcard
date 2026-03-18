# Flashcard App Constitution

## Core Principles

### I. Local-First Data Architecture
All application data MUST be stored locally using IndexedDB. The application MUST function completely offline without any network dependency. No backend server is required or permitted for data storage.

**Rationale**: User data privacy and offline accessibility are core to the app's purpose. Local-first ensures data ownership remains with the user.

### II. Static Deployment Only
The application MUST be deployable as a static site with zero server-side processing. All functionality MUST execute client-side in the browser.

**Rationale**: Simplifies deployment, reduces infrastructure cost, and ensures the app can be hosted on any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

### III. Progressive Web App (PWA)
The application MUST meet PWA installability criteria including service worker registration, web app manifest, and offline functionality.

**Rationale**: Provides native-like mobile experience with home screen installation, offline access, and reliable performance.

### IV. Extensible Brain Workout Platform
The architecture MUST support multiple brain training modalities beyond flashcards. New workout types MUST integrate without modifying core infrastructure.

**Rationale**: Future-proofs the app for brain workout expansion (memory games, mental math, pattern recognition, etc.) while maintaining code organization.

### V. Data Portability
Users MUST be able to export all their data in standard formats (JSON, CSV). Import functionality MUST support these same formats with validation.

**Rationale**: Ensures user data ownership - users can backup, migrate, or leave the platform with their data.

## Technology Constraints

- **Framework**: Svelte 4.x (stable release only)
- **Storage**: IndexedDB via idb library only
- **Styling**: TailwindCSS
- **Build**: Vite 4.x
- **PWA**: vite-plugin-pwa
- **No External APIs**: All processing happens locally

## App Architecture

### Directory Structure
```
src/
  lib/
    components/     # UI components organized by feature
    stores/         # Svelte stores for state management
    utils/          # Pure utility functions (SM-2, DB, export)
  App.svelte        # Root component
  main.js           # Entry point
```

### Data Layer
- IndexedDB schema MUST be versioned for migrations
- Each brain workout type MUST have isolated data stores
- Shared utilities (SM-2 algorithm) MUST be reusable across workouts

### Component Guidelines
- Components MUST be mobile-first responsive
- Dark/Light theme MUST be persisted in IndexedDB
- All interactive elements MUST have haptic feedback on mobile devices

## Governance

### Amendment Procedure
1. Any principle modification requires a version bump following semantic versioning
2. MAJOR: Backward incompatible architectural changes (e.g., changing storage mechanism)
3. MINOR: New brain workout type integrations or significant new capabilities
4. PATCH: Clarifications, wording fixes, non-semantic refinements

### Compliance Review
- All features MUST verify offline functionality before merge
- Data export/import MUST be tested for each new workout type
- PWA validation MUST pass ( Lighthouse score > 90 )

### Documentation Requirements
- README.md MUST contain current tech stack and setup instructions
- Feature specifications MUST follow spec-template.md format
- Each brain workout type MUST have dedicated documentation

**Version**: 1.0.0 | **Ratified**: 2026-03-17 | **Last Amended**: 2026-03-17
