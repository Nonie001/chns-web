-- Imported preview rows have no Supabase Auth author until an admin edits them.
alter table public.reports alter column created_by drop not null;
alter table public.reports alter column updated_by drop not null;
