-- Public draft showcases have been retired; only published rows are public.
alter table public.articles drop column if exists showcase_visible;
alter table public.projects drop column if exists showcase_visible;
