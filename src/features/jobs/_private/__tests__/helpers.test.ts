/** @format */

import { describe, it, expect } from 'vitest';
import {
	buildPosterPrompt,
	buildSummaryFields,
	missingPosterFields,
	themePosterPalette,
} from '../helpers';

describe('missingPosterFields', () => {
	it('returns all required fields when job is empty', () => {
		expect(missingPosterFields({})).toEqual(['title', 'department', 'skills']);
	});

	it('returns empty when title, department and at least one skill exist', () => {
		expect(missingPosterFields({ title: 'Eng', department: 'Eng', skills: ['react'] })).toEqual(
			[],
		);
	});

	it('treats whitespace-only values as missing', () => {
		expect(missingPosterFields({ title: '  ', department: '  ', skills: [] })).toEqual([
			'title',
			'department',
			'skills',
		]);
	});
});

describe('themePosterPalette', () => {
	it('returns a non-empty hint for every theme', () => {
		const themes = [
			'midnight-emerald',
			'ocean-depth',
			'sunset-copper',
			'arctic-frost',
			'royal-violet',
			'forest-moss',
			'crimson-noir',
			'paper-ink',
		] as const;
		for (const t of themes) {
			expect(themePosterPalette(t).length).toBeGreaterThan(5);
		}
	});
});

describe('buildPosterPrompt', () => {
	const job = {
		title: 'Senior Engineer',
		department: 'Platform',
		skills: ['React', 'TypeScript'],
		goodtohave: ['Rust'],
	};

	it('includes title, department, skills and palette hint', () => {
		const prompt = buildPosterPrompt(job, 'midnight-emerald', 0);
		expect(prompt).toMatch(/Senior Engineer/);
		expect(prompt).toMatch(/Platform/);
		expect(prompt).toMatch(/React, TypeScript/);
		expect(prompt).toMatch(/emerald/);
	});

	it('rotates style across variants', () => {
		const a = buildPosterPrompt(job, 'midnight-emerald', 0);
		const b = buildPosterPrompt(job, 'midnight-emerald', 1);
		const c = buildPosterPrompt(job, 'midnight-emerald', 2);
		expect(a).not.toBe(b);
		expect(b).not.toBe(c);
	});

	it('appends user refinement when provided', () => {
		const prompt = buildPosterPrompt(job, 'paper-ink', 0, 'make it more playful');
		expect(prompt).toMatch(/User refinement: make it more playful/);
	});
});

describe('buildSummaryFields', () => {
	it('falls back to safe defaults', () => {
		expect(buildSummaryFields({})).toEqual({
			title: '',
			department: '',
			skills: [],
			goodtohave: [],
		});
	});
});
