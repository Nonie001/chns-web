-- Storage's authenticated download checks object metadata as well as bytes.
-- Keep LIST blocked while allowing the two exact download operations.
alter policy "CHNS published files" on storage.objects
  using (
    bucket_id = 'chns-content'
    and storage.allow_any_operation(array['object.get_authenticated_info', 'object.get_authenticated'])
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

alter policy "CHNS published partner logos" on storage.objects
  using (
    bucket_id = 'chns-content'
    and storage.allow_any_operation(array['object.get_authenticated_info', 'object.get_authenticated'])
    and exists (select 1 from public.partners where status = 'published' and rights_confirmed
      and 'partner-logos/' || logo_key = name)
  );
