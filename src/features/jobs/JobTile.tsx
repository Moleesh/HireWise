/** @format */

import {
	MoreVertical,
	CreditCard as Edit,
	Eye,
	Trash2,
	Copy,
	BarChart3,
	CheckCircle,
	Clock,
} from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import StatusBadge from '../../shared/components/StatusBadge';
import { getAge } from '../../shared/lib/dateHelpers';
import type { Page, Job } from '../../shared/types';

type JobTileProps = {
	job: Job;
	menuOpen: boolean;
	onNavigate: (page: Page, data?: Record<string, string>) => void;
	onToggleMenu: () => void;
	onDuplicate: (id: string) => void;
	onRank: (jobId: string) => void;
	onMarkFilled: (job: Job) => void;
	onDelete: (id: string) => void;
};

/** JobTile - Job card with context menu for the job list */
const JobTile = ({
	job,
	menuOpen,
	onNavigate,
	onToggleMenu,
	onDuplicate,
	onRank,
	onMarkFilled,
	onDelete,
}: JobTileProps) => {
	return (
		<FrostedCard
			className="p-4"
			onClick={() => onNavigate('job-editor', { id: job.id, mode: 'view' })}
		>
			<div className="flex items-center justify-between">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-3 mb-2">
						<h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
							{job.title ?? 'Untitled'}
						</h3>
						<StatusBadge status={job.status} />
					</div>
					<div className="flex items-center gap-4 text-xs text-[var(--text-quaternary)]">
						{job.department && <span>{job.department}</span>}
						{job.location && <span>{job.location}</span>}
						{job.employmenttype && (
							<span className="capitalize">{job.employmenttype}</span>
						)}
						{job.experiencelevel && (
							<span className="capitalize">{job.experiencelevel}</span>
						)}
						{(job.skills?.length ?? 0) > 0 && <span>{job.skills!.length} skills</span>}
						<span className="flex items-center gap-1">
							<Clock size={10} />
							{getAge(job.createdat)}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2 ml-4">
					<div className="relative">
						<button
							onClick={(e) => {
								e.stopPropagation();
								onToggleMenu();
							}}
							className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
						>
							<MoreVertical size={16} />
						</button>
						{menuOpen && (
							<div
								className="absolute right-0 top-full mt-1 w-48 py-1 bg-[var(--dropdown-bg)] border border-[var(--dropdown-border)] rounded-xl shadow-2xl z-50"
								onClick={(e) => e.stopPropagation()}
							>
								<button
									onClick={() => {
										onNavigate('job-editor', { id: job.id, mode: 'view' });
									}}
									className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-colors"
								>
									<Eye size={14} /> View
								</button>
								<button
									onClick={() => {
										onNavigate('job-editor', { id: job.id, mode: 'edit' });
									}}
									className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-colors"
								>
									<Edit size={14} /> Edit
								</button>
								<button
									onClick={() => onDuplicate(job.id)}
									className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-colors"
								>
									<Copy size={14} /> Duplicate
								</button>
								<button
									onClick={() => onRank(job.id)}
									className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-colors"
								>
									<BarChart3 size={14} /> Rank Candidates
								</button>
								{job.status === 'published' && (
									<button
										onClick={() => onMarkFilled(job)}
										className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-colors"
									>
										<CheckCircle size={14} /> Mark as Filled
									</button>
								)}
								<div className="my-1 border-t border-[var(--border-subtle)]" />
								<button
									onClick={() => onDelete(job.id)}
									className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
								>
									<Trash2 size={14} /> Delete
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</FrostedCard>
	);
};

export default JobTile;
