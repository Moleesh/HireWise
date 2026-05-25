/** @format */

import type { Candidate } from '../../../shared/types';
import type { ReportField } from './types';

export type CandidatePreview = {
	primary: string;
	details: { label: string; value: string }[];
};

const emptyValue = "''";

const readValue = (candidate: Candidate, field: ReportField) =>
	field.value(candidate).trim() || emptyValue;

export const buildCandidatePreview = (
	candidate: Candidate,
	fields: ReportField[],
): CandidatePreview => {
	const [primaryField, ...detailFields] = fields;
	return {
		primary: primaryField ? readValue(candidate, primaryField) : candidate.name || emptyValue,
		details: detailFields.slice(0, 3).map((field) => ({
			label: field.label,
			value: readValue(candidate, field),
		})),
	};
};
