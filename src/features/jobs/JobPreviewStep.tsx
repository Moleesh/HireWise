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
	summaryError: string | null;
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
	summaryError,
	onRegenerateSummary,
	onOpenPoster,
	onSave,
	onBack,
}: JobPreviewStepProps) => {
	const renderSummary = (summary: string) => {
		const lines = summary
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

		return (
			<div className="space-y-2 text-sm">
				{lines.map((line, index) => {
					const isBullet = /^[-•]/.test(line);
					const cleanLine = line.replace(/^[-•]\s*/, '');
					const isSectionHeading = !isBullet && !line.includes('—') && line.length < 40;

					if (isBullet) {
						return (
							<div key={`${line}-${index}`} className="flex items-start gap-2.5">
								<span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent-bg-subtle)] border border-[var(--accent-border)] text-[var(--accent-text)] text-[10px]">
									✓
								</span>
								<span className="text-[var(--text-primary)] leading-relaxed">
									{cleanLine}
								</span>
							</div>
						);
					}

					if (isSectionHeading) {
						return (
							<p
								key={`${line}-${index}`}
								className="mt-2 text-[var(--accent-text)] font-semibold"
							>
								{line}
							</p>
						);
					}

					return (
						<p
							key={`${line}-${index}`}
							className="text-[var(--text-primary)] leading-relaxed"
						>
							{line}
						</p>
					);
				})}
			</div>
		);
	};

	return (
		<div className="space-y-6">
			<FrostedCard className="p-6" hover={false}>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-tight">
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
					<div className="text-[var(--text-primary)]">
						{job.summary ? (
							renderSummary(job.summary)
						) : (
							<p className="text-sm text-[var(--text-tertiary)]">
								No summary yet. Click Regenerate to create one.
							</p>
						)}
					</div>
				)}
				{summaryError && (
					<div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
						{summaryError}
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
						Poster Studio
					</h3>
					{!isView && (
						<button
							onClick={onOpenPoster}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] hover:bg-[var(--accent-bg)] hover:text-white transition-all"
							type="button"
						>
							<ImageIcon size={12} /> Create Poster
						</button>
					)}
				</div>
				<p className="text-xs text-[var(--text-tertiary)] mb-3">
					Generate one AI poster for this job, refine the style, then save it for sharing.
				</p>
				{(job.posters ?? []).length === 0 ? (
					<p className="text-sm text-[var(--text-tertiary)]">
						No poster yet. Click <strong>Create Poster</strong> to generate one from
						this job details.
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
