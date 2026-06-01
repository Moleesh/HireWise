/** @format */

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../../../shared/lib/config';

export const usernameDomain = 'hirewise.local';

export const toAuthEmail = (username: string) => {
    const trimmed = username.trim().toLowerCase();
    return trimmed.includes('@') ? trimmed : `${trimmed}@${usernameDomain}`;
};

export const displayUsername = (email: string) =>
    email.endsWith(`@${usernameDomain}`) ? email.replace(`@${usernameDomain}`, '') : email;

export const validateCredentials = (username: string, password: string) => {
    if (username.trim().length < 6) return 'Username must be at least 6 characters';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
};

export const validatePassword = (password: string) =>
    password.length < 6 ? 'Password must be at least 6 characters' : '';

export const postUserAction = async (body: Record<string, unknown>) => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/manage-users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
    });
    return res.json();
};
