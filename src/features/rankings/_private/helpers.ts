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
  const skillsscore =
    jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 50;
  const expMap: Record<string, number> = { entry: 1, mid: 3, senior: 6, lead: 9, executive: 12 };
  const requiredExp = expMap[job.experiencelevel ?? 'mid'] ?? 3;
  const experiencescore = Math.min(
    100,
    Math.round(((candidate.experienceyears ?? 0) / requiredExp) * 100),
  );
  const educationscore =
    (candidate.education ?? []).length > 0
      ? Math.min(100, (candidate.education ?? []).length * 30)
      : 30;
  const jobText =
    `${job.title} ${job.summary ?? ''} ${(job.responsibilities ?? []).join(' ')} ${(job.requirements ?? []).join(' ')}`.toLowerCase();
  const candidateText =
    `${candidate.rawtext ?? ''} ${(candidate.skills ?? []).join(' ')}`.toLowerCase();
  const uniqueKeywords = [...new Set(jobText.split(/\s+/).filter((w) => w.length > 4))];
  const matchedKeywords = uniqueKeywords.filter((kw) => candidateText.includes(kw));
  const keywordscore =
    uniqueKeywords.length > 0
      ? Math.round((matchedKeywords.length / uniqueKeywords.length) * 100)
      : 50;
  const overallscore = Math.round(
    skillsscore * 0.4 + experiencescore * 0.25 + educationscore * 0.15 + keywordscore * 0.2,
  );
  return {
    overallscore,
    skillsscore,
    experiencescore,
    educationscore,
    keywordscore,
    matchedskills: matchedSkills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    missingskills: missingSkills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
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
