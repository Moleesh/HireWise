/** @format */

import type { Candidate, Job } from '../../../shared/types';

/** calculateScores - Computes skill, experience, education, keyword, and overall scores for a candidate-job pair. */
export const calculateScores = (candidate: Candidate, job: Job) => {
    const jobSkills = (job.skills ?? []).map((s) => s.toLowerCase());
    const candidateSkills = (candidate.skills ?? []).map((s) => s.toLowerCase());
    const matchedSkills = candidateSkills.filter((cs) =>
        jobSkills.some((js) => js.includes(cs) || cs.includes(js)),
    );
    const missingSkills = jobSkills.filter(
        (js) => !candidateSkills.some((cs) => js.includes(cs) || cs.includes(js)),
    );
    const skillsScore =
        jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 50;
    const expMap: Record<string, number> = { entry: 1, mid: 3, senior: 6, lead: 9, executive: 12 };
    const requiredExp = expMap[job.experienceLevel ?? 'mid'] ?? 3;
    const experienceScore = Math.min(
        100,
        Math.round(((candidate.experienceYears ?? 0) / requiredExp) * 100),
    );
    const educationScore =
        (candidate.education ?? []).length > 0
            ? Math.min(100, (candidate.education ?? []).length * 30)
            : 30;
    const jobText =
        `${job.title} ${job.summary ?? ''} ${(job.responsibilities ?? []).join(' ')} ${(job.requirements ?? []).join(' ')}`.toLowerCase();
    const candidateText =
        `${candidate.rawText ?? ''} ${(candidate.skills ?? []).join(' ')}`.toLowerCase();
    const uniqueKeywords = [...new Set(jobText.split(/\s+/).filter((w) => w.length > 4))];
    const matchedKeywords = uniqueKeywords.filter((kw) => candidateText.includes(kw));
    const keywordScore =
        uniqueKeywords.length > 0
            ? Math.round((matchedKeywords.length / uniqueKeywords.length) * 100)
            : 50;
    const overallScore = Math.round(
        skillsScore * 0.4 + experienceScore * 0.25 + educationScore * 0.15 + keywordScore * 0.2,
    );
    return {
        overallScore,
        skillsScore,
        experienceScore,
        educationScore,
        keywordScore,
        matchedSkills: matchedSkills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
        missingSkills: missingSkills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
        highlights: matchedSkills.slice(0, 3),
        notes: '',
    };
};

/** getRankBadge - Returns badge styling for top 3 ranks, or null for other positions. */
export const getRankBadge = (rank: number) => {
    if (rank === 1)
        return { bg: 'var(--badge-gold-bg)', text: 'var(--badge-gold-text)', icon: '1st' };
    if (rank === 2)
        return { bg: 'var(--badge-silver-bg)', text: 'var(--badge-silver-text)', icon: '2nd' };
    if (rank === 3)
        return { bg: 'var(--badge-bronze-bg)', text: 'var(--badge-bronze-text)', icon: '3rd' };
    return null;
};

/** getScoreColor - Returns CSS variable for score color based on percentage threshold. */
export const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--score-excellent)';
    if (score >= 60) return 'var(--score-good)';
    if (score >= 40) return 'var(--score-fair)';
    return 'var(--score-poor)';
};
