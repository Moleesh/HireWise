/** @format */

import { Download, SlidersHorizontal, Star } from 'lucide-react';
import type { SavedReport } from './_private/types';

type ReportHeaderProps = {
	canExport: boolean;
	defaultReportId: string;
	onConfigure: () => void;
	onExport: () => void;
	onLoadReport: (report: SavedReport) => void;
	onSetDefaultReport: (reportId: string) => void;
	reports: SavedReport[];
};

const ReportHeader = ({
	canExport,
	defaultReportId,
	onConfigure,
	onExport,
	onLoadReport,
	onSetDefaultReport,
	reports,
}: ReportHeaderProps) => {
	const selectedReport = reports.find((report) => report.id === defaultReportId) ?? reports[0];
	return (
	<div className="mb-6 md:mb-8 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 md:p-6 shadow-2xl shadow-black/5">
		<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div className="min-w-0">
			<p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-text)] mb-2">
				Export Center
			</p>
			<h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Reports</h1>
			<p className="text-[var(--text-tertiary)] mt-2 text-sm md:text-base max-w-xl">
				Review filtered candidates, choose columns, and export a clean CSV for Excel.
			</p>
		</div>
		<div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center lg:justify-end">
			{reports.length > 0 && (
				<div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:min-w-80">
					<select
						value={selectedReport?.id ?? ''}
						onChange={(event) => {
							const report = reports.find((item) => item.id === event.target.value);
							if (report) onLoadReport(report);
						}}
						className="min-w-0 sm:w-52 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
					>
						{reports.map((report) => (
							<option key={report.id} value={report.id}>
								{report.name}
							</option>
						))}
					</select>
					<button
						onClick={() => selectedReport && onSetDefaultReport(selectedReport.id)}
						className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)] text-[var(--text-secondary)] font-semibold text-sm transition-all"
						title="Set selected report as default"
					>
						<Star
							size={16}
							className={
								selectedReport?.id === defaultReportId ? 'fill-current text-yellow-400' : ''
							}
						/>
					</button>
				</div>
			)}
			<button
				onClick={onConfigure}
				className="flex h-10 items-center justify-center gap-2 px-4 rounded-xl bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)] text-[var(--text-secondary)] font-semibold text-sm transition-all"
			>
				<SlidersHorizontal size={16} /> Configure
			</button>
			<button
				onClick={onExport}
				disabled={!canExport}
				className="flex h-10 items-center justify-center gap-2 px-4 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
			>
				<Download size={16} /> Export CSV
			</button>
		</div>
		</div>
	</div>
	);
};

export default ReportHeader;
