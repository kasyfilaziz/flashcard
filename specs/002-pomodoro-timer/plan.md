# Implementation Plan: Pomodoro Focus Timer

**Branch**: `002-pomodoro-timer` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-pomodoro-timer/spec.md`

## Summary

A standalone Pomodoro Focus Timer app that helps users maintain focus during study sessions. Uses the standard Pomodoro Technique (25 min work, 5 min break, 15 min long break after 4 cycles). Session names are required with random defaults. Timer runs client-side with sound/vibration notifications and tracks focus statistics including streak.

## Technical Context

**Language/Version**: JavaScript (ES Modules)  
**Primary Dependencies**: Svelte 4.x, idb 8.x (IndexedDB), TailwindCSS 3.x  
**Storage**: IndexedDB via idb library (per constitution)  
**Testing**: No formal test framework configured  
**Target Platform**: Web PWA (mobile-first)  
**Project Type**: Svelte Web Application (modular app container pattern)  
**Performance Goals**: Timer accuracy within 1 second over 25-minute session  
**Constraints**: Must work offline, must follow modular container pattern, must persist settings  
**Scale/Scope**: Single user, sessions stored locally

## Constitution Check

| Gate | Status | Notes |
|------|--------|-------|
| Local-First Data (I) | PASS | IndexedDB storage per app prefix `pomodoro_` |
| Static Deployment (II) | PASS | Pure client-side, no server requirements |
| PWA Requirements (III) | PASS | Uses existing vite-plugin-pwa infrastructure |
| Extensible Architecture (IV) | PASS | Follows modular app container pattern |
| Data Portability (V) | PASS | Sessions can be exported to JSON |
| Svelte 4.x (Tech) | PASS | Using existing framework |
| IndexedDB via idb (Tech) | PASS | Using existing db.js utility |
| TailwindCSS (Tech) | PASS | Using existing styling approach |
| Modular App Structure | PASS | Fits `src/apps/pomodoro/` pattern |

## Project Structure

### Documentation (this feature)

```text
specs/002-pomodoro-timer/
├── plan.md              # This file
├── research.md          # (not needed - no unknowns)
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # (not applicable - no external interfaces)
└── checklists/
    └── requirements.md  # Already created
```

### Source Code (repository root)

```text
src/apps/pomodoro/
├── index.js             # App registration (auto-discovered)
├── App.svelte           # Root component
├── components/
│   ├── TimerView.svelte # Main timer UI
│   ├── StatsView.svelte # Statistics view
│   └── SettingsView.svelte # Settings view
├── stores/
│   └── pomodoro.js      # Timer state, sessions, settings
└── utils/
    └── notifications.js # Sound/vibration utilities
```

### Structure Decision

Following the established modular app container pattern from `001-modular-app-container`. Each brain workout app lives in `src/apps/[app-id]/` with its own components, stores, and utilities. The container provides Hub navigation, theme, and shared infrastructure.

### Source Code Tree (Actual)

```text
src/
├── apps/
│   ├── flashcard/        # Existing
│   │   ├── index.js
│   │   ├── App.svelte
│   │   ├── components/
│   │   └── stores/
│   └── pomodoro/        # NEW - Pomodoro app
│       ├── index.js
│       ├── App.svelte
│       ├── components/
│       │   ├── TimerView.svelte
│       │   ├── StatsView.svelte
│       │   └── SettingsView.svelte
│       └── stores/
│           └── pomodoro.js
└── lib/
    ├── components/      # Shared container components
    │   └── Hub.svelte
    └── stores/
        └── theme.js     # Shared theme store
```

## Phase 0: Research

No research needed - all technical decisions are already defined by the constitution and existing implementation patterns.

## Phase 1: Design

### Data Model

Based on spec Key Entities:

```javascript
// IndexedDB stores (prefix: pomodoro_)
{
  sessions: {
    id: autoIncrement,
    name: string,           // FR-001
    startTime: timestamp,
    endTime: timestamp,
    duration: number,        // seconds
    type: 'work' | 'short_break' | 'long_break',
    completed: boolean       // FR-018
  },
  settings: {
    key: string,             // 'pomodoro_settings'
    workDuration: number,    // FR-014 (1-60 min)
    shortBreakDuration: number, // FR-015 (1-30 min)
    longBreakDuration: number,   // FR-016 (1-60 min)
    sessionsBeforeLongBreak: number, // FR-017 (1-10)
    soundEnabled: boolean,   // FR-006
    vibrationEnabled: boolean // FR-006
  }
}
```

**Derived/Denormalized for performance:**

```javascript
// Daily stats (computed from sessions)
{
  date: string,             // YYYY-MM-DD
  completedSessions: number, // Count of completed work sessions
  totalFocusMinutes: number  // Sum of work session durations
}
```

### State Machine

Timer states:

```
IDLE → WORK → (short_break | long_break) → IDLE
  ↑                                       ↓
  └───────────── (skip) ──────────────────┘
```

- **IDLE**: Ready to start, shows session name input
- **WORK**: Timer running (25 min default)
- **SHORT_BREAK**: Break timer (5 min default)
- **LONG_BREAK**: Long break timer (15 min default, after 4 sessions)

Transitions:
- IDLE + Start → WORK
- WORK + complete → (sessionCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK)
- WORK + skip → (sessionCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK)
- SHORT_BREAK + complete → IDLE (new cycle)
- LONG_BREAK + complete → IDLE (new cycle)
- ANY + skip → next state

### UI Layout

Three main views accessible via bottom navigation or tabs:

1. **Timer View** (default): Session name input, timer display, start/pause/skip controls
2. **Stats View**: Daily count, weekly count, streak, session history
3. **Settings View**: Duration sliders, notification toggles

## Quick Reference

### Key Implementation Notes

1. **Timer Accuracy**: Use `setInterval` with 1-second ticks, store start timestamp for accuracy check
2. **Notifications**: Web Audio API for sound, Navigator.vibrate() for haptic
3. **Wake Lock**: Use Wake Lock API to prevent device sleep during active timer; release when paused/completed
4. **Streak Calculation**: Compare dates of completed sessions, count consecutive days
5. **Session Completion**: Only mark `completed=true` if timer ran to zero (not skipped)
6. **Random Session Name**: Generate "Session #" + 4-digit random number

### Dependencies to Add

None - using existing dependencies only (svelte, tailwind, idb, vite-plugin-pwa)

### Files to Create

| File | Purpose |
|------|---------|
| `src/apps/pomodoro/index.js` | App registration, version, migrate |
| `src/apps/pomodoro/App.svelte` | Container with tab navigation |
| `src/apps/pomodoro/stores/pomodoro.js` | All state management |
| `src/apps/pomodoro/components/TimerView.svelte` | Main timer UI |
| `src/apps/pomodoro/components/StatsView.svelte` | Statistics display |
| `src/apps/pomodoro/components/SettingsView.svelte` | Settings form |
| `src/apps/pomodoro/utils/notifications.js` | Sound/vibration helpers |

### Validation Checklist

Before implementation complete:
- [ ] Timer counts down accurately
- [ ] Sound plays on completion
- [ ] Pause/resume works correctly
- [ ] Session count increments properly
- [ ] Long break triggers after 4 sessions
- [ ] Streak calculates correctly
- [ ] Settings persist across restarts
- [ ] Offline functionality works
- [ ] Wake lock prevents device sleep during active timer
