---

description: "Task list for Pomodoro Focus Timer implementation"
---

# Tasks: Pomodoro Focus Timer

**Input**: Design documents from `/specs/002-pomodoro-timer/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Source code**: `src/` at repository root
- **Container components**: `src/lib/components/`
- **Container stores**: `src/lib/stores/`
- **App modules**: `src/apps/[app-id]/`
- **Pomodoro app**: `src/apps/pomodoro/`

---

## Phase 1: Setup (Reorganization)

**Purpose**: Create pomodoro app directory structure

- [x] T001 [P] Create `src/apps/pomodoro/` directory structure
- [x] T002 [P] Create `src/apps/pomodoro/components/` directory
- [x] T003 [P] Create `src/apps/pomodoro/stores/` directory
- [x] T004 [P] Create `src/apps/pomodoro/utils/` directory

---

## Phase 2: Foundational (App Registration & Infrastructure)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create app registration in `src/apps/pomodoro/index.js`
- [x] T006 [P] Create IndexedDB schema with indexes (pomodor_sessions with by-date, by-type, by-completed; pomodoro_settings) in `src/apps/pomodoro/stores/pomodoro.js`
- [x] T007 [P] Create notification utilities (sound via Web Audio API, vibration via Navigator.vibrate) in `src/apps/pomodoro/utils/notifications.js`
- [x] T008 Create Pomodoro app root component `src/apps/pomodoro/App.svelte` with tab navigation
- [x] T009 [P] Initialize default settings (25/5/15/4/sound ON/vibration OFF) on first app load in `src/apps/pomodoro/stores/pomodoro.js`
- [x] T010 [P] Implement session persistence (save completed sessions to IndexedDB) in `src/apps/pomodoro/stores/pomodoro.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Start Focus Session (Priority: P1)

**Goal**: Users can start a timed focus session with a name

**Independent Test**: Open app → See session name input with random default → Start timer → Timer counts down

### Implementation for User Story 1

- [x] T011 [P] [US1] Create TimerView component `src/apps/pomodoro/components/TimerView.svelte`
- [x] T012 [US1] Implement session name input with random default generation ("Session #XXXX") in TimerView
- [x] T013 [US1] Implement daily session count display on main screen (TimerView) per FR-011
- [x] T014 [US1] Implement timer countdown logic with 1-second interval in `src/apps/pomodoro/stores/pomodoro.js`
- [x] T015 [US1] Implement pause/resume functionality in TimerView and store
- [x] T016 [US1] Release wake lock when timer is paused
- [x] T017 [US1] Reacquire wake lock when timer resumes from pause
- [x] T018 [US1] Connect timer display to show MM:SS format
- [x] T019 [US1] Implement sound notification on ALL session completions (work AND breaks) in `src/apps/pomodoro/utils/notifications.js`
- [x] T020 [US1] Acquire wake lock when work timer starts (only during work sessions, not breaks)

**Checkpoint**: User Story 1 complete - timer starts, counts down, pauses, resumes, sounds on complete, wake lock active

---

## Phase 4: User Story 2 - Take Scheduled Breaks (Priority: P1)

**Goal**: Users complete work session and take appropriate break

**Independent Test**: Complete work session → Short break appears → Complete 4 sessions → Long break appears

### Implementation for User Story 2

- [x] T021 [P] [US2] Implement state machine transitions in `src/apps/pomodoro/stores/pomodoro.js`
- [x] T022 [US2] Implement short break timer (5 min default) and display
- [x] T023 [US2] Implement long break timer (15 min) triggered after configured number of sessions
- [x] T024 [US2] Implement skip button to move to next phase
- [x] T025 [US2] Implement session counter tracking completed work sessions
- [x] T026 [US2] Implement vibration notification on session completion (all types)

**Checkpoint**: User Story 2 complete - full pomodoro cycle works (work → break → work)

---

## Phase 5: User Story 3 - Track Focus Statistics (Priority: P2)

**Goal**: Users can view their focus statistics and history

**Independent Test**: Complete sessions → View stats → See weekly count, streak, history

### Implementation for User Story 3

