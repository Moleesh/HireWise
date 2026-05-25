/** @format */

import { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { BarChart3, RefreshCw, Trophy, ChevronDown } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import ZeroState from '../../shared/components/ZeroState';
import ProgressBar from '../../shared/components/ProgressBar';
import LeaderboardTable from './LeaderboardTable';
import RankingLoading from './RankingLoading';
import ScoreBreakdownModal from './ScoreBreakdownModal';
import type { Job, Candidate, Ranking } from '../../shared/types';
import { calculateScores } from './_private/helpers';

type RankingPageProps = {
	preselectedJobId?: string;
};

/** RankingPage - Rankings page with job selection and candidate scoring */
const RankingPage = ({ preselectedJobId }: RankingPageProps) => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [rankings, setRankings] = useState<Ranking[]>([]);
	const [selectedJobId, setSelectedJobId] = useState(preselectedJobId ?? '');
	const [loading, setLoading] = useState(true);
	const [ranking, setRanking] = useState(false);
	const [sortBy, setSortBy] = useState<'overallScore' | 'skillsScore' | 'experienceScore'>(
		'overallScore',
	);
	const [selectedRanking, setSelectedRanking] = useState<Ranking | null>(null);

	const loadData = async () => {
		const [jobsRes, candidatesRes] = await Promise.all([
			supabase.from('jobs').select('*').order('createdAt', { ascending: false }),
			supabase.from('candidates').select('*').order('createdAt', { ascending: false }),
		]);
		setJobs((jobsRes.data as Job[]) ?? []);
		setCandidates((candidatesRes.data as Candidate[]) ?? []);
		setLoading(false);
	};

	useEffect(() => {
		// Defer to avoid triggering react-hooks/set-state-in-effect (ESLint 10+ rule).
		void Promise.resolve().then(loadData);
	}, []);
	useEffect(() => {
		if (preselectedJobId) {
			void Promise.resolve().then(() => setSelectedJobId(preselectedJobId));
		}
	}, [preselectedJobId]);
	useEffect(() => {
		if (selectedJobId) {
			void Promise.resolve().then(async () => {
				const { data } = await supabase
					.from('rankings')
					.select('*')
					.eq('jobId', selectedJobId);
				setRankings((data as Ranking[]) ?? []);
			});
		}
	}, [selectedJobId]);

	const rankCandidates = async () => {
		if (!selectedJobId) return;
		setRanking(true);
		const job = jobs.find((j) => j.id === selectedJobId);
		if (!job) {
			setRanking(false);
			return;
		}
		await supabase.from('rankings').delete().eq('jobId', selectedJobId);
		const newRankings: Ranking[] = [];
		for (const candidate of candidates) {
			const scores = calculateScores(candidate, job);
			const { data } = await supabase
				.from('rankings')
				.insert({ candidateId: candidate.id, jobId: selectedJobId, ...scores })
				.select()
				.single();
			if (data) newRankings.push(data as Ranking);
		}
		const sorted = [...newRankings].sort((a, b) => b.overallScore - a.overallScore);
		for (let i = 0; i < sorted.length; i++) {
			await supabase
				.from('rankings')
				.update({ rank: i + 1 })
				.eq('id', sorted[i].id);
			sorted[i].rank = i + 1;
		}
		setRankings(sorted);
		setRanking(false);
	};

	const selectedJob = jobs.find((j) => j.id === selectedJobId);

	if (loading) return <RankingLoading />;

	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-2xl font-bold text-[var(--text-primary)]">Rankings</h1>
					<p className="text-[var(--text-tertiary)] mt-1">
						Score candidates against jobs
					</p>
				</div>
			</div>

			<FrostedCard className="p-5 mb-6" hover={false}>
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
							Select Job Description
						</label>
						<div className="relative">
							<select
								value={selectedJobId}
								onChange={(e) => setSelectedJobId(e.target.value)}
								className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all appearance-none"
							>
								<option value="">Choose a job description...</option>
								{jobs.map((job) => (
									<option key={job.id} value={job.id}>
										{job.title} ({job.status})
									</option>
								))}
							</select>
							<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-quaternary)] pointer-events-none" />
						</div>
					</div>
					<div className="pt-6">
						<button
							onClick={rankCandidates}
							disabled={!selectedJobId || ranking}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
						>
							{ranking ? (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									<span className="hidden sm:inline">Ranking...</span>
								</div>
							) : rankings.length > 0 ? (
								<>
									<RefreshCw size={16} /> Re-rank
								</>
							) : (
								<>
									<BarChart3 size={16} /> Rank
								</>
							)}
						</button>
					</div>
				</div>
				{selectedJob && (
					<div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-quaternary)]">
						<span>{candidates.length} candidates</span>
						<span>{rankings.length} ranked</span>
					</div>
				)}
			</FrostedCard>

			{!selectedJobId ? (
				<ZeroState
					icon={BarChart3}
					title="Select a job description"
					description="Choose a job description above to start ranking candidates"
				/>
			) : ranking ? (
				<FrostedCard className="p-6" hover={false}>
					<ProgressBar label="Ranking candidates against job..." value={50} size="md" />
				</FrostedCard>
			) : rankings.length === 0 ? (
				<ZeroState
					icon={Trophy}
					title="No rankings yet"
					description="Click 'Rank Candidates' to score all candidates against this job"
				/>
			) : (
				<LeaderboardTable
					rankings={rankings}
					candidates={candidates}
					sortBy={sortBy}
					onSortChange={setSortBy}
					onSelect={setSelectedRanking}
				/>
			)}

			<ScoreBreakdownModal
				ranking={selectedRanking}
				candidates={candidates}
				onClose={() => setSelectedRanking(null)}
			/>
		</div>
	);
};

export default RankingPage;
