Locked in: **Option B — keep upstream Supabase**. You'll deploy the edge-function changes and set `LOVABLE_API_KEY` (or your chosen AI key) on the upstream project yourself via Supabase CLI. I'll write all function code and migrations here; you push them up.

---

## 1. Better Icon & More Themes

**Icon (`HireWiseIcon.tsx`)** — replace busy hex+check with a cleaner "HW" monogram inside a soft squircle, single subtle hover animation. Keeps `currentColor` + existing animation class names so no caller breaks.

**Themes (`_styles/_themes.scss`, `ThemeSwitcher/_private/config.ts`, `types/index.ts`)** — add 4 new themes for 8 total:
- `royal-violet` (dark, violet/indigo)
- `forest-moss` (dark, deep green/sage)
- `crimson-noir` (dark, black + crimson)
- `paper-ink` (light, off-white/black editorial)

Each gets a full token block mirroring existing theme structure.

## 2. Job Description Workflow Overhaul

### Schema
New migration `..._add_goodtohave_and_posters.sql`:
- `jobs.goodtohave text[] not null default '{}'`
- `jobs.posters jsonb not null default '[]'::jsonb`  (each entry: `{ url, prompt, createdat }`)

Type `Job` updated. Old columns (`location`, `employmenttype`, `experiencelevel`, `salaryrange`, `responsibilities`, `requirements`, `benefits`) stay in DB for back-compat but disappear from the UI.

### Step 1 — JobPasteStep
- Pre-fills with a sample JD on create (sample in `_private/sampleJD.ts`).
- "Enhance with AI" button — calls `parse-jd` with `mode: 'enhance'` to clean/normalize before extraction.

### Step 2 — JobDetailsStep (rewritten, ~150 LOC)
Only **Title, Department, Skills, Good to Have**. Same chip + add pattern reused for both list fields.

### Step 3 — JobPreviewStep
- On entering step 3, auto-generates a **professional, bulleted summary** via AI from title/department/skills/good-to-have. "Regenerate" button + editable textarea.
- Shows Title, Department, Skills, Good to Have, Summary, and existing posters (if any).
- **"Generate Poster"** button:
  - Validates required fields. If any missing → `MissingFieldsModal` opens with just those inputs.
  - Calls AI image generation, **portrait/wall-in** aspect, returns **3 variations** side-by-side.
  - Each poster has a "Refine" input → user types correction prompt → regenerates just that one.
  - Selected posters persist to `jobs.posters` on save.
  - Re-opening the JD shows saved posters; "Generate similar" pre-fills the prompt for tweaks.

### New files (each <200 LOC, mirroring existing folder convention)
- `features/jobs/PosterGeneratorModal.tsx`
- `features/jobs/PosterCard.tsx`
- `features/jobs/MissingFieldsModal.tsx`
- `features/jobs/_private/sampleJD.ts`
- `features/jobs/_private/helpers.ts` + `_private/__tests__/helpers.test.ts` (prompt builders, validation)

## 3. Resume Parsing Fix

Root cause: `parse-resume` receives raw binary text for PDF/DOCX. Fix in two places:

**Client (CandidateListPage / upload hook):** extract text **before** sending — `pdfjs-dist` for PDF, `mammoth` for DOCX, raw read for `.txt`. File still uploaded to storage for download.

**Edge function (`parse-resume`):** rewritten to call Lovable AI Gateway with **tool-calling** for structured extraction (name, email, skills, experience years, education, work history). Heuristic regex stays as fallback if AI call fails.

## 4. Edge Functions (you deploy)

Updated/new functions written here, ready for you to `supabase functions deploy`:
- `parse-jd` — adds `mode: 'enhance' | 'parse'`, uses AI when `LOVABLE_API_KEY` present, falls back to current regex.
- `parse-resume` — AI tool-calling extraction.
- `generate-summary` (new) — AI bulleted professional summary from job fields.
- `generate-poster` (new) — calls `google/gemini-3.1-flash-image-preview`, returns 3 portrait poster URLs/base64.

All functions: CORS preserved, graceful 402/429 handling surfaced to UI as toasts.

## 5. Conventions

- Every new/modified file ≤200 LOC; split if approaching limit.
- `/** @format */` header + JSDoc on each exported component/function (matches existing style).
- Tests: vitest + Testing Library, mirroring `Modal/__tests__/Modal.test.tsx` and `rankings/_private/__tests__/helpers.test.ts`. New tests for helpers, `MissingFieldsModal`, and `PosterCard`.

### Technical notes
- Text AI: `google/gemini-3-flash-preview` (default).
- Image AI: `google/gemini-3.1-flash-image-preview`, portrait wall poster.
- Poster prompts seeded with active `ThemeName` color hints for brand consistency.
- pdfjs worker bundled via Vite, no CDN dependency.

Approve to start building.