/** @format */

import type { ThemeName } from '../../../types';

export type ThemeConfig = {
    name: ThemeName;
    label: string;
};

/** themes - Theme metadata for the theme picker. Preview colors live in `_styles/_theme-switcher.scss`. */
export const themes: ThemeConfig[] = [
    {
        name: 'midnight-emerald',
        label: 'Midnight Emerald',
    },
    {
        name: 'ocean-depth',
        label: 'Ocean Depth',
    },
    {
        name: 'sunset-copper',
        label: 'Sunset Copper',
    },
    {
        name: 'royal-violet',
        label: 'Royal Violet',
    },
    {
        name: 'forest-moss',
        label: 'Forest Moss',
    },
    {
        name: 'crimson-noir',
        label: 'Crimson Noir',
    },
    {
        name: 'arctic-frost',
        label: 'Arctic Frost',
    },
    {
        name: 'paper-ink',
        label: 'Paper & Ink',
    },
];
