-- ============================================================
-- HIVE Community - Supabase Database Schema
-- Run this script in the Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Create Profiles Table (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  handle text unique,
  avatar_url text,
  wallet_address text,
  hive_id text default 'aster',
  squad_id text,
  onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies:
-- Anyone can view profiles (public read)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- 3. Automatic Profile Creation on Google Sign-in Trigger
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_name text;
  raw_avatar text;
  generated_handle text;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  raw_avatar := coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '');
  generated_handle := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]', '', 'g')) || '_' || substr(new.id::text, 1, 4);

  insert into public.profiles (
    id,
    email,
    display_name,
    handle,
    avatar_url,
    hive_id,
    onboarded
  )
  values (
    new.id,
    new.email,
    raw_name,
    generated_handle,
    raw_avatar,
    'aster',
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
