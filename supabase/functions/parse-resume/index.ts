/** @format */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

/**
 * parse-resume
 *
 * Receives extracted text from a resume (PDF/DOCX/TXT) — the client does file
 * extraction with pdfjs-dist / mammoth before calling this. Uses AI
 * Gateway with tool calling to extract structured candidate data. Falls back to
 * heuristic regex when the key is missing or AI errors.
 */

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const AI_URL = Deno.env.get('AI_URL') ?? 'https://ai.gateway.lovable.dev/v1/chat/completions';
const MODEL = Deno.env.get('AI_MODEL') ?? 'google/gemini-2.0-flash';

interface ParseRequest {
	text: string;
	file_name?: string;
}

const fallback = (text: string, file_name?: string) => {
	let candidate_name = '';
	const nameMatch =
		text.match(/(?:name|nom)\s*[:-]\s*([^\n]+)/i) ?? text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
	if (nameMatch) candidate_name = nameMatch[1].trim();
	if (!candidate_name && file_name) {
		candidate_name = file_name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
	}
	const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
	const candidate_email = emailMatch?.[0] ?? '';
	const expMatch = text.match(/(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)/i);
	const experience_years = expMatch ? parseInt(expMatch[1]) : 0;
	return {
		candidate_name,
		candidate_email,
		skills: [] as string[],
		experience_years,
		education: [] as { degree: string; institution: string; year: string }[],
		work_history: [] as {
			title: string;
			company: string;
			duration: string;
			description: string;
		}[],
	};
};

const callAi = async (text: string, fileName: string | undefined) => {
	const key = Deno.env.get('API_KEY');
	if (!key) throw new Error('no key');
	const tool = {
		type: 'function',
		function: {
			name: 'extract_resume',
			description: 'Extract structured candidate data from a resume.',
			parameters: {
				type: 'object',
				properties: {
					candidate_name: { type: 'string' },
					candidate_email: { type: 'string' },
					skills: { type: 'array', items: { type: 'string' } },
					experience_years: { type: 'number' },
					education: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								degree: { type: 'string' },
								institution: { type: 'string' },
								year: { type: 'string' },
							},
							required: ['degree', 'institution', 'year'],
							additionalProperties: false,
						},
					},
					work_history: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								title: { type: 'string' },
								company: { type: 'string' },
								duration: { type: 'string' },
								description: { type: 'string' },
							},
							required: ['title', 'company', 'duration', 'description'],
							additionalProperties: false,
						},
					},
				},
				required: [
					'candidate_name',
					'candidate_email',
					'skills',
					'experience_years',
					'education',
					'work_history',
				],
				additionalProperties: false,
			},
		},
	};
	const res = await fetch(AI_URL, {
		method: 'POST',
		headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			model: MODEL,
			messages: [
				{
					role: 'system',
					content:
						'You parse resumes into structured data. Be precise. Keep skill names concise (1-3 words). Use empty strings rather than null. If the resume is unreadable, return safe defaults.',
				},
				{
					role: 'user',
					content: `Filename: ${fileName ?? '(none)'}\n\nResume text:\n${text.slice(0, 18000)}`,
				},
			],
			tools: [tool],
			tool_choice: { type: 'function', function: { name: 'extract_resume' } },
		}),
	});
	if (!res.ok) throw new Error(`ai_${res.status}`);
	const data = await res.json();
	const call = data.choices?.[0]?.message?.tool_calls?.[0];
	if (!call) throw new Error('no tool call');
	return JSON.parse(call.function.arguments);
};

Deno.serve(async (req: Request) => {
	if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
	try {
		const { text, file_name }: ParseRequest = await req.json();
		if (!text) {
			return new Response(JSON.stringify({ error: 'No text provided' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}
		let parsed;
		try {
			parsed = await callAi(text, file_name);
		} catch {
			parsed = fallback(text, file_name);
		}
		return new Response(JSON.stringify(parsed), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: message || 'parse-resume failed' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
});
