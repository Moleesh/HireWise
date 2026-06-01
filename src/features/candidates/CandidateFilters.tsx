/** @format */

import { Search } from 'lucide-react';
import { candidateStatuses } from './_private/constants';

type CandidateFiltersProps = {
    search: string;
    statusFilter: string;
    onSearchChange: (search: string) => void;
    onStatusFilterChange: (status: string) => void;
};

/** CandidateFilters - Search and status controls for candidate cards. */
const CandidateFilters = ({
    search,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
}: CandidateFiltersProps) => (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(18rem,1fr)_auto] gap-3 lg:gap-4 mb-6">
        <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-quaternary)]" />
            <input
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by name, email, or skills..."
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
            />
        </div>
        <div className="flex gap-1.5 flex-wrap lg:justify-end">
            {candidateStatuses.map((status) => (
                <button
                    key={status.value}
                    onClick={() => onStatusFilterChange(status.value)}
                    className={`px-2.5 md:px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        statusFilter === status.value
                            ? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]'
                            : 'bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)] hover:bg-[var(--btn-ghost-hover)] border border-transparent'
                    }`}
                >
                    {status.label}
                </button>
            ))}
        </div>
    </div>
);

export default CandidateFilters;
