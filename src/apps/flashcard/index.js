export default {
  id: 'flashcard',
  name: 'Flashcards',
  icon: 'cards',
  description: 'Spaced repetition flashcards',
  version: '1.0.0',
  
  // Registration: we'll handle component loading dynamically or via registry later
  
  routes: {
    '': 'Dashboard',
    'study/:deckId': 'Study',
    'deck/:deckId': 'DeckView'
  }
};

export const migrate = async (oldVersion) => {
  // Placeholder for future migration logic
  console.log(`Flashcard app migrating from ${oldVersion}`);
};
