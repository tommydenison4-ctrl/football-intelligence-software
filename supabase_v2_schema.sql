-- ULM Football Intelligence V2
-- Run once in Supabase SQL Editor.
-- This extends the existing projects/plays system; it does not delete current data.

create extension if not exists pgcrypto;

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  code text,
  season integer default 2026,
  is_opponent boolean default true,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  team_name text,
  season integer default 2026,
  number text,
  name text not null,
  side text,
  position text,
  class_year text,
  height text,
  weight integer,
  hometown text,
  previous_school text,
  bio_url text,
  image_url text,
  metrics jsonb not null default '{}'::jsonb,
  notes text,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists players_team_idx on public.players(team_id,season);
create index if not exists players_team_name_idx on public.players(team_name,season);

create table if not exists public.depth_chart_entries (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  season integer default 2026,
  unit text not null,
  position text not null,
  depth integer not null default 1,
  player_id uuid references public.players(id) on delete set null,
  player_name text not null,
  role text,
  notes text,
  published boolean default true,
  updated_at timestamptz default now()
);
create index if not exists depth_team_idx on public.depth_chart_entries(team_id,season,unit,position,depth);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  season integer default 2026,
  side text,
  report_type text,
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Optional opponent link on the existing project model.
alter table public.projects add column if not exists team_id uuid references public.teams(id) on delete set null;
alter table public.projects add column if not exists side text;
alter table public.projects add column if not exists dataset_type text;

insert into public.teams(slug,name,code,season,is_opponent,published) values
 ('florida-atlantic','Florida Atlantic','FAU',2026,true,true),
 ('uab','UAB','UAB',2026,true,true),
 ('mississippi-state','Mississippi State','MSST',2026,true,true)
on conflict(slug) do update set name=excluded.name,code=excluded.code,season=excluded.season;

alter table public.teams enable row level security;
alter table public.platform_settings enable row level security;
alter table public.players enable row level security;
alter table public.depth_chart_entries enable row level security;
alter table public.reports enable row level security;

-- Public staff read access to published football intelligence.
drop policy if exists "Public read published teams" on public.teams;
create policy "Public read published teams" on public.teams for select to anon using (published=true);
drop policy if exists "Public read published players" on public.players;
create policy "Public read published players" on public.players for select to anon using (published=true);
drop policy if exists "Public read published depth" on public.depth_chart_entries;
create policy "Public read published depth" on public.depth_chart_entries for select to anon using (published=true);
drop policy if exists "Public read published reports" on public.reports;
create policy "Public read published reports" on public.reports for select to anon using (published=true);
drop policy if exists "Public read platform settings" on public.platform_settings;
create policy "Public read platform settings" on public.platform_settings for select to anon using (true);

-- Authenticated users can manage V2 football data. Tighten later to admin roles if desired.
drop policy if exists "Authenticated manage teams" on public.teams;
create policy "Authenticated manage teams" on public.teams for all to authenticated using (true) with check (true);
drop policy if exists "Authenticated manage settings" on public.platform_settings;
create policy "Authenticated manage settings" on public.platform_settings for all to authenticated using (true) with check (true);
drop policy if exists "Authenticated manage players" on public.players;
create policy "Authenticated manage players" on public.players for all to authenticated using (true) with check (true);
drop policy if exists "Authenticated manage depth" on public.depth_chart_entries;
create policy "Authenticated manage depth" on public.depth_chart_entries for all to authenticated using (true) with check (true);
drop policy if exists "Authenticated manage reports" on public.reports;
create policy "Authenticated manage reports" on public.reports for all to authenticated using (true) with check (true);
