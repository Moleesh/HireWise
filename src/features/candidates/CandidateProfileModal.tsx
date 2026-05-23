/** @format */

import { Download, Briefcase } from 'lucide-react';
import StatusBadge from '../../shared/components/StatusBadge';
import Modal from '../../shared/components/Modal';
import type { Candidate, CandidateStatus } from '../../shared/types';

const getAge = (dateStr: string) => {
	const d = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const days = Math.floor(diffMs / 86400000);
	if (days < 1) return 'Today';
	if (days === 1) return '1 day';
	if (days < 30) return `${days} days`;
	const months = Math.floor(days / 30);
	if (months === 1) return '1 month';
	return `${months} months`;
};

type CandidateJobMatch = {
	jobid: string;
	overallscore: number;
	jobtitle: string;
};

type CandidateProfileModalProps = {
	candidate: Candidate | null;
	candidateJobs: CandidateJobMatch[];
	onClose: () => void;
	onStatusUpdate: (id: string, status: CandidateStatus) => void;
	onDownload: (candidate: Candidate) => void;
};

/** CandidateProfileModal - Candidate detail modal with status update and job match display */
const CandidateProfileModal = ({
	candidate,
	candidateJobs,
	onClose,
	onStatusUpdate,
	onDownload,
}: CandidateProfileModalProps) => {
	if (!candidate) return null;

	return (
		<Modal
			open={!!candidate}
			onClose={onClose}
			title={candidate.name ?? 'Candidate Details'}
			size="lg"
		>
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-3 md:gap-4">
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Email
						</label>
						<p className="text-sm text-[var(--text-primary)] mt-1">
							{candidate.email ?? 'N/A'}
						</p>
					</div>
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Experience
						</label>
						<p className="text-sm text-[var(--text-primary)] mt-1">
							{candidate.experienceyears} years
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
							{candidate.timetojoin ?? 'Not specified'}
						</p>
					</div>
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Waiting Period
						</label>
						<p className="text-sm text-[var(--text-primary)] mt-1">
							{candidate.waitingperiod ?? 'Not specified'}
						</p>
					</div>
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Resume Age
						</label>
						<p className="text-sm text-[var(--text-primary)] mt-1">
							{getAge(candidate.createdat)}
						</p>
					</div>
				</div>

				{candidateJobs.length > 0 && (
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Best Job Matches
						</label>
						<div className="space-y-2 mt-2">
							{candidateJobs.map((match) => (
								<div
									key={match.jobid}
									className="flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)]"
								>
									<div className="flex items-center gap-2 min-w-0">
										<Briefcase
											size={14}
											className="text-[var(--text-quaternary)] shrink-0"
										/>
										<span className="text-sm text-[var(--text-primary)] truncate">
											{match.jobtitle}
										</span>
									</div>
									<span
										className={`text-xs font-bold tabular-nums shrink-0 ml-2 ${
											match.overallscore >= 70
												? 'text-emerald-400'
												: match.overallscore >= 40
													? 'text-amber-400'
													: 'text-red-400'
										}`}
									>
										{match.overallscore}%
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{(candidate.skills ?? []).length > 0 && (
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Skills
						</label>
						<div className="flex flex-wrap gap-1.5 mt-2">
							{candidate.skills.map((skill) => (
								<span
									key={skill}
									className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]"
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				)}

				{(candidate.education ?? []).length > 0 && (
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Education
						</label>
						<div className="space-y-1.5 mt-2">
							{candidate.education.map((edu, i) => (
								<p key={i} className="text-sm text-[var(--text-primary)]">
									{edu.degree} - {edu.institution} ({edu.year})
								</p>
							))}
						</div>
					</div>
				)}

				{(candidate.workhistory ?? []).length > 0 && (
					<div>
						<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
							Work History
						</label>
						<div className="space-y-2 mt-2">
							{candidate.workhistory.map((work, i) => (
								<div key={i} className="text-sm">
									<p className="text-[var(--text-primary)] font-medium">
										{work.title} at {work.company}
									</p>
									<p className="text-[var(--text-quaternary)] text-xs">
										{work.duration}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="pt-4 border-t border-[var(--border-subtle)]">
					<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider mb-2 block">
						Update Status
					</label>
					<div className="flex gap-2 flex-wrap">
						{(
							[
								'available',
								'in-progress',
								'offered',
								'hired',
								'rejected',
							] as CandidateStatus[]
						).map((s) => (
							<button
								key={s}
								onClick={() => onStatusUpdate(candidate.id, s)}
								className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
									candidate.status === s
										? 'bg-[var(--accent-bg)] text-white'
										: 'bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)] hover:bg-[var(--btn-ghost-hover)]'
								}`}
							>
								{s === 'in-progress'
									? 'In Progress'
									: s.charAt(0).toUpperCase() + s.slice(1)}
							</button>
						))}
					</div>
				</div>

				<div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
					<button
						onClick={() => onDownload(candidate)}
						className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
					>
						<Download size={14} /> Download
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all"
					>
						Close
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default CandidateProfileModal;
