/** @format */

import { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../shared/lib/config';
import { ArrowLeft, Save, Send, Check } from 'lucide-react';
import StatusBadge from '../../shared/components/StatusBadge';
import JobPasteStep from './JobPasteStep';
import JobDetailsStep from './JobDetailsStep';
import JobPreviewStep from './JobPreviewStep';
import type { Job, Page } from '../../shared/types';
import { emptyJob } from './_private/constants';

type JobEditorProps = {
  onNavigate: (page: Page, data?: Record<string, string>) => void;
  jobId?: string;
  mode?: 'create' | 'edit' | 'view';
};

type Step = 1 | 2 | 3;

/** JobEditorPage - Job editor page orchestrating the 3-step JD creation flow */
const JobEditorPage = ({ onNavigate, jobId, mode = 'create' }: JobEditorProps) => {
  const [step, setStep] = useState<Step>(1);
  const [job, setJob] = useState<Partial<Job>>({ ...emptyJob });
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const isView = mode === 'view';

  useEffect(() => {
    if (jobId) loadJob(jobId);
  }, [jobId]);

  const loadJob = async (id: string) => {
    setLoading(true);
    const { data } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
    if (data) {
      setJob(data as Job);
      if (data.summary) setRawText(data.summary ?? '');
    }
    setLoading(false);
  };

  const parseRawText = async () => {
    if (!rawText.trim()) return;
    setParsing(true);

    try {
      const apiUrl = `${SUPABASE_URL}/functions/v1/parse-jd`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      };
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: rawText }),
      });
      const parsed = await res.json();

      setJob((prev) => ({
        ...prev,
        title: parsed.title ?? prev.title ?? '',
        department: parsed.department ?? prev.department ?? '',
        location: parsed.location ?? prev.location ?? '',
        employmenttype: parsed.employmentType ?? prev.employmenttype ?? 'full-time',
        experiencelevel: parsed.experienceLevel ?? prev.experiencelevel ?? 'mid',
        salaryrange: parsed.salaryRange ?? prev.salaryrange ?? '',
        summary: parsed.summary ?? rawText,
        responsibilities: parsed.responsibilities ?? prev.responsibilities ?? [],
        requirements: parsed.requirements ?? prev.requirements ?? [],
        skills: parsed.skills ?? prev.skills ?? [],
        benefits: parsed.benefits ?? prev.benefits ?? [],
      }));
    } catch {
      setJob((prev) => ({ ...prev, summary: rawText }));
    }

    setParsing(false);
    setStep(2);
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    setSaving(true);
    const saveData = { ...job, status: status ?? job.status ?? 'draft' };

    let result;
    if (jobId) {
      result = await supabase
        .from('jobs')
        .update({ ...saveData, updatedat: new Date().toISOString() })
        .eq('id', jobId)
        .select()
        .single();
    } else {
      result = await supabase.from('jobs').insert(saveData).select().single();
    }

    setSaving(false);
    if (result.data) onNavigate('jobs');
  };

  const updateField = (field: keyof Job, value: unknown) => {
    setJob((prev) => ({ ...prev, [field]: value }));
  };

  const addToList = (field: 'responsibilities' | 'requirements' | 'benefits', value: string) => {
    if (!value.trim()) return;
    updateField(field, [...(job[field] ?? []), value.trim()]);
    setNewItem((prev) => ({ ...prev, [field]: '' }));
  };

  const removeFromList = (
    field: 'responsibilities' | 'requirements' | 'benefits',
    index: number,
  ) => {
    updateField(
      field,
      (job[field] ?? []).filter((_, i) => i !== index),
    );
  };

  const addSkill = (skill: string) => {
    if (!skill.trim() || (job.skills ?? []).includes(skill.trim())) return;
    updateField('skills', [...(job.skills ?? []), skill.trim()]);
    setNewItem((prev) => ({ ...prev, skill: '' }));
  };

  const removeSkill = (skill: string) => {
    updateField(
      'skills',
      (job.skills ?? []).filter((s) => s !== skill),
    );
  };

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
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => s.n < step && setStep(s.n as Step)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  step === s.n
                    ? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]'
                    : step > s.n
                      ? 'bg-[var(--accent-bg)] text-white cursor-pointer'
                      : 'bg-[var(--btn-ghost-bg)] text-[var(--text-quaternary)]'
                }`}
              >
                {step > s.n ? <Check size={14} /> : s.n}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 2 && <div className="flex-1 h-px bg-[var(--border-subtle)]" />}
            </div>
          ))}
        </div>
      )}

      {step === 1 && !isView && (
        <JobPasteStep
          rawText={rawText}
          onRawTextChange={setRawText}
          onParse={parseRawText}
          parsing={parsing}
        />
      )}

      {step === 2 && !isView && (
        <JobDetailsStep
          job={job}
          newItem={newItem}
          onUpdateField={updateField}
          onAddToList={addToList}
          onRemoveFromList={removeFromList}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
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
          onSave={handleSave}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
};

export default JobEditorPage;
