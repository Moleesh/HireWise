/** @format */

import type { SavedReport } from './types';
import { ensureUniqueReportNames } from './reportNames';

const STORAGE_KEY = 'hirewise-saved-reports';
const DEFAULT_REPORT_KEY = 'hirewise-default-report-id';

export const readSavedReports = (): SavedReport[] => {
	try {
		const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as SavedReport[];
		const uniqueReports = ensureUniqueReportNames(parsed);
		if (JSON.stringify(parsed) !== JSON.stringify(uniqueReports))
			writeSavedReports(uniqueReports);
		return uniqueReports;
	} catch {
		return [];
	}
};

export const writeSavedReports = (reports: SavedReport[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const readDefaultReportId = () => localStorage.getItem(DEFAULT_REPORT_KEY) ?? '';

export const writeDefaultReportId = (reportId: string) => {
	if (reportId) localStorage.setItem(DEFAULT_REPORT_KEY, reportId);
	else localStorage.removeItem(DEFAULT_REPORT_KEY);
};
