/** @format */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface FetchRequest {
	job_id: string;
	job_title: string;
	skills: string[];
	experience_level: string;
	location: string;
	sites: string[];
	search_terms: string;
}

interface Candidate {
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

const FIRST_NAMES = [
	'Alex',
	'Jordan',
	'Taylor',
	'Morgan',
	'Casey',
	'Riley',
	'Quinn',
	'Avery',
	'Cameron',
	'Blake',
	'Drew',
	'Jamie',
	'Kennedy',
	'Parker',
	'Sage',
	'Reese',
	'Dakota',
	'Skyler',
	'Lennox',
	'Harper',
	'Emerson',
	'Rowan',
	'Finley',
	'Dakota',
	'Priya',
	'Wei',
	'Amara',
	'Kenji',
	'Sofia',
	'Omar',
	'Yuki',
	'Lena',
	'Raj',
	'Mei',
	'Carlos',
	'Aisha',
	'Viktor',
	'Ines',
	'Kwame',
	'Daria',
];

const LAST_NAMES = [
	'Chen',
	'Patel',
	'Kim',
	'Singh',
	'Wang',
	'Garcia',
	'Muller',
	'Tanaka',
	"O'Brien",
	'Novak',
	'Silva',
	'Andersen',
	'Park',
	'Johansson',
	'Rivera',
	'Nakamura',
	'Schmidt',
	'Rossi',
	'Larsson',
	'Dubois',
	'Kowalski',
	'Santos',
	'Fischer',
	'Murphy',
	'Ivanov',
	'Bergstrom',
	'Torres',
	'Leclerc',
	'Yamamoto',
];

const COMPANIES = [
	'Google',
	'Meta',
	'Amazon',
	'Microsoft',
	'Apple',
	'Netflix',
	'Stripe',
	'Shopify',
	'Spotify',
	'Airbnb',
	'Uber',
	'Slack',
	'Figma',
	'Vercel',
	'Datadog',
	'Snowflake',
	'Databricks',
	'Palantir',
	'Coinbase',
	'Square',
	'Twilio',
	'Okta',
	'Cloudflare',
	'PagerDuty',
	'Elastic',
	'HashiCorp',
	'Salesforce',
	'Adobe',
	'Atlassian',
	'Zoom',
	'Notion',
	'Linear',
];

const SKILL_POOL: Record<string, string[]> = {
	frontend: [
		'react',
		'typescript',
		'javascript',
		'vue',
		'angular',
		'css',
		'html',
		'tailwind',
		'next.js',
		'graphql',
		'jest',
		'cypress',
		'webpack',
		'vite',
		'storybook',
	],
	backend: [
		'python',
		'java',
		'go',
		'rust',
		'node',
		'sql',
		'postgresql',
		'redis',
		'mongodb',
		'docker',
		'kubernetes',
		'grpc',
		'rest api',
		'microservices',
		'kafka',
	],
	data: [
		'python',
		'sql',
		'machine learning',
		'tensorflow',
		'pytorch',
		'pandas',
		'numpy',
		'spark',
		'airflow',
		'dbt',
		'snowflake',
		'bigquery',
		'tableau',
		'statistics',
		'nlp',
	],
	devops: [
		'aws',
		'docker',
		'kubernetes',
		'terraform',
		'ci/cd',
		'jenkins',
		'linux',
		'python',
		'go',
		'monitoring',
		'ansible',
		'cloudformation',
		'helm',
		'prometheus',
		'grafana',
	],
	mobile: [
		'react native',
		'swift',
		'kotlin',
		'flutter',
		'dart',
		'ios',
		'android',
		'typescript',
		'firebase',
		'graphql',
		'rest api',
		'xcode',
		'jetpack compose',
		'swiftui',
	],
	fullstack: [
		'react',
		'typescript',
		'node',
		'python',
		'sql',
		'postgresql',
		'docker',
		'aws',
		'graphql',
		'rest api',
		'redis',
		'mongodb',
		'next.js',
		'tailwind',
		'git',
	],
	design: [
		'figma',
		'sketch',
		'adobe xd',
		'photoshop',
		'illustrator',
		'css',
		'html',
		'tailwind',
		'prototyping',
		'user research',
		'wireframing',
		'design systems',
		'accessibility',
	],
	management: [
		'agile',
		'scrum',
		'jira',
		'project management',
		'leadership',
		'communication',
		'stakeholder management',
		'roadmapping',
		'data analysis',
		'strategy',
		'budgeting',
		'risk management',
	],
};

const DEGREES = [
	'B.S. Computer Science',
	'M.S. Computer Science',
	'B.S. Software Engineering',
	'M.S. Data Science',
	'B.S. Information Technology',
	'M.B.A.',
	'Ph.D. Computer Science',
	'B.S. Mathematics',
	'M.S. Artificial Intelligence',
	'B.A. Design',
	'M.S. Human-Computer Interaction',
	'B.S. Electrical Engineering',
];

const INSTITUTIONS = [
	'MIT',
	'Stanford University',
	'Carnegie Mellon',
	'UC Berkeley',
	'Georgia Tech',
	'University of Washington',
	'University of Michigan',
	'Cornell University',
	'Princeton University',
	'Columbia University',
	'University of Toronto',
	'Imperial College London',
	'ETH Zurich',
	'IIT Bombay',
	'Tsinghua University',
];

const pick = <T>(arr: T[]): T => {
	return arr[Math.floor(Math.random() * arr.length)];
};

const pickN = <T>(arr: T[], n: number): T[] => {
	const shuffled = [...arr].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, Math.min(n, arr.length));
};

