-- Preview reports can be edited in admin but cannot be published as evidence.
alter table public.reports
  add column is_mockup boolean not null default false
  check (not is_mockup or status = 'draft');

-- A selected UUID is only public while its target is approved and published.
drop policy "read homepage features" on public.homepage_features;
create policy "read published homepage features" on public.homepage_features
  for select to anon, authenticated using (
    (slot = 'article_1' and exists (
      select 1 from public.articles where id = content_id and status = 'published' and not is_mockup
    ))
    or (slot in ('project_1', 'project_2') and exists (
      select 1 from public.projects where id = content_id and status = 'published' and not is_mockup
    ))
  );
create policy "admin read homepage features" on public.homepage_features
  for select to authenticated using ((select public.is_chns_admin()));
