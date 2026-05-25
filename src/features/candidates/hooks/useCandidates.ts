/** @format */

import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../../shared/lib/config';
import { extractResumeText } from '../_private/extractResumeText';
import { openRawResume, openUrlInNewTab } from '../_private/openCandidateFile';
import type { Candidate } from '../../../shared/types';

/** useCandidates - Hook for candidate CRUD operations, resume upload, and download */
const useCandidates = () => {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [loading, setLoading] = useState(true);

	const loadCandidates = async () => {
		setLoading(true);
		const { data } = await supabase
			.from('candidates')
			.select('*')
			.order('createdAt', { ascending: false });
		setCandidates((data as Candidate[]) ?? []);
		setLoading(false);
	};

	useEffect(() => {
		// Defer to avoid triggering react-hooks/set-state-in-effect (ESLint 10+ rule).
		void Promise.resolve().then(loadCandidates);
	}, []);

	const uploadResume = async (file: File) => {
		const fileExt = file.name.split('.').pop();
		const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from('resumes')
			.upload(filePath, file);
		if (uploadError) return { data: null, error: uploadError.message };

		const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
		const fileUrl = urlData?.publicUrl ?? '';

		// Extract text on the client so the edge function gets real content
		// for PDF/DOCX/TXT instead of binary garbage.
		const rawText = await extractResumeText(file);

		const parseRes = await fetch(`${SUPABASE_URL}/functions/v1/parse-resume`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({ text: rawText, file_name: file.name }),
		});
		const parsed = await parseRes.json();

		const candidateData: Partial<Candidate> = {
			name: parsed.candidate_name ?? file.name.replace(/\.[^/.]+$/, ''),
			email: parsed.candidate_email ?? '',
			source: 'upload',
			fileUrl,
			fileName: file.name,
			rawText,
			skills: parsed.skills ?? [],
			experienceYears: parsed.experience_years ?? 0,
			education: parsed.education ?? [],
			workHistory: parsed.work_history ?? [],
			parsedData: parsed,
		};

		const { data, error } = await supabase
			.from('candidates')
			.insert(candidateData)
			.select()
			.single();

		if (!error && data) {
			setCandidates((prev) => [data as Candidate, ...prev]);
		}
		return { data: data as Candidate | null, error: error?.message ?? null };
	};

	const deleteCandidate = async (id: string) => {
		const { error } = await supabase.from('candidates').delete().eq('id', id);
		if (!error) setCandidates((prev) => prev.filter((c) => c.id !== id));
		return { error: error?.message ?? null };
	};

	const downloadResume = async (candidate: Candidate) => {
		if (candidate.fileUrl) {
			const { data, error } = await supabase.storage
				.from('resumes')
				.createSignedUrl(candidate.fileUrl.split('/').pop()!, 60);

			if (!error && data?.signedUrl) {
				openUrlInNewTab(data.signedUrl);
				return;
			}
		}

		if (candidate.rawText) {
			openRawResume(candidate);
		}
	};

	const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
		const { data, error } = await supabase
			.from('candidates')
			.update({ ...updates, updatedAt: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();
		if (!error && data) {
			setCandidates((prev) => prev.map((c) => (c.id === id ? (data as Candidate) : c)));
		}
		return { data: data as Candidate | null, error: error?.message ?? null };
	};

	return {
		candidates,
		loading,
		loadCandidates,
		uploadResume,
		deleteCandidate,
		downloadResume,
		updateCandidate,
	};
};

export { useCandidates };
