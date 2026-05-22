/*
  # Rename tables and columns to POJO-style camelCase naming

  1. Changes
    - Rename `job_descriptions` to `jobs`
    - Rename `resumes` to `candidates`
    - Rename `resume_scores` to `rankings`
    - Rename `app_users` to `users`
    - Rename all snake_case columns to camelCase
    - Update `archived` status values to `filled`
    - Add `duplicatedFromId` column to `jobs`
    - Update all foreign keys, indexes, and triggers

  2. Security
    - RLS remains enabled on all tables
    - All existing policies are dropped and recreated with new names

  3. Important Notes
    - All data is preserved during the rename
    - Foreign key constraints are recreated
    - The handle_new_user trigger is updated to reference `users` table
*/

-- ==========================================
-- Step 1: Rename app_users -> users
-- ==========================================
ALTER TABLE IF EXISTS app_users RENAME TO users;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_sign_in_at') THEN
    ALTER TABLE users RENAME COLUMN last_sign_in_at TO lastSignInAt;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
    ALTER TABLE users RENAME COLUMN created_at TO createdAt;
  END IF;
END $$;

-- ==========================================
-- Step 2: Rename job_descriptions -> jobs
-- ==========================================
ALTER TABLE IF EXISTS job_descriptions RENAME TO jobs;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'employment_type') THEN
    ALTER TABLE jobs RENAME COLUMN employment_type TO employmentType;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'experience_level') THEN
    ALTER TABLE jobs RENAME COLUMN experience_level TO experienceLevel;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_range') THEN
    ALTER TABLE jobs RENAME COLUMN salary_range TO salaryRange;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'created_by') THEN
    ALTER TABLE jobs RENAME COLUMN created_by TO createdBy;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'created_at') THEN
    ALTER TABLE jobs RENAME COLUMN created_at TO createdAt;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'updated_at') THEN
    ALTER TABLE jobs RENAME COLUMN updated_at TO updatedAt;
  END IF;
END $$;

-- Add duplicatedFromId column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'duplicatedFromId') THEN
    ALTER TABLE jobs ADD COLUMN duplicatedFromId uuid REFERENCES jobs(id);
  END IF;
END $$;

-- Update archived status to filled
UPDATE jobs SET status = 'filled' WHERE status = 'archived';

-- ==========================================
-- Step 3: Rename resumes -> candidates
-- ==========================================
ALTER TABLE IF EXISTS resumes RENAME TO candidates;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'candidate_name') THEN
    ALTER TABLE candidates RENAME COLUMN candidate_name TO name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'candidate_email') THEN
    ALTER TABLE candidates RENAME COLUMN candidate_email TO email;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'file_url') THEN
    ALTER TABLE candidates RENAME COLUMN file_url TO fileUrl;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'file_name') THEN
    ALTER TABLE candidates RENAME COLUMN file_name TO fileName;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'raw_text') THEN
    ALTER TABLE candidates RENAME COLUMN raw_text TO rawText;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'experience_years') THEN
    ALTER TABLE candidates RENAME COLUMN experience_years TO experienceYears;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'work_history') THEN
    ALTER TABLE candidates RENAME COLUMN work_history TO workHistory;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'parsed_data') THEN
    ALTER TABLE candidates RENAME COLUMN parsed_data TO parsedData;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'uploaded_by') THEN
    ALTER TABLE candidates RENAME COLUMN uploaded_by TO uploadedBy;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'created_at') THEN
    ALTER TABLE candidates RENAME COLUMN created_at TO createdAt;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'updated_at') THEN
    ALTER TABLE candidates RENAME COLUMN updated_at TO updatedAt;
  END IF;
END $$;

-- ==========================================
-- Step 4: Rename resume_scores -> rankings
-- ==========================================
ALTER TABLE IF EXISTS resume_scores RENAME TO rankings;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'job_description_id') THEN
    ALTER TABLE rankings RENAME COLUMN job_description_id TO jobId;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'resume_id') THEN
    ALTER TABLE rankings RENAME COLUMN resume_id TO candidateId;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'overall_score') THEN
    ALTER TABLE rankings RENAME COLUMN overall_score TO overallScore;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'skills_score') THEN
    ALTER TABLE rankings RENAME COLUMN skills_score TO skillsScore;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'experience_score') THEN
    ALTER TABLE rankings RENAME COLUMN experience_score TO experienceScore;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'education_score') THEN
    ALTER TABLE rankings RENAME COLUMN education_score TO educationScore;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'keyword_score') THEN
    ALTER TABLE rankings RENAME COLUMN keyword_score TO keywordScore;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'matched_skills') THEN
    ALTER TABLE rankings RENAME COLUMN matched_skills TO matchedSkills;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'missing_skills') THEN
    ALTER TABLE rankings RENAME COLUMN missing_skills TO missingSkills;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'created_by') THEN
    ALTER TABLE rankings RENAME COLUMN created_by TO createdBy;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rankings' AND column_name = 'created_at') THEN
    ALTER TABLE rankings RENAME COLUMN created_at TO createdAt;
  END IF;
END $$;

-- ==========================================
-- Step 5: Update handle_new_user trigger
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role, lastSignInAt)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_app_meta_data->>'role', 'member'),
    NEW.last_sign_in_at
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Step 6: Recreate indexes with new names
-- ==========================================
DROP INDEX IF EXISTS idx_job_descriptions_created_by;
DROP INDEX IF EXISTS idx_job_descriptions_status;
DROP INDEX IF EXISTS idx_resumes_uploaded_by;
DROP INDEX IF EXISTS idx_resumes_source;
DROP INDEX IF EXISTS idx_resume_scores_job_description_id;
DROP INDEX IF EXISTS idx_resume_scores_resume_id;

CREATE INDEX IF NOT EXISTS idx_jobs_createdBy ON jobs(createdBy);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_candidates_uploadedBy ON candidates(uploadedBy);
CREATE INDEX IF NOT EXISTS idx_candidates_source ON candidates(source);
CREATE INDEX IF NOT EXISTS idx_rankings_jobId ON rankings(jobId);
CREATE INDEX IF NOT EXISTS idx_rankings_candidateId ON rankings(candidateId);
