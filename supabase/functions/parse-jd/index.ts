/** @format */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

/**
 * parse-jd
 *
 * Two modes:
 *   - mode: "enhance"  -> rewrites raw pasted text into a clean, well-structured JD
 *   - mode: "parse" (default) -> extracts structured fields (title, department, skills, goodToHave)
 *
 * Uses OpenRouter when OPENROUTER_API_KEY/API_KEY is configured, falls back to a
 * lightweight regex heuristic otherwise so the function never hard-fails.
 */

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const AI_URL = Deno.env.get('AI_URL') ?? 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = Deno.env.get('AI_MODEL') ?? 'openrouter/free';

const COMMON_SKILLS = [
	'JavaScript',
	'TypeScript',
	'Python',
	'Java',
	'Go',
	'Rust',
	'C++',
	'C#',
	'Ruby',
	'PHP',
	'React',
	'Vue',
	'Angular',
	'Svelte',
	'Next.js',
	'Node.js',
	'Express',
	'Django',
	'Flask',
	'AWS',
	'Azure',
	'GCP',
	'Docker',
	'Kubernetes',
	'Terraform',
	'CI/CD',
	'PostgreSQL',
	'MySQL',
	'MongoDB',
	'Redis',
	'GraphQL',
	'REST',
	'HTML',
	'CSS',
	'Tailwind',
	'SASS',
	'Testing',
	'Jest',
	'Cypress',
	'Playwright',
	'Machine Learning',
	'AI',
	'Data Science',
	'NLP',
	'Swift',
	'Kotlin',
	'Flutter',
];

const fallbackExtract = (text: string) => {
	const lower = text.toLowerCase();
	const lines = text
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean);
	const title = (lines.find((l) => l.length < 100 && !l.includes(':')) ?? '').replace(
		/^(job title|position|role|title)\s*:\s*/i,
		'',
	);
	const deptMatch = text.match(/(?:department|team|division)\s*:\s*([^\n,]+)/i);
	const department = deptMatch?.[1]?.trim() ?? '';
	const skills = COMMON_SKILLS.filter((s) => lower.includes(s.toLowerCase()));
	return { title, department, skills, goodToHave: [] as string[] };
};

const callAi = async (messages: unknown[], tools?: unknown[], toolChoice?: unknown) => {
	const key = Deno.env.get('OPENROUTER_API_KEY') ?? Deno.env.get('API_KEY');
	if (!key) throw new Error('OPENROUTER_API_KEY missing');
	const res = await fetch(AI_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': Deno.env.get('SITE_URL') ?? 'http://localhost:5173/HireWise',
			'X-Title': 'HireWise',
		},
		body: JSON.stringify({
			model: MODEL,
			messages,
			...(tools ? { tools, tool_choice: toolChoice } : {}),
		}),
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`ai_${res.status}:${body.slice(0, 200)}`);
	}
	return await res.json();
};

const enhance = async (text: string): Promise<string> => {
	const data = await callAi([
		{
			role: 'system',
			content:
				'You clean up rough job descriptions. Return a well-structured JD with sections: Title, Department, About the role, Must have, Good to have. Use bullet points. Plain text, no markdown headings beyond simple line labels.',
		},
		{ role: 'user', content: text },
	]);
	return data.choices?.[0]?.message?.content ?? text;
};

const extract = async (text: string) => {
	const tool = {
		type: 'function',
		function: {
			name: 'extract_jd',
			description: 'Extract structured fields from a job description.',
			parameters: {
				type: 'object',
				properties: {
					title: { type: 'string' },
					department: { type: 'string' },
					skills: { type: 'array', items: { type: 'string' } },
					goodToHave: { type: 'array', items: { type: 'string' } },
					summary: { type: 'string' },
				},
				required: ['title', 'department', 'skills', 'goodToHave'],
				additionalProperties: false,
			},
		},
	};
	const data = await callAi(
		[
			{
				role: 'system',
				content:
					'Extract the job title, department, required skills, and good-to-have skills from the JD. Keep skill names concise (1-3 words). Do not invent skills.',
			},
			{ role: 'user', content: text },
		],
		[tool],
		{ type: 'function', function: { name: 'extract_jd' } },
	);
	const call = data.choices?.[0]?.message?.tool_calls?.[0];
	if (!call) throw new Error('no tool call');
	return JSON.parse(call.function.arguments);
};

Deno.serve(async (req: Request) => {
	if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
	try {
		const { text, mode = 'parse' } = await req.json();
		if (!text || typeof text !== 'string') {
			return new Response(JSON.stringify({ error: 'Text is required' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}
		const hasOpenRouterKey = !!Deno.env.get('OPENROUTER_API_KEY') || !!Deno.env.get('API_KEY');

		if (mode === 'enhance') {
			const out = hasOpenRouterKey ? await enhance(text) : text;
			return new Response(JSON.stringify({ text: out }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		let result;
		try {
			result = hasOpenRouterKey ? await extract(text) : fallbackExtract(text);
		} catch {
			result = fallbackExtract(text);
		}
		return new Response(JSON.stringify(result), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ error: message || 'parse-jd failed' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
});
