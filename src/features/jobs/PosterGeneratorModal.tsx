/** @format */

import { useState } from 'react';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import Modal from '../../shared/components/Modal';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../shared/lib/config';
import useTheme from '../../shared/hooks/useTheme';
import { buildPosterPrompt, missingPosterFields } from './_private/helpers';
import type { Job, JobPoster } from '../../shared/types';

type PosterGeneratorModalProps = {
	isOpen: boolean;
	onClose: () => void;
	job: Partial<Job>;
	onSavePosters: (posters: JobPoster[]) => void;
};

type Variant = { url: string; prompt: string; refinement: string; loading: boolean };

/** PosterGeneratorModal - Generate 3 AI wall-in poster variations and persist selections. */
const PosterGeneratorModal = ({
	isOpen,
	onClose,
	job,
	onSavePosters,
}: PosterGeneratorModalProps) => {
	const { theme } = useTheme();
	const missing = missingPosterFields(job);
	const [variants, setVariants] = useState<Variant[]>([]);
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/** callAi - Calls generate-poster with N prompts; returns parallel URLs (null on per-item failure). */
	const callAi = async (prompts: string[]): Promise<(string | null)[]> => {
		try {
			const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-poster`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
				},
				body: JSON.stringify({ prompts }),
			});
			const data = await res.json();
			if (!res.ok) {
				if (res.status === 429) setError('Rate limit reached. Please retry in a moment.');
				else if (res.status === 402)
					setError('AI credits exhausted. Add funds in Workspace > Usage.');
				else setError(data?.error ?? `Poster generation failed (${res.status}).`);
				return prompts.map(() => null);
			}
			const images: { url: string; prompt: string }[] = data.images ?? [];
			// Match by prompt position; fall back to index ordering returned by the server.
			return prompts.map((p, i) => {
				const byPrompt = images.find((img) => img.prompt === p);
				return byPrompt?.url ?? images[i]?.url ?? null;
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Network error generating posters.');
			return prompts.map(() => null);
		}
	};

	const generateAll = async () => {
		setGenerating(true);
		setError(null);
		const prompts = [0, 1, 2].map((i) => buildPosterPrompt(job, theme, i));
		const initial: Variant[] = prompts.map((p) => ({
			url: '',
			prompt: p,
			refinement: '',
			loading: true,
		}));
		setVariants(initial);
		const results = await callAi(prompts);
		const next = initial.map((v, i) => ({ ...v, url: results[i] ?? '', loading: false }));
		setVariants(next);
		if (next.every((v) => !v.url) && !error) {
			setError('Poster generation failed. Please retry.');
		}
		setGenerating(false);
	};

	const refineOne = async (idx: number) => {
		const v = variants[idx];
		const prompt = buildPosterPrompt(job, theme, idx, v.refinement);
		setError(null);
		setVariants((prev) =>
			prev.map((p, i) => (i === idx ? { ...p, loading: true, prompt } : p)),
		);
		const [url] = await callAi([prompt]);
		setVariants((prev) =>
			prev.map((p, i) => (i === idx ? { ...p, url: url ?? p.url, loading: false } : p)),
		);
	};

	const saveSelected = (idx: number) => {
		const v = variants[idx];
		if (!v?.url) return;
		const poster: JobPoster = {
			url: v.url,
			prompt: v.prompt,
			createdAt: new Date().toISOString(),
		};
		onSavePosters([...(job.posters ?? []), poster]);
		onClose();
	};

	return (
		<Modal open={isOpen} onClose={onClose} title="Generate Recruitment Posters" size="lg">
			<div className="space-y-4">
				<p className="text-sm text-[var(--text-tertiary)] flex items-center gap-2">
					<Sparkles size={14} /> Three wall-in portrait variations tuned to your theme.
				</p>

				{missing.length > 0 ? (
					<div className="p-4 rounded-xl bg-[var(--accent-bg-subtle)] border border-[var(--accent-border)] text-sm text-[var(--text-secondary)]">
						Please fill in the following before generating:{' '}
						<strong>{missing.join(', ')}</strong>.
					</div>
				) : variants.length === 0 ? (
					<button
						onClick={generateAll}
						disabled={generating}
						className="w-full px-6 py-3 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
					>
						{generating ? 'Generating...' : 'Generate 3 variations'}
					</button>
				) : (
					<>
						{error && <div className="mb-3 text-sm text-red-400">{error}</div>}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{variants.map((v, i) => (
								<div
									key={i}
									className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden flex flex-col"
								>
									<div className="aspect-[2/3] bg-[var(--skeleton-bg)] flex items-center justify-center">
										{v.loading ? (
											<div className="w-6 h-6 border-2 border-[var(--accent-bg)] border-t-transparent rounded-full animate-spin" />
										) : v.url ? (
											<img
												src={v.url}
												alt={`Poster ${i + 1}`}
												className="w-full h-full object-cover"
											/>
										) : (
											<span className="text-xs text-[var(--text-quaternary)]">
												No image
											</span>
										)}
									</div>
									<div className="p-3 space-y-2">
										<input
											value={v.refinement}
											onChange={(e) =>
												setVariants((prev) =>
													prev.map((p, idx) =>
														idx === i
															? { ...p, refinement: e.target.value }
															: p,
													),
												)
											}
											placeholder="Refine: e.g. add a teal stripe"
											className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-ring)]"
										/>
										<div className="flex gap-2">
											<button
												onClick={() => refineOne(i)}
												disabled={v.loading}
												className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] disabled:opacity-50"
											>
												<RefreshCw size={12} /> Refine
											</button>
											<button
												onClick={() => saveSelected(i)}
												disabled={!v.url || v.loading}
												className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-bg-hover)] disabled:opacity-50"
											>
												<Check size={12} /> Save
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
						<button
							onClick={generateAll}
							disabled={generating}
							className="mt-4 w-full px-4 py-2 rounded-xl text-xs font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] disabled:opacity-50"
						>
							Regenerate all
						</button>
					</>
				)}
			</div>
		</Modal>
	);
};

export default PosterGeneratorModal;
