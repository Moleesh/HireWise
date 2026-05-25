/** @format */

import { Check } from 'lucide-react';

type Step = 1 | 2 | 3;

type JobEditorStepperProps = {
	jobId?: string;
	mode: 'create' | 'edit' | 'view';
	step: Step;
	onStepChange: (step: Step) => void;
};

/** JobEditorStepper - Mode-aware step tabs for JD creation and editing. */
const JobEditorStepper = ({ jobId, mode, step, onStepChange }: JobEditorStepperProps) => {
	const steps =
		mode === 'edit'
			? [
					{ n: 2, display: 1, label: 'Details' },
					{ n: 3, display: 2, label: 'Summary' },
				]
			: [
					{ n: 1, display: 1, label: 'Paste JD' },
					{ n: 2, display: 2, label: 'Details' },
					{ n: 3, display: 3, label: 'Summary' },
				];

	return (
		<div className="flex items-center gap-2 mb-8">
			{steps.map((item, index) => {
				const isEdit = mode === 'edit';
				const isCurrent = step === item.n;
				const isComplete = !isEdit && step > item.n;
				const clickable = isEdit || !!jobId || item.n < step;

				return (
					<div key={item.n} className="flex items-center gap-2 flex-1">
						<button
							onClick={() => clickable && onStepChange(item.n as Step)}
							disabled={!clickable}
							className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
								isCurrent
									? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]'
									: isComplete
										? 'bg-[var(--accent-bg)] text-white cursor-pointer'
										: clickable
											? 'bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] cursor-pointer'
											: 'bg-[var(--btn-ghost-bg)] text-[var(--text-quaternary)]'
							}`}
						>
							{isComplete ? <Check size={14} /> : item.display}
							<span className="hidden sm:inline">{item.label}</span>
						</button>
						{index < steps.length - 1 && (
							<div className="flex-1 h-px bg-[var(--border-subtle)]" />
						)}
					</div>
				);
			})}
		</div>
	);
};

export default JobEditorStepper;
