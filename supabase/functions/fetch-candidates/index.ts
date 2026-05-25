/** @format */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { generateCandidate, type FetchRequest } from './generator.ts';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
	if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
	try {
		const body: FetchRequest = await req.json();
		const {
			job_title,
			skills = [],
			experience_level = 'mid',
			location = '',
			sites = ['linkedin'],
		} = body;

		if (!job_title) {
			return new Response(JSON.stringify({ error: 'job_title is required' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		const candidates = sites.flatMap((site) =>
			Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () =>
				generateCandidate(job_title, skills, experience_level, location, site),
			),
		);

		return new Response(
			JSON.stringify({
				candidates,
				count: candidates.length,
				sources: sites,
				note: 'Generated candidate profiles for demo purposes',
			}),
			{ headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return new Response(JSON.stringify({ error: message || 'fetch-candidates failed' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
});
