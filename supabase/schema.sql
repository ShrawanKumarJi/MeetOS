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

create index if not exists meetings_status_idx on public.meetings(status);
create index if not exists meetings_scheduled_time_idx on public.meetings(scheduled_time);

alter table public.meetings enable row level security;

drop policy if exists "meetings_select_all" on public.meetings;
create policy "meetings_select_all"
on public.meetings
for select
to anon, authenticated
using (true);

drop policy if exists "meetings_insert_all" on public.meetings;
create policy "meetings_insert_all"
on public.meetings
for insert
to anon, authenticated
with check (true);

drop policy if exists "meetings_update_all" on public.meetings;
create policy "meetings_update_all"
on public.meetings
for update
to anon, authenticated
using (true)
with check (true);

alter publication supabase_realtime add table public.meetings;
