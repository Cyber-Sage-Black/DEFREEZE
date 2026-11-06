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

-- 2. Reservations Table (With Learning Goals)
create table if not exists public.reservations (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text not null,
  gender text not null,
  questionnaire jsonb default '{}'::jsonb,
  learning_goals text,
  receipt_url text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  confirmed_at timestamp with time zone
);

-- 3. Collated Questionnaire Responses for Youth Research
create table if not exists public.questionnaire_responses (
  id uuid primary key default uuid_generate_v4(),
  stuck_area text not null,
  biggest_obstacle text not null,
  growth_goal text,
  readiness_score integer,
  user_name text,
  user_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed initial collated youth insights
insert into public.questionnaire_responses (stuck_area, biggest_obstacle, growth_goal, readiness_score, user_name)
values
('Creative Projects & Ideas', 'Overthinking & analysis paralysis', 'Launch my design portfolio without second-guessing every choice', 9, 'Tobi A.'),
('Career & Purpose', 'Fear of failure or being judged', 'Transition into tech and speak up in meetings', 10, 'Amaka E.'),
('Personal Growth & Habits', 'Comparing my progress to everyone else', 'Build a disciplined morning routine and stop doomscrolling', 8, 'David O.'),
('Taking the First Bold Step', 'Simply not knowing where or how to begin', 'Find clarity and an accountability partner who pushes me forward', 9, 'Anonymous Youth')
on conflict do nothing;

-- 4. Organizers / Team Profiles Table
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
alter table public.questionnaire_responses enable row level security;
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

-- Policies for questionnaire_responses:
create policy "Anyone can insert questionnaire response"
  on public.questionnaire_responses for insert
  with check (true);

create policy "Allow read questionnaire responses"
  on public.questionnaire_responses for select
  using (true);

-- Policies for organizers:
create policy "Public can read organizers"
  on public.organizers for select
  using (true);

create policy "Allow insert or update organizers"
  on public.organizers for all
  using (true)
  with check (true);

-- 5. Storage Buckets
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
