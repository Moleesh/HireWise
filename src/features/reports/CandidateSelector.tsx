/** @format */

import { FileSpreadsheet, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import FrostedCard from '../../shared/components/FrostedCard';
import ZeroState from '../../shared/components/ZeroState';
import type { Candidate } from '../../shared/types';
import type { CandidateStatus } from '../../shared/types';

type CandidateSelectorProps = {
	candidates: Candidate[];
	onSearchChange: (search: string) => void;
	onToggleVisible: (visibleIds?: string[]) => void;
	search: string;
	selectedIds: string[];
};

const DAY_IN_MILLISECONDS = 86_400_000;

const CandidateSelector = ({
	candidates,
	onSearchChange,
	onToggleVisible,
	search,
	selectedIds,
}: CandidateSelectorProps) => {
	const [statusFilter, setStatusFilter] = useState<'all' | CandidateStatus>('all');
	const [uploadedByFilter, setUploadedByFilter] = useState('all');
	const [startsWith, setStartsWith] = useState('');
	const [createdWindow, setCreatedWindow] = useState('all');
	const [createdAfter, setCreatedAfter] = useState<number | null>(null);

	const uploadedByOptions = useMemo(() => {
		const options = Array.from(
			new Set(candidates.map((candidate) => candidate.uploadedBy || 'system')),
		);
		return options.sort((a, b) => a.localeCompare(b));
	}, [candidates]);

	const filteredCandidates = useMemo(() => {
		return candidates.filter((candidate) => {
			const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
			const uploader = candidate.uploadedBy || 'system';
			const matchesUploader = uploadedByFilter === 'all' || uploader === uploadedByFilter;
			const matchesStartsWith =
				!startsWith.trim() ||
				candidate.name.toLowerCase().startsWith(startsWith.trim().toLowerCase());
			const matchesCreated =
				createdAfter === null || new Date(candidate.createdAt).getTime() >= createdAfter;
			return matchesStatus && matchesUploader && matchesStartsWith && matchesCreated;
		});
	}, [candidates, createdAfter, startsWith, statusFilter, uploadedByFilter]);

	const allVisibleSelected =
		filteredCandidates.length > 0 &&
		filteredCandidates.every((candidate) => selectedIds.includes(candidate.id));

	return (
		<FrostedCard className="p-4 md:p-5" hover={false}>
			<div className="flex items-center justify-between gap-3 mb-4">
				<div>
					<h2 className="text-sm font-semibold text-[var(--text-primary)]">
						Candidate Filters
					</h2>
					<p className="text-xs text-[var(--text-tertiary)] mt-1">
						{filteredCandidates.length} match filters • {selectedIds.length} selected
					</p>
				</div>
				<button
					onClick={() =>
						onToggleVisible(filteredCandidates.map((candidate) => candidate.id))
					}
					className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
				>
					{allVisibleSelected ? 'Clear visible' : 'Select visible'}
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
			<div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
				<div className="select-wrap">
					<select
						value={statusFilter}
						onChange={(event) =>
							setStatusFilter(event.target.value as CandidateStatus | 'all')
						}
						className="app-select w-full text-xs"
					>
						<option value="all">Status: all</option>
						<option value="available">Available</option>
						<option value="in-progress">In Progress</option>
						<option value="offered">Offered</option>
						<option value="hired">Hired</option>
						<option value="rejected">Rejected</option>
					</select>
				</div>
				<div className="select-wrap">
					<select
						value={uploadedByFilter}
						onChange={(event) => setUploadedByFilter(event.target.value)}
						className="app-select w-full text-xs"
					>
						<option value="all">Uploaded by: all</option>
						{uploadedByOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
				<input
					value={startsWith}
					onChange={(event) => setStartsWith(event.target.value)}
					placeholder="Name starts with..."
					className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] placeholder-[var(--text-quaternary)]"
				/>
				<div className="select-wrap">
					<select
						value={createdWindow}
						onChange={(event) => {
							const window = event.target.value;
							setCreatedWindow(window);
							setCreatedAfter(
								window === 'all'
									? null
									: Date.now() - Number(window) * DAY_IN_MILLISECONDS,
							);
						}}
						className="app-select w-full text-xs"
					>
						<option value="all">Created: any time</option>
						<option value="7">Created: last 7 days</option>
						<option value="30">Created: last 30 days</option>
						<option value="90">Created: last 90 days</option>
					</select>
				</div>
			</div>
			{filteredCandidates.length === 0 ? (
				<ZeroState
					icon={FileSpreadsheet}
					title="No candidates found"
					description="Try a different filter combination"
				/>
			) : (
				<div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--input-bg)] p-3">
					<p className="text-sm text-[var(--text-secondary)]">
						Use filters above to define candidate scope for this report.
					</p>
					<p className="text-xs text-[var(--text-quaternary)] mt-1">
						Selected set updates with “Select visible” using current filters.
					</p>
					<div className="mt-2 flex flex-wrap gap-2">
						{filteredCandidates.slice(0, 6).map((candidate) => (
							<span
								key={candidate.id}
								className="text-xs px-2 py-1 rounded-full bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)]"
							>
								{candidate.name}
							</span>
						))}
						{filteredCandidates.length > 6 && (
							<span className="text-xs px-2 py-1 rounded-full bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)]">
								+{filteredCandidates.length - 6} more
							</span>
						)}
					</div>
				</div>
			)}
		</FrostedCard>
	);
};

export default CandidateSelector;
