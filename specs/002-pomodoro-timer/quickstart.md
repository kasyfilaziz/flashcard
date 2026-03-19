# Quickstart: Adding a New Brain Workout App

**Feature**: Pomodoro Focus Timer  
**Pattern**: Modular App Container

---

## Overview

The Brain Workouts platform uses a modular architecture where each workout type (flashcard, pomodoro, etc.) is a self-contained app module. This quickstart explains how to add a new app following the established pattern.

---

## Pomodoro App Structure

```text
src/apps/pomodoro/
├── index.js             # App registration & metadata
├── App.svelte           # Root component (optional wrapper)
├── components/
│   ├── TimerView.svelte # Main timer UI
│   ├── StatsView.svelte # Statistics display
│   └── SettingsView.svelte # User settings
└── stores/
    └── pomodoro.js      # State management
```

---

## Step-by-Step: Creating a New App

### Step 1: Create App Directory

```bash
mkdir -p src/apps/[app-name]/components
mkdir -p src/apps/[app-name]/stores
```

### Step 2: Create App Registration (index.js)

```javascript
// src/apps/[app-name]/index.js
export default {
  id: '[app-name]',
  name: 'App Display Name',
  version: '1.0.0',
  componentLoader: () => import('./App.svelte')
};

export async function migrate(fromVersion) {
  // Handle data migrations when version changes
  // Called automatically by container on version mismatch
}
```

### Step 3: Create Root Component (App.svelte)

```svelte
<script>
  import TimerView from './components/TimerView.svelte';
  import StatsView from './components/StatsView.svelte';
  // ... other imports
  
  let currentView = 'timer'; // or use store-based navigation
</script>

<div class="app-container">
  {#if currentView === 'timer'}
    <TimerView />
  {:else if currentView === 'stats'}
    <StatsView />
  {/if}
  
  <!-- Bottom navigation -->
  <nav>...</nav>
</div>
```

### Step 4: Create Stores (State Management)

```javascript
// src/apps/[app-name]/stores/app.js
import { writable, derived } from 'svelte/store';
import { dbPromise } from '../../../lib/utils/db';

const PREFIX = '[app-name]_';

export const state = writable('idle');
export const sessions = writable([]);

export async function loadSessions() {
  const db = await dbPromise;
  const all = await db.getAll(`${PREFIX}sessions`);
  sessions.set(all);
}
```

### Step 5: Register in Hub

The container auto-discovers apps via `import.meta.glob('../../apps/*/index.js')`. No manual registration needed if index.js is properly exported.

---

## Pomodoro App Specifics

### Timer Logic

```javascript
// Timer runs on 1-second interval
// Store start timestamp for accuracy
// On complete: mark session, play sound, transition state

let startTime = Date.now();
let remaining = workDuration * 60; // seconds

const interval = setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  remaining = (workDuration * 60) - elapsed;
  if (remaining <= 0) {
    completeSession();
    clearInterval(interval);
  }
}, 1000);
```

### Session Name Generation

```javascript
function generateRandomName() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `Session #${num}`;
}
```

### Notification Sound

```javascript
// Use Web Audio API for reliable sound
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
oscillator.frequency.value = 800;
gainNode.gain.value = 0.5;
oscillator.start();
oscillator.stop(audioContext.currentTime + 0.3);
```

### Vibration

```javascript
if (settings.vibrationEnabled && navigator.vibrate) {
  navigator.vibrate([200, 100, 200]);
}
```

### Wake Lock (Prevent Device Sleep)

```javascript
let wakeLock = null;

async function acquireWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock acquired');
    } catch (err) {
      console.error('Wake Lock failed:', err);
    }
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

// Call acquireWakeLock() when timer starts
// Call releaseWakeLock() when timer pauses/completes/skips
```

---

## Testing Your App

1. **Start dev server**: `npm run dev`
2. **Open browser**: Navigate to localhost
3. **Check Hub**: New app should appear automatically
4. **Click to launch**: App loads in container

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.svelte` | Container wrapper with Hub |
| `src/lib/stores/apps.js` | App registry & auto-discovery |
| `src/lib/stores/navigation.js` | Container navigation |
| `src/lib/utils/db.js` | IndexedDB utilities |
| `src/lib/stores/theme.js` | Shared theme store |

---

## Data Isolation

Each app uses its own IndexedDB store prefix:

| App | Prefix |
|-----|--------|
| Flashcard | `flashcard_` |
| Pomodoro | `pomodoro_` |

This ensures data never conflicts between apps.

---

## Common Patterns

### Loading Data on Mount

```javascript
import { onMount } from 'svelte';

onMount(async () => {
  await loadSessions();
  await loadSettings();
});
```

### Settings Persistence

```javascript
export async function saveSettings(settings) {
  const db = await dbPromise;
  await db.put('pomodoro_settings', { key: 'pomodoro_settings', ...settings });
}
```

### Computing Derived Stats

```javascript
export const dailyStats = derived(sessions, ($sessions) => {
  const today = new Date().toISOString().split('T')[0];
  return $sessions.filter(s => 
    s.completed && 
    s.type === 'work' && 
    s.date === today
  ).length;
});
```
