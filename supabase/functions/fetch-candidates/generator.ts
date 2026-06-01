/** @format */

import { COMPANIES, DEGREES, FIRST_NAMES, INSTITUTIONS, LAST_NAMES } from './data.ts';
import { SKILL_POOL } from './skills.ts';

export interface FetchRequest {
    job_id: string;
    job_title: string;
    skills: string[];
    experience_level: string;
    location: string;
    sites: string[];
    search_terms: string;
}

export interface Candidate {
    name: string;
    email: string;
    source: string;
    profile_url: string;
    raw_text: string;
    summary: string;
    skills: string[];
    experience_years: number;
    education: { degree: string; institution: string; year: string }[];
    work_history: { title: string; company: string; duration: string; description: string }[];
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const pickN = <T>(arr: T[], n: number): T[] =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));

const getCategory = (jobTitle: string) => {
    const titleLower = jobTitle.toLowerCase();
    if (/frontend|front-end|ui|design/.test(titleLower)) return 'frontend';
    if (/backend|back-end|api/.test(titleLower)) return 'backend';
    if (/data|ml|machine learning|ai/.test(titleLower)) return 'data';
    if (/devops|sre|infrastructure|platform/.test(titleLower)) return 'devops';
    if (/mobile|ios|android/.test(titleLower)) return 'mobile';
    if (/product|project|manager/.test(titleLower)) return 'management';
    return 'fullstack';
};

const previousTitle = (currentTitle: string, index: number): string => {
    const titleLower = currentTitle.toLowerCase();
    if (index === 0) return currentTitle;
    const prefixes = ['Junior', 'Associate', 'Intern'];
    if (titleLower.includes('senior'))
        return currentTitle.replace(/senior/i, prefixes[index - 1] || 'Junior');
    if (titleLower.includes('lead')) return currentTitle.replace(/lead/i, 'Senior');
    if (titleLower.includes('principal')) return currentTitle.replace(/principal/i, 'Senior');
    if (titleLower.includes('staff')) return currentTitle.replace(/staff/i, 'Senior');
    return `${pick(prefixes)} ${currentTitle}`;
};

const buildProfileUrl = (site: string, firstName: string, lastName: string) => {
    const first = firstName.toLowerCase();
    const last = lastName.toLowerCase();
    if (site === 'linkedin')
        return `https://linkedin.com/in/${first}${last}${Math.floor(Math.random() * 99)}`;
    if (site === 'indeed')
        return `https://indeed.com/resume/${first}-${last}-${Math.random().toString(36).slice(2, 6)}`;
    return `https://glassdoor.com/profile/${first}${last}${Math.floor(Math.random() * 99)}`;
};

export const generateCandidate = (
    jobTitle: string,
    skills: string[],
    experienceLevel: string,
    location: string,
    site: string,
): Candidate => {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const expLevelMap: Record<string, [number, number]> = {
        entry: [1, 3],
        mid: [3, 7],
        senior: [6, 12],
        lead: [8, 15],
        executive: [12, 25],
    };
    const [minExp, maxExp] = expLevelMap[experienceLevel] || [2, 8];
    const experienceYears = Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;
    const categorySkills = SKILL_POOL[getCategory(jobTitle)] || SKILL_POOL.fullstack;
    const matchedSkills = skills.filter((skill) =>
        categorySkills.some(
            (categorySkill) =>
                categorySkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(categorySkill.toLowerCase()),
        ),
    );
    const additionalSkills = pickN(
        categorySkills.filter(
            (categorySkill) =>
                !matchedSkills.some((match) => match.toLowerCase() === categorySkill.toLowerCase()),
        ),
        Math.floor(Math.random() * 4) + 2,
    );
    const allSkills = [...new Set([...matchedSkills, ...additionalSkills])];
    const workHistory = buildWorkHistory(jobTitle, experienceLevel, experienceYears, allSkills);
    const education = buildEducation(experienceYears);
    const summary = `${experienceYears}+ years ${experienceLevel}-level experience in ${jobTitle}. Skilled in ${allSkills.slice(0, 5).join(', ')}. Based in ${location || 'San Francisco, CA'}.`;

    return {
        name,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${pick(['gmail.com', 'outlook.com', 'proton.me', 'icloud.com'])}`,
        source: site,
        profile_url: buildProfileUrl(site, firstName, lastName),
        raw_text: buildRawText(name, location, summary, allSkills, workHistory, education),
        summary,
        skills: allSkills,
        experience_years: experienceYears,
        education,
        work_history: workHistory,
    };
};

const buildWorkHistory = (
    jobTitle: string,
    experienceLevel: string,
    experienceYears: number,
    allSkills: string[],
) => {
    const numJobs = Math.min(experienceYears, Math.floor(Math.random() * 3) + 2);
    const usedCompanies = new Set<string>();
    return Array.from({ length: numJobs }, (_, index) => {
        let company = pick(COMPANIES);
        while (usedCompanies.has(company)) company = pick(COMPANIES);
        usedCompanies.add(company);
        return {
            title: index === 0 ? jobTitle : previousTitle(jobTitle, index),
            company,
            duration: `${Math.floor(Math.random() * (index === 0 ? 3 : 4)) + 1} yrs`,
            description: `Contributed to key projects at ${company}, leveraging ${pickN(allSkills, 3).join(', ')}.`,
        };
    });
};

const buildEducation = (experienceYears: number) =>
    Array.from({ length: Math.random() > 0.3 ? 1 : 2 }, (_, index) => ({
        degree: pick(DEGREES),
        institution: pick(INSTITUTIONS),
        year: String(
            new Date().getFullYear() - experienceYears - index * 2 - Math.floor(Math.random() * 3),
        ),
    }));

const buildRawText = (
    name: string,
    location: string,
    summary: string,
    allSkills: string[],
    workHistory: Candidate['work_history'],
    education: Candidate['education'],
) => `${name}
${location || 'San Francisco, CA'}
${summary}

SKILLS
${allSkills.join(', ')}

EXPERIENCE
${workHistory.map((item) => `${item.title} | ${item.company} | ${item.duration}\n${item.description}`).join('\n\n')}

EDUCATION
${education.map((entry) => `${entry.degree} - ${entry.institution} (${entry.year})`).join('\n')}
`;
