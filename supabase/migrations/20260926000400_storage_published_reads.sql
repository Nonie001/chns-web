-- Published object names are already present in public content rows.
-- Exact row references constrain reads to approved files; Storage's download
-- API may use more than one SELECT operation internally.
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

alter policy "CHNS published partner logos" on storage.objects
  using (
    bucket_id = 'chns-content'
    and exists (select 1 from public.partners where status = 'published' and rights_confirmed
      and 'partner-logos/' || logo_key = name)
  );
