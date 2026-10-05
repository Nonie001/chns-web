-- CHNS content schema. Imported preview records remain drafts.

create table public.chns_admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor', 'reviewer', 'publisher')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.chns_admin_users enable row level security;
revoke all on public.chns_admin_users from anon, authenticated;
grant select on public.chns_admin_users to authenticated;
create policy "read own CHNS admin account" on public.chns_admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create function public.is_chns_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.chns_admin_users
    where user_id = (select auth.uid()) and active and role = 'admin'
  );
$$;
revoke all on function public.is_chns_admin() from public;
grant execute on function public.is_chns_admin() to authenticated;

create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_key text not null unique,
  mobile_image_key text,
  image_alt text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_mockup boolean not null default false check (not is_mockup or status = 'draft'),
  position integer not null default 0,
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create index hero_slides_public_idx on public.hero_slides (status, position);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  kind text not null check (kind in ('news', 'story')),
  summary text not null,
  body text not null,
  image_key text unique,
  image_alt text not null default '',
  image_credit text not null default '',
  image_rights_confirmed boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_mockup boolean not null default false check (not is_mockup or status = 'draft'),
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint article_image_rights check (status <> 'published' or image_key is null or image_rights_confirmed)
);
create index articles_public_idx on public.articles (status, published_at desc);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  category text not null,
  location text not null,
  department_slug text not null,
  summary text not null,
  body text not null,
  image_key text unique,
  image_alt text not null default '',
  image_credit text not null default '',
  image_rights_confirmed boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_mockup boolean not null default false check (not is_mockup or status = 'draft'),
  created_by uuid references auth.users (id),
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint project_image_rights check (status <> 'published' or image_key is null or image_rights_confirmed)
);
create index projects_public_idx on public.projects (status, published_at desc);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  kind text not null,
  report_year integer not null check (report_year between 1900 and 2100),
  summary text not null,
  source text not null,
  file_key text unique,
  file_rights_confirmed boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid not null references auth.users (id),
  updated_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint report_publish_ready check (status <> 'published' or (file_key is not null and file_rights_confirmed and length(trim(source)) > 0))
);
create index reports_public_idx on public.reports (status, report_year desc, published_at desc);

create table public.homepage_features (
  slot text primary key check (slot in ('article_1', 'project_1', 'project_2')),
  content_id uuid not null,
  updated_by uuid not null references auth.users (id),
  updated_at timestamptz not null default now()
);

create table public.hero_slide_audit (
  id uuid primary key default gen_random_uuid(),
  slide_id uuid not null references public.hero_slides (id),
  actor_id uuid not null references auth.users (id),
  action text not null,
  details jsonb not null,
  created_at timestamptz not null default now()
);
create table public.article_audit (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id),
  actor_id uuid not null references auth.users (id),
  action text not null,
  details jsonb not null,
  created_at timestamptz not null default now()
);
create table public.project_audit (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id),
  actor_id uuid not null references auth.users (id),
  action text not null,
  details jsonb not null,
  created_at timestamptz not null default now()
);
create table public.report_audit (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports (id),
  actor_id uuid not null references auth.users (id),
  action text not null,
  details jsonb not null,
  created_at timestamptz not null default now()
);
create table public.homepage_feature_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users (id),
  before_json jsonb not null,
  after_json jsonb not null,
  created_at timestamptz not null default now()
);

