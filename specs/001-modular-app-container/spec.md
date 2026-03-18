# Feature Specification: Modular App Container

**Feature Branch**: `001-modular-app-container`  
**Created**: 2026-03-17  
**Status**: Draft  
**Input**: User description: "I want to create a modular version of this app. Currently the only focus of this project is flashcard app, I want to create something like a container so that new app can be added to this project without modifying core function. I want current app converted as an app inside a container app or main container or whatever you call it."

## User Scenarios & Testing

### User Story 1 - App Launcher (Priority: P1)

As a user, I want to see a central hub that shows all available brain workout apps, so I can select which app I want to use.

**Why this priority**: This is the primary navigation mechanism for the entire platform. Without it, users cannot access any brain workout apps.

**Independent Test**: Can be tested by launching the app and verifying all registered workout apps appear in the hub with proper icons and names.

**Acceptance Scenarios**:

1. **Given** the app is installed, **When** the user opens the app, **Then** the hub displays all available workout apps with their names and icons.
2. **Given** the hub is displayed, **When** the user clicks on a workout app, **Then** the selected app launches with its own UI and functionality.
3. **Given** multiple workout apps are installed, **When** the hub loads, **Then** each app appears as a distinct, tappable card.

---

### User Story 2 - Flashcard App Integration (Priority: P1)

As an existing flashcard user, I want the flashcard functionality to work exactly as before, but accessible through the new hub interface.

**Why this priority**: Preserves existing functionality while introducing the new container architecture. Critical for user retention.

**Independent Test**: Can be tested by launching flashcard app from hub, creating decks, adding cards, and completing a study session.

**Acceptance Scenarios**:

1. **Given** the flashcard app is registered, **When** user clicks flashcard from hub, **Then** the flashcard dashboard loads with deck list.
2. **Given** user is in flashcard app, **When** they create a new deck, **Then** the deck appears in the dashboard.
3. **Given** user completes a study session, **Then** the SM-2 scheduling is applied correctly and cards reappear based on the algorithm.

---

### User Story 3 - New App Registration (Priority: P2)

As a developer, I want to add a new brain workout app to the container without modifying the container's core code.

**Why this priority**: Enables the core value proposition of extensibility. New brain workouts can be added independently.

**Independent Test**: Can be tested by creating a minimal new app module, registering it, and verifying it appears in the hub.

**Acceptance Scenarios**:

1. **Given** a new app module follows the registration pattern, **When** the container loads, **Then** the new app automatically appears in the hub.
2. **Given** a new app has its own name and icon, **When** displayed in hub, **Then** the custom branding appears correctly.
3. **Given** a new app has its own routes and components, **When** clicked from hub, **Then** only that app's UI renders independently.

---

### User Story 4 - Shared Settings (Priority: P3)

As a user, I want common settings like theme and preferences to work across all brain workout apps.

**Why this priority**: Provides consistent user experience. Users shouldn't need to set dark mode separately for each app.

**Independent Test**: Can be tested by changing theme in one app and verifying it persists when switching to another app.

**Acceptance Scenarios**:

1. **Given** user sets dark mode in flashcard app, **When** they launch another app from hub, **Then** dark mode is applied.
2. **Given** user changes theme preference, **When** the container loads any app, **Then** the selected theme is applied immediately.

---

### Edge Cases

- What happens when a registered app has no cards/decks? (Show empty state, not error)
- What happens if app data is corrupted? (Graceful error with reset option)
- What happens when switching between apps? (Clean state transition, no data leakage)
- What happens when no apps are registered? (Show placeholder with instructions)

---

## Requirements

### Functional Requirements

- **FR-001**: The container app MUST display a hub screen showing all registered workout apps as selectable cards.
- **FR-002**: Each workout app MUST have a unique identifier, name, and icon for display in the hub.
- **FR-003**: Clicking a workout app from the hub MUST navigate to that app's UI without page reload.
- **FR-004**: The flashcard app MUST function identically to before when launched from the hub.
- **FR-005**: New workout apps MUST be addable by creating a new module in `src/apps/[app-id]/index.js` - auto-discovered by the container without manual registration.
- **FR-006**: Theme settings (dark/light mode) MUST persist across all apps in the container.
- **FR-007**: The container MUST maintain navigation state (last opened app) between sessions.
- **FR-008**: Each workout app MUST have isolated data storage that does not interfere with other apps.
- **FR-009**: Each workout app MUST export a migration function for data schema updates; container calls it when app version changes.
- **FR-010**: The hub MUST always display first on app launch, regardless of number of registered apps.

### Key Entities

- **Container**: The main wrapper app that provides hub navigation and shared services
- **WorkoutApp**: A registered brain training application with its own UI and data
- **AppRegistry**: Central configuration that lists all available workout apps
- **SharedStore**: Cross-app state for theme, preferences, and navigation

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can launch any registered app from the hub within 2 clicks.
- **SC-002**: Flashcard functionality remains fully functional with no regression in existing features.
- **SC-003**: New brain workout apps can be added by creating only app-specific files, without modifying container code.
- **SC-004**: Theme changes apply consistently across all apps within 100ms of toggle.
- **SC-005**: App switching shows a simple spinner during load; no maximum time limit (apps may have large data).

---

## Clarifications

### Session 2026-03-17

- Q: Should adding a new app require manual registration or use auto-discovery? → A: Auto-discovery - Developer creates `src/apps/[app-name]/index.js`, container automatically finds it
- Q: How should the container handle data migrations when a registered app is updated? → A: App-managed migration - Each app exports a migration function; container calls it on app load
- Q: When a user first launches the app with only one registered app, should they see the hub or go directly to the app? → A: Always show hub first - Users see available apps even with just one
- Q: How should the UI behave while switching between apps? → A: Show simple spinner for any loading; no time limit - apps may have larger data to load

## Assumptions

- The container will use a simple URL-based routing (hash or query params) for app switching
- App modules will be JavaScript/ES modules that export a standard interface
- Each app will have its own IndexedDB object store prefix to isolate data
- The container will provide shared utilities for theme, navigation, and persistence
