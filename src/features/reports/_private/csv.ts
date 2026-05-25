/** @format */

import type { Candidate } from '../../../shared/types';
import type { ReportField } from './types';

export const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

export const buildCsv = (candidates: Candidate[], fields: ReportField[]) => {
	const header = fields.map((field) => escapeCsvValue(field.label)).join(',');
	const rows = candidates.map((candidate) =>
		fields.map((field) => escapeCsvValue(field.value(candidate))).join(','),
	);
	return [header, ...rows].join('\n');
};

export const downloadCsv = (name: string, candidates: Candidate[], fields: ReportField[]) => {
	const blob = new Blob([buildCsv(candidates, fields)], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = `${name.trim() || 'candidate-report'}.csv`;
	anchor.click();
	URL.revokeObjectURL(url);
};