-- Every exposed table has explicit grants and RLS. Public reads are published-only.
do $$
declare table_name text;
begin
  foreach table_name in array array['hero_slides', 'articles', 'projects', 'reports', 'homepage_features',
    'hero_slide_audit', 'article_audit', 'project_audit', 'report_audit', 'homepage_feature_audit'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
  end loop;
end $$;

grant select on public.hero_slides, public.articles, public.projects, public.reports to anon, authenticated;
grant insert, update on public.hero_slides, public.articles, public.projects, public.reports to authenticated;

create policy "published hero slides" on public.hero_slides for select to anon, authenticated using (status = 'published');
create policy "admin read hero slides" on public.hero_slides for select to authenticated using ((select public.is_chns_admin()));
create policy "admin insert hero slides" on public.hero_slides for insert to authenticated with check ((select public.is_chns_admin()) and created_by = (select auth.uid()) and updated_by = (select auth.uid()));
create policy "admin update hero slides" on public.hero_slides for update to authenticated using ((select public.is_chns_admin())) with check ((select public.is_chns_admin()) and updated_by = (select auth.uid()));

create policy "published articles" on public.articles for select to anon, authenticated using (status = 'published');
create policy "admin read articles" on public.articles for select to authenticated using ((select public.is_chns_admin()));
create policy "admin insert articles" on public.articles for insert to authenticated with check ((select public.is_chns_admin()) and created_by = (select auth.uid()) and updated_by = (select auth.uid()));
create policy "admin update articles" on public.articles for update to authenticated using ((select public.is_chns_admin())) with check ((select public.is_chns_admin()) and updated_by = (select auth.uid()));

create policy "published projects" on public.projects for select to anon, authenticated using (status = 'published');
create policy "admin read projects" on public.projects for select to authenticated using ((select public.is_chns_admin()));
create policy "admin insert projects" on public.projects for insert to authenticated with check ((select public.is_chns_admin()) and created_by = (select auth.uid()) and updated_by = (select auth.uid()));
create policy "admin update projects" on public.projects for update to authenticated using ((select public.is_chns_admin())) with check ((select public.is_chns_admin()) and updated_by = (select auth.uid()));

create policy "published reports" on public.reports for select to anon, authenticated using (status = 'published');
create policy "admin read reports" on public.reports for select to authenticated using ((select public.is_chns_admin()));
create policy "admin insert reports" on public.reports for insert to authenticated with check ((select public.is_chns_admin()) and created_by = (select auth.uid()) and updated_by = (select auth.uid()));
create policy "admin update reports" on public.reports for update to authenticated using ((select public.is_chns_admin())) with check ((select public.is_chns_admin()) and updated_by = (select auth.uid()));

grant select on public.homepage_features to anon, authenticated;
grant insert, update, delete on public.homepage_features to authenticated;
create policy "read homepage features" on public.homepage_features for select to anon, authenticated using (true);
create policy "admin insert homepage features" on public.homepage_features for insert to authenticated with check ((select public.is_chns_admin()) and updated_by = (select auth.uid()));
create policy "admin update homepage features" on public.homepage_features for update to authenticated using ((select public.is_chns_admin())) with check ((select public.is_chns_admin()) and updated_by = (select auth.uid()));
create policy "admin delete homepage features" on public.homepage_features for delete to authenticated using ((select public.is_chns_admin()));

do $$
declare table_name text;
begin
  foreach table_name in array array['hero_slide_audit', 'article_audit', 'project_audit', 'report_audit', 'homepage_feature_audit'] loop
    execute format('grant select, insert on public.%I to authenticated', table_name);
    execute format('create policy %I on public.%I for select to authenticated using ((select public.is_chns_admin()))', 'admin read ' || table_name, table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select public.is_chns_admin()) and actor_id = (select auth.uid()))', 'admin append ' || table_name, table_name);
  end loop;
end $$;

-- Keep every file private. Public image/PDF Route Handlers must check content status
-- before reading with a server-only privileged client or issuing a short signed URL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chns-content', 'chns-content', false, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

create policy "CHNS admin read files" on storage.objects for select to authenticated
  using (bucket_id = 'chns-content' and (select public.is_chns_admin()));
create policy "CHNS admin upload files" on storage.objects for insert to authenticated
  with check (bucket_id = 'chns-content' and (select public.is_chns_admin()));

-- A private object becomes readable without a session only when an approved
-- published record points to its exact path. Draft and orphan files stay private.
create policy "CHNS published files" on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'chns-content'
    and storage.allow_only_operation('object.get_authenticated')
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
