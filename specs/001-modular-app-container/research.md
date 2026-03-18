# Research: Modular App Container

## Decision: Modular App Architecture Pattern

### What was chosen
Svelte component-based modular architecture with:
- Central app registry (JavaScript module)
- Standardized app interface (export object with id, name, icon, component)
- URL-based routing (hash-based for simplicity and PWA compatibility)

### Rationale
- Svelte's component system naturally supports lazy loading
- ES modules provide clean dependency injection
- Hash routing (#/app-id) works reliably offline without server configuration
- Registry pattern is simple to understand and extend

### Alternatives considered

1. **Dynamic import() with file system scanning**
   - Rejected: Requires build-time code generation or server-side scanning
   - Not suitable for static deployment

2. **JSON config file for app registry**
   - Rejected: Requires manual config updates
   - Registry pattern via JS modules allows runtime discovery

3. **iFrame-based app isolation**
   - Rejected: Heavyweight, poor UX
   - Svelte component composition is cleaner

---

## Decision: Data Isolation Strategy

### What was chosen
IndexedDB object store prefix per app:
- Flashcard app: stores `flashcard_decks`, `flashcard_cards`
- New app: stores `{appId}_*` (e.g., `memory_cards`, `math_problems`)

### Rationale
- Simple prefix-based naming prevents collisions
- Each app can manage its own schema version
- No complex migration coordination needed
- Follows constitution's "isolated data stores" requirement

### Alternatives considered

1. **Separate IndexedDB databases per app**
   - Rejected: Browser limits on DB count (Chrome: ~20)
   - Prefix approach scales to many apps

2. **Shared database with app_id foreign key**
   - Rejected: Increases complexity, no isolation
   - Prefix provides clean separation

---

## Decision: Shared Services Scope

### What was chosen
Container provides:
- Theme (dark/light mode)
- Navigation state (current app, history)
- User preferences (persisted settings)
- Shared utilities (export/import)

Container does NOT provide:
- Authentication (not needed for local-first app)
- Network layer (offline-only)
- Cross-app data sharing (each app isolated)

### Rationale
- Minimal shared surface reduces coupling
- Apps remain independently testable
- Follows constitution's principle of extensibility

---

## Decision: App Registration Pattern

### What was chosen
Auto-discovery via folder conventions (clarified 2026-03-17):

- Container scans `src/apps/*/index.js` at runtime
- Each app exports a standard registration object
- No manual registration required

```javascript
// src/apps/flashcard/index.js
export default {
  id: 'flashcard',
  name: 'Flashcards',
  icon: 'cards',
  version: '1.0.0',
  // ...
};
```

### Rationale
- Developers simply create a new folder to add an app
- No need to modify any central registry file
- Follows constitution's "Extensible Brain Workout Platform" principle

### Clarification Resolution
- **Before**: Manual registration in central file
- **After**: Auto-discovery from folder structure

---

## Decision: App Migration Strategy

### What was chosen
App-managed migration (clarified 2026-03-17):

- Each app exports a `migrate(oldVersion)` function
- Container calls migration on app load when version changes
- Apps handle their own schema updates

```javascript
// In app index.js
export const migrate = async (oldVersion) => {
  if (oldVersion < 2) {
    // Run migration from v1 to v2
  }
};
```

### Rationale
- Each app knows its own data structure
- Container doesn't need to understand app-specific schemas
- Follows principle of isolation between apps
