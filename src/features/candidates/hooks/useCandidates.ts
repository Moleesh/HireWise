/** @format */

import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../../shared/lib/config';
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
      .order('createdat', { ascending: false });
    setCandidates((data as Candidate[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const uploadResume = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, file);
    if (uploadError) return { data: null, error: uploadError.message };

    const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
    const fileurl = urlData?.publicUrl ?? '';

    let rawtext = '';
    if (file.type === 'text/plain') {
      rawtext = await file.text();
    }

    const parseRes = await fetch(`${SUPABASE_URL}/functions/v1/parse-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ text: rawtext, file_name: file.name }),
    });
    const parsed = await parseRes.json();

    const candidateData: Partial<Candidate> = {
      name: parsed.candidate_name ?? file.name.replace(/\.[^/.]+$/, ''),
      email: parsed.candidate_email ?? '',
      source: 'upload',
      fileurl,
      filename: file.name,
      rawtext,
      skills: parsed.skills ?? [],
      experienceyears: parsed.experience_years ?? 0,
      education: parsed.education ?? [],
      workhistory: parsed.work_history ?? [],
      parseddata: parsed,
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
    if (candidate.fileurl) {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(candidate.fileurl.split('/').pop()!, 60);

      if (!error && data?.signedUrl) {
        const a = document.createElement('a');
        a.href = data.signedUrl;
        a.download = candidate.filename ?? `${candidate.name}_resume.pdf`;
        a.click();
        return;
      }
    }

    if (candidate.rawtext) {
      const blob = new Blob([candidate.rawtext], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidate.name}_resume.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
    const { data, error } = await supabase
      .from('candidates')
      .update({ ...updates, updatedat: new Date().toISOString() })
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
