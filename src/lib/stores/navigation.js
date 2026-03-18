import { writable } from 'svelte/store';

function createNavigationStore() {
  const { subscribe, set, update } = writable({
    currentAppId: null, // null means Hub
    previousAppId: null,
    history: []
  });

  function navigateTo(appId) {
    update(state => {
      if (state.currentAppId === appId) return state;
      
      const newHistory = [...state.history];
      if (state.currentAppId) {
        newHistory.push(state.currentAppId);
      }

      // Persist last opened app
      if (appId) {
        localStorage.setItem('lastOpenedApp', appId);
      } else {
        localStorage.removeItem('lastOpenedApp');
      }

      return {
        currentAppId: appId,
        previousAppId: state.currentAppId,
        history: newHistory
      };
    });
    
    // Update hash for deep linking (basic)
    window.location.hash = appId ? `#/${appId}` : '';
  }

  function goBack() {
    update(state => {
      if (state.history.length === 0) {
        return { ...state, currentAppId: null };
      }
      
      const newHistory = [...state.history];
      const prev = newHistory.pop();
      
      return {
        currentAppId: prev,
        previousAppId: state.currentAppId,
        history: newHistory
      };
    });
  }

  function init() {
    // Handle initial hash
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      const appId = hash.substring(2);
      navigateTo(appId);
    } else {
      const lastApp = localStorage.getItem('lastOpenedApp');
      if (lastApp) {
        navigateTo(lastApp);
      }
    }

    // Handle back button
    window.addEventListener('popstate', () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/')) {
        const appId = hash.substring(2);
        set({ currentAppId: appId, previousAppId: null, history: [] });
      } else {
        set({ currentAppId: null, previousAppId: null, history: [] });
      }
    });
  }

  return {
    subscribe,
    navigateTo,
    goBack,
    init
  };
}

export const navigation = createNavigationStore();