- [x] T027 [P] [US3] Create StatsView component `src/apps/pomodoro/components/StatsView.svelte`
- [x] T028 [US3] Implement weekly session count (calendar week Sunday-Saturday)
- [x] T029 [US3] Implement focus streak calculation (consecutive days with completed sessions)
- [x] T030 [US3] Implement session history list with name, date, duration, type

**Checkpoint**: User Story 3 complete - stats view shows weekly count, streak, history (daily count already in TimerView per US1)

---

## Phase 6: User Story 4 - Customize Timer Settings (Priority: P3)

**Goal**: Users can customize durations and notification preferences

**Independent Test**: Change settings → Start new session → Verify new durations used

### Implementation for User Story 4

- [x] T031 [P] [US4] Create SettingsView component `src/apps/pomodoro/components/SettingsView.svelte`
- [x] T032 [US4] Implement work duration slider (1-60 minutes)
- [x] T033 [US4] Implement short break duration slider (1-30 minutes)
- [x] T034 [US4] Implement long break duration slider (1-60 minutes)
- [x] T035 [US4] Implement sessions before long break setting (1-10)
- [x] T036 [US4] Implement sound enabled toggle
- [x] T037 [US4] Implement vibration enabled toggle
- [x] T038 [US4] Persist settings changes to IndexedDB

**Checkpoint**: User Story 4 complete - all settings customizable and persisted

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and edge case handling

- [x] T039 [P] Add empty state UI when no sessions completed
- [x] T040 [P] Handle wake lock API unsupported gracefully (app continues working normally)
- [x] T041 [P] Verify PWA functionality works with new app
- [x] T042 Run `npm run build` to ensure production build succeeds
- [x] T043 Update Hub icon if custom icon needed for Pomodoro app (optional)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase
  - US1 (Start Session): P1 priority
  - US2 (Scheduled Breaks): P1 priority, depends on US1
  - US3 (Statistics): P2 priority, depends on US1, US2
  - US4 (Settings): P3 priority, independent

### Within Each User Story

- Components before integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T001, T002, T003, T004)
- All Foundational tasks marked [P] can run in parallel (T005, T006, T007, T009, T010)
- US1 tasks marked [P] can run in parallel (T011)
- US2 tasks marked [P] can run in parallel (T021)
- US3 tasks marked [P] can run in parallel (T027)
- US4 tasks marked [P] can run in parallel (T031)

---

## Parallel Example: User Story 1

```bash
# Launch all implementation for User Story 1 together:
Task: "Create TimerView component"
Task: "Implement session name input"
Task: "Implement daily session count on main screen"
Task: "Implement timer countdown logic"
Task: "Implement pause/resume with wake lock"
Task: "Implement sound notification"

# Then after above complete:
Task: "Connect timer to display"
Task: "Finalize state transitions"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Start Session)
4. **STOP and VALIDATE**: Test timer starts, counts down, pause/resume works
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Timer works → Deploy/Demo
3. Add User Story 2 → Breaks work → Deploy/Demo
4. Add User Story 3 → Stats work → Deploy/Demo
5. Add User Story 4 → Settings work → Deploy/Demo

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Wake lock: Only during work sessions, not during breaks
- Wake lock: Released on pause, reacquired on resume
- Sound: Plays on ALL session completions (work AND breaks)
- Daily count: Displayed on main screen (TimerView), not StatsView

---

## Task Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Phase 1: Setup | 4 | Directory structure |
| Phase 2: Foundational | 6 | App registration, infrastructure, session persistence |
| Phase 3: US1 | 10 | Start Focus Session |
| Phase 4: US2 | 6 | Take Scheduled Breaks |
| Phase 5: US3 | 4 | Track Focus Statistics |
| Phase 6: US4 | 8 | Customize Settings |
| Phase 7: Polish | 5 | Final improvements |
| **Total** | **43** | |

---

## Fixes Applied (from re-scan 2026-03-19)

| # | Issue | Fix Applied |
|---|-------|-------------|
| 1 | Daily count location | Moved T013 to US1 TimerView (per FR-011) |
| 2 | Session saving placement | Moved T010 to Phase 2 as foundational |
| 3 | Wake lock on pause | Added T016 (release), T017 (reacquire) |
| 4 | Sound on break end | T019 now "ALL session completions" |
| 5 | IndexedDB schema | T006 expanded with indexes |
| 6 | Default settings init | Added T009 in Phase 2 |
