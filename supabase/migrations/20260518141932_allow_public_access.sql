/*
  # Allow public access to all tables

  1. Security Changes
    - Replace authenticated-only RLS policies with public access policies
    - Allow unauthenticated reads and writes on job_descriptions, resumes, resume_scores
    - Allow public access to resumes storage bucket
    - This removes the authentication requirement for the application

  2. Important Notes
    - All existing restrictive policies are dropped and replaced
    - Storage bucket policies updated for public access
*/

-- Drop existing policies on job_descriptions
DROP POLICY IF EXISTS "Authenticated users can view job descriptions" ON job_descriptions;
DROP POLICY IF EXISTS "Authenticated users can create job descriptions" ON job_descriptions;
DROP POLICY IF EXISTS "Authenticated users can update job descriptions" ON job_descriptions;
DROP POLICY IF EXISTS "Authenticated users can delete job descriptions" ON job_descriptions;

-- Drop existing policies on resumes
DROP POLICY IF EXISTS "Authenticated users can view resumes" ON resumes;
DROP POLICY IF EXISTS "Authenticated users can create resumes" ON resumes;
DROP POLICY IF EXISTS "Authenticated users can update resumes" ON resumes;
DROP POLICY IF EXISTS "Authenticated users can delete resumes" ON resumes;

-- Drop existing policies on resume_scores
DROP POLICY IF EXISTS "Authenticated users can view resume scores" ON resume_scores;
DROP POLICY IF EXISTS "Authenticated users can create resume scores" ON resume_scores;
DROP POLICY IF EXISTS "Authenticated users can update resume scores" ON resume_scores;
DROP POLICY IF EXISTS "Authenticated users can delete resume scores" ON resume_scores;

-- Create public policies for job_descriptions
CREATE POLICY "Public can view job descriptions" ON job_descriptions FOR SELECT USING (true);
CREATE POLICY "Public can create job descriptions" ON job_descriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update job descriptions" ON job_descriptions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete job descriptions" ON job_descriptions FOR DELETE USING (true);

-- Create public policies for resumes
CREATE POLICY "Public can view resumes" ON resumes FOR SELECT USING (true);
CREATE POLICY "Public can create resumes" ON resumes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update resumes" ON resumes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete resumes" ON resumes FOR DELETE USING (true);

-- Create public policies for resume_scores
CREATE POLICY "Public can view resume scores" ON resume_scores FOR SELECT USING (true);
CREATE POLICY "Public can create resume scores" ON resume_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update resume scores" ON resume_scores FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete resume scores" ON resume_scores FOR DELETE USING (true);

-- Drop existing storage policies
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resumes" ON storage.objects;

-- Create public storage policies for resumes bucket
CREATE POLICY "Public can upload resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Public can view resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "Public can delete resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resumes');
