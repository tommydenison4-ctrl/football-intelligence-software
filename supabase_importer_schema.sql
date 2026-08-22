-- ULM Football Intelligence V2 — PFF Importer Extension
-- Run this AFTER supabase_v2_schema.sql.
-- Safe to run more than once.

create extension if not exists pgcrypto;

create table if not exists public.pff_import_batches (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  dataset_side text not null check (dataset_side in ('opponent_defense','opponent_offense')),
  season integer,
  status text not null default 'completed',
  rows_seen integer not null default 0,
  rows_selected integer not null default 0,
  rows_inserted integer not null default 0,
  duplicates_skipped integer not null default 0,
  team_summary jsonb not null default '{}'::jsonb,
  notes text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.pff_raw_plays (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.pff_import_batches(id) on delete set null,
  dataset_side text not null check (dataset_side in ('opponent_defense','opponent_offense')),
  source_key text not null,
  pff_game_id text,
  pff_play_id text,
  game_date date,
  season integer,
  week integer,
  offense_code text,
  defense_code text,
  focus_team_code text,
  is_scheme_reference boolean not null default false,
  scheme_reference_for text,
  scheme_coach text,
  raw_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(dataset_side, source_key)
);

create index if not exists pff_raw_side_team_idx on public.pff_raw_plays(dataset_side,focus_team_code,season);
create index if not exists pff_raw_game_idx on public.pff_raw_plays(pff_game_id);
create index if not exists pff_raw_scheme_idx on public.pff_raw_plays(scheme_reference_for,is_scheme_reference);
create index if not exists pff_batches_created_idx on public.pff_import_batches(created_at desc);

alter table public.pff_import_batches enable row level security;
alter table public.pff_raw_plays enable row level security;

-- Import data is admin/authenticated-only for now.
drop policy if exists "Authenticated manage PFF batches" on public.pff_import_batches;
create policy "Authenticated manage PFF batches"
on public.pff_import_batches for all to authenticated
using (true) with check (true);

drop policy if exists "Authenticated manage PFF raw plays" on public.pff_raw_plays;
create policy "Authenticated manage PFF raw plays"
on public.pff_raw_plays for all to authenticated
using (true) with check (true);

-- No anon policies are created for raw PFF data.
