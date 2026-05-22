/*
  # Fix auth trigger causing Database error querying schema

  1. Problem
    - The on_auth_user_signin trigger on auth.users was causing a 500 error
      during sign-in because it fires AFTER UPDATE on auth.users, which
      interferes with the auth token generation process.
    - The handle_new_user trigger also runs during sign-in flow and can
      cause issues if the row already exists in app_users (duplicate key).

  2. Changes
    - Drop the on_auth_user_signin trigger entirely (last_sign_in_at is not critical)
    - Make handle_new_user INSERT use ON CONFLICT DO NOTHING to handle duplicates
    - Keep on_auth_user_created trigger for auto-populating app_users on signup
*/

-- Drop the problematic sign-in trigger
DROP TRIGGER IF EXISTS on_auth_user_signin ON auth.users;

-- Also drop the function since it's no longer needed
DROP FUNCTION IF EXISTS public.update_last_sign_in();

-- Fix the handle_new_user function to handle duplicates gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.app_users (id, email, role, last_sign_in_at)
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
