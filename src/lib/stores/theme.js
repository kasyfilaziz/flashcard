import { writable } from 'svelte/store';

const isClient = typeof window !== 'undefined';

const getInitialTheme = () => {
  if (!isClient) return 'light';
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const theme = writable(getInitialTheme());

if (isClient) {
  theme.subscribe(async value => {
    localStorage.setItem('theme', value);
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
}

export function toggleTheme() {
  theme.update(current => current === 'dark' ? 'light' : 'dark');
}
