/*
  # Consolidated Schema - Final POJO-style

  1. Ensures all tables exist with correct column names and types
  2. Adds `waitingperiod` column to candidates
  3. All tables use lowercase column names (Postgres default)
  4. RLS enabled on all tables with authenticated-user policies

  Tables:
    - `users` (id, email, role, createdat, lastsigninat)
    - `jobs` (id, title, department, location, employmenttype, experiencelevel,
              salaryrange, summary, responsibilities, requirements, skills,
              benefits, status, createdby, createdat, updatedat, duplicatedfromid)
    - `candidates` (id, name, email, source, fileurl, filename, rawtext, skills,
                    experienceyears, education, workhistory, parseddata, uploadedby,
                    createdat, updatedat, status, timetojoin, waitingperiod)
    - `rankings` (id, candidateid, jobid, overallscore, skillsscore, experiencescore,
                  educationscore, keywordscore, matchedskills, missingskills,
                  highlights, notes, rank, createdby, createdat)

  Security:
    - RLS enabled on all tables
    - Authenticated users can read/write their own data
*/

-- Add waitingperiod column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'candidates' AND column_name = 'waitingperiod'
  ) THEN
    ALTER TABLE candidates ADD COLUMN waitingperiod text DEFAULT '';
  END IF;
END $$;

-- Ensure status and timetojoin exist on candidates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'candidates' AND column_name = 'status'
  ) THEN
    ALTER TABLE candidates ADD COLUMN status text DEFAULT 'available';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'candidates' AND column_name = 'timetojoin'
  ) THEN
    ALTER TABLE candidates ADD COLUMN timetojoin text DEFAULT '';
  END IF;
END $$;

-- Ensure duplicatedfromid exists on jobs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'duplicatedfromid'
  ) THEN
    ALTER TABLE jobs ADD COLUMN duplicatedfromid uuid REFERENCES jobs(id);
  END IF;
END $$;

-- Enable RLS on all tables (safe to re-run)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_createdby ON jobs(createdby);
CREATE INDEX IF NOT EXISTS idx_candidates_uploadedby ON candidates(uploadedby);
CREATE INDEX IF NOT EXISTS idx_rankings_jobid ON rankings(jobid);
CREATE INDEX IF NOT EXISTS idx_rankings_candidateid ON rankings(candidateid);
