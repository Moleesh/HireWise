/** @format */

import { CreditCard as Edit, Eye, Trash2, Copy, BarChart3, CheckCircle, Clock } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import StatusBadge from '../../shared/components/StatusBadge';
import { getAge } from '../../shared/lib/dateHelpers';
import type { Page, Job } from '../../shared/types';

type JobTileProps = {
	job: Job;
	onNavigate: (page: Page, data?: Record<string, string>) => void;
	onDuplicate: (id: string) => void;
	onRank: (jobId: string) => void;
	onMarkFilled: (job: Job) => void;
	onDelete: (id: string) => void;
};

/** JobTile - Job card with context menu for the job list */
const JobTile = ({
	job,
	onNavigate,
	onDuplicate,
	onRank,
	onMarkFilled,
	onDelete,
}: JobTileProps) => {
	const metaItems = [
		job.department,
		job.location,
		job.employmentType,
		job.experienceLevel,
		(job.skills?.length ?? 0) > 0 ? `${job.skills!.length} skills` : '',
	].filter(Boolean);

	return (
		<FrostedCard
			className="p-4 sm:p-5"
			onClick={() => onNavigate('job-editor', { id: job.id, mode: 'view' })}
		>
			<div className="space-y-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<h3 className="text-base sm:text-sm font-semibold text-[var(--text-primary)] truncate">
							{job.title ?? 'Untitled'}
						</h3>
					</div>
					<div className="shrink-0">
						<StatusBadge status={job.status} />
					</div>
				</div>

				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-wrap gap-2 text-xs text-[var(--text-quaternary)]">
						{metaItems.slice(0, 3).map((item) => (
							<span
								key={item}
								className="px-2 py-1 rounded-lg bg-[var(--btn-ghost-bg)] capitalize"
							>
								{item}
							</span>
						))}
						<span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--btn-ghost-bg)]">
							<Clock size={10} />
							{getAge(job.createdAt)}
						</span>
					</div>
				</div>

				<div className="flex items-center justify-end gap-1.5 border-t border-[var(--border-subtle)] pt-2">
					<div className="flex items-center justify-end gap-1.5">
						<button
							onClick={(event) => {
								event.stopPropagation();
								onNavigate('job-editor', { id: job.id, mode: 'view' });
							}}
							className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
							title="View"
						>
							<Eye size={14} />
						</button>
						<button
							onClick={(event) => {
								event.stopPropagation();
								onNavigate('job-editor', { id: job.id, mode: 'edit' });
							}}
							className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
							title="Edit"
						>
							<Edit size={14} />
						</button>
						<button
							onClick={(event) => {
								event.stopPropagation();
								onDuplicate(job.id);
							}}
							className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
							title="Duplicate"
						>
							<Copy size={14} />
						</button>
						<button
							onClick={(event) => {
								event.stopPropagation();
								onRank(job.id);
							}}
							className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
							title="Rank candidates"
						>
							<BarChart3 size={14} />
						</button>
						{job.status === 'published' && (
							<button
								onClick={(event) => {
									event.stopPropagation();
									onMarkFilled(job);
								}}
								className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
								title="Mark as filled"
							>
								<CheckCircle size={14} />
							</button>
						)}
						<button
							onClick={(event) => {
								event.stopPropagation();
								onDelete(job.id);
							}}
							className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
							title="Delete"
						>
							<Trash2 size={14} />
						</button>
					</div>
				</div>
			</div>
		</FrostedCard>
	);
};

export default JobTile;
