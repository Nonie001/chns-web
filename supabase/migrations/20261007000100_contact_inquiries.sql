-- Contact submissions contain personal data. Only active CHNS admins may read them.
create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  department_slug text not null check (department_slug in (
    'general', 'domestic', 'refugees', 'zakat', 'international',
    'academic', 'relations', 'special', 'communications'
  )),
  subject text not null check (char_length(subject) between 1 and 160),
  full_name text not null check (char_length(full_name) between 1 and 160),
  phone text not null default '' check (char_length(phone) <= 30),
  email text not null default '' check (char_length(email) <= 254),
  line_id text not null default '' check (char_length(line_id) <= 80),
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_method_required check (phone <> '' or email <> '' or line_id <> '')
);

create index contact_inquiries_queue_idx on public.contact_inquiries (status, created_at desc);
create index contact_inquiries_department_idx on public.contact_inquiries (department_slug, created_at desc);

alter table public.contact_inquiries enable row level security;
revoke all on public.contact_inquiries from anon, authenticated;
grant select on public.contact_inquiries to authenticated;
grant update (status, updated_at) on public.contact_inquiries to authenticated;

create policy "active CHNS admins read contact inquiries" on public.contact_inquiries
  for select to authenticated using ((select public.is_chns_admin()));
create policy "active CHNS admins update contact inquiries" on public.contact_inquiries
  for update to authenticated using ((select public.is_chns_admin()))
  with check ((select public.is_chns_admin()));

-- An anonymous caller can submit a validated inquiry, but cannot read the table.
create function public.submit_contact_inquiry(
  p_department_slug text, p_subject text, p_full_name text,
  p_phone text, p_email text, p_line_id text, p_message text
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_department text := btrim(coalesce(p_department_slug, ''));
  v_subject text := btrim(coalesce(p_subject, ''));
  v_name text := btrim(coalesce(p_full_name, ''));
  v_phone text := btrim(coalesce(p_phone, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_line text := btrim(coalesce(p_line_id, ''));
  v_message text := btrim(coalesce(p_message, ''));
begin
  if v_department not in ('general', 'domestic', 'refugees', 'zakat', 'international',
    'academic', 'relations', 'special', 'communications')
    or char_length(v_subject) not between 1 and 160
    or char_length(v_name) not between 1 and 160
    or char_length(v_phone) > 30 or char_length(v_email) > 254
    or char_length(v_line) > 80 or char_length(v_message) not between 1 and 4000
    or (v_phone = '' and v_email = '' and v_line = '')
    or (v_email <> '' and v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
    or (v_phone <> '' and v_phone !~ '^[0-9+() -]{7,30}$')
  then
    raise exception 'invalid contact inquiry' using errcode = '22023';
  end if;

  if exists (
    select 1 from public.contact_inquiries
    where created_at > now() - interval '1 minute'
      and ((v_email <> '' and email = v_email) or (v_phone <> '' and phone = v_phone)
        or (v_line <> '' and line_id = v_line))
  ) then
    raise exception 'contact inquiry rate limit' using errcode = 'P0001';
  end if;

  insert into public.contact_inquiries
    (department_slug, subject, full_name, phone, email, line_id, message)
  values (v_department, v_subject, v_name, v_phone, v_email, v_line, v_message)
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.submit_contact_inquiry(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_inquiry(text, text, text, text, text, text, text) to anon, authenticated;
