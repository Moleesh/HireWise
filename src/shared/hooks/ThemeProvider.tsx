/** @format */

import { useEffect, useState, type ReactNode } from 'react';
import type { ThemeName } from '../types';
import { ThemeContext } from './themeContext';
import { supabase } from '../lib/supabase';

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

const isThemeName = (v: unknown): v is ThemeName =>
    typeof v === 'string' && (THEME_NAMES as string[]).includes(v);

/** ThemeProvider - Theme context with localStorage cache + sync to app_users.theme_preference */
const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<ThemeName>(() => {
        const saved = localStorage.getItem('hirewise-theme');
        return isThemeName(saved) ? saved : 'midnight-emerald';
    });

    // Apply to <html data-theme>
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('hirewise-theme', theme);
    }, [theme]);

    // Hydrate from app_users on sign-in; persist there on change.
    useEffect(() => {
        const syncFromProfile = async (userId: string) => {
            const { data } = await supabase
                .from('app_users')
                .select('themePreference')
                .eq('id', userId)
                .maybeSingle();
            const remote = (data as { themePreference?: string } | null)?.themePreference;
            if (isThemeName(remote)) setThemeState(remote);
        };
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) void syncFromProfile(data.user.id);
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
            if (session?.user) void syncFromProfile(session.user.id);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    const setTheme = (next: ThemeName) => {
        setThemeState(next);
        void supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                void supabase
                    .from('app_users')
                    .update({ themePreference: next })
                    .eq('id', data.user.id);
            }
        });
    };

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
