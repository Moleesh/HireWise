/** @format */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

/**
 * generate-summary
 *
 * Generates a professional, bulleted JD summary from title, department, skills,
 * and good-to-have items via Lovable AI Gateway.
 */

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const AI_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const MODEL = 'google/gemini-3-flash-preview';

const fallback = (title: string, dept: string, skills: string[], goodtohave: string[]): string => {
	const lines = [
		`${title || 'Open Role'} — ${dept || 'Team'}`,
		'',
		'About the role',
		`• Join the ${dept || 'team'} as a ${title || 'team member'} and own end-to-end delivery of high-impact work.`,
		`• Collaborate closely with product, design and engineering partners to ship customer value.`,
		'',
		"What you'll bring",
		...skills.slice(0, 5).map((s) => `• Strong working knowledge of ${s}.`),
		'',
		goodtohave.length ? 'Nice to have' : '',
		...goodtohave.slice(0, 4).map((s) => `• Familiarity with ${s}.`),
	].filter(Boolean);
	return lines.join('\n');
};

Deno.serve(async (req: Request) => {
	if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
	try {
		const { title = '', department = '', skills = [], goodtohave = [] } = await req.json();
		const key = Deno.env.get('LOVABLE_API_KEY');

		if (!key) {
			return new Response(
				JSON.stringify({ summary: fallback(title, department, skills, goodtohave) }),
				{ headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
			);
		}

		const res = await fetch(AI_URL, {
			method: 'POST',
			headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: MODEL,
				messages: [
					{
						role: 'system',
						content:
							"You write polished, professional job-description summaries. Output plain text with short section labels (no markdown headings) and bullet points using '• '. Sections: a one-line headline, 'About the role' (2-3 bullets), 'What you'll bring' (3-5 bullets derived from required skills), and 'Nice to have' (only if provided). Keep it concise, confident and human.",
					},
					{
						role: 'user',
						content: JSON.stringify({ title, department, skills, goodtohave }),
					},
				],
			}),
		});

		if (!res.ok) {
			const body = await res.text();
			if (res.status === 429 || res.status === 402) {
				return new Response(JSON.stringify({ error: body, status: res.status }), {
					status: res.status,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				});
			}
			return new Response(
				JSON.stringify({ summary: fallback(title, department, skills, goodtohave) }),
				{ headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
			);
		}

		const data = await res.json();
		const summary =
			data.choices?.[0]?.message?.content ?? fallback(title, department, skills, goodtohave);
		return new Response(JSON.stringify({ summary }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ error: message || 'generate-summary failed' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
});
