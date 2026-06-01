/** @format */

import type { Candidate } from '../../shared/types';

type CandidateProfileDetailsProps = {
    candidate: Candidate;
};

/** CandidateProfileDetails - Skill, education, and work-history lists. */
const CandidateProfileDetails = ({ candidate }: CandidateProfileDetailsProps) => (
    <>
        {(candidate.skills ?? []).length > 0 && (
            <div>
                <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                    Skills
                </label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {candidate.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        )}
        {(candidate.education ?? []).length > 0 && (
            <div>
                <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                    Education
                </label>
                <div className="space-y-1.5 mt-2">
                    {candidate.education.map((entry, index) => (
                        <p key={index} className="text-sm text-[var(--text-primary)]">
                            {entry.degree} - {entry.institution} ({entry.year})
                        </p>
                    ))}
                </div>
            </div>
        )}
        {(candidate.workHistory ?? []).length > 0 && (
            <div>
                <label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
                    Work History
                </label>
                <div className="space-y-2 mt-2">
                    {candidate.workHistory.map((work, index) => (
                        <div key={index} className="text-sm">
                            <p className="text-[var(--text-primary)] font-medium">
                                {work.title} at {work.company}
                            </p>
                            <p className="text-[var(--text-quaternary)] text-xs">{work.duration}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>
);

export default CandidateProfileDetails;
