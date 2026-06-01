/** @format */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

/**
 * generate-poster
 *
 * Generates wall-in (portrait) recruitment poster images via Pollinations.
 * Body: { prompts: string[] }  — one prompt per requested variation (typically 3).
 * Returns: { images: { url: string; prompt: string }[] } where url is a data URL.
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const AI_URL = Deno.env.get('AI_IMAGE_URL') ?? 'https://image.pollinations.ai/prompt';
const MODEL = Deno.env.get('AI_IMAGE_MODEL') ?? 'flux';

const toDataUrl = (bytes: Uint8Array) => {
    const binary = String.fromCharCode(...bytes);
    return `data:image/jpeg;base64,${btoa(binary)}`;
};

async function generateOne(prompt: string) {
    const url = `${AI_URL}/${encodeURIComponent(prompt)}?model=${encodeURIComponent(
        MODEL,
    )}&width=1080&height=1920&nologo=true`;
    const res = await fetch(url);
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`ai_${res.status}:${body.slice(0, 200)}`);
    }
    const bytes = new Uint8Array(await res.arrayBuffer());
    return toDataUrl(bytes);
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });
    try {
        const { prompts } = (await req.json()) as { prompts: string[] };
        if (!Array.isArray(prompts) || !prompts.length) {
            return new Response(JSON.stringify({ error: 'prompts[] is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        const results = await Promise.allSettled(prompts.map((p) => generateOne(p)));
        const images: { url: string; prompt: string }[] = [];
        let firstErr = '';
        let rateStatus: number | null = null;

        results.forEach((r, i) => {
            if (r.status === 'fulfilled') {
                images.push({ url: r.value, prompt: prompts[i] });
            } else {
                if (!firstErr) {
                    firstErr =
                        r.reason instanceof Error
                            ? r.reason.message
                            : String(r.reason ?? 'unknown');
                }
                if (firstErr.includes('ai_429')) rateStatus = 429;
                if (firstErr.includes('ai_402')) rateStatus = 402;
            }
        });

        if (!images.length) {
            return new Response(JSON.stringify({ error: firstErr || 'no images' }), {
                status: rateStatus ?? 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ images }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return new Response(JSON.stringify({ error: message || 'generate-poster failed' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
