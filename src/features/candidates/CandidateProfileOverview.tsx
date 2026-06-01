/** @format */

import StatusBadge from '../../shared/components/StatusBadge';
import type { Candidate } from '../../shared/types';

const getAge = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days < 1) return 'Today';
    if (days === 1) return '1 day';
    if (days < 30) return `${days} days`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
};

type CandidateProfileOverviewProps = {
    candidate: Candidate;
};

/** CandidateProfileOverview - Key candidate facts in the profile modal. */
const CandidateProfileOverview = ({ candidate }: CandidateProfileOverviewProps) => (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div>
            <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                Email
            </label>
            <p className="text-sm text-[var(--text-primary)] mt-1">{candidate.email ?? 'N/A'}</p>
        </div>
        <div>
            <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                Experience
            </label>
            <p className="text-sm text-[var(--text-primary)] mt-1">
                {candidate.experienceYears} years
            </p>
        </div>
        <div>
            <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                Status
            </label>
            <div className="mt-1">
                <StatusBadge status={candidate.status} size="md" />
            </div>
        </div>
        <div>
            <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                Time to Join
            </label>
            <p className="text-sm text-[var(--text-primary)] mt-1">
                {candidate.timeToJoin ?? 'Not specified'}
            </p>
        </div>
        <div>
            <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                Waiting Period
            </label>
            <p className="text-sm text-[var(--text-primary)] mt-1">
                {candidate.waitingPeriod ?? 'Not specified'}
            </p>
        </div>
        <div>
            <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                Resume Age
            </label>
            <p className="text-sm text-[var(--text-primary)] mt-1">{getAge(candidate.createdAt)}</p>
        </div>
    </div>
);

export default CandidateProfileOverview;
