/** @format */

import ProgressBar from '../../shared/components/ProgressBar';
import Modal from '../../shared/components/Modal';
import type { Candidate, Ranking } from '../../shared/types';
import { getScoreColor } from './_private/helpers';

type ScoreBreakdownModalProps = {
	ranking: Ranking | null;
	candidates: Candidate[];
	onClose: () => void;
};

/** ScoreBreakdownModal - Ranking detail modal showing score breakdowns and skill matches */
const ScoreBreakdownModal = ({ ranking, candidates, onClose }: ScoreBreakdownModalProps) => {
	if (!ranking) return null;

	const candidate = candidates.find((c) => c.id === ranking.candidateId);

	return (
		<Modal open={!!ranking} onClose={onClose} title="Ranking Details" size="lg">
			<div className="space-y-4">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-12 h-12 rounded-xl bg-[var(--accent-bg-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-lg font-bold text-[var(--accent-text)]">
						#{ranking.rank}
					</div>
					<div>
						<h3 className="text-lg font-semibold text-[var(--text-primary)]">
							{candidate?.name ?? 'Unknown'}
						</h3>
						<p className="text-sm text-[var(--text-quaternary)]">
							{candidate?.email ?? ''}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
					{[
						{ label: 'Overall', score: ranking.overallScore, weight: '40%' },
						{ label: 'Skills', score: ranking.skillsScore, weight: '40%' },
						{ label: 'Experience', score: ranking.experienceScore, weight: '25%' },
						{ label: 'Education', score: ranking.educationScore, weight: '15%' },
						{ label: 'Keywords', score: ranking.keywordScore, weight: '20%' },
					].map((item) => (
						<div
							key={item.label}
							className="p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)]"
						>
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-[var(--text-quaternary)]">
									{item.label} ({item.weight})
								</span>
								<span
									className="text-sm font-bold tabular-nums"
									style={{ color: getScoreColor(item.score) }}
								>
									{item.score}%
								</span>
							</div>
							<ProgressBar
								label=""
								value={item.score}
								showPercent={false}
								size="md"
							/>
						</div>
					))}
				</div>

				{(ranking.matchedSkills ?? []).length > 0 && (
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Matched Skills
						</label>
						<div className="flex flex-wrap gap-1.5 mt-2">
							{ranking.matchedSkills.map((skill) => (
								<span
									key={skill}
									className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				)}

				{(ranking.missingSkills ?? []).length > 0 && (
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Missing Skills
						</label>
						<div className="flex flex-wrap gap-1.5 mt-2">
							{ranking.missingSkills.map((skill) => (
								<span
									key={skill}
									className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ScoreBreakdownModal;
