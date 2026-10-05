-- Explicit public showcase for the eleven synthetic article previews.
-- Other drafts remain inaccessible to anonymous users.
alter table public.articles
  add column showcase_visible boolean not null default false
  check (not showcase_visible or (is_mockup and status = 'draft'));

create policy "visible article mockups" on public.articles
  for select to anon, authenticated
  using (showcase_visible and is_mockup and status = 'draft');

alter policy "CHNS published files" on storage.objects
  using (
    bucket_id = 'chns-content'
    and (
      exists (select 1 from public.hero_slides where status = 'published' and not is_mockup
        and ('hero-images/' || image_key = name or 'hero-images/' || mobile_image_key = name))
      or exists (select 1 from public.articles where status = 'published' and not is_mockup
        and image_rights_confirmed and 'article-images/' || image_key = name)
      or exists (select 1 from public.articles where status = 'draft' and is_mockup and showcase_visible
        and 'article-images/' || image_key = name)
      or exists (select 1 from public.projects where status = 'published' and not is_mockup
        and image_rights_confirmed and 'project-images/' || image_key = name)
      or exists (select 1 from public.reports where status = 'published' and file_rights_confirmed
        and 'report-files/' || file_key = name)
    )
  );
