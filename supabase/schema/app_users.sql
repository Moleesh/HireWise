-- app_users — application user directory, mirrors auth.users

create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'member',
  theme_preference text not null default 'midnight-emerald',
  created_at timestamptz not null default now(),
  last_signin_at timestamptz
);

alter table public.app_users enable row level security;

create index if not exists idx_app_users_email on public.app_users(email);
