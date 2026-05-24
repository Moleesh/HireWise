-- jobs — job description records

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text,
  location text,
  employment_type text,
  experience_level text,
  salary_range text,
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

alter table public.jobs enable row level security;

create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_created_by on public.jobs(created_by);
