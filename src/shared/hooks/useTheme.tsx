/** @format */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ThemeName } from '../types';

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'midnight-emerald',
  setTheme: () => {},
});

/** ThemeProvider - Theme context provider with localStorage persistence */
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('hirewise-theme');
    return (saved as ThemeName) ?? 'midnight-emerald';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hirewise-theme', theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

/** useTheme - Hook to access theme context */
const useTheme = () => {
  return useContext(ThemeContext);
};

export { ThemeProvider, useTheme };
