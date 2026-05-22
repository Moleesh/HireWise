/*
  # Restore authenticated RLS policies for main tables

  1. Security Changes
    - Replace public (USING true) policies with authenticated-only policies
    - job_descriptions, resumes, resume_scores all require authentication
    - Storage bucket resumes requires authentication

  2. Important Notes
    - Drops all "Public can..." policies
    - Creates "Authenticated users can..." policies
*/

-- Drop public policies on job_descriptions
DROP POLICY IF EXISTS "Public can view job descriptions" ON job_descriptions;
DROP POLICY IF EXISTS "Public can create job descriptions" ON job_descriptions;
DROP POLICY IF EXISTS "Public can update job descriptions" ON job_descriptions;
DROP POLICY IF EXISTS "Public can delete job descriptions" ON job_descriptions;

-- Drop public policies on resumes
DROP POLICY IF EXISTS "Public can view resumes" ON resumes;
DROP POLICY IF EXISTS "Public can create resumes" ON resumes;
DROP POLICY IF EXISTS "Public can update resumes" ON resumes;
DROP POLICY IF EXISTS "Public can delete resumes" ON resumes;

-- Drop public policies on resume_scores
DROP POLICY IF EXISTS "Public can view resume scores" ON resume_scores;
DROP POLICY IF EXISTS "Public can create resume scores" ON resume_scores;
DROP POLICY IF EXISTS "Public can update resume scores" ON resume_scores;
DROP POLICY IF EXISTS "Public can delete resume scores" ON resume_scores;

-- Drop public storage policies
DROP POLICY IF EXISTS "Public can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete resumes" ON storage.objects;

-- Create authenticated policies for job_descriptions
CREATE POLICY "Authenticated users can view job descriptions" ON job_descriptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create job descriptions" ON job_descriptions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update job descriptions" ON job_descriptions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete job descriptions" ON job_descriptions FOR DELETE TO authenticated USING (true);

-- Create authenticated policies for resumes
CREATE POLICY "Authenticated users can view resumes" ON resumes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create resumes" ON resumes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update resumes" ON resumes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete resumes" ON resumes FOR DELETE TO authenticated USING (true);

-- Create authenticated policies for resume_scores
CREATE POLICY "Authenticated users can view resume scores" ON resume_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create resume scores" ON resume_scores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update resume scores" ON resume_scores FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete resume scores" ON resume_scores FOR DELETE TO authenticated USING (true);

-- Create authenticated storage policies for resumes bucket
CREATE POLICY "Authenticated users can upload resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Authenticated users can view resumes" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes');
CREATE POLICY "Authenticated users can delete resumes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes');
