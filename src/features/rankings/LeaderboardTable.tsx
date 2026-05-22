/** @format */

import FrostedCard from '../../shared/components/FrostedCard';
import ProgressBar from '../../shared/components/ProgressBar';
import type { Candidate, Ranking } from '../../shared/types';
import { getRankBadge } from './_private/helpers';

type LeaderboardTableProps = {
  rankings: Ranking[];
  candidates: Candidate[];
  sortBy: 'overallscore' | 'skillsscore' | 'experiencescore';
  onSortChange: (sortBy: 'overallscore' | 'skillsscore' | 'experiencescore') => void;
  onSelect: (ranking: Ranking) => void;
};

/** LeaderboardTable - Ranking list with sort controls and rank badges */
const LeaderboardTable = ({
  rankings,
  candidates,
  sortBy,
  onSortChange,
  onSelect,
}: LeaderboardTableProps) => {
  const sortedRankings = [...rankings].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-[var(--text-quaternary)]">Sort by:</span>
        {(['overallscore', 'skillsscore', 'experiencescore'] as const).map((field) => (
          <button
            key={field}
            onClick={() => onSortChange(field)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              sortBy === field
                ? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)]'
                : 'text-[var(--text-quaternary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {field === 'overallscore'
              ? 'Overall'
              : field === 'skillsscore'
                ? 'Skills'
                : 'Experience'}
          </button>
        ))}
      </div>

      {sortedRankings.map((r) => {
        const candidate = candidates.find((c) => c.id === r.candidateid);
        const badge = getRankBadge(r.rank);
        return (
          <FrostedCard key={r.id} className="p-4" onClick={() => onSelect(r)}>
            <div className="flex items-center gap-4">
              <div className="w-12 text-center">
                {badge ? (
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {badge.icon}
                  </span>
                ) : (
                  <span className="text-lg font-bold text-[var(--text-quaternary)]">#{r.rank}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {candidate?.name ?? 'Unknown'}
                </h3>
                <p className="text-xs text-[var(--text-quaternary)]">{candidate?.email ?? ''}</p>
              </div>
              <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                <div className="w-14 md:w-16">
                  <ProgressBar label="Overall" value={r.overallscore} size="sm" />
                </div>
                <div className="w-14 md:w-16">
                  <ProgressBar label="Skills" value={r.skillsscore} size="sm" />
                </div>
                <div className="w-14 md:w-16 hidden sm:block">
                  <ProgressBar label="Exp" value={r.experiencescore} size="sm" />
                </div>
              </div>
            </div>
          </FrostedCard>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;
