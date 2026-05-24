/** @format */

import { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../shared/lib/config';
import { ArrowLeft, Save, Send, Check } from 'lucide-react';
import StatusBadge from '../../shared/components/StatusBadge';
import JobPasteStep from './JobPasteStep';
import JobDetailsStep from './JobDetailsStep';
import JobPreviewStep from './JobPreviewStep';
import PosterGeneratorModal from './PosterGeneratorModal';
import type { Job, JobPoster, Page } from '../../shared/types';
import { emptyJob } from './_private/constants';

type JobEditorProps = {
	onNavigate: (page: Page, data?: Record<string, string>) => void;
	jobId?: string;
	mode?: 'create' | 'edit' | 'view';
};

type Step = 1 | 2 | 3;

/** callEdge - thin POST helper to a Supabase edge function with anon auth. */
const callEdge = async <T,>(name: string, body: unknown): Promise<T | null> => {
	try {
		const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify(body),
		});
		return (await res.json()) as T;
	} catch {
		return null;
	}
};

/** JobEditorPage - Orchestrates the 3-step JD creation flow plus AI poster modal. */
const JobEditorPage = ({ onNavigate, jobId, mode = 'create' }: JobEditorProps) => {
	const [step, setStep] = useState<Step>(1);
	const [job, setJob] = useState<Partial<Job>>({ ...emptyJob });
	const [rawText, setRawText] = useState('');
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [parsing, setParsing] = useState(false);
	const [enhancing, setEnhancing] = useState(false);
	const [summarizing, setSummarizing] = useState(false);
	const [posterOpen, setPosterOpen] = useState(false);
	const [newItem, setNewItem] = useState<Record<string, string>>({});
	const isView = mode === 'view';

	const loadJob = async (id: string) => {
		setLoading(true);
		const { data } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
		if (data) {
			setJob(data as Job);
			if (data.summary) setRawText(data.summary ?? '');
		}
		setLoading(false);
	};

	useEffect(() => {
		if (jobId) {
			// Defer to avoid triggering react-hooks/set-state-in-effect (ESLint 10+ rule).
			void Promise.resolve().then(() => loadJob(jobId));
		}
	}, [jobId]);

	const enhanceText = async () => {
		if (!rawText.trim()) return;
		setEnhancing(true);
		const parsed = await callEdge<{ text?: string }>('parse-jd', {
			text: rawText,
			mode: 'enhance',
		});
		if (parsed?.text) setRawText(parsed.text);
		setEnhancing(false);
	};

	const parseRawText = async () => {
		if (!rawText.trim()) return;
		setParsing(true);
		const parsed = await callEdge<Record<string, unknown>>('parse-jd', {
			text: rawText,
			mode: 'parse',
		});
		if (parsed) {
			setJob((prev) => ({
				...prev,
				title: (parsed.title as string) ?? prev.title ?? '',
				department: (parsed.department as string) ?? prev.department ?? '',
				skills: (parsed.skills as string[]) ?? prev.skills ?? [],
				goodtohave:
					(parsed.goodtohave as string[]) ??
					(parsed.goodToHave as string[]) ??
					prev.goodtohave ??
					[],
				summary: (parsed.summary as string) ?? rawText,
			}));
		} else {
			setJob((prev) => ({ ...prev, summary: rawText }));
		}
		setParsing(false);
		setStep(2);
	};

	const generateSummary = async () => {
		if (!job.title?.trim()) return;
		setSummarizing(true);
		const res = await callEdge<{ summary?: string }>('generate-summary', {
			title: job.title,
			department: job.department,
			skills: job.skills,
			goodtohave: job.goodtohave,
		});
		if (res?.summary) setJob((prev) => ({ ...prev, summary: res.summary }));
		setSummarizing(false);
	};

	// Auto-generate the summary the first time the user lands on step 3 without one.
	useEffect(() => {
		if (step === 3 && !isView && !job.summary?.trim() && job.title?.trim()) {
			// Defer to avoid triggering react-hooks/set-state-in-effect (ESLint 10+ rule).
			void Promise.resolve().then(generateSummary);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	const handleSave = async (status?: 'draft' | 'published') => {
		setSaving(true);
		const saveData = { ...job, status: status ?? job.status ?? 'draft' };
		const result = jobId
			? await supabase
					.from('jobs')
					.update({ ...saveData, updatedat: new Date().toISOString() })
					.eq('id', jobId)
					.select()
					.single()
			: await supabase.from('jobs').insert(saveData).select().single();
		setSaving(false);
		if (result.data) onNavigate('jobs');
	};

	const updateField = (field: keyof Job, value: unknown) =>
		setJob((prev) => ({ ...prev, [field]: value }));

	const addSkill = (skill: string) => {
		const v = skill.trim();
		if (!v || (job.skills ?? []).includes(v)) return;
		updateField('skills', [...(job.skills ?? []), v]);
		setNewItem((p) => ({ ...p, skill: '' }));
	};

	const removeSkill = (skill: string) =>
		updateField(
			'skills',
			(job.skills ?? []).filter((s) => s !== skill),
		);

	const addGoodToHave = (item: string) => {
		const v = item.trim();
		if (!v || (job.goodtohave ?? []).includes(v)) return;
		updateField('goodtohave', [...(job.goodtohave ?? []), v]);
		setNewItem((p) => ({ ...p, goodtohave: '' }));
	};

	const removeGoodToHave = (item: string) =>
		updateField(
			'goodtohave',
			(job.goodtohave ?? []).filter((s) => s !== item),
		);

	const handleSavePosters = (posters: JobPoster[]) => updateField('posters', posters);

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto flex items-center justify-center h-96">
				<div className="w-8 h-8 border-2 border-[var(--accent-bg)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<button
						onClick={() => onNavigate('jobs')}
						className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
					>
						<ArrowLeft size={20} />
					</button>
					<div>
						<h1 className="text-xl font-bold text-[var(--text-primary)]">
							{isView ? 'View Job' : jobId ? 'Edit Job' : 'New Job Description'}
						</h1>
						{jobId && <StatusBadge status={job.status ?? 'draft'} size="md" />}
					</div>
				</div>
				{!isView && step === 3 && (
					<div className="flex items-center gap-3">
						<button
							onClick={() => handleSave('draft')}
							disabled={saving}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all disabled:opacity-50"
						>
							<Save size={16} /> Save Draft
						</button>
						<button
							onClick={() => handleSave('published')}
							disabled={saving}
							className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
						>
							<Send size={16} /> Publish
						</button>
					</div>
				)}
			</div>

			{!isView && (
				<div className="flex items-center gap-2 mb-8">
					{[
						{ n: 1, label: 'Paste JD' },
						{ n: 2, label: 'Details' },
						{ n: 3, label: 'Summary' },
					].map((s, i) => {
						// When editing an existing job, every step is reachable so the user
						// can choose either method (re-paste or edit fields directly).
						const clickable = !!jobId || s.n < step;
						return (
							<div key={s.n} className="flex items-center gap-2 flex-1">
								<button
									onClick={() => clickable && setStep(s.n as Step)}
									disabled={!clickable}
									className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
										step === s.n
											? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]'
											: step > s.n
												? 'bg-[var(--accent-bg)] text-white cursor-pointer'
												: clickable
													? 'bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] cursor-pointer'
													: 'bg-[var(--btn-ghost-bg)] text-[var(--text-quaternary)]'
									}`}
								>
									{step > s.n ? <Check size={14} /> : s.n}
									<span className="hidden sm:inline">{s.label}</span>
								</button>
								{i < 2 && <div className="flex-1 h-px bg-[var(--border-subtle)]" />}
							</div>
						);
					})}
				</div>
			)}

			{step === 1 && !isView && (
				<JobPasteStep
					rawText={rawText}
					onRawTextChange={setRawText}
					onParse={parseRawText}
					onEnhance={enhanceText}
					parsing={parsing}
					enhancing={enhancing}
				/>
			)}

			{step === 2 && !isView && (
				<JobDetailsStep
					job={job}
					newItem={newItem}
					onUpdateField={updateField}
					onAddSkill={addSkill}
					onRemoveSkill={removeSkill}
					onAddGoodToHave={addGoodToHave}
					onRemoveGoodToHave={removeGoodToHave}
					onNewItemChange={(updates) => setNewItem((prev) => ({ ...prev, ...updates }))}
					onNext={() => setStep(3)}
					onBack={() => setStep(1)}
				/>
			)}

			{(step === 3 || isView) && (
				<JobPreviewStep
					job={job}
					isView={isView}
					saving={saving}
					summarizing={summarizing}
					onRegenerateSummary={generateSummary}
					onOpenPoster={() => setPosterOpen(true)}
					onSave={handleSave}
					onBack={() => setStep(2)}
				/>
			)}

			<PosterGeneratorModal
				isOpen={posterOpen}
				onClose={() => setPosterOpen(false)}
				job={job}
				onSavePosters={handleSavePosters}
			/>
		</div>
	);
};

export default JobEditorPage;
