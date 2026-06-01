/** @format */

import { Briefcase } from 'lucide-react';
import { useMemo, useState } from 'react';

export type CandidateJobMatch = {
	jobId: string;
	overallScore: number;
	jobTitle: string;
	jobDepartment?: string;
	jobStatus?: string;
	rank?: number;
	skillsScore?: number;
	experienceScore?: number;
	educationScore?: number;
	keywordScore?: number;
};

type CandidateJobMatchesProps = {
	matches: CandidateJobMatch[];
};

/** CandidateJobMatches - Best matching jobs for a candidate. */
const CandidateJobMatches = ({ matches }: CandidateJobMatchesProps) => {
	const [sortBy, setSortBy] = useState<'rank' | 'overallScore'>('overallScore');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
	const sortedMatches = useMemo(() => {
		const dir = sortDirection === 'asc' ? 1 : -1;
		return [...matches].sort((a, b) => {
			const aValue = sortBy === 'rank' ? (a.rank ?? Number.MAX_SAFE_INTEGER) : a.overallScore;
			const bValue = sortBy === 'rank' ? (b.rank ?? Number.MAX_SAFE_INTEGER) : b.overallScore;
			return (aValue - bValue) * dir;
		});
	}, [matches, sortBy, sortDirection]);

	const toggleSort = (nextSortBy: 'rank' | 'overallScore') => {
		if (sortBy === nextSortBy) {
			setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
			return;
		}
		setSortBy(nextSortBy);
		setSortDirection(nextSortBy === 'rank' ? 'asc' : 'desc');
	};

	return (
		<div>
			<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
				Ranking Across Job Descriptions
			</label>
			<div className="mt-2 overflow-auto rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)]">
				<table className="w-full text-left text-sm">
					<thead className="bg-[var(--card-bg)] text-[var(--text-quaternary)]">
						<tr>
							<th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider">
								JD
							</th>
							<th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
								<button
									type="button"
									onClick={() => toggleSort('rank')}
									className="inline-flex items-center whitespace-nowrap gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-quaternary)] hover:text-[var(--text-secondary)]"
								>
									Rank{' '}
									{sortBy === 'rank' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
								</button>
							</th>
							<th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
								<button
									type="button"
									onClick={() => toggleSort('overallScore')}
									className="inline-flex items-center whitespace-nowrap gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-quaternary)] hover:text-[var(--text-secondary)]"
								>
									Overall{' '}
									{sortBy === 'overallScore'
										? sortDirection === 'asc'
											? '↑'
											: '↓'
										: ''}
								</button>
							</th>
							<th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider">
								Breakdown
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[var(--border-subtle)]">
						{matches.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className="px-3 py-5 text-sm text-[var(--text-quaternary)]"
								>
									No existing rankings yet for this candidate.
								</td>
							</tr>
						) : (
							sortedMatches.map((match) => (
								<tr key={match.jobId} className="align-top">
									<td className="px-3 py-3 text-[var(--text-primary)]">
										<div className="flex items-center gap-2 min-w-0">
											<Briefcase
												size={14}
												className="text-[var(--text-quaternary)] shrink-0"
											/>
											<span className="truncate">{match.jobTitle}</span>
										</div>
										<div className="mt-1 flex flex-wrap gap-1.5">
											{match.jobDepartment && (
												<span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--btn-ghost-bg)] text-[var(--text-quaternary)]">
													{match.jobDepartment}
												</span>
											)}
											{match.jobStatus && (
												<span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--btn-ghost-bg)] text-[var(--text-quaternary)] capitalize">
													{match.jobStatus}
												</span>
											)}
										</div>
									</td>
									<td className="px-3 py-3 text-[var(--text-secondary)]">
										{match.rank ? `#${match.rank}` : '—'}
									</td>
									<td
										className={`px-3 py-3 font-semibold tabular-nums ${
											match.overallScore >= 70
												? 'text-emerald-400'
												: match.overallScore >= 40
													? 'text-amber-400'
													: 'text-red-400'
										}`}
									>
										{match.overallScore}%
									</td>
									<td className="px-3 py-3 text-[11px] text-[var(--text-quaternary)]">
										Skills: {match.skillsScore ?? '—'}% · Exp:{' '}
										{match.experienceScore ?? '—'}% · Edu:{' '}
										{match.educationScore ?? '—'}% · Key:{' '}
										{match.keywordScore ?? '—'}%
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CandidateJobMatches;
