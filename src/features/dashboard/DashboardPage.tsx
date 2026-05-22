/** @format */

import { useEffect, useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { FileText, Users, BarChart3, UserCheck, Briefcase } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import CountUp from '../../shared/components/CountUp';
import { ShimmerCard, ShimmerRow } from '../../shared/components/ShimmerLoader';
import ActivityFeed from './ActivityFeed';
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
  recentJobs: { id: string; title: string; status: string; createdat: string }[];
  recentCandidates: {
    id: string;
    name: string;
    source: string;
    createdat: string;
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

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [jobsRes, publishedRes, candidatesRes, hiredRes, rankingsRes] = await Promise.all([
      supabase.from('jobs').select('id', { count: 'exact', head: true }),
      supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'published'),
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
        .select('id, title, status, createdat')
        .order('createdat', { ascending: false })
        .limit(5),
      supabase
        .from('candidates')
        .select('id, name, source, createdat, status')
        .order('createdat', { ascending: false })
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

  const statCards = [
    {
      label: 'Job Descriptions',
      value: stats.totalJobs,
      icon: FileText,
      sub: `${stats.publishedJobs} published`,
      accent: 'var(--accent-text)',
      navigate: () => onNavigate('jobs'),
    },
    {
      label: 'Candidates',
      value: stats.totalCandidates,
      icon: Users,
      sub: 'in pipeline',
      accent: 'var(--stat-cyan)',
      navigate: () => onNavigate('candidates'),
    },
    {
      label: 'Hired',
      value: stats.hiredCandidates,
      icon: UserCheck,
      sub: 'candidates',
      accent: 'var(--stat-teal)',
      navigate: () => onNavigate('candidates'),
    },
    {
      label: 'Rankings',
      value: stats.totalRankings,
      icon: BarChart3,
      sub: 'evaluated',
      accent: 'var(--stat-amber)',
      navigate: () => onNavigate('rankings'),
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-48 bg-[var(--skeleton-bg)] rounded-lg mb-2" />
          <div className="h-4 w-64 bg-[var(--skeleton-bg)] rounded-lg" />
        </div>
        <ShimmerCard count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
            <ShimmerRow rows={4} />
          </div>
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
            <ShimmerRow rows={4} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-[var(--text-tertiary)] mt-1 text-sm">Overview of your hiring pipeline</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((card) => (
          <FrostedCard
            key={card.label}
            className="p-4 md:p-5 cursor-pointer"
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
            <p className="text-xs md:text-sm text-[var(--text-tertiary)] mt-1">{card.label}</p>
            <p className="text-[10px] md:text-xs mt-1" style={{ color: card.accent }}>
              {card.sub}
            </p>
          </FrostedCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ActivityFeed
          label="Recent Job Descriptions"
          icon={<Briefcase className="w-4 h-4 text-[var(--text-quaternary)] shrink-0" />}
          items={stats.recentJobs.map((j) => ({
            id: j.id,
            title: j.title,
            status: j.status,
            createdat: j.createdat,
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
            createdat: c.createdat,
          }))}
          onNavigate={onNavigate}
          navigatePage="candidates"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
