-- rankings — AI-produced match scores per (candidate, job)

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

alter table public.rankings enable row level security;

create index if not exists idx_rankings_job_id on public.rankings(job_id);
create index if not exists idx_rankings_candidate_id on public.rankings(candidate_id);
