/** @format */

import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import type { Job } from '../../shared/types';

type JobDetailsStepProps = {
    job: Partial<Job>;
    newItem: Record<string, string>;
    onUpdateField: (field: keyof Job, value: unknown) => void;
    onAddSkill: (skill: string) => void;
    onRemoveSkill: (skill: string) => void;
    onAddGoodToHave: (item: string) => void;
    onRemoveGoodToHave: (item: string) => void;
    onNewItemChange: (updates: Record<string, string>) => void;
    onNext: () => void;
    onBack: () => void;
};

/** ChipList - Reusable tag/chip editor used for skills and good-to-have. */
const ChipList = ({
    title,
    values,
    inputValue,
    onInputChange,
    onAdd,
    onRemove,
    placeholder,
}: {
    title: string;
    values: string[];
    inputValue: string;
    onInputChange: (v: string) => void;
    onAdd: () => void;
    onRemove: (v: string) => void;
    placeholder: string;
}) => (
    <FrostedCard className="p-6" hover={false}>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
            {values.map((v) => (
                <span
                    key={v}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]"
                >
                    {v}
                    <button
                        onClick={() => onRemove(v)}
                        className="hover:text-red-400 transition-colors"
                    >
                        <X size={12} />
                    </button>
                </span>
            ))}
        </div>
        <div className="flex gap-2">
            <input
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onAdd();
                    }
                }}
                className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
                placeholder={placeholder}
            />
            <button
                onClick={onAdd}
                className="px-3 py-2 rounded-xl bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] hover:bg-[var(--accent-bg)] hover:text-white transition-all"
                type="button"
            >
                <Plus size={16} />
            </button>
        </div>
    </FrostedCard>
);

/** JobDetailsStep - Step 2: simplified Title / Department / Skills / Good to Have. */
const JobDetailsStep = ({
    job,
    newItem,
    onUpdateField,
    onAddSkill,
    onRemoveSkill,
    onAddGoodToHave,
    onRemoveGoodToHave,
    onNewItemChange,
    onNext,
    onBack,
}: JobDetailsStepProps) => {
    return (
        <div className="space-y-6">
            <FrostedCard className="p-6" hover={false}>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                    Job Details
                </h2>
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
                    <div className="md:col-span-2">
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
                </div>
            </FrostedCard>

            <ChipList
                title="Required Skills"
                values={job.skills ?? []}
                inputValue={newItem.skill ?? ''}
                onInputChange={(v) => onNewItemChange({ skill: v })}
                onAdd={() => onAddSkill(newItem.skill ?? '')}
                onRemove={onRemoveSkill}
                placeholder="Add a skill and press Enter"
            />

            <ChipList
                title="Good to Have"
                values={job.goodToHave ?? []}
                inputValue={newItem.goodToHave ?? ''}
                onInputChange={(v) => onNewItemChange({ goodToHave: v })}
                onAdd={() => onAddGoodToHave(newItem.goodToHave ?? '')}
                onRemove={onRemoveGoodToHave}
                placeholder="Add a nice-to-have and press Enter"
            />

            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
                    type="button"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all shadow-lg shadow-[var(--accent-shadow)]"
                    type="button"
                >
                    Next <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default JobDetailsStep;
