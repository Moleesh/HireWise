/** @format */

import type { Candidate } from '../../../shared/types';

export type ReportField = {
    key: string;
    label: string;
    value: (candidate: Candidate) => string;
};

export type SavedReport = {
    id: string;
    name: string;
    fieldKeys: string[];
    candidateIds: string[];
    createdAt: string;
    favorite?: boolean;
};
