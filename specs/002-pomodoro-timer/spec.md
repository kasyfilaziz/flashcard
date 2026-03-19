# Feature Specification: Pomodoro Focus Timer

**Feature Branch**: `002-pomodoro-timer`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: "A pomodoro/focus timer app that helps users maintain focus during study sessions. Uses the Pomodoro Technique (25 min work, 5 min break, with longer breaks after 4 cycles). Standalone app - no deck linking. Session must have a name with random default."

---

## User Scenarios & Testing

### User Story 1 - Start Focus Session (Priority: P1)

As a user, I want to start a timed focus session with a name so I can track what I'm working on.

**Why this priority**: Core functionality - users cannot use the app without this.

**Independent Test**: Can be tested by opening the app, seeing the session name input with random default, and starting a timer.

**Acceptance Scenarios**:

1. **Given** the Pomodoro app is open, **When** I see the start screen, **Then** there is a text field for session name with a random default value.
2. **Given** the session name field is shown, **When** I tap "Start Work", **Then** a 25-minute timer begins counting down and displays my session name.
3. **Given** the timer is running, **When** the time reaches zero, **Then** I receive a notification (sound and/or vibration per settings) and the app shows break options.
4. **Given** I'm on a work session, **When** I want to pause, **Then** I can pause and resume without losing progress.

---

### User Story 2 - Take Scheduled Breaks (Priority: P1)

As a user, I want to take scheduled breaks so I don't burn out during study.

**Why this priority**: Core Pomodoro functionality - without breaks this is just a timer, not a productivity system.

**Independent Test**: Can be tested by completing a work session and verifying break options appear correctly.

**Acceptance Scenarios**:

1. **Given** I complete a work session, **When** the timer ends, **Then** I see a 5-minute short break timer with "Start Break" option.
2. **Given** I complete 4 work sessions, **When** I start a break, **Then** I see a 15-minute long break option (instead of short break).
3. **Given** I'm on a break, **When** the break ends, **Then** the app returns to work session ready state with session name input.
4. **Given** I don't want to take a break yet, **When** I tap "Skip", **Then** the app moves directly to the next work session.

---

### User Story 3 - Track Focus Statistics (Priority: P2)

As a user, I want to see my focus statistics so I can track my productivity over time.

**Why this priority**: Important for motivation and tracking progress. Users need feedback on their consistency.

**Independent Test**: Can be tested by completing sessions and viewing stats to verify counts are accurate.

**Acceptance Scenarios**:

1. **Given** I've completed pomodoro sessions, **When** I open the stats view, **Then** I see total sessions completed today and this week.
2. **Given** I'm using the app daily, **When** I view my streak, **Then** I see how many consecutive days I've completed at least one work session.
3. **Given** I'm viewing the stats, **When** I see session history, **Then** each entry shows the session name, date, duration, and type.

---

### User Story 4 - Customize Timer Settings (Priority: P3)

As a user, I want to customize timer durations and notification preferences to fit my workflow.

**Why this priority**: Nice-to-have for power users who want to tweak the technique.

**Independent Test**: Can be tested by changing settings and verifying new sessions use the updated durations.

**Acceptance Scenarios**:

1. **Given** I'm in the settings screen, **When** I adjust work duration, **Then** the next work session uses the new duration.
2. **Given** I'm in the settings screen, **When** I toggle sound or vibration, **Then** notifications respect my preferences.
3. **Given** I'm in the settings screen, **When** I change sessions before long break, **Then** the long break triggers after the new count.

---

### Edge Cases

