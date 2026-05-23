/**
 * ThemeName - Available theme names
 *
 * @format
 */

export type ThemeName =
	| 'midnight-emerald'
	| 'ocean-depth'
	| 'sunset-copper'
	| 'arctic-frost'
	| 'royal-violet'
	| 'forest-moss'
	| 'crimson-noir'
	| 'paper-ink';

/** Page - Available page routes */
export type Page = 'dashboard' | 'jobs' | 'job-editor' | 'candidates' | 'rankings' | 'settings';

/** JobPoster - AI-generated wall-in poster attached to a job */
export type JobPoster = {
	/** Inline data URL (data:image/png;base64,...) or remote URL */
	url: string;
	/** Prompt that was used to produce this poster */
	prompt: string;
	/** ISO timestamp of generation */
	createdat: string;
};

/** Job - Job description record from the `jobs` table */
export type Job = {
	id: string;
	title: string;
	department: string | null;
	location: string | null;
	employmenttype: string | null;
	experiencelevel: string | null;
	salaryrange: string | null;
	summary: string | null;
	responsibilities: string[];
	requirements: string[];
	skills: string[];
	goodtohave: string[];
	benefits: string[];
	posters: JobPoster[];
	status: 'draft' | 'published' | 'filled';
	createdby: string | null;
	createdat: string;
	updatedat: string;
	duplicatedfromid: string | null;
};

/** CandidateStatus - Candidate status values */
export type CandidateStatus = 'available' | 'in-progress' | 'offered' | 'hired' | 'rejected';

/** Candidate - Candidate record from the `candidates` table */
export type Candidate = {
	id: string;
	name: string;
	email: string;
	source: string;
	fileurl: string;
	filename: string;
	rawtext: string;
	skills: string[];
	experienceyears: number;
	education: EducationEntry[];
	workhistory: WorkHistoryEntry[];
	parseddata: Record<string, unknown>;
	uploadedby: string | null;
	createdat: string;
	updatedat: string;
	status: CandidateStatus;
	timetojoin: string;
	waitingperiod: string;
};

/** EducationEntry - Education entry within a candidate's parsed data */
export type EducationEntry = {
	degree: string;
	institution: string;
	year: string;
};

/** WorkHistoryEntry - Work history entry within a candidate's parsed data */
export type WorkHistoryEntry = {
	title: string;
	company: string;
	duration: string;
	description: string;
};

/** Ranking - Ranking record from the `rankings` table */
export type Ranking = {
	id: string;
	candidateid: string;
	jobid: string;
	overallscore: number;
	skillsscore: number;
	experiencescore: number;
	educationscore: number;
	keywordscore: number;
	matchedskills: string[];
	missingskills: string[];
	highlights: string[];
	notes: string;
	rank: number;
	createdby: string | null;
	createdat: string;
};

/** User - User record from the `users` table */
export type User = {
	id: string;
	email: string;
	role: string;
	createdat: string;
	lastsigninat: string | null;
};
