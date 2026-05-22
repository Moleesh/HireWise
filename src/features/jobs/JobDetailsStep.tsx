/** @format */

import { ArrowLeft, ArrowRight, GripVertical, Plus, X } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import type { Job } from '../../shared/types';

type ListField = 'responsibilities' | 'requirements' | 'benefits';

type JobDetailsStepProps = {
  job: Partial<Job>;
  newItem: Record<string, string>;
  onUpdateField: (field: keyof Job, value: unknown) => void;
  onAddToList: (field: ListField, value: string) => void;
  onRemoveFromList: (field: ListField, index: number) => void;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  onNewItemChange: (updates: Record<string, string>) => void;
  onNext: () => void;
  onBack: () => void;
};

const fieldLabels: Record<ListField, { title: string; singular: string }> = {
  responsibilities: { title: 'Responsibilities', singular: 'responsibility' },
  requirements: { title: 'Requirements', singular: 'requirement' },
  benefits: { title: 'Benefits', singular: 'benefit' },
};

/** JobDetailsStep - Step 2 of job editor: edit job details, skills, and list fields */
const JobDetailsStep = ({
  job,
  newItem,
  onUpdateField,
  onAddToList,
  onRemoveFromList,
  onAddSkill,
  onRemoveSkill,
  onNewItemChange,
  onNext,
  onBack,
}: JobDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <FrostedCard className="p-6" hover={false}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Title
            </label>
            <input
              value={job.title ?? ''}
              onChange={(e) => onUpdateField('title', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Department
            </label>
            <input
              value={job.department ?? ''}
              onChange={(e) => onUpdateField('department', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
              placeholder="e.g. Engineering"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Location
            </label>
            <input
              value={job.location ?? ''}
              onChange={(e) => onUpdateField('location', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Employment Type
            </label>
            <select
              value={job.employmenttype ?? 'full-time'}
              onChange={(e) => onUpdateField('employmenttype', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Experience Level
            </label>
            <select
              value={job.experiencelevel ?? 'mid'}
              onChange={(e) => onUpdateField('experiencelevel', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
            >
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Salary Range
            </label>
            <input
              value={job.salaryrange ?? ''}
              onChange={(e) => onUpdateField('salaryrange', e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
              placeholder="e.g. $120,000 - $180,000"
            />
          </div>
        </div>
      </FrostedCard>

      <FrostedCard className="p-6" hover={false}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Required Skills</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {(job.skills ?? []).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]"
            >
              {skill}
              <button
                onClick={() => onRemoveSkill(skill)}
                className="hover:text-red-400 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newItem.skill ?? ''}
            onChange={(e) => onNewItemChange({ skill: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onAddSkill(newItem.skill ?? '')}
            className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
            placeholder="Add a skill and press Enter"
          />
          <button
            onClick={() => onAddSkill(newItem.skill ?? '')}
            className="px-3 py-2 rounded-xl bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] hover:bg-[var(--accent-bg)] hover:text-white transition-all"
          >
            <Plus size={16} />
          </button>
        </div>
      </FrostedCard>

      {(['responsibilities', 'requirements', 'benefits'] as const).map((field) => (
        <FrostedCard key={field} className="p-6" hover={false}>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            {fieldLabels[field].title}
          </h2>
          <div className="space-y-2 mb-3">
            {(job[field] ?? []).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-2 px-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] group"
              >
                <GripVertical size={14} className="text-[var(--text-quaternary)]" />
                <span className="flex-1 text-sm text-[var(--text-primary)]">{item}</span>
                <button
                  onClick={() => onRemoveFromList(field, i)}
                  className="opacity-0 group-hover:opacity-100 text-[var(--text-quaternary)] hover:text-red-400 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newItem[field] ?? ''}
              onChange={(e) => onNewItemChange({ [field]: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && onAddToList(field, newItem[field] ?? '')}
              className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
              placeholder={`Add a ${fieldLabels[field].singular} and press Enter`}
            />
            <button
              onClick={() => onAddToList(field, newItem[field] ?? '')}
              className="px-3 py-2 rounded-xl bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] hover:bg-[var(--accent-bg)] hover:text-white transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
        </FrostedCard>
      ))}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all shadow-lg shadow-[var(--accent-shadow)]"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default JobDetailsStep;
