/*
  # Add `goodtohave` and `posters` to jobs (Option B — deploy yourself)

  This project keeps the upstream Supabase backend, so Lovable cannot apply
  migrations here. Run this SQL on your upstream project via:

      supabase db push          # if using the CLI with `supabase link`
      # or paste it into the Supabase SQL editor

  1. Adds `goodtohave text[] not null default '{}'` for the new "Good to Have"
     list surfaced in the simplified JD editor.
  2. Adds `posters jsonb not null default '[]'::jsonb` to persist AI-generated
     wall-in posters attached to a job. Each entry is `{ url, prompt, createdat }`.

  Safe to re-run.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'goodtohave'
  ) THEN
    ALTER TABLE jobs ADD COLUMN goodtohave text[] NOT NULL DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'posters'
  ) THEN
    ALTER TABLE jobs ADD COLUMN posters jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;
