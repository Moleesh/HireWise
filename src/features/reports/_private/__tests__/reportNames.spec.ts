/** @format */

import { describe, expect, it } from 'vitest';
import { buildUniqueReportName, ensureUniqueReportNames } from '../reportNames';

describe('reportNames helpers', () => {
    it('appends numeric suffix for duplicate save names', () => {
        expect(buildUniqueReportName('Candidate Reports', ['Candidate Reports'])).toBe(
            'Candidate Reports (2)',
        );
        expect(
            buildUniqueReportName('Candidate Reports', [
                'Candidate Reports',
                'Candidate Reports (2)',
            ]),
        ).toBe('Candidate Reports (3)');
    });

    it('normalizes existing duplicate report names', () => {
        const normalized = ensureUniqueReportNames([
            {
                id: '1',
                name: 'Pipeline',
                fieldKeys: [],
                candidateIds: [],
                createdAt: 'now',
            },
            {
                id: '2',
                name: 'Pipeline',
                fieldKeys: [],
                candidateIds: [],
                createdAt: 'now',
            },
        ]);
        expect(normalized.map((report) => report.name)).toEqual(['Pipeline', 'Pipeline (2)']);
    });
});
