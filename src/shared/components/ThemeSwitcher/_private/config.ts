/** @format */

import type { ThemeName } from '../../../types';

/** themes - Available color theme definitions with name, label, and preview colors. */
export const themes: { name: ThemeName; label: string; colors: string[] }[] = [
	{ name: 'midnight-emerald', label: 'Midnight Emerald', colors: ['#0f172a', '#10b981'] },
	{ name: 'ocean-depth', label: 'Ocean Depth', colors: ['#0c1a2e', '#06b6d4'] },
	{ name: 'sunset-copper', label: 'Sunset Copper', colors: ['#1c1410', '#f59e0b'] },
	{ name: 'royal-violet', label: 'Royal Violet', colors: ['#130c2b', '#8b5cf6'] },
	{ name: 'forest-moss', label: 'Forest Moss', colors: ['#0b1a14', '#4ade80'] },
	{ name: 'crimson-noir', label: 'Crimson Noir', colors: ['#0a0a0a', '#ef4444'] },
	{ name: 'arctic-frost', label: 'Arctic Frost', colors: ['#f8fafc', '#3b82f6'] },
	{ name: 'paper-ink', label: 'Paper & Ink', colors: ['#f5f3ee', '#111111'] },
];
