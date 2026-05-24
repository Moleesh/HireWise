-- Triggers: mirror auth.users into app_users, maintain updated_at

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.app_users (id, email, role)
  values (new.id, new.email, 'member')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists jobs_touch_updated_at on public.jobs;
create trigger jobs_touch_updated_at before update on public.jobs
  for each row execute function public.touch_updated_at();

drop trigger if exists candidates_touch_updated_at on public.candidates;
create trigger candidates_touch_updated_at before update on public.candidates
  for each row execute function public.touch_updated_at();
