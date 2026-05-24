/** @format */

import type { ThemeName } from '../../../types';

/** themes - Theme metadata. `colors` mirrors the actual `[data-theme=...]` CSS palette in _styles/_themes.scss. */
export const themes: { name: ThemeName; label: string; colors: string[] }[] = [
	{
		name: 'midnight-emerald',
		label: 'Midnight Emerald',
		colors: ['#020617', '#0f172a', '#10b981', '#34d399'],
	},
	{
		name: 'ocean-depth',
		label: 'Ocean Depth',
		colors: ['#030712', '#0c1a2e', '#06b6d4', '#67e8f9'],
	},
	{
		name: 'sunset-copper',
		label: 'Sunset Copper',
		colors: ['#0c0a09', '#1c1410', '#f59e0b', '#fbbf24'],
	},
	{
		name: 'royal-violet',
		label: 'Royal Violet',
		colors: ['#08051a', '#130c2b', '#8b5cf6', '#c4b5fd'],
	},
	{
		name: 'forest-moss',
		label: 'Forest Moss',
		colors: ['#050d0a', '#0b1a14', '#4ade80', '#86efac'],
	},
	{
		name: 'crimson-noir',
		label: 'Crimson Noir',
		colors: ['#050505', '#1a1a1a', '#ef4444', '#fef3f3'],
	},
	{
		name: 'arctic-frost',
		label: 'Arctic Frost',
		colors: ['#f8fafc', '#e2e8f0', '#3b82f6', '#1e40af'],
	},
	{
		name: 'paper-ink',
		label: 'Paper & Ink',
		colors: ['#f5f3ee', '#e8e4dd', '#111111', '#dc2626'],
	},
];
