/** @format */

import type { Job } from '../../../shared/types';

/** emptyJob - Default empty state for a new job description. */
export const emptyJob: Partial<Job> = {
	title: '',
	department: '',
	location: '',
	employmenttype: 'full-time',
	experiencelevel: 'mid',
	salaryrange: '',
	summary: '',
	responsibilities: [],
	requirements: [],
	skills: [],
	goodtohave: [],
	benefits: [],
	posters: [],
	status: 'draft',
};
