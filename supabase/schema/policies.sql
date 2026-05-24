-- Row-Level Security policies (authenticated-user model)

do $$ begin
  if not exists (select 1 from pg_policies where tablename='app_users' and policyname='app_users_select_auth') then
    create policy app_users_select_auth on public.app_users for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='app_users' and policyname='app_users_update_self') then
    create policy app_users_update_self on public.app_users for update to authenticated using (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where tablename='jobs' and policyname='jobs_all_auth') then
    create policy jobs_all_auth on public.jobs for all to authenticated using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename='candidates' and policyname='candidates_all_auth') then
    create policy candidates_all_auth on public.candidates for all to authenticated using (true) with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename='rankings' and policyname='rankings_all_auth') then
    create policy rankings_all_auth on public.rankings for all to authenticated using (true) with check (true);
  end if;
end $$;
