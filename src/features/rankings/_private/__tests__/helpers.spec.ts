/** @format */

import { describe, it, expect } from 'vitest';
import { calculateScores, getRankBadge, getScoreColor } from '../helpers';
import type { Candidate, Job } from '../../../../shared/types';

const makeJob = (overrides: Partial<Job> = {}): Job => ({
    id: 'j1',
    title: 'Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    salaryRange: '$100k-$150k',
    summary: 'Build great software',
    responsibilities: ['Code reviews', 'Feature development'],
    requirements: ['3+ years experience', 'TypeScript'],
    skills: ['typescript', 'react', 'node'],
    goodToHave: [],
    benefits: ['Health', '401k'],
    posters: [],
    status: 'published',
    createdBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    duplicatedFromId: null,
    ...overrides,
});

const makeCandidate = (overrides: Partial<Candidate> = {}): Candidate => ({
    id: 'c1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    source: 'upload',
    fileUrl: '',
    fileName: 'resume.pdf',
    rawText: 'Experienced typescript developer',
    skills: ['typescript', 'react', 'python'],
    experienceYears: 4,
    education: [{ degree: 'BS', institution: 'MIT', year: '2020' }],
    workHistory: [],
    parsedData: {},
    uploadedBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'available',
    timeToJoin: '',
    waitingPeriod: '',
    ...overrides,
});

describe('calculateScores', () => {
    it('computes scores for a candidate-job pair', () => {
        const result = calculateScores(makeCandidate(), makeJob());
        expect(result.overallScore).toBeGreaterThan(0);
        expect(result.overallScore).toBeLessThanOrEqual(100);
        expect(result.skillsScore).toBeGreaterThanOrEqual(0);
        expect(result.experienceScore).toBeGreaterThanOrEqual(0);
    });

    it('identifies matched and missing skills', () => {
        const result = calculateScores(makeCandidate(), makeJob());
        expect(result.matchedSkills).toContain('Typescript');
        expect(result.matchedSkills).toContain('React');
        expect(result.missingSkills).toContain('Node');
    });

    it('gives high skill score when all skills match', () => {
        const candidate = makeCandidate({ skills: ['typescript', 'react', 'node'] });
        const result = calculateScores(candidate, makeJob());
        expect(result.skillsScore).toBe(100);
    });
});

describe('getRankBadge', () => {
    it('returns gold badge for rank 1', () => {
        expect(getRankBadge(1)).toEqual({
            bg: 'var(--badge-gold-bg)',
            text: 'var(--badge-gold-text)',
            icon: '1st',
        });
    });

    it('returns silver badge for rank 2', () => {
        expect(getRankBadge(2)).toEqual({
            bg: 'var(--badge-silver-bg)',
            text: 'var(--badge-silver-text)',
            icon: '2nd',
        });
    });

    it('returns bronze badge for rank 3', () => {
        expect(getRankBadge(3)).toEqual({
            bg: 'var(--badge-bronze-bg)',
            text: 'var(--badge-bronze-text)',
            icon: '3rd',
        });
    });

    it('returns null for rank 4+', () => {
        expect(getRankBadge(4)).toBeNull();
        expect(getRankBadge(10)).toBeNull();
    });
});

describe('getScoreColor', () => {
    it('returns excellent color for scores >= 80', () => {
        expect(getScoreColor(80)).toBe('var(--score-excellent)');
        expect(getScoreColor(100)).toBe('var(--score-excellent)');
    });

    it('returns good color for scores 60-79', () => {
        expect(getScoreColor(60)).toBe('var(--score-good)');
        expect(getScoreColor(79)).toBe('var(--score-good)');
    });

    it('returns fair color for scores 40-59', () => {
        expect(getScoreColor(40)).toBe('var(--score-fair)');
        expect(getScoreColor(59)).toBe('var(--score-fair)');
    });

    it('returns poor color for scores < 40', () => {
        expect(getScoreColor(0)).toBe('var(--score-poor)');
        expect(getScoreColor(39)).toBe('var(--score-poor)');
    });
});
