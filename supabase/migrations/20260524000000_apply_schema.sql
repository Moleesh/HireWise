/*
  # Apply-this consolidated schema

  Single migration file you run against the upstream Supabase project. Use:

      psql "$DATABASE_URL" -f supabase/schema/00_apply_this.sql
      # or paste into the Supabase SQL editor

  Per-table source-of-truth definitions also live in this folder, included
  by `_master.sql`. This file is the flat version you actually deploy.

  Idempotent — safe to re-run. Renames legacy lowercase-no-underscore
  columns into snake_case so existing data is preserved.
*/

-- ---------- legacy column renames (idempotent) ----------
do $$
declare rec record;
begin
  for rec in (values
      ('jobs','createdat','created_at'),('jobs','updatedat','updated_at'),
      ('jobs','employmenttype','employment_type'),('jobs','experiencelevel','experience_level'),
      ('jobs','salaryrange','salary_range'),('jobs','createdby','created_by'),
      ('jobs','duplicatedfromid','duplicated_from_id'),('jobs','goodtohave','good_to_have'),
      ('candidates','createdat','created_at'),('candidates','updatedat','updated_at'),
      ('candidates','fileurl','file_url'),('candidates','filename','file_name'),
      ('candidates','rawtext','raw_text'),('candidates','experienceyears','experience_years'),
      ('candidates','workhistory','work_history'),('candidates','parseddata','parsed_data'),
      ('candidates','uploadedby','uploaded_by'),('candidates','timetojoin','time_to_join'),
      ('candidates','waitingperiod','waiting_period'),
      ('rankings','candidateid','candidate_id'),('rankings','jobid','job_id'),
      ('rankings','overallscore','overall_score'),('rankings','skillsscore','skills_score'),
      ('rankings','experiencescore','experience_score'),('rankings','educationscore','education_score'),
      ('rankings','keywordscore','keyword_score'),('rankings','matchedskills','matched_skills'),
      ('rankings','missingskills','missing_skills'),('rankings','createdby','created_by'),
      ('rankings','createdat','created_at')
  ) as t(tab text, oldc text, newc text)
  loop
    if exists (select 1 from information_schema.columns
               where table_schema='public' and table_name=rec.tab and column_name=rec.oldc)
       and not exists (select 1 from information_schema.columns
               where table_schema='public' and table_name=rec.tab and column_name=rec.newc) then
      execute format('alter table public.%I rename column %I to %I', rec.tab, rec.oldc, rec.newc);
    end if;
  end loop;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='users')
     and not exists (select 1 from information_schema.tables where table_schema='public' and table_name='app_users') then
    execute 'alter table public.users rename to app_users';
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='app_users' and column_name='createdat')
     and not exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='app_users' and column_name='created_at') then
    execute 'alter table public.app_users rename column createdat to created_at';
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='app_users' and column_name='lastsigninat')
     and not exists (select 1 from information_schema.columns
             where table_schema='public' and table_name='app_users' and column_name='last_signin_at') then
    execute 'alter table public.app_users rename column lastsigninat to last_signin_at';
  end if;
end $$;

-- ---------- tables ----------
create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'member',
  theme_preference text not null default 'midnight-emerald',
  created_at timestamptz not null default now(),
  last_signin_at timestamptz
);
alter table public.app_users add column if not exists theme_preference text not null default 'midnight-emerald';

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null, department text, location text,
  employment_type text, experience_level text, salary_range text,
  summary text,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  skills text[] not null default '{}',
  good_to_have text[] not null default '{}',
  benefits text[] not null default '{}',
  posters jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  duplicated_from_id uuid references public.jobs(id) on delete set null
);
alter table public.jobs add column if not exists good_to_have text[] not null default '{}';
alter table public.jobs add column if not exists posters jsonb not null default '[]'::jsonb;

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null,
  source text not null default '',
  file_url text not null default '', file_name text not null default '',
  raw_text text not null default '',
  skills text[] not null default '{}',
  experience_years numeric not null default 0,
  education jsonb not null default '[]'::jsonb,
  work_history jsonb not null default '[]'::jsonb,
  parsed_data jsonb not null default '{}'::jsonb,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'available',
  time_to_join text not null default '',
  waiting_period text not null default ''
);

create table if not exists public.rankings (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  overall_score numeric not null default 0,
  skills_score numeric not null default 0,
  experience_score numeric not null default 0,
  education_score numeric not null default 0,
  keyword_score numeric not null default 0,
  matched_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  highlights text[] not null default '{}',
  notes text not null default '',
  rank integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- security ----------
alter table public.app_users enable row level security;
alter table public.jobs enable row level security;
alter table public.candidates enable row level security;
alter table public.rankings enable row level security;

create index if not exists idx_app_users_email on public.app_users(email);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_created_by on public.jobs(created_by);
create index if not exists idx_candidates_uploaded_by on public.candidates(uploaded_by);
create index if not exists idx_candidates_status on public.candidates(status);
create index if not exists idx_rankings_job_id on public.rankings(job_id);
create index if not exists idx_rankings_candidate_id on public.rankings(candidate_id);

do $$ begin
  if not exists (select 1 from pg_policies where tablename='app_users' and policyname='app_users_select_auth') then
    create policy app_users_select_auth on public.app_users for select to authenticated using (true); end if;
  if not exists (select 1 from pg_policies where tablename='app_users' and policyname='app_users_update_self') then
    create policy app_users_update_self on public.app_users for update to authenticated using (auth.uid() = id); end if;
  if not exists (select 1 from pg_policies where tablename='jobs' and policyname='jobs_all_auth') then
    create policy jobs_all_auth on public.jobs for all to authenticated using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='candidates' and policyname='candidates_all_auth') then
    create policy candidates_all_auth on public.candidates for all to authenticated using (true) with check (true); end if;
  if not exists (select 1 from pg_policies where tablename='rankings' and policyname='rankings_all_auth') then
    create policy rankings_all_auth on public.rankings for all to authenticated using (true) with check (true); end if;
end $$;

-- ---------- triggers ----------
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.app_users (id, email, role) values (new.id, new.email, 'member')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists jobs_touch_updated_at on public.jobs;
create trigger jobs_touch_updated_at before update on public.jobs
  for each row execute function public.touch_updated_at();

drop trigger if exists candidates_touch_updated_at on public.candidates;
create trigger candidates_touch_updated_at before update on public.candidates
  for each row execute function public.touch_updated_at();
