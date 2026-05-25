/** @format */

import { useState } from 'react';
import { useCandidates } from '../candidates/hooks/useCandidates';
import { downloadCsv } from './_private/csv';
import CandidateReportTable from './CandidateReportTable';
import ReportConfigModal from './ReportConfigModal';
import ReportHeader from './ReportHeader';
import { useReportBuilder } from './hooks/useReportBuilder';

/** ReportsPage - Table-first candidate report with setup in a popup. */
const ReportsPage = () => {
	const { candidates, loading } = useCandidates();
	const [configOpen, setConfigOpen] = useState(false);
	const report = useReportBuilder(candidates);
	const exportCandidates = report.selectedCandidates.length
		? report.selectedCandidates
		: report.filteredCandidates;

	return (
		<div className="max-w-7xl mx-auto">
			<ReportHeader
				canExport={exportCandidates.length > 0 && report.selectedFields.length > 0}
				defaultReportId={report.defaultReportId}
				onConfigure={() => setConfigOpen(true)}
				onExport={() =>
					downloadCsv(report.reportName, exportCandidates, report.selectedFields)
				}
				onLoadReport={report.loadReport}
				onSetDefaultReport={report.setDefaultReport}
				reports={report.savedReports}
			/>
			<CandidateReportTable
				candidates={report.filteredCandidates}
				fields={report.selectedFields}
				search={report.search}
			/>
			<ReportConfigModal
				open={configOpen}
				onClose={() => setConfigOpen(false)}
				loading={loading}
				reportName={report.reportName}
				search={report.search}
				candidates={report.filteredCandidates}
				selectedIds={report.selectedCandidateIds}
				defaultReportId={report.defaultReportId}
				fields={report.orderedFields}
				selectedFieldKeys={report.selectedFieldKeys}
				allSelected={report.allFilteredSelected}
				canSave={report.canExport}
				saved={Boolean(report.lastSavedReportId)}
				savedReports={report.savedReports}
				onNameChange={report.setReportName}
				onSearchChange={report.setSearch}
				onToggleCandidate={report.toggleCandidate}
				onToggleVisible={report.toggleFilteredCandidates}
				onToggleField={report.toggleField}
				onReorderField={report.reorderField}
				onSave={report.saveReport}
				onReset={report.resetReport}
				onLoadReport={report.loadReport}
				onDeleteReport={report.deleteReport}
				onSetDefaultReport={report.setDefaultReport}
			/>
		</div>
	);
};

export default ReportsPage;
