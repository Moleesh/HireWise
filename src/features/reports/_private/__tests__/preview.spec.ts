/** @format */

import { describe, expect, it } from 'vitest';
import type { Candidate } from '../../../../shared/types';
import { buildCandidatePreview } from '../preview';
import type { ReportField } from '../types';

const candidate = {
	id: 'candidate-1',
	name: '',
	email: 'casey@example.com',
	status: 'available',
	experienceYears: 4,
} as Candidate;

const fields: ReportField[] = [
	{ key: 'name', label: 'Name', value: (item) => item.name },
	{ key: 'email', label: 'Email', value: (item) => item.email },
	{
		key: 'experienceYears',
		label: 'Experience',
		value: (item) => String(item.experienceYears),
	},
];

describe('buildCandidatePreview', () => {
	it('uses the first selected field as the primary text', () => {
		expect(buildCandidatePreview(candidate, fields).primary).toBe("''");
	});

	it('uses following selected fields as detail rows', () => {
		expect(buildCandidatePreview(candidate, fields).details).toEqual([
			{ label: 'Email', value: 'casey@example.com' },
			{ label: 'Experience', value: '4' },
		]);
	});
});
