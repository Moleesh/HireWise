/** @format */

import { describe, expect, it } from 'vitest';
import { displayUsername, toAuthEmail, validateCredentials, validatePassword } from '../userAccess';

describe('user access helpers', () => {
    it('converts usernames to auth-safe emails', () => {
        expect(toAuthEmail('testers')).toBe('testers@hirewise.local');
        expect(toAuthEmail('admin@example.com')).toBe('admin@example.com');
    });

    it('displays local auth emails as usernames', () => {
        expect(displayUsername('testers@hirewise.local')).toBe('testers');
        expect(displayUsername('admin@example.com')).toBe('admin@example.com');
    });

    it('validates six-character usernames and passwords', () => {
        expect(validateCredentials('tester', 'secret')).toBe('');
        expect(validateCredentials('test', 'secret')).toMatch(/Username/);
        expect(validatePassword('short')).toMatch(/Password/);
    });
});
