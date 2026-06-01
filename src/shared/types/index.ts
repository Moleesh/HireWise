/** @format */

/** ThemeName - Available theme names */
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
export type Page =
    | 'dashboard'
    | 'jobs'
    | 'job-editor'
    | 'candidates'
    | 'rankings'
    | 'reports'
    | 'settings';

/** JobPoster - AI-generated wall-in poster attached to a job */
export type JobPoster = {
    /** Inline data URL (data:image/png;base64,...) or remote URL */
    url: string;
    /** Prompt that was used to produce this poster */
    prompt: string;
    /** ISO timestamp of generation */
    createdAt: string;
};

/** Job - Job description record from the `jobs` table */
export type Job = {
    id: string;
    title: string;
    department: string | null;
    location: string | null;
    employmentType: string | null;
    experienceLevel: string | null;
    salaryRange: string | null;
    summary: string | null;
    responsibilities: string[];
    requirements: string[];
    skills: string[];
    goodToHave: string[];
    benefits: string[];
    posters: JobPoster[];
    status: 'draft' | 'published' | 'filled';
    createdBy: string | null;
    createdAt: string;
    updatedAt: string;
    duplicatedFromId: string | null;
};

/** CandidateStatus - Candidate status values */
export type CandidateStatus = 'available' | 'in-progress' | 'offered' | 'hired' | 'rejected';

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

/** Candidate - Candidate record from the `candidates` table */
export type Candidate = {
    id: string;
    name: string;
    email: string;
    source: string;
    fileUrl: string;
    fileName: string;
    rawText: string;
    skills: string[];
    experienceYears: number;
    education: EducationEntry[];
    workHistory: WorkHistoryEntry[];
    parsedData: Record<string, unknown>;
    uploadedBy: string | null;
    createdAt: string;
    updatedAt: string;
    status: CandidateStatus;
    timeToJoin: string;
    waitingPeriod: string;
};

/** Ranking - Ranking record from the `rankings` table */
export type Ranking = {
    id: string;
    candidateId: string;
    jobId: string;
    overallScore: number;
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    keywordScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    highlights: string[];
    notes: string;
    rank: number;
    createdBy: string | null;
    createdAt: string;
};

/** User - User record from the `app_users` table */
export type User = {
    id: string;
    email: string;
    role: string;
    themePreference: ThemeName;
    createdAt: string;
    lastSignInAt: string | null;
};