| Scenario | Handling |
|----------|----------|
| App is closed mid-session | Session is lost; user must start a new session |
| User changes duration settings mid-session | Current session uses old duration; next session uses new |
| Midnight occurs during a session | Stats split proportionally; session counts for start date |
| No sessions ever completed | Show empty state with encouragement to start first session |
| Session name left empty | Use random default name |
| Device is in silent mode | Sound may not play; vibration option helps as fallback |
| Wake lock not supported or denied | App continues working normally; timer may not prevent sleep |

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | The app MUST display a session name input field on the start screen with a random default name | P1 |
| FR-002 | Timer MUST support work mode (default 25 minutes) | P1 |
| FR-003 | Timer MUST support short break mode (default 5 minutes) | P1 |
| FR-004 | Timer MUST support long break mode (default 15 minutes) | P1 |
| FR-005 | Timer MUST emit sound notification when session completes | P1 |
| FR-006 | User MUST be able to enable/disable vibration notification in settings | P1 |
| FR-007 | User MUST be able to pause and resume the current session | P1 |
| FR-008 | User MUST be able to skip the current session and move to the next phase | P2 |
| FR-009 | App MUST count completed work sessions within current cycle | P1 |
| FR-010 | App MUST automatically offer long break after 4 completed work sessions | P1 |
| FR-011 | App MUST display daily session count on the main screen | P2 |
| FR-012 | App MUST display weekly session count in stats view | P2 |
| FR-013 | App MUST track and display focus streak (consecutive days with completed sessions) | P2 |
| FR-014 | User MUST be able to customize work duration (1-60 minutes) | P3 |
| FR-015 | User MUST be able to customize short break duration (1-30 minutes) | P3 |
| FR-016 | User MUST be able to customize long break duration (1-60 minutes) | P3 |
| FR-017 | User MUST be able to customize sessions before long break (1-10) | P3 |
| FR-018 | Session is considered "completed" only when timer runs to zero naturally | P1 |
| FR-019 | App MUST save all completed sessions to persistent storage | P2 |
| FR-020 | App MUST display session history showing name, date, duration, and type | P3 |
| FR-021 | App MUST prevent device from sleeping while timer is actively running | P1 |

---

## Success Criteria

### Measurable Outcomes

| ID | Criterion | Metric |
|----|-----------|--------|
| SC-001 | Users can start a focus session with a name within 3 taps | Tap count <= 3 |
| SC-002 | Timer countdown is accurate within 1 second over a full session | Accuracy >= 99.95% |
| SC-003 | Sound notification plays within 1 second of timer reaching zero | Latency <= 1s |
| SC-004 | Users can view their daily session count immediately upon opening the app | Time to view <= 2s |
| SC-005 | Focus streak increments correctly when user completes a session on consecutive days | 100% accuracy |
| SC-006 | Users can complete a full pomodoro cycle (work → break → work...) within 3 taps | Tap count <= 3 |
| SC-007 | Settings changes take effect on the next session (not current) | Behavioral requirement |
| SC-008 | Device remains awake during active timer (screen does not dim or lock) | Behavioral requirement |

---

## Key Entities

### FocusSession

| Field | Type | Description |
|-------|------|-------------|
| id | Auto-increment | Unique identifier |
| name | String | User-provided or random session name |
| startTime | Timestamp | When session started |
| endTime | Timestamp | When session ended |
| duration | Integer | Duration in seconds |
| type | Enum | 'work', 'short_break', 'long_break' |
| completed | Boolean | True if timer ran to completion |

### UserSettings

| Field | Type | Default |
|-------|------|---------|
| workDuration | Integer (minutes) | 25 |
| shortBreakDuration | Integer (minutes) | 5 |
| longBreakDuration | Integer (minutes) | 15 |
| sessionsBeforeLongBreak | Integer | 4 |
| soundEnabled | Boolean | true |
| vibrationEnabled | Boolean | false |

### DailyStats

| Field | Type | Description |
|-------|------|-------------|
| date | String (YYYY-MM-DD) | The date |
| completedSessions | Integer | Number of completed work sessions |
| totalFocusMinutes | Integer | Total focus time in minutes |

---

## Clarifications

### Session 2026-03-19

- Q: Weekly stats definition → A: Calendar week (Sunday to Saturday)
- Q: Data export → A: No export feature for Pomodoro (data remains local only)
- Q: Wake lock during breaks → A: Wake lock only during work sessions (not during breaks)
- Q: Sound on break completion → A: Sound plays on ALL session completions (work AND breaks)
- Q: Wake lock on pause → A: Release wake lock on pause, reacquire on resume
- Q: Daily session count location → A: Displayed on main screen (TimerView), not StatsView
- Q: Session saving timing → A: Sessions saved to IndexedDB immediately upon completion

## Assumptions

- Default durations (25/5/15) follow the standard Pomodoro Technique
- A session is "completed" only when the timer runs all the way to zero (not manually stopped early)
- Streak counts days where at least one work session was completed and ran to completion
- Random default session names follow pattern like "Session #7294"
- PWA background tab limitations may affect timer when app is not visible
- Sound notification is the primary alert mechanism; vibration is supplementary
- All sessions (work, short_break, long_break) are recorded in history
- Settings persist across app restarts
- Wake Lock API prevents device sleep during active timer; gracefully degrades if unsupported
- Weekly stats use calendar week (Sunday to Saturday)
