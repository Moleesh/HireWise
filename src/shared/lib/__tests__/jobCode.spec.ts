/** @format */

import { describe, expect, it } from 'vitest';
import { findJobByCode, isShortJobCode, jobCodeFromId } from '../jobCode';

describe('jobCodeFromId', () => {
    it('creates stable 8-digit numeric job codes', () => {
        const code = jobCodeFromId('829afe3a-2a22-4c4c-9cd6-3c5241e31186');
        expect(code).toMatch(/^\d{8}$/);
        expect(jobCodeFromId('829afe3a-2a22-4c4c-9cd6-3c5241e31186')).toBe(code);
    });
});

describe('isShortJobCode', () => {
    it('accepts only 8 digit codes', () => {
        expect(isShortJobCode('12345678')).toBe(true);
        expect(isShortJobCode('1234abcd')).toBe(false);
        expect(isShortJobCode('123456789')).toBe(false);
    });
});

describe('findJobByCode', () => {
    it('finds a job by generated code', () => {
        const jobs = [{ id: 'job-a' }, { id: 'job-b' }];
        expect(findJobByCode(jobs, jobCodeFromId('job-b'))).toEqual({ id: 'job-b' });
    });
});
