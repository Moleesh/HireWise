/** @format */

import { Star, Trash2 } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import useLazyList from '../../shared/hooks/useLazyList';
import type { SavedReport } from './_private/types';

type SavedReportsPanelProps = {
	defaultReportId: string;
	reports: SavedReport[];
	onLoadReport: (report: SavedReport) => void;
	onDeleteReport: (reportId: string) => void;
	onSetDefaultReport: (reportId: string) => void;
};

/** SavedReportsPanel - Quick access list for stored report workflows. */
const SavedReportsPanel = ({
	defaultReportId,
	reports,
	onLoadReport,
	onDeleteReport,
	onSetDefaultReport,
}: SavedReportsPanelProps) => {
	const lazyReports = useLazyList(reports, { initialCount: 5, increment: 5 });

	return (
		<FrostedCard className="p-4 md:p-5" hover={false}>
			<h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Saved Reports</h2>
			<p className="text-xs text-[var(--text-tertiary)] mb-4">Reuse common exports</p>
			{reports.length === 0 ? (
				<p className="text-sm text-[var(--text-tertiary)]">No saved reports yet.</p>
			) : (
				<div className="space-y-2">
					{lazyReports.visibleItems.map((report) => (
						<div
							key={report.id}
							className="flex items-center gap-2 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] p-2"
						>
							<button
								onClick={() => onLoadReport(report)}
								className="min-w-0 flex-1 text-left"
							>
								<span className="block text-sm font-medium text-[var(--text-primary)] truncate">
									{report.name}
								</span>
								<span className="block text-xs text-[var(--text-quaternary)]">
									{report.candidateIds.length} candidates,{' '}
									{report.fieldKeys.length} fields
								</span>
							</button>
							<button
								onClick={() => onSetDefaultReport(report.id)}
								aria-label={`Set ${report.name} as default`}
								className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-yellow-400 hover:bg-yellow-500/10 transition-all"
							>
								<Star
									size={14}
									className={
										report.id === defaultReportId
											? 'fill-current text-yellow-400'
											: ''
									}
								/>
							</button>
							<button
								onClick={() => onDeleteReport(report.id)}
								aria-label={`Delete ${report.name}`}
								className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
							>
								<Trash2 size={14} />
							</button>
						</div>
					))}
					{lazyReports.hasMore && (
						<LoadMoreButton
							remainingCount={lazyReports.remainingCount}
							onClick={lazyReports.loadMore}
						/>
					)}
				</div>
			)}
		</FrostedCard>
	);
};

export default SavedReportsPanel;
