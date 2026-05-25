/** @format */

import { afterEach, describe, expect, it } from 'vitest';
import {
	readDefaultReportId,
	readSavedReports,
	writeDefaultReportId,
	writeSavedReports,
} from '../storage';

describe('report storage', () => {
	afterEach(() => {
		localStorage.clear();
	});

	it('stores saved reports', () => {
		writeSavedReports([
			{
				id: 'report-1',
				name: 'Pipeline',
				fieldKeys: ['name'],
				candidateIds: ['candidate-1'],
				createdAt: 'now',
			},
		]);
		expect(readSavedReports()[0].name).toBe('Pipeline');
	});

	it('stores and clears the default report id', () => {
		writeDefaultReportId('report-1');
		expect(readDefaultReportId()).toBe('report-1');
		writeDefaultReportId('');
		expect(readDefaultReportId()).toBe('');
	});
});
