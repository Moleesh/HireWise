/** @format */

import { User, Clock, Calendar, Hourglass, Download, Trash2 } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import StatusBadge from '../../shared/components/StatusBadge';
import { getAge } from '../../shared/lib/dateHelpers';
import type { Candidate } from '../../shared/types';

type CandidateTileProps = {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
  onDownload: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
};

/** CandidateTile - Candidate card component for the candidate grid */
const CandidateTile = ({ candidate, onSelect, onDownload, onDelete }: CandidateTileProps) => {
  return (
    <FrostedCard className="p-4 md:p-5" onClick={() => onSelect(candidate)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[var(--accent-bg-subtle)] border border-[var(--accent-border)] flex items-center justify-center">
            <User size={16} className="text-[var(--accent-text)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {candidate.name ?? 'Unknown'}
            </h3>
            <p className="text-xs text-[var(--text-quaternary)]">{candidate.email ?? 'No email'}</p>
          </div>
        </div>
        <StatusBadge status={candidate.status} />
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--text-quaternary)] mb-3 flex-wrap">
        {candidate.experienceyears > 0 && <span>{candidate.experienceyears}y exp</span>}
        {candidate.timetojoin && (
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {candidate.timetojoin}
          </span>
        )}
        {candidate.waitingperiod && (
          <span className="flex items-center gap-1">
            <Hourglass size={10} />
            {candidate.waitingperiod}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {getAge(candidate.createdat)}
        </span>
      </div>

      {(candidate.skills ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {candidate.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)]"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-quaternary)]">
              +{candidate.skills.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(candidate);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)] hover:bg-[var(--btn-ghost-hover)] hover:text-[var(--text-secondary)] transition-all"
        >
          <Download size={12} /> Download
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(candidate.id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-tertiary)] hover:text-red-400 hover:bg-red-500/10 transition-all ml-auto"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </FrostedCard>
  );
};

export default CandidateTile;
