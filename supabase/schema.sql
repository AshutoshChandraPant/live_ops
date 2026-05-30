-- ============================================================
-- LiveOps Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Configurable session types
create table if not exists public.session_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Team members (extends auth.users)
create table if not exists public.team_members (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('pm', 'ops', 'leadership')),
  availability text,
  weekly_capacity int not null default 10,
  created_at timestamptz not null default now()
);

-- Sessions — single source of truth for both Planning and Live Ops views
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),

  -- Planning columns
  program text not null,
  cohort text not null,
  session_type text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  instructor text,
  meeting_link text,
  notes text,

  -- Confirmation workflow
  soft_confirmed boolean not null default false,
  final_confirmed boolean not null default false,
  cancelled boolean not null default false,

  -- Ops columns (populated after soft confirmation)
  ops_in_charge uuid references public.team_members(id) on delete set null,
  published text not null default 'No' check (published in ('Yes', 'No')),
  deck_status text not null default 'Not Started'
    check (deck_status in ('Not Started', 'Pending', 'In Progress', 'Ready', 'Shared')),
  instructor_connect text not null default 'Pending'
    check (instructor_connect in ('Pending', 'Scheduled', 'Completed')),

  -- Metadata
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Additional ops members per session (multi-select)
create table if not exists public.session_ops_members (
  session_id uuid not null references public.sessions(id) on delete cascade,
  member_id uuid not null references public.team_members(id) on delete cascade,
  primary key (session_id, member_id)
);

-- ============================================================
-- COMPUTED STATUS VIEW
-- ============================================================

create or replace view public.sessions_with_status as
select
  s.*,
  case
    when s.cancelled then 'Cancelled'
    when s.final_confirmed then 'Confirmed'
    when s.soft_confirmed then 'Awaiting Final Confirmation'
    else 'Draft'
  end as session_status,
  tm.name as ops_in_charge_name,
  to_char(s.date, 'Dy') as day_of_week,
  coalesce(
    (
      select json_agg(json_build_object('id', om.member_id, 'name', t.name))
      from session_ops_members om
      join team_members t on t.id = om.member_id
      where om.session_id = s.id
    ),
    '[]'::json
  ) as additional_ops
from sessions s
left join team_members tm on tm.id = s.ops_in_charge;

-- ============================================================
-- SEED DATA: Session Types
-- ============================================================

insert into public.session_types (name) values
  ('Core Session'),
  ('Mentor Session'),
  ('DSA Session'),
  ('Interview Prep Session'),
  ('Mock Interview'),
  ('Workshop'),
  ('AMA')
on conflict (name) do nothing;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists sessions_date_idx on public.sessions(date);
create index if not exists sessions_soft_confirmed_idx on public.sessions(soft_confirmed);
create index if not exists sessions_final_confirmed_idx on public.sessions(final_confirmed);
create index if not exists sessions_cancelled_idx on public.sessions(cancelled);
create index if not exists sessions_ops_in_charge_idx on public.sessions(ops_in_charge);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.sessions enable row level security;
alter table public.team_members enable row level security;
alter table public.session_ops_members enable row level security;
alter table public.session_types enable row level security;

-- Helper: get current user role
create or replace function public.current_user_role()
returns text language sql security definer stable as $$
  select role from public.team_members where id = auth.uid();
$$;

-- ── session_types ─────────────────────────────────────────
-- Everyone can read; only PMs can write
create policy "session_types: all can read"
  on public.session_types for select using (true);

create policy "session_types: pm can insert"
  on public.session_types for insert
  with check (public.current_user_role() = 'pm');

create policy "session_types: pm can update"
  on public.session_types for update
  using (public.current_user_role() = 'pm');

create policy "session_types: pm can delete"
  on public.session_types for delete
  using (public.current_user_role() = 'pm');

-- ── team_members ──────────────────────────────────────────
-- Everyone can read team members
create policy "team_members: all can read"
  on public.team_members for select using (true);

-- PMs can manage team members
create policy "team_members: pm can insert"
  on public.team_members for insert
  with check (public.current_user_role() = 'pm');

create policy "team_members: pm can update"
  on public.team_members for update
  using (public.current_user_role() = 'pm');

create policy "team_members: pm can delete"
  on public.team_members for delete
  using (public.current_user_role() = 'pm');

-- Users can update their own record
create policy "team_members: self update"
  on public.team_members for update
  using (id = auth.uid());

-- ── sessions ──────────────────────────────────────────────
-- Leadership and Ops can read soft/final confirmed + non-draft sessions
-- PMs can read all
create policy "sessions: pm reads all"
  on public.sessions for select
  using (public.current_user_role() = 'pm');

create policy "sessions: ops and leadership read confirmed"
  on public.sessions for select
  using (
    public.current_user_role() in ('ops', 'leadership')
    and soft_confirmed = true
  );

-- Only PMs can create sessions
create policy "sessions: pm can insert"
  on public.sessions for insert
  with check (public.current_user_role() = 'pm');

-- PMs can update any column
create policy "sessions: pm can update"
  on public.sessions for update
  using (public.current_user_role() = 'pm');

-- Ops can update only ops-related columns
create policy "sessions: ops can update ops columns"
  on public.sessions for update
  using (
    public.current_user_role() = 'ops'
    and soft_confirmed = true
  )
  with check (
    -- Ops cannot change planning columns
    program = (select program from sessions where id = sessions.id)
    and cohort = (select cohort from sessions where id = sessions.id)
    and session_type = (select session_type from sessions where id = sessions.id)
    and date = (select date from sessions where id = sessions.id)
    and start_time = (select start_time from sessions where id = sessions.id)
    and end_time = (select end_time from sessions where id = sessions.id)
    and soft_confirmed = (select soft_confirmed from sessions where id = sessions.id)
    and final_confirmed = (select final_confirmed from sessions where id = sessions.id)
  );

-- Only PMs can delete sessions
create policy "sessions: pm can delete"
  on public.sessions for delete
  using (public.current_user_role() = 'pm');

-- ── session_ops_members ───────────────────────────────────
create policy "som: all can read"
  on public.session_ops_members for select using (true);

create policy "som: pm and ops can insert"
  on public.session_ops_members for insert
  with check (public.current_user_role() in ('pm', 'ops'));

create policy "som: pm and ops can delete"
  on public.session_ops_members for delete
  using (public.current_user_role() in ('pm', 'ops'));

-- ============================================================
-- REALTIME
-- ============================================================

-- Enable realtime for sessions (ops team sees live updates)
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.session_ops_members;
