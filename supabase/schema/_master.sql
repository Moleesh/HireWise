/*
  # Master schema include
  Run with psql:  psql ... -f supabase/schema/_master.sql

  Each table lives in its own file. This master file pulls them together so
  a fresh DB can be created from scratch in one go. The corresponding
  timestamped migration in supabase/migrations/ is what Supabase actually
  applies — this folder is the authoritative source-of-truth definition.
*/

\i app_users.sql
\i jobs.sql
\i candidates.sql
\i rankings.sql
\i policies.sql
\i triggers.sql
