/** @format */

import type { ReportField } from './types';

export const reportFields: ReportField[] = [
	{ key: 'name', label: 'Name', value: (candidate) => candidate.name ?? '' },
	{ key: 'email', label: 'Email', value: (candidate) => candidate.email ?? '' },
	{ key: 'status', label: 'Status', value: (candidate) => candidate.status ?? '' },
	{ key: 'source', label: 'Source', value: (candidate) => candidate.source ?? '' },
	{
		key: 'experienceYears',
		label: 'Experience',
		value: (candidate) => String(candidate.experienceYears ?? 0),
	},
	{ key: 'timeToJoin', label: 'Time to Join', value: (candidate) => candidate.timeToJoin ?? '' },
	{
		key: 'waitingPeriod',
		label: 'Waiting Period',
		value: (candidate) => candidate.waitingPeriod ?? '',
	},
	{ key: 'skills', label: 'Skills', value: (candidate) => (candidate.skills ?? []).join(', ') },
	{
		key: 'education',
		label: 'Education',
		value: (candidate) =>
			(candidate.education ?? [])
				.map((entry) => `${entry.degree} - ${entry.institution} (${entry.year})`)
				.join('; '),
	},
	{
		key: 'workHistory',
		label: 'Work History',
		value: (candidate) =>
			(candidate.workHistory ?? [])
				.map((entry) => `${entry.title} at ${entry.company} (${entry.duration})`)
				.join('; '),
	},
	{ key: 'fileName', label: 'Resume File', value: (candidate) => candidate.fileName ?? '' },
	{
		key: 'createdAt',
		label: 'Uploaded At',
		value: (candidate) =>
			candidate.createdAt ? new Date(candidate.createdAt).toLocaleString() : '',
	},
];
