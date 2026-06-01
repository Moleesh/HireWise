/** @format */

import type { SavedReport } from './types';

const cleanName = (name: string) => name.trim() || 'Candidate Report';

export const buildUniqueReportName = (requestedName: string, existingNames: string[]): string => {
    const base = cleanName(requestedName);
    if (!existingNames.includes(base)) return base;
    let suffix = 2;
    let candidate = `${base} (${suffix})`;
    while (existingNames.includes(candidate)) {
        suffix += 1;
        candidate = `${base} (${suffix})`;
    }
    return candidate;
};

export const ensureUniqueReportNames = (reports: SavedReport[]): SavedReport[] => {
    const seen: string[] = [];
    return reports.map((report) => {
        const uniqueName = buildUniqueReportName(report.name, seen);
        seen.push(uniqueName);
        return uniqueName === report.name ? report : { ...report, name: uniqueName };
    });
};
