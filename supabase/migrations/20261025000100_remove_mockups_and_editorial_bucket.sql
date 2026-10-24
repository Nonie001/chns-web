-- Remove retired synthetic previews. Published content and partner logos stay intact.
delete from public.hero_slide_audit where slide_id in
  (select id from public.hero_slides where is_mockup);
delete from public.article_audit where article_id in
  (select id from public.articles where is_mockup);
delete from public.project_audit where project_id in
  (select id from public.projects where is_mockup);
delete from public.report_audit where report_id in
  (select id from public.reports where is_mockup);

delete from public.homepage_features where content_id in
  (select id from public.articles where is_mockup
   union select id from public.projects where is_mockup);
delete from public.hero_slides where is_mockup;
delete from public.articles where is_mockup;
delete from public.projects where is_mockup;
delete from public.reports where is_mockup;

drop policy if exists "visible article mockups" on public.articles;
drop policy if exists "visible project mockups" on public.projects;

alter policy "CHNS published files" on storage.objects
  using (
    bucket_id = 'chns-content'
    and (
      exists (select 1 from public.hero_slides where status = 'published' and not is_mockup
        and ('hero-images/' || image_key = name or 'hero-images/' || mobile_image_key = name))
      or exists (select 1 from public.articles where status = 'published' and not is_mockup
        and image_rights_confirmed and 'article-images/' || image_key = name)
      or exists (select 1 from public.projects where status = 'published' and not is_mockup
        and image_rights_confirmed and 'project-images/' || image_key = name)
      or exists (select 1 from public.reports where status = 'published' and file_rights_confirmed
        and 'report-files/' || file_key = name)
    )
  );

-- Only the approved CHNS editorial images are uploaded here by a service-role
-- maintenance operation. No anonymous or authenticated write policy is granted.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chns-editorial', 'chns-editorial', true, 25000000, array['image/webp'])
on conflict (id) do nothing;
