/** @format */

import { ArrowLeft, Save, Send, Check } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import ClipboardButton from '../../shared/components/ClipboardButton';
import StatusBadge from '../../shared/components/StatusBadge';
import type { Job } from '../../shared/types';

type JobPreviewStepProps = {
  job: Partial<Job>;
  isView: boolean;
  saving: boolean;
  onSave: (status?: 'draft' | 'published') => void;
  onBack: () => void;
};

/** JobPreviewStep - Step 3 of job editor: beautified summary view with save/publish actions */
const JobPreviewStep = ({ job, isView, saving, onSave, onBack }: JobPreviewStepProps) => {
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
              {job.location && <span>{job.location}</span>}
              {job.employmenttype && <span className="capitalize">{job.employmenttype}</span>}
              {job.experiencelevel && <span className="capitalize">{job.experiencelevel}</span>}
              {job.salaryrange && <span>{job.salaryrange}</span>}
            </div>
          </div>
          <StatusBadge status={job.status ?? 'draft'} size="md" />
        </div>
      </FrostedCard>

      {job.summary && (
        <FrostedCard className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Summary
            </h3>
            <ClipboardButton text={job.summary} />
          </div>
          <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
            {job.summary}
          </p>
        </FrostedCard>
      )}

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

      {(job.responsibilities ?? []).length > 0 && (
        <FrostedCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Responsibilities
          </h3>
          <ul className="space-y-2">
            {job.responsibilities!.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bg)] mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </FrostedCard>
      )}

      {(job.requirements ?? []).length > 0 && (
        <FrostedCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Requirements
          </h3>
          <ul className="space-y-2">
            {job.requirements!.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-bg)] mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </FrostedCard>
      )}

      {(job.benefits ?? []).length > 0 && (
        <FrostedCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Benefits
          </h3>
          <ul className="space-y-2">
            {job.benefits!.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
                <Check size={14} className="text-[var(--accent-text)] mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </FrostedCard>
      )}

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
