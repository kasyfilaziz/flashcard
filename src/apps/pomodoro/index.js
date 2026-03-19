const componentLoader = () => import('./App.svelte');

export default {
  id: 'pomodoro',
  name: 'Pomodoro',
  icon: 'timer',
  description: 'Focus timer using the Pomodoro Technique',
  version: '1.0.0',
  componentLoader,
  
  routes: {
    '': 'Timer',
    'stats': 'Stats',
    'settings': 'Settings'
  }
};

export const migrate = async (oldVersion) => {
  console.log(`Pomodoro app migrating from ${oldVersion}`);
};
