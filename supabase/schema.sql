-- Goals table
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  duration_days integer not null check (duration_days > 0),
  start_date date not null,
  created_at timestamptz not null default now()
);

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  title text not null,
  points integer not null check (points >= 0),
  created_at timestamptz not null default now()
);

-- Task logs table
create table if not exists public.task_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  log_date date not null,
  status boolean not null default false,
  points_earned integer not null default 0,
  created_at timestamptz not null default now(),
  unique (task_id, log_date)
);

-- Enable row level security
alter table public.goals enable row level security;
alter table public.tasks enable row level security;
alter table public.task_logs enable row level security;

-- Policies so users can only access their own data
create policy "Users can manage their own goals"
  on public.goals
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage tasks for their goals"
  on public.tasks
  for all
  using (
    exists (
      select 1
      from public.goals g
      where g.id = goal_id and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.goals g
      where g.id = goal_id and g.user_id = auth.uid()
    )
  );

create policy "Users can manage logs for their tasks"
  on public.task_logs
  for all
  using (
    exists (
      select 1
      from public.tasks t
      join public.goals g on g.id = t.goal_id
      where t.id = task_id and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.tasks t
      join public.goals g on g.id = t.goal_id
      where t.id = task_id and g.user_id = auth.uid()
    )
  );


