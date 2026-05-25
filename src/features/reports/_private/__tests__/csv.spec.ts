/** @format */

import { describe, expect, it } from 'vitest';
import type { Candidate } from '../../../../shared/types';
import { buildCsv, escapeCsvValue } from '../csv';
import type { ReportField } from '../types';

const candidate = {
	id: 'candidate-1',
	name: 'Asha "Ace"',
	email: 'asha@example.com',
	skills: ['react', 'node'],
	status: 'available',
} as Candidate;

const fields: ReportField[] = [
	{ key: 'name', label: 'Name', value: (item) => item.name },
	{ key: 'skills', label: 'Skills', value: (item) => item.skills.join(', ') },
];

describe('escapeCsvValue', () => {
	it('quotes values and escapes embedded quotes', () => {
		expect(escapeCsvValue('Asha "Ace"')).toBe('"Asha ""Ace"""');
	});
});

describe('buildCsv', () => {
	it('builds an Excel-friendly CSV with selected fields', () => {
		expect(buildCsv([candidate], fields)).toBe('"Name","Skills"\n"Asha ""Ace""","react, node"');
	});

	it('includes only the requested columns', () => {
		expect(buildCsv([candidate], [fields[0]])).toBe('"Name"\n"Asha ""Ace"""');
	});
});
