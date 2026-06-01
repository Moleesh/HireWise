/** @format */

import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';

export type AuthContextValue = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
    user: null,
    session: null,
    loading: true,
    signIn: async () => ({ error: null }),
    signOut: async () => {},
});
