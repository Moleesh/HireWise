/** @format */

import { useState, useRef, useEffect } from 'react';
import { useCandidates } from './hooks/useCandidates';
import { supabase } from '../../shared/lib/supabase';
import { Upload, User } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import LoadMoreButton from '../../shared/components/LoadMoreButton';
import ZeroState from '../../shared/components/ZeroState';
import ProgressBar from '../../shared/components/ProgressBar';
import { ShimmerRow } from '../../shared/components/ShimmerLoader';
import CandidateFilters from './CandidateFilters';
import CandidateListHeader from './CandidateListHeader';
import CandidateTile from './CandidateTile';
import CandidateProfileModal from './CandidateProfileModal';
import DeleteCandidateModal from './DeleteCandidateModal';
import type { Candidate, CandidateStatus } from '../../shared/types';
import useLazyList from '../../shared/hooks/useLazyList';

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
        {
            jobId: string;
            overallScore: number;
            jobTitle: string;
            jobDepartment?: string;
            jobStatus?: string;
            rank?: number;
            skillsScore?: number;
            experienceScore?: number;
            educationScore?: number;
            keywordScore?: number;
        }[]
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
    const lazyCandidates = useLazyList(filtered, {
        initialCount: 12,
        increment: 12,
        resetKey: `${search}:${statusFilter}`,
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
            .select(
                'jobId, overallScore, skillsScore, experienceScore, educationScore, keywordScore, rank',
            )
            .eq('candidateId', candidateId)
            .order('overallScore', { ascending: false })
            .limit(5);
        const rows = (data ?? []) as {
            jobId: string;
            overallScore: number;
            skillsScore: number;
            experienceScore: number;
            educationScore: number;
            keywordScore: number;
            rank: number;
        }[];
        if (rows.length > 0) {
            const jobIds = rows.map((r) => r.jobId);
            const { data: jobsData } = await supabase
                .from('jobs')
                .select('id, title, department, status')
                .in('id', jobIds);
            const jobs = (jobsData ?? []) as {
                id: string;
                title: string;
                department: string | null;
                status: string;
            }[];
            const jobMap = new Map(
                jobs.map((job) => [
                    job.id,
                    {
                        title: job.title,
                        department: job.department ?? '',
                        status: job.status,
                    },
                ]),
            );
            setCandidateJobs(
                rows.map((r) => ({
                    jobId: r.jobId,
                    overallScore: Number(r.overallScore),
                    jobTitle: jobMap.get(r.jobId)?.title ?? 'Unknown',
                    jobDepartment: jobMap.get(r.jobId)?.department ?? '',
                    jobStatus: jobMap.get(r.jobId)?.status ?? '',
                    rank: Number(r.rank ?? 0) > 0 ? Number(r.rank) : undefined,
                    skillsScore: Number(r.skillsScore ?? 0) > 0 ? Number(r.skillsScore) : undefined,
                    experienceScore:
                        Number(r.experienceScore ?? 0) > 0 ? Number(r.experienceScore) : undefined,
                    educationScore:
                        Number(r.educationScore ?? 0) > 0 ? Number(r.educationScore) : undefined,
                    keywordScore:
                        Number(r.keywordScore ?? 0) > 0 ? Number(r.keywordScore) : undefined,
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
            <CandidateListHeader
                fileInputRef={fileInputRef}
                uploading={uploading}
                onUpload={handleUpload}
            />

            {uploading && (
                <div className="mb-4">
                    <ProgressBar label="Uploading resumes..." value={60} size="sm" />
                </div>
            )}

            <CandidateFilters
                search={search}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onStatusFilterChange={setStatusFilter}
            />

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
                    {lazyCandidates.visibleItems.map((candidate) => (
                        <CandidateTile
                            key={candidate.id}
                            candidate={candidate}
                            onSelect={setSelectedCandidate}
                            onDownload={downloadResume}
                            onDelete={(id) => setDeleteConfirm(id)}
                        />
                    ))}
                    {lazyCandidates.hasMore && (
                        <div className="sm:col-span-2 lg:col-span-3">
                            <LoadMoreButton
                                remainingCount={lazyCandidates.remainingCount}
                                onClick={lazyCandidates.loadMore}
                            />
                        </div>
                    )}
                </div>
            )}

            <CandidateProfileModal
                candidate={selectedCandidate}
                candidateJobs={candidateJobs}
                onClose={() => setSelectedCandidate(null)}
                onStatusUpdate={handleStatusUpdate}
                onDownload={downloadResume}
            />

            <DeleteCandidateModal
                open={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
            />
        </div>
    );
};

export default CandidateListPage;
