/** @format */

import { describe, it, expect } from 'vitest';
import { pageToUrl, urlToPage } from '../useRouter';

describe('pageToUrl', () => {
	it('maps simple pages', () => {
		expect(pageToUrl('dashboard')).toBe('/');
		expect(pageToUrl('jobs')).toBe('/jobs');
		expect(pageToUrl('candidates')).toBe('/candidates');
		expect(pageToUrl('settings')).toBe('/settings');
	});
	it('maps job-editor by mode', () => {
		expect(pageToUrl('job-editor')).toBe('/jobs/new');
		expect(pageToUrl('job-editor', { id: 'abc' })).toBe('/jobs/abc');
		expect(pageToUrl('job-editor', { id: 'abc', mode: 'edit' })).toBe('/jobs/abc/edit');
		expect(pageToUrl('job-editor', { id: 'abc', mode: 'view' })).toBe('/jobs/abc');
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
		expect(urlToPage('/settings', '').page).toBe('settings');
	});
	it('parses job-editor variants', () => {
		expect(urlToPage('/jobs/new', '')).toEqual({
			page: 'job-editor',
			data: { mode: 'create' },
		});
		expect(urlToPage('/jobs/abc', '')).toEqual({
			page: 'job-editor',
			data: { id: 'abc', mode: 'view' },
		});
		expect(urlToPage('/jobs/abc/edit', '')).toEqual({
			page: 'job-editor',
			data: { id: 'abc', mode: 'edit' },
		});
	});
	it('parses rankings with optional jobId', () => {
		expect(urlToPage('/rankings', '')).toEqual({ page: 'rankings', data: {} });
		expect(urlToPage('/rankings', '?jobId=xyz')).toEqual({
			page: 'rankings',
			data: { jobId: 'xyz' },
		});
	});
	it('falls back to dashboard for unknown routes', () => {
		expect(urlToPage('/totally-bogus', '').page).toBe('dashboard');
	});
});
