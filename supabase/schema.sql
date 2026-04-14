create extension if not exists "pgcrypto";

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  reason text not null,
  priority text not null check (priority in ('Normal', 'Important', 'Urgent')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'in_progress', 'completed')),
  scheduled_time timestamptz not null,
  created_at timestamptz not null default now()
);

alter publication supabase_realtime add table public.meetings;
