import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'comic';
const ThemeContext = createContext({ theme: 'dark' as Theme, toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'comic' ? 'comic' : 'dark');

  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme === 'comic' ? 'dark' : 'comic';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem('cptaincm-theme', next);
    } catch {
      // Theme selection still works when the browser blocks storage.
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
