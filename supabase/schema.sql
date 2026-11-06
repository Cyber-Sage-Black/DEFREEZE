-- ==========================================================
-- DEFREEZE: Supabase Database Schema
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Admin & System Settings (Bank Details & Spots Config)
create table if not exists public.admin_settings (
  id text primary key,
  bank_name text not null default 'Guaranty Trust Bank (GTBank)',
  account_number text not null default '0123456789',
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
  '0123456789',
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

-- Enable Row Level Security (RLS)
alter table public.admin_settings enable row level security;
alter table public.reservations enable row level security;

-- Policies for admin_settings:
-- Anyone can read bank details to pay
create policy "Anyone can read bank details"
  on public.admin_settings for select
  using (true);

-- Anyone can update bank details (or restrict by admin service role)
create policy "Allow update bank settings"
  on public.admin_settings for all
  using (true)
  with check (true);

-- Policies for reservations:
-- Anyone can insert a reservation
create policy "Anyone can insert reservation"
  on public.reservations for insert
  with check (true);

-- Anyone can view reservations (or restrict to admin)
create policy "Allow read reservations"
  on public.reservations for select
  using (true);

-- Allow updates (e.g., confirm payment)
create policy "Allow update reservations"
  on public.reservations for update
  using (true)
  with check (true);

-- 3. Storage Bucket for Receipts
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

create policy "Public Access to Receipts"
  on storage.objects for select
  using (bucket_id = 'receipts');

create policy "Anyone can upload Receipts"
  on storage.objects for insert
  with check (bucket_id = 'receipts');
