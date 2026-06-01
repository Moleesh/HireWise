/** @format */

import { useState } from 'react';
import { useJobs } from './hooks/useJobs';
import { Search, Plus } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import PageHero from '../../shared/components/PageHero';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import ZeroState from '../../shared/components/ZeroState';
import { ShimmerRow } from '../../shared/components/ShimmerLoader';
import Modal from '../../shared/components/Modal';
import JobTile from './JobTile';
import type { Page, Job } from '../../shared/types';
import useLazyList from '../../shared/hooks/useLazyList';

type JobListProps = {
	onNavigate: (page: Page, data?: Record<string, string>) => void;
};

/** JobListPage - Job list page with search, status filters, and context menus */
const JobListPage = ({ onNavigate }: JobListProps) => {
	const { jobs, loading, deleteJob, duplicateJob, updateJob } = useJobs();
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

	const filtered = jobs.filter((job) => {
		const matchesSearch =
			!search ||
			job.title.toLowerCase().includes(search.toLowerCase()) ||
			(job.department ?? '').toLowerCase().includes(search.toLowerCase());
		const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
		return matchesSearch && matchesStatus;
	});
	const lazyJobs = useLazyList(filtered, {
		initialCount: 8,
		increment: 8,
		resetKey: `${search}:${statusFilter}`,
	});

	const statusCounts = {
		all: jobs.length,
		draft: jobs.filter((j) => j.status === 'draft').length,
		published: jobs.filter((j) => j.status === 'published').length,
		filled: jobs.filter((j) => j.status === 'filled').length,
	};

	const handleDelete = async (id: string) => {
		await deleteJob(id);
		setDeleteConfirm(null);
	};

	const handleDuplicate = async (id: string) => {
		const { data } = await duplicateJob(id);
		if (data) onNavigate('job-editor', { id: data.id });
	};

	const handleMarkFilled = async (job: Job) => {
		await updateJob(job.id, { status: 'filled' });
	};

	const handleRank = (jobId: string) => onNavigate('rankings', { jobId });

	return (
		<div className="max-w-7xl mx-auto">
			<PageHero
				eyebrow="Hiring Pipeline"
				title="Jobs"
				description="Manage active roles, drafts, and hiring status from one place."
				action={
					<button
						onClick={() => onNavigate('job-editor')}
						className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-xs md:text-sm whitespace-nowrap transition-all shadow-md shadow-[var(--accent-shadow)] hover:shadow-[var(--accent-shadow-hover)]"
					>
						<Plus size={14} />
						<span className="sm:hidden">New</span>
						<span className="hidden sm:inline">New Job</span>
					</button>
				}
			/>

			<div className="flex flex-col xl:flex-row gap-3 xl:gap-4 mb-6">
				<div className="relative w-full xl:flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-quaternary)]" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by title or department..."
						className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
					/>
				</div>
				<div className="grid grid-cols-2 sm:flex gap-2 sm:overflow-x-auto sm:pb-1 xl:pb-0 xl:overflow-visible">
					{(['all', 'draft', 'published', 'filled'] as const).map((status) => (
						<button
							key={status}
							onClick={() => setStatusFilter(status)}
							className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
								statusFilter === status
									? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]'
									: 'bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)] hover:bg-[var(--btn-ghost-hover)] border border-transparent'
							}`}
						>
							{status === 'all'
								? 'All'
								: status.charAt(0).toUpperCase() + status.slice(1)}
							<span className="ml-1.5 opacity-60">{statusCounts[status]}</span>
						</button>
					))}
				</div>
			</div>

			{loading ? (
				<FrostedCard className="p-6" hover={false}>
					<ShimmerRow rows={5} />
				</FrostedCard>
			) : filtered.length === 0 ? (
				<ZeroState
					icon={Search}
					title={search ? 'No matching jobs' : 'No jobs yet'}
					description={
						search
							? 'Try adjusting your search'
							: 'Create your first job description to get started'
					}
					action={
						!search ? (
							<button
								onClick={() => onNavigate('job-editor')}
								className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all"
							>
								<Plus size={16} /> Create Job
							</button>
						) : undefined
					}
				/>
			) : (
				<div className="space-y-3">
					{lazyJobs.visibleItems.map((job) => (
						<JobTile
							key={job.id}
							job={job}
							onNavigate={onNavigate}
							onDuplicate={handleDuplicate}
							onRank={handleRank}
							onMarkFilled={handleMarkFilled}
							onDelete={(id) => {
								setDeleteConfirm(id);
							}}
						/>
					))}
					{lazyJobs.hasMore && (
						<LoadMoreButton
							remainingCount={lazyJobs.remainingCount}
							onClick={lazyJobs.loadMore}
						/>
					)}
				</div>
			)}

			<Modal
				open={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				title="Delete Job Description"
				size="sm"
			>
				<p className="text-sm text-[var(--text-secondary)] mb-6">
					Are you sure you want to delete this job description? This action cannot be
					undone.
				</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={() => setDeleteConfirm(null)}
						className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)] transition-all"
					>
						Cancel
					</button>
					<button
						onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
						className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
					>
						Delete
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default JobListPage;
