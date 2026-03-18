create extension if not exists pgcrypto;

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  description text not null default '',
  priority text not null check (priority in ('low', 'medium', 'high')),
  tags jsonb not null default '[]'::jsonb,
  due_date date not null,
  estimate text not null default '',
  status text not null check (status in ('backlog', 'in-progress', 'review', 'done')),
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.boards add column if not exists owner_id uuid default auth.uid();
alter table public.tasks add column if not exists owner_id uuid default auth.uid();

create index if not exists idx_boards_owner_id on public.boards(owner_id);
create index if not exists idx_tasks_board_id on public.tasks(board_id);
create index if not exists idx_tasks_owner_id on public.tasks(owner_id);
create index if not exists idx_tasks_board_position on public.tasks(board_id, position);

revoke all on table public.boards from anon;
revoke all on table public.tasks from anon;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.boards to authenticated;
grant select, insert, update, delete on table public.tasks to authenticated;

alter table public.boards enable row level security;
alter table public.tasks enable row level security;

drop policy if exists boards_public_read_write on public.boards;
drop policy if exists tasks_public_read_write on public.tasks;
drop policy if exists boards_owner_policy on public.boards;
drop policy if exists tasks_owner_policy on public.tasks;

create policy boards_owner_policy on public.boards
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy tasks_owner_policy on public.tasks
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
