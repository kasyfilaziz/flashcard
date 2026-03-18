# Workout App Contract

## Interface Definition

Every workout app MUST export a standard registration object to be recognized by the container.

### Required Export

```javascript
// src/apps/[app-name]/index.js
export default {
  // Unique identifier (lowercase, no spaces)
  id: 'flashcard',
  
  // Display name in hub
  name: 'Flashcards',
  
  // Icon name (from available icon set)
  icon: 'cards',
  
  // Brief description for hub
  description: 'Spaced repetition flashcards',
  
  // Semantic version (used for migration)
  version: '1.0.0',
  
  // App-specific stores
  stores: {
    // Store factory functions
  },
  
  // Routes this app handles
  routes: {
    '': 'Dashboard',        // Default route
    'study/:deckId': 'Study',
    'deck/:deckId': 'DeckView'
  },

  // Main Svelte component
  component: null // To be set by importing the component
};

// REQUIRED: Migration function (FR-009)
// Called when app version changes
export const migrate = async (oldVersion) => {
  // oldVersion is the version string from previous session
  // Perform necessary data migrations here
  // Example:
  // if (oldVersion === '1.0.0') {
  //   // Migrate from 1.0.0 to 2.0.0
  // }
};
```

**Auto-Discovery**: Apps are auto-discovered from `src/apps/*/index.js`. Simply create a new folder with an `index.js` exporting the above to add a new app.

### Optional Exports

```javascript
// Lifecycle hooks (optional)
export const onAppMount = (containerServices) => {
  // Called when app becomes active
  // containerServices: { theme, navigation, settings }
};

export const onAppUnmount = (containerServices) => {
  // Called when app becomes inactive
};

// Export data for container backup
export const exportData = async () => {
  return { /* app-specific data */ };
};

// Import data from container restore
export const importData = async (data) => {
  // Restore app data
};
```

### Icon Set

Available icons for hub display:
- `cards` - Flashcard/deck icon
- `brain` - Brain training icon
- `memory` - Memory game icon
- `math` - Mental math icon
- `puzzle` - Pattern recognition icon
- `plus` - Add new app placeholder

---

## Container Services

Container provides these services to registered apps:

| Service | Description | API |
|---------|-------------|-----|
| theme | Theme management | `subscribe(callback)`, `toggle()`, `set('dark'\|'light')` |
| navigation | App navigation | `navigate(appId, route)`, `goBack()`, `currentRoute` |
| settings | User preferences | `get(key)`, `set(key, value)` |
| db | Database access | `getStore(prefix)`, `getAll(store)`, `put(store, item)` |

### Usage Example

```javascript
import { theme, navigation, settings, db } from '../../container.js';

// Subscribe to theme changes
theme.subscribe(value => {
  // Apply theme to app UI
});

// Navigate to another app
navigation.navigate('memory');

// Access app-specific data
const decks = await db.getAll('flashcard_decks');
```

---

## Data Isolation

Each app MUST use a unique prefix for its IndexedDB stores:

| App | Store Prefix | Example Stores |
|-----|--------------|----------------|
| Flashcard | `flashcard_` | `flashcard_decks`, `flashcard_cards` |
| Memory Game | `memory_` | `memory_games`, `memory_scores` |
| Math Trainer | `math_` | `math_problems`, `math_stats` |

This ensures data isolation between apps without complex coordination.
