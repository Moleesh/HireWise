/** @format */

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import type { Candidate } from '../../shared/types';
import useLazyList from '../../shared/hooks/useLazyList';
import type { ReportField } from './_private/types';
import { sortCandidates, type ReportSort } from './_private/sort';

type CandidateReportTableProps = {
	candidates: Candidate[];
	fields: ReportField[];
	search: string;
};

/** CandidateReportTable - Read-only table preview of filtered report rows. */
const CandidateReportTable = ({ candidates, fields, search }: CandidateReportTableProps) => {
	const visibleFields = useMemo(() => (fields.length ? fields : []), [fields]);
	const [sort, setSort] = useState<ReportSort>({
		fieldKey: visibleFields[0]?.key ?? 'name',
		direction: 'asc',
	});
	const sortedCandidates = useMemo(
		() => sortCandidates(candidates, visibleFields, sort),
		[candidates, sort, visibleFields],
	);
	const lazyRows = useLazyList(sortedCandidates, {
		initialCount: 12,
		increment: 12,
		resetKey: `${search}:${sort.fieldKey}:${sort.direction}`,
	});

	const toggleSort = (fieldKey: string) => {
		setSort((current) => ({
			fieldKey,
			direction:
				current.fieldKey === fieldKey && current.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	return (
		<FrostedCard className="p-4 md:p-5" hover={false}>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-text)] mb-1">
						Report Preview
					</p>
					<h2 className="text-lg font-bold text-[var(--text-primary)]">Candidate Table</h2>
					<p className="text-sm text-[var(--text-tertiary)] mt-1">
						{candidates.length} filtered rows · sorted by {sort.fieldKey}
					</p>
				</div>
				<div className="text-xs text-[var(--text-quaternary)]">
					Click a column heading to sort
				</div>
			</div>
			<div className="max-h-[28rem] max-w-full overflow-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] shadow-inner shadow-black/10">
				<table className="min-w-full text-left text-sm">
					<thead className="sticky top-0 z-10 bg-[var(--input-bg)] text-[var(--text-tertiary)]">
						<tr>
							{visibleFields.map((field) => (
								<th key={field.key} className="px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
									<button
										onClick={() => toggleSort(field.key)}
										className="flex items-center gap-2 hover:text-[var(--accent-text)] transition-colors"
									>
										{field.label}
										{sort.fieldKey !== field.key ? (
											<ArrowUpDown size={13} />
										) : sort.direction === 'asc' ? (
											<ArrowUp size={13} />
										) : (
											<ArrowDown size={13} />
										)}
									</button>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-[var(--border-subtle)]">
						{lazyRows.visibleItems.map((candidate) => (
							<tr
								key={candidate.id}
								className="text-[var(--text-secondary)] odd:bg-white/[0.02] hover:bg-[var(--accent-bg-subtle)] transition-colors"
							>
								{visibleFields.map((field) => (
									<td key={field.key} className="px-4 py-3.5 max-w-72 truncate align-middle">
										{field.value(candidate) || '—'}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{lazyRows.hasMore && (
				<LoadMoreButton remainingCount={lazyRows.remainingCount} onClick={lazyRows.loadMore} />
			)}
		</FrostedCard>
	);
};

export default CandidateReportTable;
