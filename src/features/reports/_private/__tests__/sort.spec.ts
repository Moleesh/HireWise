/** @format */

import { describe, expect, it } from 'vitest';
import type { Candidate } from '../../../../shared/types';
import { sortCandidates } from '../sort';
import type { ReportField } from '../types';

const candidates = [
	{ id: '1', name: 'Zara', experienceYears: 2 },
	{ id: '2', name: 'Asha', experienceYears: 10 },
	{ id: '3', name: 'Ben', experienceYears: 4 },
] as Candidate[];

const fields: ReportField[] = [
	{ key: 'name', label: 'Name', value: (candidate) => candidate.name },
	{
		key: 'experienceYears',
		label: 'Experience',
		value: (candidate) => String(candidate.experienceYears),
	},
];

describe('sortCandidates', () => {
	it('sorts text fields ascending and descending', () => {
		expect(
			sortCandidates(candidates, fields, { fieldKey: 'name', direction: 'asc' }).map(
				(c) => c.name,
			),
		).toEqual(['Asha', 'Ben', 'Zara']);
		expect(
			sortCandidates(candidates, fields, { fieldKey: 'name', direction: 'desc' }).map(
				(c) => c.name,
			),
		).toEqual(['Zara', 'Ben', 'Asha']);
	});

	it('sorts numeric strings naturally', () => {
		expect(
			sortCandidates(candidates, fields, {
				fieldKey: 'experienceYears',
				direction: 'asc',
			}).map((candidate) => candidate.experienceYears),
		).toEqual([2, 4, 10]);
	});
});
