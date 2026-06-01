/** @format */

import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import Modal from '../../shared/components/Modal';
import CandidateSelector from './CandidateSelector';
import FieldReportTable from './FieldReportTable';
import ReportSetupCard from './ReportSetupCard';
import type { Candidate } from '../../shared/types';
import type { ReportField } from './_private/types';

type ReportConfigModalProps = {
	canSave: boolean;
	candidates: Candidate[];
	defaultReportId: string;
	loading: boolean;
	onClose: () => void;
	onNameChange: (name: string) => void;
	onReset: () => void;
	onSave: () => void;
	onSearchChange: (search: string) => void;
	onReorderField: (fromKey: string, toKey: string) => void;
	onToggleField: (fieldKey: string) => void;
	onToggleVisible: (visibleIds?: string[]) => void;
	open: boolean;
	reportName: string;
	search: string;
	fields: ReportField[];
	selectedFieldKeys: string[];
	selectedIds: string[];
	saved: boolean;
};

/** ReportConfigModal - Popup for report name, filters, fields, and saved workflows. */
const ReportConfigModal = (props: ReportConfigModalProps) => {
	const [step, setStep] = useState(0);
	const steps = useMemo(
		() => [
			{ title: 'Report', hint: 'Name and save setup' },
			{ title: 'Filters', hint: 'Choose candidate scope' },
			{ title: 'Columns', hint: 'Pick and reorder fields' },
		],
		[],
	);
	const canMoveNext =
		(step === 0 && props.reportName.trim().length > 0) ||
		step === 1 ||
		(step === 2 && props.selectedFieldKeys.length > 0);
	const isFinalStep = step === steps.length - 1;

	return (
		<Modal open={props.open} onClose={props.onClose} title="Configure Report" size="lg">
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
					{steps.map((item, index) => {
						const active = index === step;
						const done = index < step;
						return (
							<button
								key={item.title}
								onClick={() => setStep(index)}
								className={`rounded-xl border px-3 py-2 text-left transition-all ${
									active
										? 'border-[var(--accent-border)] bg-[var(--accent-bg-subtle)]'
										: done
											? 'border-[var(--border-subtle)] bg-[var(--btn-ghost-bg)]'
											: 'border-[var(--border-subtle)] bg-transparent'
								}`}
							>
								<p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
									{done ? (
										<>
											<Check size={12} /> {item.title}
										</>
									) : (
										<>
											{index + 1}. {item.title}
										</>
									)}
								</p>
								<p className="mt-1 text-[11px] text-[var(--text-quaternary)]">
									{item.hint}
								</p>
							</button>
						);
					})}
				</div>
				<div className="flex justify-end">
					<button
						onClick={props.onReset}
						className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
					>
						Reset all
					</button>
				</div>
				{step === 0 && (
					<ReportSetupCard
						name={props.reportName}
						canSave={props.canSave}
						onNameChange={props.onNameChange}
						onSave={props.onSave}
						saved={props.saved}
					/>
				)}
				{step === 1 && (
					<CandidateSelector
						search={props.search}
						candidates={props.candidates}
						selectedIds={props.selectedIds}
						onSearchChange={props.onSearchChange}
						onToggleVisible={props.onToggleVisible}
					/>
				)}
				{step === 2 && (
					<FieldReportTable
						fields={props.fields}
						selectedFieldKeys={props.selectedFieldKeys}
						onReorderField={props.onReorderField}
						onToggleField={props.onToggleField}
					/>
				)}
				<div className="flex items-center justify-between gap-3 pt-1">
					<button
						onClick={() => setStep((current) => Math.max(current - 1, 0))}
						disabled={step === 0}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] disabled:opacity-50"
					>
						<ChevronLeft size={14} /> Previous
					</button>
					<div className="flex items-center gap-2">
						{isFinalStep ? (
							<button
								onClick={props.onSave}
								disabled={!props.canSave}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-bg-hover)] disabled:opacity-50"
							>
								Save Report <Check size={14} />
							</button>
						) : (
							<button
								onClick={() =>
									setStep((current) => Math.min(current + 1, steps.length - 1))
								}
								disabled={!canMoveNext}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent-bg)] text-white hover:bg-[var(--accent-bg-hover)] disabled:opacity-50"
							>
								Next <ChevronRight size={14} />
							</button>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ReportConfigModal;
