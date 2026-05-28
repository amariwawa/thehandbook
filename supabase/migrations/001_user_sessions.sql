create table user_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  subject text not null,
  score numeric check (score >= 0 and score <= 100),
  duration_mins numeric,
  session_type text check (session_type in ('quiz', 'practice', 'ai_tutor')),
  created_at timestamptz default now()
);

alter table user_sessions enable row level security;

create policy "users see own sessions" on user_sessions
  for select using (auth.uid() = user_id);

create policy "users insert own sessions" on user_sessions
  for insert with check (auth.uid() = user_id);
