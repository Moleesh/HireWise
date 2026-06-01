/** @format */

import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { FileText, Users, BarChart3, UserCheck, Briefcase } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import CountUp from '../../shared/components/CountUp';
import ActivityFeed from './ActivityFeed';
import DashboardHero from './DashboardHero';
import DashboardLoading from './DashboardLoading';
import type { Page } from '../../shared/types';

type DashboardProps = {
    onNavigate: (page: Page, data?: Record<string, string>) => void;
};

type Stats = {
    totalJobs: number;
    publishedJobs: number;
    totalCandidates: number;
    hiredCandidates: number;
    totalRankings: number;
    recentJobs: { id: string; title: string; status: string; createdAt: string }[];
    recentCandidates: {
        id: string;
        name: string;
        source: string;
        createdAt: string;
        status: string;
    }[];
};

/** DashboardPage - Dashboard page with clickable stat cards and recent activity lists */
const DashboardPage = ({ onNavigate }: DashboardProps) => {
    const [stats, setStats] = useState<Stats>({
        totalJobs: 0,
        publishedJobs: 0,
        totalCandidates: 0,
        hiredCandidates: 0,
        totalRankings: 0,
        recentJobs: [],
        recentCandidates: [],
    });
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        const [jobsRes, publishedRes, candidatesRes, hiredRes, rankingsRes] = await Promise.all([
            supabase.from('jobs').select('id', { count: 'exact', head: true }),
            supabase
                .from('jobs')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'published'),
            supabase.from('candidates').select('id', { count: 'exact', head: true }),
            supabase
                .from('candidates')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'hired'),
            supabase.from('rankings').select('id', { count: 'exact', head: true }),
        ]);
        const [recentJobsRes, recentCandidatesRes] = await Promise.all([
            supabase
                .from('jobs')
                .select('id, title, status, createdAt')
                .order('createdAt', { ascending: false })
                .limit(5),
            supabase
                .from('candidates')
                .select('id, name, source, createdAt, status')
                .order('createdAt', { ascending: false })
                .limit(5),
        ]);
        setStats({
            totalJobs: jobsRes.count ?? 0,
            publishedJobs: publishedRes.count ?? 0,
            totalCandidates: candidatesRes.count ?? 0,
            hiredCandidates: hiredRes.count ?? 0,
            totalRankings: rankingsRes.count ?? 0,
            recentJobs: recentJobsRes.data ?? [],
            recentCandidates: recentCandidatesRes.data ?? [],
        });
        setLoading(false);
    };

    useEffect(() => {
        // Defer to avoid triggering react-hooks/set-state-in-effect (ESLint 10+ rule).
        void Promise.resolve().then(loadStats);
    }, []);

    const statCards = [
        {
            label: 'Jobs',
            value: stats.totalJobs,
            icon: FileText,
            sub: `${stats.publishedJobs} published`,
            detail: `${Math.max(stats.totalJobs - stats.publishedJobs, 0)} not published`,
            accent: 'var(--accent-text)',
            navigate: () => onNavigate('jobs'),
        },
        {
            label: 'Candidates',
            value: stats.totalCandidates,
            icon: Users,
            sub: 'in pipeline',
            detail: `${Math.max(stats.totalCandidates - stats.hiredCandidates, 0)} active`,
            accent: 'var(--stat-cyan)',
            navigate: () => onNavigate('candidates'),
        },
        {
            label: 'Hired',
            value: stats.hiredCandidates,
            icon: UserCheck,
            sub: 'candidates',
            detail:
                stats.totalCandidates > 0
                    ? `${Math.round((stats.hiredCandidates / stats.totalCandidates) * 100)}% hire rate`
                    : '0% hire rate',
            accent: 'var(--stat-teal)',
            navigate: () => onNavigate('candidates'),
        },
        {
            label: 'Rankings',
            value: stats.totalRankings,
            icon: BarChart3,
            sub: 'evaluated',
            detail: `${stats.recentJobs.length} recent jobs`,
            accent: 'var(--stat-amber)',
            navigate: () => onNavigate('rankings'),
        },
    ];

    if (loading) return <DashboardLoading />;

    return (
        <div className="max-w-7xl mx-auto">
            <DashboardHero />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {statCards.map((card) => (
                    <FrostedCard
                        key={card.label}
                        className="p-4 md:p-5 cursor-pointer min-h-[190px] md:min-h-[210px] flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                        onClick={card.navigate}
                    >
                        <div className="flex items-start justify-between mb-3 md:mb-4">
                            <div
                                className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center border"
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${card.accent} 10%, transparent)`,
                                    borderColor: `color-mix(in srgb, ${card.accent} 20%, transparent)`,
                                }}
                            >
                                <card.icon size={18} style={{ color: card.accent }} />
                            </div>
                        </div>
                        <CountUp value={card.value} />
                        <p className="text-xs md:text-sm text-[var(--text-tertiary)] mt-1">
                            {card.label}
                        </p>
                        <div className="mt-auto pt-3">
                            <div className="h-px bg-[var(--border-subtle)] mb-2.5" />
                            <div className="space-y-1.5">
                                <p
                                    className="text-[10px] md:text-xs px-2 py-1 rounded-md border w-fit"
                                    style={{
                                        color: card.accent,
                                        backgroundColor: `color-mix(in srgb, ${card.accent} 10%, transparent)`,
                                        borderColor: `color-mix(in srgb, ${card.accent} 25%, transparent)`,
                                    }}
                                >
                                    {card.sub}
                                </p>
                                <p className="text-[10px] md:text-xs text-[var(--text-quaternary)]">
                                    {card.detail}
                                </p>
                            </div>
                        </div>
                    </FrostedCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <ActivityFeed
                    label="Recent Jobs"
                    icon={<Briefcase className="w-4 h-4 text-[var(--text-quaternary)] shrink-0" />}
                    items={stats.recentJobs.map((j) => ({
                        id: j.id,
                        title: j.title,
                        status: j.status,
                        createdAt: j.createdAt,
                    }))}
                    onNavigate={onNavigate}
                    navigatePage="job-editor"
                    navigateData={(item) => ({ id: item.id, mode: 'view' })}
                />
                <ActivityFeed
                    label="Recent Candidates"
                    icon={<Users className="w-4 h-4 text-[var(--text-quaternary)] shrink-0" />}
                    items={stats.recentCandidates.map((c) => ({
                        id: c.id,
                        name: c.name,
                        status: c.status,
                        createdAt: c.createdAt,
                    }))}
                    onNavigate={onNavigate}
                    navigatePage="candidates"
                />
            </div>
        </div>
    );
};

export default DashboardPage;
