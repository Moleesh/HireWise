/** @format */

import type { Candidate } from '../../../shared/types';
import type { ReportField } from './types';

export type ReportSort = {
	direction: 'asc' | 'desc';
	fieldKey: string;
};

export const sortCandidates = (
	candidates: Candidate[],
	fields: ReportField[],
	sort: ReportSort,
) => {
	const field = fields.find((item) => item.key === sort.fieldKey);
	if (!field) return candidates;
	const multiplier = sort.direction === 'asc' ? 1 : -1;
	return [...candidates].sort((left, right) => {
		const leftValue = field.value(left).toLowerCase();
		const rightValue = field.value(right).toLowerCase();
		return leftValue.localeCompare(rightValue, undefined, { numeric: true }) * multiplier;
	});
};
