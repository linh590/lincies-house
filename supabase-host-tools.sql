-- Lincies House Host Tools schema
-- Run in Supabase SQL editor before enabling the live tool for students.

create extension if not exists pgcrypto;

create table if not exists public.host_tool_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'basic' check (plan in ('basic', 'premium', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.host_tool_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text,
  cleaner_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.host_tool_calendar_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.host_tool_listings(id) on delete cascade,
  platform text not null check (platform in ('airbnb', 'booking', 'vrbo', 'direct', 'other')),
  ical_url text,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.host_tool_reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.host_tool_listings(id) on delete cascade,
  platform text not null check (platform in ('airbnb', 'booking', 'vrbo', 'direct', 'other')),
  guest_name text,
  check_in date not null,
  check_out date not null,
  guest_count integer,
  status text not null default 'confirmed' check (status in ('confirmed', 'blocked', 'tentative', 'cancelled')),
  source_calendar_id uuid references public.host_tool_calendar_sources(id) on delete set null,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint host_tool_valid_dates check (check_out > check_in)
);

create index if not exists host_tool_listings_user_id_idx on public.host_tool_listings(user_id);
create index if not exists host_tool_calendar_sources_user_id_idx on public.host_tool_calendar_sources(user_id);
create index if not exists host_tool_calendar_sources_listing_id_idx on public.host_tool_calendar_sources(listing_id);
create index if not exists host_tool_reservations_user_id_idx on public.host_tool_reservations(user_id);
create index if not exists host_tool_reservations_listing_dates_idx on public.host_tool_reservations(listing_id, check_in, check_out);

alter table public.host_tool_profiles enable row level security;
alter table public.host_tool_listings enable row level security;
alter table public.host_tool_calendar_sources enable row level security;
alter table public.host_tool_reservations enable row level security;

drop policy if exists "Host tool profiles are owned by user" on public.host_tool_profiles;
create policy "Host tool profiles are owned by user"
  on public.host_tool_profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Host tool listings are owned by user" on public.host_tool_listings;
create policy "Host tool listings are owned by user"
  on public.host_tool_listings for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Host tool calendar sources are owned by user" on public.host_tool_calendar_sources;
create policy "Host tool calendar sources are owned by user"
  on public.host_tool_calendar_sources for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Host tool reservations are owned by user" on public.host_tool_reservations;
create policy "Host tool reservations are owned by user"
  on public.host_tool_reservations for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
