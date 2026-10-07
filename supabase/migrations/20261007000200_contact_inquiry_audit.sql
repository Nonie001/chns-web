create table public.contact_inquiry_audit (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.contact_inquiries (id) on delete cascade,
  actor_id uuid not null references auth.users (id),
  from_status text not null,
  to_status text not null,
  created_at timestamptz not null default now()
);

create index contact_inquiry_audit_inquiry_idx on public.contact_inquiry_audit (inquiry_id, created_at desc);
alter table public.contact_inquiry_audit enable row level security;
revoke all on public.contact_inquiry_audit from anon, authenticated;
grant select on public.contact_inquiry_audit to authenticated;
create policy "active CHNS admins read contact audit" on public.contact_inquiry_audit
  for select to authenticated using ((select public.is_chns_admin()));

create function public.log_contact_inquiry_status()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.status is distinct from new.status then
    insert into public.contact_inquiry_audit (inquiry_id, actor_id, from_status, to_status)
    values (new.id, auth.uid(), old.status, new.status);
  end if;
  return new;
end;
$$;
revoke all on function public.log_contact_inquiry_status() from public;
create trigger contact_inquiry_status_audit
  after update of status on public.contact_inquiries
  for each row execute function public.log_contact_inquiry_status();
