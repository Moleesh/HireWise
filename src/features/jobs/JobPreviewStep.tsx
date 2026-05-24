/** @format */

import { ArrowLeft, Save, Send, Sparkles, ImageIcon, RefreshCw } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import ClipboardButton from '../../shared/components/ClipboardButton';
import StatusBadge from '../../shared/components/StatusBadge';
import type { Job } from '../../shared/types';

type JobPreviewStepProps = {
	job: Partial<Job>;
	isView: boolean;
	saving: boolean;
	summarizing: boolean;
	onRegenerateSummary: () => void;
	onOpenPoster: () => void;
	onSave: (status?: 'draft' | 'published') => void;
	onBack: () => void;
};

/** JobPreviewStep - Step 3: AI-generated bulleted summary, skills, posters. */
const JobPreviewStep = ({
	job,
	isView,
	saving,
	summarizing,
	onRegenerateSummary,
	onOpenPoster,
	onSave,
	onBack,
}: JobPreviewStepProps) => {
	return (
		<div className="space-y-6">
			<FrostedCard className="p-6" hover={false}>
				<div className="flex items-start justify-between mb-4">
					<div>
						<div className="flex items-center gap-2 mb-1">
							<h2 className="text-2xl font-bold text-[var(--text-primary)]">
								{job.title ?? 'Untitled'}
							</h2>
							<ClipboardButton text={job.title ?? ''} />
						</div>
						<div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
							{job.department && <span>{job.department}</span>}
						</div>
					</div>
					<StatusBadge status={job.status ?? 'draft'} size="md" />
				</div>
			</FrostedCard>

			<FrostedCard className="p-6" hover={false}>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
						Professional Summary
					</h3>
					<div className="flex items-center gap-2">
						{!isView && (
							<button
								onClick={onRegenerateSummary}
								disabled={summarizing}
								className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all disabled:opacity-50"
								type="button"
							>
								<RefreshCw
									size={12}
									className={summarizing ? 'animate-spin' : ''}
								/>{' '}
								Regenerate
							</button>
						)}
						{job.summary && <ClipboardButton text={job.summary} />}
					</div>
				</div>
				{summarizing && !job.summary ? (
					<div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
						<Sparkles size={14} className="animate-pulse" /> Generating professional
						summary...
					</div>
				) : (
					<div className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap text-sm">
						{job.summary ?? 'No summary yet. Click Regenerate to create one.'}
					</div>
				)}
			</FrostedCard>

			{(job.skills ?? []).length > 0 && (
				<FrostedCard className="p-6" hover={false}>
					<h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
						Required Skills
					</h3>
					<div className="flex flex-wrap gap-2">
						{job.skills!.map((skill) => (
							<span
								key={skill}
								className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]"
							>
								{skill}
							</span>
						))}
					</div>
				</FrostedCard>
			)}

			{(job.goodToHave ?? []).length > 0 && (
				<FrostedCard className="p-6" hover={false}>
					<h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
						Good to Have
					</h3>
					<div className="flex flex-wrap gap-2">
						{job.goodToHave!.map((item) => (
							<span
								key={item}
								className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
							>
								{item}
							</span>
						))}
					</div>
				</FrostedCard>
			)}

			<FrostedCard className="p-6" hover={false}>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
						Recruitment Posters
					</h3>
					{!isView && (
						<button
							onClick={onOpenPoster}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] hover:bg-[var(--accent-bg)] hover:text-white transition-all"
							type="button"
						>
							<ImageIcon size={12} /> Generate
						</button>
					)}
				</div>
				{(job.posters ?? []).length === 0 ? (
					<p className="text-sm text-[var(--text-tertiary)]">
						No posters yet. Use AI to generate a wall-in recruitment poster.
					</p>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{job.posters!.map((p, i) => (
							<a
								key={i}
								href={p.url}
								target="_blank"
								rel="noreferrer"
								className="aspect-[2/3] rounded-lg overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--accent-border)] transition-all"
							>
								<img
									src={p.url}
									alt={`Poster ${i + 1}`}
									className="w-full h-full object-cover"
								/>
							</a>
						))}
					</div>
				)}
			</FrostedCard>

			{!isView && (
				<div className="flex justify-between">
					<button
						onClick={onBack}
						className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
					>
						<ArrowLeft size={16} /> Back
					</button>
					<div className="flex items-center gap-3">
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
				</div>
			)}
		</div>
	);
};

export default JobPreviewStep;
