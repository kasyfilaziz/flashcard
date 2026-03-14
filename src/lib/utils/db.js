import { openDB } from 'idb';

const DB_NAME = 'flashcard_db';
const DB_VERSION = 2;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains('decks')) {
        const deckStore = db.createObjectStore('decks', { keyPath: 'id', autoIncrement: true });
        deckStore.createIndex('by-name', 'name');
      }
      
      if (!db.objectStoreNames.contains('cards')) {
        const cardStore = db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true });
        cardStore.createIndex('by-deckId', 'deckId');
        cardStore.createIndex('by-nextReview', 'nextReview');
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
}

export const dbPromise = initDB();
