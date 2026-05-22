/*
  # Add filled flag and time-to-join to candidates

  1. Changes
    - Add `status` column to candidates (text, default 'available')
      Values: 'available', 'in-progress', 'offered', 'hired', 'rejected'
    - Add `timetojoin` column to candidates (text, default '')
      Stores expected availability/notice period (e.g., "2 weeks", "1 month", "Immediate")

  2. Security
    - RLS remains enabled on all tables
*/

ALTER TABLE candidates ADD COLUMN IF NOT EXISTS status text DEFAULT 'available';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS timetojoin text DEFAULT '';
