# Data Model: Pomodoro Focus Timer

**Feature**: `002-pomodoro-timer`  
**Based on**: [spec.md](./spec.md)

---

## Entity Definitions

### FocusSession

Represents a single Pomodoro session (work or break).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Auto-increment | Primary key | Unique identifier |
| name | String | Max 100 chars | User-provided or random "Session #XXXX" |
| startTime | Timestamp | Required | Unix timestamp when session started |
| endTime | Timestamp | Nullable | Unix timestamp when session ended |
| duration | Integer | Seconds | Configured duration for this session |
| type | Enum | 'work', 'short_break', 'long_break' | Session type |
| completed | Boolean | Default: false | True only if timer ran to zero |

**Validation Rules:**
- `name` must not be empty (use random default if user leaves blank)
- `duration` must be positive
- `type` must be one of the three valid values
- `completed` is false if session was skipped or in-progress

---

### UserSettings

User preferences for timer behavior.

| Field | Type | Default | Constraints |
|-------|------|---------|-------------||
| workDuration | Integer | 25 | 1-60 minutes |
| shortBreakDuration | Integer | 5 | 1-30 minutes |
| longBreakDuration | Integer | 15 | 1-60 minutes |
| sessionsBeforeLongBreak | Integer | 4 | 1-10 sessions |
| soundEnabled | Boolean | true | - |
| vibrationEnabled | Boolean | false | - |

**Validation Rules:**
- All duration fields must be within specified ranges
- Sound/vibration can be independently toggled

---

### DailyStats

Aggregated daily statistics (derived from FocusSession queries).

| Field | Type | Description |
|-------|------|-------------|
| date | String | YYYY-MM-DD format |
| completedSessions | Integer | Count of completed work sessions |
| totalFocusMinutes | Integer | Sum of all work session durations |

**Note**: This is a denormalized view for performance. It can be computed from FocusSession queries but is stored for quick dashboard access.

---

## State Machine

### Timer States

```
┌───────┐    Start    ┌─────────┐   Complete   ┌──────────────┐
│ IDLE  │ ─────────► │  WORK   │ ───────────► │ SHORT_BREAK  │
└───────┘            └─────────┘              └──────────────┘
    ▲                     │                         │
    │                     │ Skip                    │ Skip
    │                     ▼                         ▼
    │                 ┌─────────┐              ┌───────────┐
    └─────────────────│  SKIP   │◄─────────────│  SKIP     │
                      └─────────┘              └───────────┘

After 4 work sessions → LONG_BREAK (15 min) instead of SHORT_BREAK (5 min)
```

### State Definitions

| State | Description | Display |
|-------|-------------|---------|
| IDLE | No active session, showing name input | Session name field, Start button |
| WORK | Timer counting down (default 25 min) | Timer display, Pause/Skip buttons |
| SHORT_BREAK | Break timer (default 5 min) | Timer display, Skip button |
| LONG_BREAK | Long break after 4 sessions (default 15 min) | Timer display, Skip button |

### Transition Rules

| From | Event | To | Side Effects |
|------|-------|----|--------------|
| IDLE | User taps Start | WORK | Start timer, save session startTime |
| WORK | Timer reaches 0 | SHORT_BREAK or LONG_BREAK | Mark session completed=true, play sound |
| WORK | User taps Skip | NEXT_BREAK | Increment session count, don't mark complete |
| SHORT_BREAK | Timer reaches 0 | IDLE | Reset cycle, new session ready |
| LONG_BREAK | Timer reaches 0 | IDLE | Reset session count to 0 |
| ANY | User taps Pause | PAUSED | Stop interval, keep state |
| PAUSED | User taps Resume | PREVIOUS_STATE | Resume interval |

---

## IndexedDB Schema

**Database**: `flashcard_db` (shared with other apps)  
**Prefix**: `pomodoro_`  
**Version**: 1 (initial)

### Object Stores

```javascript
// Store: pomodoro_sessions
{
  keyPath: 'id',
  autoIncrement: true,
  indexes: [
    { name: 'by-date', keyPath: 'date' },      // For stats queries
    { name: 'by-type', keyPath: 'type' },       // Filter by session type
    { name: 'by-completed', keyPath: 'completed' } // Filter completed only
  ]
}

// Store: pomodoro_settings
{
  keyPath: 'key',
  data: { key: 'pomodoro_settings', ...fields }
}
```

---

## Relationships

- FocusSession is independent (no foreign keys)
- DailyStats is derived from FocusSession (no direct relationship)

---

## Assumptions

1. All timestamps stored as Unix milliseconds
2. Dates stored as YYYY-MM-DD strings for easy grouping
3. Sessions table is append-only (no updates, only inserts)
4. Settings always has exactly one record with key='pomodoro_settings'
