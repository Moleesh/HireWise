/** @format */

import Modal from '../../shared/components/Modal';
import CandidateSelector from './CandidateSelector';
import FieldReportTable from './FieldReportTable';
import ReportSetupCard from './ReportSetupCard';
import SavedReportsPanel from './SavedReportsPanel';
import type { Candidate } from '../../shared/types';
import type { ReportField, SavedReport } from './_private/types';

type ReportConfigModalProps = {
	allSelected: boolean;
	canSave: boolean;
	candidates: Candidate[];
	defaultReportId: string;
	loading: boolean;
	onClose: () => void;
	onDeleteReport: (reportId: string) => void;
	onLoadReport: (report: SavedReport) => void;
	onNameChange: (name: string) => void;
	onReset: () => void;
	onSave: () => void;
	onSearchChange: (search: string) => void;
	onReorderField: (fromKey: string, toKey: string) => void;
	onSetDefaultReport: (reportId: string) => void;
	onToggleCandidate: (id: string) => void;
	onToggleField: (fieldKey: string) => void;
	onToggleVisible: () => void;
	open: boolean;
	reportName: string;
	savedReports: SavedReport[];
	search: string;
	fields: ReportField[];
	selectedFieldKeys: string[];
	selectedIds: string[];
	saved: boolean;
};

/** ReportConfigModal - Popup for report name, filters, fields, and saved workflows. */
const ReportConfigModal = (props: ReportConfigModalProps) => (
	<Modal open={props.open} onClose={props.onClose} title="Configure Report" size="lg">
		<div className="space-y-4">
			<div className="flex justify-end">
				<button
					onClick={props.onReset}
					className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
				>
					Reset all
				</button>
			</div>
			<ReportSetupCard
				name={props.reportName}
				canSave={props.canSave}
				onNameChange={props.onNameChange}
				onSave={props.onSave}
				saved={props.saved}
			/>
			<CandidateSelector
				loading={props.loading}
				search={props.search}
				candidates={props.candidates}
				fields={props.fields.filter((field) => props.selectedFieldKeys.includes(field.key))}
				selectedIds={props.selectedIds}
				allSelected={props.allSelected}
				onSearchChange={props.onSearchChange}
				onToggleCandidate={props.onToggleCandidate}
				onToggleVisible={props.onToggleVisible}
			/>
			<FieldReportTable
				fields={props.fields}
				selectedFieldKeys={props.selectedFieldKeys}
				onReorderField={props.onReorderField}
				onToggleField={props.onToggleField}
			/>
			<SavedReportsPanel
				defaultReportId={props.defaultReportId}
				reports={props.savedReports}
				onLoadReport={props.onLoadReport}
				onDeleteReport={props.onDeleteReport}
				onSetDefaultReport={props.onSetDefaultReport}
			/>
		</div>
	</Modal>
);

export default ReportConfigModal;
