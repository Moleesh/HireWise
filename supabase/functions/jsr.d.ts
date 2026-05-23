/** @format */

// Makes TypeScript happy when editing Supabase Edge Functions in a Node/TS workspace.
// Deno understands this specifier; TS Server in this repo does not unless we declare it.
declare module 'jsr:@supabase/functions-js/edge-runtime.d.ts' {
	export {};
}
