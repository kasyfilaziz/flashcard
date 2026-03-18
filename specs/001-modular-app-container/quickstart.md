# Quickstart: Adding a New Brain Workout App

This guide explains how to add a new brain training app to the container platform.

## Prerequisites

- Node.js 18+
- npm installed
- Basic knowledge of Svelte

## Step 1: Create App Directory

Create a new directory under `src/apps/`:

```bash
mkdir src/apps/memory
```

## Step 2: Create App Registration

Create `src/apps/memory/index.js`:

```javascript
export default {
  id: 'memory',
  name: 'Memory Match',
  icon: 'memory',
  description: 'Train your memory with card matching',
  version: '1.0.0',
  
  stores: {
    // App-specific stores
  },
  
  routes: {
    '': 'MemoryDashboard',
    'play/:level': 'MemoryGame'
  }
};

// Migration function - called when version changes
export const migrate = async (oldVersion) => {
  // Add migration logic here when needed
};
```

**That's it!** The app will automatically appear in the hub. No manual registration needed (auto-discovery).

## Step 3: Create App Components

Create your app's Svelte components in `src/apps/memory/components/`.

## Step 4: Implement Data Stores

Use the app-specific prefix for IndexedDB:

```javascript
// Use 'memory_' prefix for all stores
const STORE_NAME = 'memory_games';
const PREFIX = 'memory_';
```

## Step 5: Test Your App

Run the development server:

```bash
npm run dev
```

Open the app - your new app should appear in the hub alongside Flashcards.

---

## App Template

```
src/apps/[app-name]/
├── index.js           # App registration (REQUIRED) - includes migrate function
├── stores/
│   └── [app]-store.js # App-specific state
└── components/
    ├── [App]Dashboard.svelte
    ├── [App]Game.svelte
    └── [App]Card.svelte
```

---

## Available Icons

When registering your app, choose from:
- `cards` - Flashcards
- `brain` - General brain training
- `memory` - Memory games
- `math` - Math/numbers
- `puzzle` - Patterns/puzzles

---

## Container Services

Access shared services via import:

```javascript
import { theme, navigation, settings, db } from '../../container.js';
```

See [contracts/app-contract.md](./contracts/app-contract.md) for full API.
