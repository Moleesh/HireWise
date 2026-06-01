/** @format */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

/**
 * generate-summary
 *
 * Generates a professional, bulleted JD summary from title, department, skills,
 * and good-to-have items via OpenRouter free routing.
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const AI_URL = Deno.env.get('AI_URL') ?? 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = Deno.env.get('AI_MODEL') ?? 'openrouter/free';

const fallback = (title: string, dept: string, skills: string[], goodToHave: string[]): string => {
    const topSkills = skills.slice(0, 5);
    const lines = [
        `${title || 'Open Role'} — ${dept || 'Team'}`,
        '',
        'About the role',
        `• Lead end-to-end delivery as a ${title || 'key team member'} in the ${dept || 'team'}, from planning through production rollout.`,
        `• Partner with product, design, and engineering stakeholders to ship reliable, user-focused outcomes on a regular cadence.`,
        `• Raise quality through clear technical decisions, maintainable implementation, and proactive ownership of execution.`,
        '',
        "What you'll bring",
        ...(topSkills.length
            ? topSkills.map(
                  (s) => `• Hands-on expertise in ${s} with production-level problem solving.`,
              )
            : ['• Strong fundamentals in modern software engineering and collaborative delivery.']),
        '',
        goodToHave.length ? 'Nice to have' : '',
        ...goodToHave
            .slice(0, 4)
            .map((s) => `• Exposure to ${s} and the ability to apply it in real-world scenarios.`),
    ].filter(Boolean);
    return lines.join('\n');
};

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
    try {
        const { title = '', department = '', skills = [], goodToHave = [] } = await req.json();
        const key = Deno.env.get('OPENROUTER_API_KEY') ?? Deno.env.get('API_KEY');

        if (!key) {
            return new Response(
                JSON.stringify({ summary: fallback(title, department, skills, goodToHave) }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
        }

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
                messages: [
                    {
                        role: 'system',
                        content: [
                            'You are a senior recruiting copywriter for modern tech hiring teams.',
                            'Write a sharp, premium-quality job summary that feels specific, persuasive, and high-signal.',
                            "Output plain text only (no markdown headings), using section labels and bullets with '• '.",
                            'Format exactly as:',
                            '1) One-line headline: "<Title> — <Department>".',
                            '2) "About the role" with exactly 3 bullets.',
                            `3) "What you'll bring" with 4-6 bullets derived from required skills.`,
                            '4) "Nice to have" only when optional skills exist (2-4 bullets).',
                            'Style rules:',
                            '- Use action verbs and concrete outcomes.',
                            '- Keep each bullet to one sentence and 10-18 words.',
                            '- Avoid generic filler, buzzword stacking, and repetitive "Strong knowledge of..." phrasing.',
                            '- No emojis, no numbering, no extra sections.',
                            '- Keep tone confident, crisp, and human.',
                        ].join(' '),
                    },
                    {
                        role: 'user',
                        content: JSON.stringify({ title, department, skills, goodToHave }),
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
                JSON.stringify({ summary: fallback(title, department, skills, goodToHave) }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            );
        }

        const data = await res.json();
        const summary =
            data.choices?.[0]?.message?.content ?? fallback(title, department, skills, goodToHave);
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
