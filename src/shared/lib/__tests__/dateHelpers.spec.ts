/** @format */

import { describe, it, expect } from 'vitest';
import { getAge, formatDate } from '../dateHelpers';

describe('dateHelpers', () => {
    describe('getAge', () => {
        it('returns "Today" for dates within the same day', () => {
            const now = new Date().toISOString();
            expect(getAge(now)).toBe('Today');
        });

        it('returns "1 day" for yesterday', () => {
            const yesterday = new Date(Date.now() - 86400000).toISOString();
            expect(getAge(yesterday)).toBe('1 day');
        });

        it('returns days for dates within a month', () => {
            const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();
            expect(getAge(fiveDaysAgo)).toBe('5 days');
        });

        it('returns "1 month" for 30 days ago', () => {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
            expect(getAge(thirtyDaysAgo)).toBe('1 month');
        });

        it('returns months for older dates', () => {
            const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString();
            expect(getAge(ninetyDaysAgo)).toBe('3 months');
        });
    });

    describe('formatDate', () => {
        it('returns "Just now" for very recent dates', () => {
            const now = new Date().toISOString();
            expect(formatDate(now)).toBe('Just now');
        });

        it('returns hours for recent dates', () => {
            const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();
            expect(formatDate(twoHoursAgo)).toBe('2h ago');
        });

        it('returns days for dates within a week', () => {
            const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
            expect(formatDate(threeDaysAgo)).toBe('3d ago');
        });
    });
});