const generateCandidate = (
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

	const titleLower = jobTitle.toLowerCase();
	let category = 'fullstack';
	if (
		titleLower.includes('frontend') ||
		titleLower.includes('front-end') ||
		titleLower.includes('ui') ||
		titleLower.includes('design')
	)
		category = 'frontend';
	else if (
		titleLower.includes('backend') ||
		titleLower.includes('back-end') ||
		titleLower.includes('api')
	)
		category = 'backend';
	else if (
		titleLower.includes('data') ||
		titleLower.includes('ml') ||
		titleLower.includes('machine learning') ||
		titleLower.includes('ai')
	)
		category = 'data';
	else if (
		titleLower.includes('devops') ||
		titleLower.includes('sre') ||
		titleLower.includes('infrastructure') ||
		titleLower.includes('platform')
	)
		category = 'devops';
	else if (
		titleLower.includes('mobile') ||
		titleLower.includes('ios') ||
		titleLower.includes('android')
	)
		category = 'mobile';
	else if (
		titleLower.includes('product') ||
		titleLower.includes('project') ||
		titleLower.includes('manager')
	)
		category = 'management';

	const categorySkills = SKILL_POOL[category] || SKILL_POOL.fullstack;
	const matchedSkills = skills.filter((s) =>
		categorySkills.some(
			(cs) =>
				cs.toLowerCase().includes(s.toLowerCase()) ||
				s.toLowerCase().includes(cs.toLowerCase()),
		),
	);
	const additionalSkills = pickN(
		categorySkills.filter(
			(cs) => !matchedSkills.some((ms) => ms.toLowerCase() === cs.toLowerCase()),
		),
		Math.floor(Math.random() * 4) + 2,
	);
	const allSkills = [...new Set([...matchedSkills, ...additionalSkills])];

	const numJobs = Math.min(experienceYears, Math.floor(Math.random() * 3) + 2);
	const workHistory = [];
	const usedCompanies = new Set<string>();
	for (let i = 0; i < numJobs; i++) {
		let company = pick(COMPANIES);
		while (usedCompanies.has(company)) company = pick(COMPANIES);
		usedCompanies.add(company);
		const duration =
			i === 0
				? `${Math.floor(Math.random() * 3) + 1} yrs`
				: `${Math.floor(Math.random() * 4) + 1} yrs`;
		workHistory.push({
			title: i === 0 ? jobTitle : generatePreviousTitle(jobTitle, experienceLevel, i),
			company,
			duration,
			description: `Contributed to key projects at ${company}, leveraging ${pickN(allSkills, 3).join(', ')}.`,
		});
	}

	const numEducation = Math.random() > 0.3 ? 1 : 2;
	const education = [];
	for (let i = 0; i < numEducation; i++) {
		const year =
			new Date().getFullYear() - experienceYears - i * 2 - Math.floor(Math.random() * 3);
		education.push({
			degree: pick(DEGREES),
			institution: pick(INSTITUTIONS),
			year: String(year),
		});
	}

	const profileUrl =
		site === 'linkedin'
			? `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}`
			: site === 'indeed'
				? `https://indeed.com/resume/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.random().toString(36).slice(2, 6)}`
				: `https://glassdoor.com/profile/${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}`;

	const summary = `${experienceYears}+ years ${experienceLevel}-level experience in ${jobTitle}. Skilled in ${allSkills.slice(0, 5).join(', ')}. Based in ${location || 'San Francisco, CA'}.`;

	const rawText = `${name}
${location || 'San Francisco, CA'}
${summary}

SKILLS
${allSkills.join(', ')}

EXPERIENCE
${workHistory.map((wh) => `${wh.title} | ${wh.company} | ${wh.duration}\n${wh.description}`).join('\n\n')}

EDUCATION
${education.map((ed) => `${ed.degree} - ${ed.institution} (${ed.year})`).join('\n')}
`;

	return {
		name,
		email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${pick(['gmail.com', 'outlook.com', 'proton.me', 'icloud.com'])}`,
		source: site,
		profile_url: profileUrl,
		raw_text: rawText,
		summary,
		skills: allSkills,
		experience_years: experienceYears,
		education,
		work_history: workHistory,
	};
};

const generatePreviousTitle = (currentTitle: string, _level: string, index: number): string => {
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

Deno.serve(async (req: Request) => {
	if (req.method === 'OPTIONS') {
		return new Response(null, { status: 200, headers: corsHeaders });
	}

	try {
		const body: FetchRequest = await req.json();

		if (!body.job_id || !body.sites?.length) {
			return new Response(
				JSON.stringify({ error: 'Missing required fields: job_id, sites' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				},
			);
		}

		const candidates: Candidate[] = [];
		const candidatesPerSite = Math.floor(Math.random() * 4) + 3; // 3-6 per site

		for (const site of body.sites) {
			for (let i = 0; i < candidatesPerSite; i++) {
				candidates.push(
					generateCandidate(
						body.job_title || 'Software Engineer',
						body.skills || [],
						body.experience_level || 'mid',
						body.location || 'Remote',
						site,
					),
				);
			}
		}

		// Sort by relevance - candidates with more matching skills come first
		const jobSkillsLower = (body.skills || []).map((s) => s.toLowerCase());
		candidates.sort((a, b) => {
			const aMatch = a.skills.filter((s) =>
				jobSkillsLower.some((js) => s.toLowerCase().includes(js)),
			).length;
			const bMatch = b.skills.filter((s) =>
				jobSkillsLower.some((js) => s.toLowerCase().includes(js)),
			).length;
			return bMatch - aMatch;
		});

		return new Response(JSON.stringify({ candidates, total: candidates.length }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: message || 'Internal server error' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
});
