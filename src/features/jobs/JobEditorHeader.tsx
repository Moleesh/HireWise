/** @format */

import { ArrowLeft, ImageIcon, Pencil, RefreshCw, Save, Send } from 'lucide-react';
import StatusBadge from '../../shared/components/StatusBadge';
import type { Job, Page } from '../../shared/types';

type JobEditorHeaderProps = {
	job: Partial<Job>;
	jobId?: string;
	isView: boolean;
	step: number;
	saving: boolean;
	summarizing: boolean;
	summaryError: string | null;
	onNavigate: (page: Page, data?: Record<string, string>) => void;
	onRegenerateSummary: () => void;
	onOpenPoster: () => void;
	onSave: (status: 'draft' | 'published') => void;
};

/** JobEditorHeader - Title and primary actions for create, edit, and view modes. */
const JobEditorHeader = ({
	job,
	jobId,
	isView,
	step,
	saving,
	summarizing,
	summaryError,
	onNavigate,
	onRegenerateSummary,
	onOpenPoster,
	onSave,
}: JobEditorHeaderProps) => (
	<div className="mb-6 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 md:p-5 shadow-2xl shadow-black/5">
		<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div className="flex items-center gap-3 min-w-0">
				<button
					onClick={() => onNavigate('jobs')}
					className="p-2.5 rounded-2xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
					aria-label="Back to jobs"
				>
					<ArrowLeft size={20} />
				</button>
				<div className="min-w-0">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-text)]">
						{isView ? 'Job Overview' : 'Job Workspace'}
					</p>
					<h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] truncate">
						{isView ? 'View Job' : jobId ? 'Edit Job' : 'New Job Description'}
					</h1>
					{jobId && (
						<div className="mt-2">
							<StatusBadge status={job.status ?? 'draft'} size="md" />
						</div>
					)}
				</div>
			</div>
			{isView && jobId && (
				<div className="flex flex-col items-stretch gap-2 lg:items-end">
					<div className="flex flex-wrap items-center gap-2 lg:justify-end">
						<button
							onClick={onRegenerateSummary}
							disabled={summarizing}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all disabled:opacity-50"
						>
							<RefreshCw size={16} className={summarizing ? 'animate-spin' : ''} />
							Regenerate
						</button>
						<button
							onClick={onOpenPoster}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] hover:bg-[var(--accent-bg)] hover:text-white transition-all"
						>
							<ImageIcon size={16} /> Generate Poster
						</button>
						<button
							onClick={() => onNavigate('job-editor', { id: jobId, mode: 'edit' })}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all shadow-lg shadow-[var(--accent-shadow)]"
						>
							<Pencil size={16} /> Edit Job
						</button>
					</div>
					{summaryError && (
						<div className="w-full lg:max-w-md rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
							{summaryError}
						</div>
					)}
				</div>
			)}
			{!isView && step === 3 && (
				<div className="flex flex-wrap items-center gap-2 lg:justify-end">
					<button
						onClick={() => onSave('draft')}
						disabled={saving}
						className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all disabled:opacity-50"
					>
						<Save size={16} /> Save Draft
					</button>
					<button
						onClick={() => onSave('published')}
						disabled={saving}
						className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
					>
						<Send size={16} /> Publish
					</button>
				</div>
			)}
		</div>
	</div>
);

export default JobEditorHeader;
