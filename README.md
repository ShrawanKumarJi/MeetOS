# MeetOS

MeetOS is an internal SaaS MVP for Legal Capital to manage meeting flow in real time.

## Stack

- Next.js (App Router + TypeScript)
- Tailwind CSS
- shadcn-style UI primitives
- Supabase (Postgres + Realtime)

## Setup

1. Install dependencies:
   - `npm install`
2. Copy env vars:
   - `cp .env.example .env.local` (or create `.env.local` manually on Windows)
3. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run the schema in Supabase SQL editor:
   - `supabase/schema.sql`
5. Start the app:
   - `npm run dev`

## Routes

- `/book` - booking form (creates `pending` meetings)
- `/dashboard` - operational board with action buttons
- `/display` - fullscreen waiting/live monitor with realtime updates

## Status Flow

`pending -> approved -> in_progress -> completed`
