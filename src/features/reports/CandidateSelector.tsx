/** @format */

import { FileSpreadsheet, Search } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import ZeroState from '../../shared/components/ZeroState';
import { ShimmerRow } from '../../shared/components/ShimmerLoader';
import type { Candidate } from '../../shared/types';
import useLazyList from '../../shared/hooks/useLazyList';
import { buildCandidatePreview } from './_private/preview';
import type { ReportField } from './_private/types';

type CandidateSelectorProps = {
	allSelected: boolean;
	candidates: Candidate[];
	fields: ReportField[];
	loading: boolean;
	onSearchChange: (search: string) => void;
	onToggleCandidate: (id: string) => void;
	onToggleVisible: () => void;
	search: string;
	selectedIds: string[];
};

const CandidateSelector = ({
	allSelected,
	candidates,
	fields,
	loading,
	onSearchChange,
	onToggleCandidate,
	onToggleVisible,
	search,
	selectedIds,
}: CandidateSelectorProps) => {
	const lazyCandidates = useLazyList(candidates, {
		initialCount: 10,
		increment: 10,
		resetKey: search,
	});

	return (
		<FrostedCard className="p-4 md:p-5" hover={false}>
		<div className="flex items-center justify-between gap-3 mb-4">
			<div>
				<h2 className="text-sm font-semibold text-[var(--text-primary)]">Choose Candidates</h2>
				<p className="text-xs text-[var(--text-tertiary)] mt-1">
					{selectedIds.length} selected
				</p>
			</div>
			<button
				onClick={onToggleVisible}
				className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
			>
				{allSelected ? 'Clear visible' : 'Select visible'}
			</button>
		</div>
		<div className="relative mb-4">
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-quaternary)]" />
			<input
				value={search}
				onChange={(event) => onSearchChange(event.target.value)}
				placeholder="Search candidates..."
				className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
			/>
		</div>
		{loading ? (
			<ShimmerRow rows={4} />
		) : candidates.length === 0 ? (
			<ZeroState icon={FileSpreadsheet} title="No candidates found" description="Try a different search term" />
		) : (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[24rem] overflow-y-auto pr-1">
				{lazyCandidates.visibleItems.map((candidate) => {
					const preview = buildCandidatePreview(candidate, fields);
					return (
						<label
							key={candidate.id}
							className="flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--input-bg)] px-3 py-2.5 cursor-pointer hover:border-[var(--accent-border)] transition-all"
						>
							<input
								type="checkbox"
								checked={selectedIds.includes(candidate.id)}
								onChange={() => onToggleCandidate(candidate.id)}
								className="mt-1 accent-[var(--accent-bg)]"
							/>
							<span className="min-w-0 flex-1">
								<span className="block text-sm font-semibold text-[var(--text-primary)] truncate">
									{preview.primary}
								</span>
								<span className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
									{preview.details.map((detail) => (
										<span
											key={detail.label}
											className="text-[11px] text-[var(--text-quaternary)] truncate"
										>
											{detail.label}: {detail.value}
										</span>
									))}
								</span>
							</span>
						</label>
					);
				})}
				{lazyCandidates.hasMore && (
					<div className="md:col-span-2">
						<LoadMoreButton
							remainingCount={lazyCandidates.remainingCount}
							onClick={lazyCandidates.loadMore}
						/>
					</div>
				)}
			</div>
		)}
		</FrostedCard>
	);
};

export default CandidateSelector;
