-- Match the ten visible homepage project positions and allow intentional reuse.
alter table public.homepage_features
  drop constraint homepage_features_slot_check;
alter table public.homepage_features
  add constraint homepage_features_slot_check
  check (slot = 'article_1' or slot ~ '^project_([1-9]|10)$');

drop policy "read published homepage features" on public.homepage_features;
create policy "read published homepage features" on public.homepage_features
  for select to anon, authenticated using (
    (slot = 'article_1' and exists (
      select 1 from public.articles where id = content_id and status = 'published' and not is_mockup
    ))
    or (slot ~ '^project_([1-9]|10)$' and exists (
      select 1 from public.projects where id = content_id and status = 'published' and not is_mockup
    ))
  );
