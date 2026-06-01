/** @format */

import type { Job } from '../../../shared/types';

/** emptyJob - Default empty state for a new job description. */
export const emptyJob: Partial<Job> = {
    title: '',
    department: '',
    location: '',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    salaryRange: '',
    summary: '',
    responsibilities: [],
    requirements: [],
    skills: [],
    goodToHave: [],
    benefits: [],
    posters: [],
    status: 'draft',
};
