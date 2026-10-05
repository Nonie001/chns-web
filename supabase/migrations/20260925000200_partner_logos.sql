-- Partner logos, including approved records imported from the local CMS.
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text not null default '',
  logo_key text not null unique,
  logo_alt text not null,
  logo_credit text not null,
  rights_confirmed boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  position integer not null,
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index partners_public_idx on public.partners (status, position);

create table public.partner_audit (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id),
  actor_id uuid not null references auth.users (id),
  action text not null,
  details jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.partners enable row level security;
alter table public.partner_audit enable row level security;
revoke all on public.partners, public.partner_audit from anon, authenticated;
grant select on public.partners to anon, authenticated;
grant insert, update on public.partners to authenticated;
grant select, insert on public.partner_audit to authenticated;

create policy "published partners" on public.partners for select to anon, authenticated
  using (status = 'published' and rights_confirmed);
create policy "admin read partners" on public.partners for select to authenticated
  using ((select public.is_chns_admin()));
create policy "admin insert partners" on public.partners for insert to authenticated
  with check ((select public.is_chns_admin()) and created_by = (select auth.uid()) and updated_by = (select auth.uid()));
create policy "admin update partners" on public.partners for update to authenticated
  using ((select public.is_chns_admin()))
  with check ((select public.is_chns_admin()) and updated_by = (select auth.uid()));
create policy "admin read partner audit" on public.partner_audit for select to authenticated
  using ((select public.is_chns_admin()));
create policy "admin append partner audit" on public.partner_audit for insert to authenticated
  with check ((select public.is_chns_admin()) and actor_id = (select auth.uid()));

create policy "CHNS published partner logos" on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'chns-content'
    and storage.allow_only_operation('object.get_authenticated')
    and exists (select 1 from public.partners where status = 'published' and rights_confirmed
      and 'partner-logos/' || logo_key = name)
  );
