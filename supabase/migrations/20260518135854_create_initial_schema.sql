/*
  # Create JD Editor and Resume Ranker Schema

  1. New Tables
    - `job_descriptions`
      - `id` (uuid, primary key)
      - `title` (text, job title)
      - `department` (text, department name)
      - `location` (text, job location)
      - `employment_type` (text, full-time/part-time/contract)
      - `experience_level` (text, junior/mid/senior)
      - `salary_range` (text, salary range description)
      - `summary` (text, job summary)
      - `responsibilities` (jsonb, list of responsibilities)
      - `requirements` (jsonb, list of requirements)
      - `skills` (jsonb, list of required skills)
      - `benefits` (jsonb, list of benefits)
      - `status` (text, draft/published/archived)
      - `created_by` (uuid, reference to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `resumes`
      - `id` (uuid, primary key)
      - `candidate_name` (text, candidate name)
      - `candidate_email` (text, candidate email)
      - `source` (text, upload/linkedin/indeed/glassdoor/etc)
      - `file_url` (text, storage URL for uploaded file)
      - `file_name` (text, original file name)
      - `raw_text` (text, extracted text content)
      - `skills` (jsonb, extracted skills list)
      - `experience_years` (integer, years of experience)
      - `education` (jsonb, education entries)
      - `work_history` (jsonb, work history entries)
      - `parsed_data` (jsonb, full parsed resume data)
      - `uploaded_by` (uuid, reference to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `resume_scores`
      - `id` (uuid, primary key)
      - `resume_id` (uuid, foreign key to resumes)
      - `job_description_id` (uuid, foreign key to job_descriptions)
      - `overall_score` (numeric, 0-100 match score)
      - `skills_score` (numeric, 0-100 skills match)
      - `experience_score` (numeric, 0-100 experience match)
      - `education_score` (numeric, 0-100 education match)
      - `keyword_score` (numeric, 0-100 keyword match)
      - `matched_skills` (jsonb, skills that matched)
      - `missing_skills` (jsonb, skills that are missing)
      - `highlights` (jsonb, notable matches/strengths)
      - `notes` (text, reviewer notes)
      - `rank` (integer, rank among all scores for this JD)
      - `created_by` (uuid, reference to auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users to manage all data
    - All tables restricted to authenticated users only

  3. Important Notes
    - This schema supports the full JD editor and resume ranking workflow
    - Resume scores link resumes to job descriptions for matching
    - Skills are stored as JSONB arrays for flexible matching
*/

-- Create job_descriptions table
CREATE TABLE IF NOT EXISTS job_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  department text DEFAULT '',
  location text DEFAULT '',
  employment_type text DEFAULT 'full-time',
  experience_level text DEFAULT 'mid',
  salary_range text DEFAULT '',
  summary text DEFAULT '',
  responsibilities jsonb DEFAULT '[]'::jsonb,
  requirements jsonb DEFAULT '[]'::jsonb,
  skills jsonb DEFAULT '[]'::jsonb,
  benefits jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text DEFAULT '',
  candidate_email text DEFAULT '',
  source text DEFAULT 'upload',
  file_url text DEFAULT '',
  file_name text DEFAULT '',
  raw_text text DEFAULT '',
  skills jsonb DEFAULT '[]'::jsonb,
  experience_years integer DEFAULT 0,
  education jsonb DEFAULT '[]'::jsonb,
  work_history jsonb DEFAULT '[]'::jsonb,
  parsed_data jsonb DEFAULT '{}'::jsonb,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resume_scores table
CREATE TABLE IF NOT EXISTS resume_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  job_description_id uuid NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  overall_score numeric DEFAULT 0,
  skills_score numeric DEFAULT 0,
  experience_score numeric DEFAULT 0,
  education_score numeric DEFAULT 0,
  keyword_score numeric DEFAULT 0,
  matched_skills jsonb DEFAULT '[]'::jsonb,
  missing_skills jsonb DEFAULT '[]'::jsonb,
  highlights jsonb DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  rank integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resume_id, job_description_id)
);

-- Enable RLS on all tables
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_scores ENABLE ROW LEVEL SECURITY;

-- Policies for job_descriptions
CREATE POLICY "Authenticated users can view job descriptions"
  ON job_descriptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create job descriptions"
  ON job_descriptions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update job descriptions"
  ON job_descriptions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job descriptions"
  ON job_descriptions FOR DELETE
  TO authenticated
  USING (true);

-- Policies for resumes
CREATE POLICY "Authenticated users can view resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (true);

-- Policies for resume_scores
CREATE POLICY "Authenticated users can view resume scores"
  ON resume_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create resume scores"
  ON resume_scores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update resume scores"
  ON resume_scores FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete resume scores"
  ON resume_scores FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_descriptions_status ON job_descriptions(status);
CREATE INDEX IF NOT EXISTS idx_resumes_source ON resumes(source);
CREATE INDEX IF NOT EXISTS idx_resume_scores_jd ON resume_scores(job_description_id);
CREATE INDEX IF NOT EXISTS idx_resume_scores_resume ON resume_scores(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_scores_rank ON resume_scores(job_description_id, rank);

-- Create storage bucket for resume files
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT DO NOTHING;

-- Storage policies for resume uploads
CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can view resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can delete resumes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');
