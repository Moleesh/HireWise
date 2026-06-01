/** @format */

// Minimal Deno global typings for TS tooling in this repo.
// The Edge Runtime provides `Deno`, but TypeScript in a Node workspace doesn't know it by default.
declare const Deno: {
    env: { get: (key: string) => string | undefined };
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};
