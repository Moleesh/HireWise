/** @format */

import { useEffect, useState, type ReactNode } from 'react';
import type { ThemeName } from '../types';
import { ThemeContext } from './themeContext';

const THEME_NAMES: ThemeName[] = [
	'midnight-emerald',
	'ocean-depth',
	'sunset-copper',
	'arctic-frost',
	'royal-violet',
	'forest-moss',
	'crimson-noir',
	'paper-ink',
];

/** ThemeProvider - Theme context provider with localStorage persistence */
const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<ThemeName>(() => {
		const saved = localStorage.getItem('hirewise-theme');
		if (saved && (THEME_NAMES as string[]).includes(saved)) return saved as ThemeName;
		return 'midnight-emerald';
	});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('hirewise-theme', theme);
	}, [theme]);

	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
