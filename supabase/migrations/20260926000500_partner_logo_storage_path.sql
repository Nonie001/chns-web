-- `partners` also has a `name` column. Qualify the outer Storage column so
-- the policy compares the object path, not the partner's display name.
alter policy "CHNS published partner logos" on storage.objects
  using (
    bucket_id = 'chns-content'
    and exists (select 1 from public.partners
      where status = 'published' and rights_confirmed
      and 'partner-logos/' || logo_key = storage.objects.name)
  );
