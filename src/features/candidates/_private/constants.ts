/** @format */

import type { CandidateStatus } from '../../../shared/types';

/** candidateStatuses - Available candidate status filter options. */
export const candidateStatuses: { value: CandidateStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'offered', label: 'Offered' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];
