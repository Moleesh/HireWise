/** @format */

import { describe, it, expect } from 'vitest';
import { pageToUrl, urlToPage } from '../useRouter';
import { jobCodeFromId } from '../../lib/jobCode';

describe('pageToUrl', () => {
    it('maps simple pages', () => {
        expect(pageToUrl('dashboard')).toBe('/');
        expect(pageToUrl('jobs')).toBe('/jobs');
        expect(pageToUrl('candidates')).toBe('/candidates');
        expect(pageToUrl('reports')).toBe('/reports');
        expect(pageToUrl('settings')).toBe('/settings');
    });
    it('maps job-editor by mode', () => {
        const code = jobCodeFromId('abc');
        expect(pageToUrl('job-editor')).toBe('/jobs/new');
        expect(pageToUrl('job-editor', { id: 'abc' })).toBe(`/jobs/${code}`);
        expect(pageToUrl('job-editor', { id: 'abc', mode: 'edit' })).toBe(`/jobs/${code}/edit`);
        expect(pageToUrl('job-editor', { id: 'abc', mode: 'view' })).toBe(`/jobs/${code}`);
        expect(pageToUrl('job-editor', { id: 'abc', code: '12345678' })).toBe('/jobs/12345678');
    });
    it('encodes ranking jobId via query string', () => {
        expect(pageToUrl('rankings')).toBe('/rankings');
        expect(pageToUrl('rankings', { jobId: 'xyz' })).toBe('/rankings?jobId=xyz');
    });
});

describe('urlToPage', () => {
    it('parses root + named pages', () => {
        expect(urlToPage('/', '').page).toBe('dashboard');
        expect(urlToPage('/jobs', '').page).toBe('jobs');
        expect(urlToPage('/candidates', '').page).toBe('candidates');
        expect(urlToPage('/reports', '').page).toBe('reports');
        expect(urlToPage('/settings', '').page).toBe('settings');
    });
    it('accepts dashboard aliases', () => {
        expect(urlToPage('/dashboard', '')).toEqual({
            page: 'dashboard',
            data: {},
            matched: true,
        });
    });
    it('parses job-editor variants', () => {
        expect(urlToPage('/jobs/new', '')).toEqual({
            page: 'job-editor',
            data: { mode: 'create' },
            matched: true,
        });
        expect(urlToPage('/jobs/abc', '')).toEqual({
            page: 'job-editor',
            data: { id: 'abc', mode: 'view' },
            matched: true,
        });
        expect(urlToPage('/jobs/abc/edit', '')).toEqual({
            page: 'job-editor',
            data: { id: 'abc', mode: 'edit' },
            matched: true,
        });
    });
    it('parses rankings with optional jobId', () => {
        expect(urlToPage('/rankings', '')).toEqual({
            page: 'rankings',
            data: {},
            matched: true,
        });
        expect(urlToPage('/rankings', '?jobId=xyz')).toEqual({
            page: 'rankings',
            data: { jobId: 'xyz' },
            matched: true,
        });
    });
    it('marks unknown routes for dashboard replacement', () => {
        expect(urlToPage('/totally-bogus', '')).toEqual({
            page: 'dashboard',
            data: {},
            matched: false,
        });
    });
});
