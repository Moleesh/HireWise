/** @format */

import { Briefcase } from 'lucide-react';

export type CandidateJobMatch = {
	jobId: string;
	overallScore: number;
	jobTitle: string;
};

type CandidateJobMatchesProps = {
	matches: CandidateJobMatch[];
};

/** CandidateJobMatches - Best matching jobs for a candidate. */
const CandidateJobMatches = ({ matches }: CandidateJobMatchesProps) => {
	if (matches.length === 0) return null;
	return (
		<div>
			<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
				Best Job Matches
			</label>
			<div className="space-y-2 mt-2">
				{matches.map((match) => (
					<div
						key={match.jobId}
						className="flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)]"
					>
						<div className="flex items-center gap-2 min-w-0">
							<Briefcase size={14} className="text-[var(--text-quaternary)] shrink-0" />
							<span className="text-sm text-[var(--text-primary)] truncate">
								{match.jobTitle}
							</span>
						</div>
						<span
							className={`text-xs font-bold tabular-nums shrink-0 ml-2 ${
								match.overallScore >= 70
									? 'text-emerald-400'
									: match.overallScore >= 40
										? 'text-amber-400'
										: 'text-red-400'
							}`}
						>
							{match.overallScore}%
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default CandidateJobMatches;
