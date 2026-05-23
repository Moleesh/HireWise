/** @format */

import { useState, useRef, useEffect } from 'react';
import { useCandidates } from './hooks/useCandidates';
import { supabase } from '../../shared/lib/supabase';
import { Search, Upload, User } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import ZeroState from '../../shared/components/ZeroState';
import ProgressBar from '../../shared/components/ProgressBar';
import { ShimmerRow } from '../../shared/components/ShimmerLoader';
import Modal from '../../shared/components/Modal';
import CandidateTile from './CandidateTile';
import CandidateProfileModal from './CandidateProfileModal';
import type { Candidate, CandidateStatus } from '../../shared/types';
import { candidateStatuses } from './_private/constants';

/** CandidateListPage - Candidate list page with search, filters, upload, and detail modal */
const CandidateListPage = () => {
	const { candidates, loading, uploadResume, deleteCandidate, downloadResume, updateCandidate } =
		useCandidates();
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [uploading, setUploading] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
	const [candidateJobs, setCandidateJobs] = useState<
		{ jobid: string; overallscore: number; jobtitle: string }[]
	>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const filtered = candidates.filter((c) => {
		const matchesSearch =
			!search ||
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase()) ||
			(c.skills ?? []).some((s) => s.toLowerCase().includes(search.toLowerCase()));
		const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files?.length) return;
		setUploading(true);
		for (const file of Array.from(files)) {
			await uploadResume(file);
		}
		setUploading(false);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleDelete = async (id: string) => {
		await deleteCandidate(id);
		setDeleteConfirm(null);
	};

	const handleStatusUpdate = async (id: string, status: CandidateStatus) => {
		const { data } = await updateCandidate(id, { status });
		if (data && selectedCandidate?.id === id) {
			setSelectedCandidate(data);
		}
	};

	const loadCandidateJobs = async (candidateId: string) => {
		const { data } = await supabase
			.from('rankings')
			.select('jobid, overallscore')
			.eq('candidateid', candidateId)
			.order('overallscore', { ascending: false })
			.limit(5);
		if (data && data.length > 0) {
			const jobIds = data.map((r) => r.jobid);
			const { data: jobsData } = await supabase
				.from('jobs')
				.select('id, title')
				.in('id', jobIds);
			const jobMap = new Map((jobsData ?? []).map((j) => [j.id, j.title]));
			setCandidateJobs(
				data.map((r) => ({
					jobid: r.jobid,
					overallscore: Number(r.overallscore),
					jobtitle: jobMap.get(r.jobid) ?? 'Unknown',
				})),
			);
		} else {
			setCandidateJobs([]);
		}
	};

	useEffect(() => {
		if (selectedCandidate) {
			// Defer to avoid triggering react-hooks/set-state-in-effect (ESLint 10+ rule).
			void Promise.resolve().then(() => loadCandidateJobs(selectedCandidate.id));
		}
	}, [selectedCandidate]);

	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex items-center justify-between mb-6 md:mb-8">
				<div>
					<h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
						Candidates
					</h1>
					<p className="text-[var(--text-tertiary)] mt-1 text-sm">
						Manage your candidate pipeline
					</p>
				</div>
				<div>
					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,.doc,.docx,.txt"
						multiple
						onChange={handleUpload}
						className="hidden"
					/>
					<button
						onClick={() => fileInputRef.current?.click()}
						disabled={uploading}
						className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
					>
						{uploading ? (
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : (
							<Upload size={16} />
						)}
						<span className="hidden sm:inline">Upload Resumes</span>
						<span className="sm:hidden">Upload</span>
					</button>
				</div>
			</div>

			{uploading && (
				<div className="mb-4">
					<ProgressBar label="Uploading resumes..." value={60} size="sm" />
				</div>
			)}

			<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-quaternary)]" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by name, email, or skills..."
						className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
					/>
				</div>
				<div className="flex gap-1.5 flex-wrap">
					{candidateStatuses.map((s) => (
						<button
							key={s.value}
							onClick={() => setStatusFilter(s.value)}
							className={`px-2.5 md:px-3 py-2 rounded-xl text-xs font-medium transition-all ${
								statusFilter === s.value
									? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]'
									: 'bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)] hover:bg-[var(--btn-ghost-hover)] border border-transparent'
							}`}
						>
							{s.label}
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
					icon={User}
					title={search ? 'No matching candidates' : 'No candidates yet'}
					description={
						search
							? 'Try adjusting your search'
							: 'Upload resumes to start building your candidate pipeline'
					}
					action={
						!search ? (
							<button
								onClick={() => fileInputRef.current?.click()}
								className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all"
							>
								<Upload size={16} /> Upload Resumes
							</button>
						) : undefined
					}
				/>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
					{filtered.map((candidate) => (
						<CandidateTile
							key={candidate.id}
							candidate={candidate}
							onSelect={setSelectedCandidate}
							onDownload={downloadResume}
							onDelete={(id) => setDeleteConfirm(id)}
						/>
					))}
				</div>
			)}

			<CandidateProfileModal
				candidate={selectedCandidate}
				candidateJobs={candidateJobs}
				onClose={() => setSelectedCandidate(null)}
				onStatusUpdate={handleStatusUpdate}
				onDownload={downloadResume}
			/>

			<Modal
				open={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				title="Delete Candidate"
				size="sm"
			>
				<p className="text-sm text-[var(--text-secondary)] mb-6">
					Are you sure you want to remove this candidate? This action cannot be undone.
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

export default CandidateListPage;
