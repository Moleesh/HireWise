-- candidates — candidate records parsed from uploaded resumes

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  source text not null default '',
  file_url text not null default '',
  file_name text not null default '',
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

alter table public.candidates enable row level security;

create index if not exists idx_candidates_uploaded_by on public.candidates(uploaded_by);
create index if not exists idx_candidates_status on public.candidates(status);
