/** @format */

import { useEffect, useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { findJobByCode, isShortJobCode } from '../../../shared/lib/jobCode';
import type { Job, JobPoster, Page } from '../../../shared/types';
import { callEdge } from '../_private/edge';
import { emptyJob } from '../_private/constants';

export type JobEditorMode = 'create' | 'edit' | 'view';
export type JobEditorStep = 1 | 2 | 3;

type UseJobEditorStateParams = {
	jobId?: string;
	mode: JobEditorMode;
	onNavigate: (page: Page, data?: Record<string, string>) => void;
};

export const useJobEditorState = ({ jobId, mode, onNavigate }: UseJobEditorStateParams) => {
	const [step, setStep] = useState<JobEditorStep>(mode === 'edit' ? 2 : 1);
	const [job, setJob] = useState<Partial<Job>>({ ...emptyJob });
	const [rawText, setRawText] = useState('');
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [parsing, setParsing] = useState(false);
	const [enhancing, setEnhancing] = useState(false);
	const [summarizing, setSummarizing] = useState(false);
	const [summaryError, setSummaryError] = useState<string | null>(null);
	const [posterOpen, setPosterOpen] = useState(false);
	const [newItem, setNewItem] = useState<Record<string, string>>({});
	const isView = mode === 'view';

	const loadJob = async (id: string) => {
		setLoading(true);
		const { data } = isShortJobCode(id)
			? await supabase.from('jobs').select('*')
			: await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
		const resolvedJob = Array.isArray(data) ? findJobByCode(data as Job[], id) : (data as Job);
		if (resolvedJob) {
			setJob(resolvedJob);
			if (resolvedJob.summary) setRawText(resolvedJob.summary ?? '');
			setStep(mode === 'edit' ? 2 : 3);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (jobId) void Promise.resolve().then(() => loadJob(jobId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				goodToHave: (parsed.goodToHave as string[]) ?? prev.goodToHave ?? [],
				summary: (parsed.summary as string) ?? rawText,
			}));
		} else {
			setJob((prev) => ({ ...prev, summary: rawText }));
		}
		setParsing(false);
		setStep(2);
	};

	const generateSummary = async (persist = false) => {
		if (!job.title?.trim()) return;
		setSummarizing(true);
		setSummaryError(null);
		const res = await callEdge<{ summary?: string; error?: string; status?: number }>(
			'generate-summary',
			{
				title: job.title,
				department: job.department,
				skills: job.skills,
				goodToHave: job.goodToHave,
			},
		);
		if (res?.summary) {
			setJob((prev) => ({ ...prev, summary: res.summary }));
			if (persist && (job.id || jobId)) {
				await supabase
					.from('jobs')
					.update({ summary: res.summary, updatedAt: new Date().toISOString() })
					.eq('id', job.id ?? jobId);
			}
		} else {
			setSummaryError(
				res?.error ??
					'Unable to regenerate summary right now. Please check API key/config and try again.',
			);
		}
		setSummarizing(false);
	};

	useEffect(() => {
		if (step === 3 && !isView && !job.summary?.trim() && job.title?.trim()) {
			void Promise.resolve().then(() => generateSummary());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	const handleSave = async (status?: 'draft' | 'published') => {
		setSaving(true);
		const saveData = { ...job, status: status ?? job.status ?? 'draft' };
		const existingId = job.id ?? jobId;
		const result = existingId
			? await supabase
					.from('jobs')
					.update({ ...saveData, updatedAt: new Date().toISOString() })
					.eq('id', existingId)
					.select()
					.single()
			: await supabase.from('jobs').insert(saveData).select().single();
		setSaving(false);
		if (result.data) onNavigate('jobs');
	};

	const updateField = (field: keyof Job, value: unknown) =>
		setJob((prev) => ({ ...prev, [field]: value }));

	const addSkill = (skill: string) => {
		const value = skill.trim();
		if (!value || (job.skills ?? []).includes(value)) return;
		updateField('skills', [...(job.skills ?? []), value]);
		setNewItem((prev) => ({ ...prev, skill: '' }));
	};

	const removeSkill = (skill: string) =>
		updateField(
			'skills',
			(job.skills ?? []).filter((item) => item !== skill),
		);

	const addGoodToHave = (item: string) => {
		const value = item.trim();
		if (!value || (job.goodToHave ?? []).includes(value)) return;
		updateField('goodToHave', [...(job.goodToHave ?? []), value]);
		setNewItem((prev) => ({ ...prev, goodToHave: '' }));
	};

	const removeGoodToHave = (item: string) =>
		updateField(
			'goodToHave',
			(job.goodToHave ?? []).filter((value) => value !== item),
		);

	const handleSavePosters = async (posters: JobPoster[]) => {
		updateField('posters', posters);
		if (isView && (job.id || jobId)) {
			await supabase
				.from('jobs')
				.update({ posters, updatedAt: new Date().toISOString() })
				.eq('id', job.id ?? jobId);
		}
	};

	return {
		addGoodToHave,
		addSkill,
		enhanceText,
		enhancing,
		generateSummary,
		handleSave,
		handleSavePosters,
		isView,
		job,
		loading,
		newItem,
		parseRawText,
		parsing,
		posterOpen,
		rawText,
		removeGoodToHave,
		removeSkill,
		saving,
		setNewItem,
		setPosterOpen,
		setRawText,
		setStep,
		step,
		summaryError,
		summarizing,
		updateField,
	};
};
