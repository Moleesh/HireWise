/** @format */

import { describe, expect, it } from 'vitest';
import type { Candidate } from '../../../../shared/types';
import { filterCandidates } from '../filter';

const candidates = [
    {
        id: '1',
        name: 'Asha Rao',
        email: 'asha@example.com',
        skills: ['React'],
        status: 'available',
    },
    { id: '2', name: 'Ben Lee', email: 'ben@example.com', skills: ['Python'], status: 'offered' },
] as Candidate[];

describe('filterCandidates', () => {
    it('returns all candidates for empty search', () => {
        expect(filterCandidates(candidates, '')).toHaveLength(2);
    });

    it('matches by name, email, status, and skills', () => {
        expect(filterCandidates(candidates, 'asha')).toEqual([candidates[0]]);
        expect(filterCandidates(candidates, 'ben@example')).toEqual([candidates[1]]);
        expect(filterCandidates(candidates, 'offered')).toEqual([candidates[1]]);
        expect(filterCandidates(candidates, 'react')).toEqual([candidates[0]]);
    });
});
