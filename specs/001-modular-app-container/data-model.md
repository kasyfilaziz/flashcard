# Data Model: Modular App Container

## Core Entities

### AppRegistry

Central configuration listing all available workout apps.

| Field | Type | Description |
|-------|------|-------------|
| apps | Array<AppDefinition> | List of registered workout apps |

### AppDefinition

Configuration for a single workout app.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (e.g., 'flashcard', 'memory') |
| name | String | Display name shown in hub |
| icon | String | Icon identifier for hub display |
| description | String | Brief description for hub |
| version | String | App version for compatibility |
| routes | Object | Route definitions for the app |
| component | SvelteComponent | Main app component (runtime) |
| migrate | Function | Migration function (FR-009): `migrate(oldVersion) => Promise<void>` |

### Navigation State

Tracks current app and navigation history.

| Field | Type | Description |
|-------|------|-------------|
| currentAppId | String\|null | Currently active app ID |
| previousAppId | String\|null | Previously active app ID |
| appHistory | Array<String> | Navigation stack for back button |

### Shared Settings

User preferences shared across all apps.

| Field | Type | Description |
|-------|------|-------------|
| theme | 'light' \| 'dark' | Current theme |
| hapticEnabled | Boolean | Haptic feedback preference |
| lastOpenedApp | String | App to open on next launch |

---

## Existing Entities (Flashcard App)

These remain unchanged but will be moved to app-specific stores.

### Deck

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (UUID) |
| name | String | Deck name |
| createdAt | Number | Timestamp |
| updatedAt | Number | Timestamp |

### Card

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (UUID) |
| deckId | String | Parent deck ID |
| front | String | Question/prompt |
| back | String | Answer |
| easeFactor | Number | SM-2 ease factor (default 2.5) |
| interval | Number | Days until next review |
| nextReview | Number | Timestamp for next review |
| reviewCount | Number | Total review count |
| createdAt | Number | Timestamp |
| updatedAt | Number | Timestamp |

---

## Relationships

```
AppRegistry (global)
    └── defines: AppDefinition (1:N)
                    
NavigationState (global)
    └── references: AppDefinition.id (1:1 current)
                    
SharedSettings (global)
    └── stores: user preferences
                    
AppDefinition (per app)
    └── owns: App-specific stores (e.g., Deck, Card)
```

---

## Data Flow

1. **App Launch**: Container loads → reads `lastOpenedApp` → navigates to that app (or hub)
2. **App Switch**: User clicks app card → NavigationState updates → Container renders new app component
3. **Theme Change**: User toggles theme → SharedSettings updates → All apps react via store subscription
4. **Data Access**: Each app accesses its own IndexedDB stores with app-specific prefixes
