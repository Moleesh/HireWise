/*
  # Create app_users table for user management

  1. New Tables
    - `app_users`
      - `id` (uuid, primary key, references auth.users.id)
      - `email` (text, unique)
      - `role` (text, default 'member')
      - `created_at` (timestamptz)
      - `last_sign_in_at` (timestamptz, nullable)

  2. Security
    - Enable RLS on `app_users` table
    - Authenticated users can view all users
    - Only admins can insert/update/delete users

  3. Important Notes
    - This table mirrors auth.users for display purposes
    - A trigger auto-populates this table when new users sign up
    - The admin user is seeded on creation
*/

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  last_sign_in_at timestamptz
);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view app_users"
  ON app_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert app_users"
  ON app_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update app_users"
  ON app_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete app_users"
  ON app_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-populate app_users when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.app_users (id, email, role, last_sign_in_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_app_meta_data->>'role', 'member'),
    NEW.last_sign_in_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update last_sign_in_at
CREATE OR REPLACE FUNCTION public.update_last_sign_in()
RETURNS trigger AS $$
BEGIN
  UPDATE public.app_users
  SET last_sign_in_at = NEW.last_sign_in_at
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_signin ON auth.users;
CREATE TRIGGER on_auth_user_signin
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
  EXECUTE FUNCTION public.update_last_sign_in();

-- Seed the admin user into app_users
INSERT INTO app_users (id, email, role)
VALUES ('292eeba0-9897-4ba1-ac9e-f0fd0527e0bb', 'admin@hirewise.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
