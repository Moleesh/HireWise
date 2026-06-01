/** @format */

import { MoreVertical, Pencil, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
	onToggleFavoriteReport: (reportId: string) => void;
	onRenameReport: (reportId: string, name: string) => void;
};

/** SavedReportsPanel - Quick access list for stored report workflows. */
const SavedReportsPanel = ({
	defaultReportId,
	reports,
	onLoadReport,
	onDeleteReport,
	onSetDefaultReport,
	onToggleFavoriteReport,
	onRenameReport,
}: SavedReportsPanelProps) => {
	const lazyReports = useLazyList(reports, { initialCount: 5, increment: 5 });
	const [openMenuId, setOpenMenuId] = useState('');

	const closeMenu = () => setOpenMenuId('');

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
							className="relative flex items-center gap-2 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] p-2"
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
								onClick={() =>
									setOpenMenuId((current) =>
										current === report.id ? '' : report.id,
									)
								}
								aria-label={`Manage ${report.name}`}
								className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
							>
								<MoreVertical size={14} />
							</button>
							{openMenuId === report.id && (
								<div className="absolute right-2 top-11 z-10 w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] shadow-xl p-1.5">
									<button
										onClick={() => {
											const nextName =
												prompt('Rename report', report.name) ?? '';
											onRenameReport(report.id, nextName);
											closeMenu();
										}}
										className="w-full px-2.5 py-2 rounded-lg text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-bg)] inline-flex items-center gap-2"
									>
										<Pencil size={13} /> Edit name
									</button>
									<button
										onClick={() => {
											onToggleFavoriteReport(report.id);
											closeMenu();
										}}
										className="w-full px-2.5 py-2 rounded-lg text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-bg)] inline-flex items-center gap-2"
									>
										<Star
											size={13}
											className={
												report.favorite
													? 'fill-current text-yellow-400'
													: ''
											}
										/>
										{report.favorite ? 'Remove favorite' : 'Add favorite'}
									</button>
									<button
										onClick={() => {
											onSetDefaultReport(report.id);
											closeMenu();
										}}
										className="w-full px-2.5 py-2 rounded-lg text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-bg)]"
									>
										{report.id === defaultReportId
											? 'Default report'
											: 'Set as default'}
									</button>
									<button
										onClick={() => {
											onDeleteReport(report.id);
											closeMenu();
										}}
										className="w-full px-2.5 py-2 rounded-lg text-left text-sm text-red-400 hover:bg-red-500/10 inline-flex items-center gap-2"
									>
										<Trash2 size={13} /> Delete
									</button>
								</div>
							)}
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
