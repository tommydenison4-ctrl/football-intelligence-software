-- ULM public read access for published projects
-- Run in Supabase SQL Editor only if the public app reports an RLS/read error.

alter table public.projects enable row level security;
alter table public.plays enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects
for select
to anon
using (published = true);

drop policy if exists "Public can read plays from published projects" on public.plays;
create policy "Public can read plays from published projects"
on public.plays
for select
to anon
using (
  exists (
    select 1
    from public.projects p
    where p.id = plays.project_id
      and p.published = true
  )
);
