/** @format */

import type { Candidate } from '../../../shared/types';

export const filterCandidates = (candidates: Candidate[], search: string) => {
    const query = search.trim().toLowerCase();
    if (!query) return candidates;
    return candidates.filter(
        (candidate) =>
            candidate.name?.toLowerCase().includes(query) ||
            candidate.email?.toLowerCase().includes(query) ||
            candidate.status?.toLowerCase().includes(query) ||
            (candidate.skills ?? []).some((skill) => skill.toLowerCase().includes(query)),
    );
};
