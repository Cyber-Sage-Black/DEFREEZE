-- ==========================================================
-- DEFREEZE: Supabase Database Schema
-- Project: https://hfmfprhniobdpubvtfca.supabase.co
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Admin & System Settings (Bank Details & Spots Config)
create table if not exists public.admin_settings (
  id text primary key,
  bank_name text not null default 'Guaranty Trust Bank (GTBank)',
  account_number text not null default '0739182390',
  account_name text not null default 'DEFREEZE INITIATIVE',
  amount text not null default '₦15,000',
  total_spots integer not null default 25,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default bank settings if not already present
insert into public.admin_settings (id, bank_name, account_number, account_name, amount, total_spots)
values (
  'default',
  'Guaranty Trust Bank (GTBank)',
  '0739182390',
  'DEFREEZE INITIATIVE',
  '₦15,000',
  25
)
on conflict (id) do nothing;

-- 2. Reservations Table
create table if not exists public.reservations (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text not null,
  gender text not null,
  questionnaire jsonb default '{}'::jsonb,
  receipt_url text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  confirmed_at timestamp with time zone
);

-- 3. Organizers / Team Profiles Table
create table if not exists public.organizers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  bio text,
  image_url text not null,
  instagram text,
  twitter text,
  linkedin text,
  whatsapp text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed initial organizers
insert into public.organizers (name, role, bio, image_url, instagram, twitter, linkedin)
values 
(
  'Ifeoluwa',
  'Founder & Lead Visionary',
  'Curating safe, high-energy spaces for ambitious youths to unfreeze their true potential and build intentional accountability circles.',
  '/images/defreeze-logo.png',
  'https://instagram.com',
  'https://x.com',
  'https://linkedin.com'
),
(
  'DEFREEZE Experience Team',
  'Community & Game Dynamics',
  'Architecting physical games and psychological simulations that break awkward barriers and forge lasting brotherhood and sisterhood.',
  '/images/defreeze-flyer-friends.jpg',
  'https://instagram.com',
  'https://x.com',
  'https://linkedin.com'
)
on conflict do nothing;

-- Enable Row Level Security (RLS)
alter table public.admin_settings enable row level security;
alter table public.reservations enable row level security;
alter table public.organizers enable row level security;

-- Policies for admin_settings:
create policy "Anyone can read bank details"
  on public.admin_settings for select
  using (true);

create policy "Allow update bank settings"
  on public.admin_settings for all
  using (true)
  with check (true);

-- Policies for reservations:
create policy "Anyone can insert reservation"
  on public.reservations for insert
  with check (true);

create policy "Allow read reservations"
  on public.reservations for select
  using (true);

create policy "Allow update reservations"
  on public.reservations for update
  using (true)
  with check (true);

-- Policies for organizers:
create policy "Public can read organizers"
  on public.organizers for select
  using (true);

create policy "Allow insert or update organizers"
  on public.organizers for all
  using (true)
  with check (true);

-- 4. Storage Bucket for Receipts & Profile Images
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('organizers', 'organizers', true)
on conflict (id) do nothing;

create policy "Public Access to Receipts"
  on storage.objects for select
  using (bucket_id in ('receipts', 'organizers'));

create policy "Anyone can upload Receipts & Images"
  on storage.objects for insert
  with check (bucket_id in ('receipts', 'organizers'));
