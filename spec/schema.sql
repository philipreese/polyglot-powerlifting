-- Create the lifts table
create table public.lifts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users null, -- Null implies an anonymous/local lift
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  bodyweight numeric not null,
  gender text not null check (gender in ('male', 'female')),
  equipment text not null check (equipment in ('raw', 'single-ply', 'multi-ply')),
  squat numeric not null check (squat >= 0),
  bench numeric not null check (bench >= 0),
  deadlift numeric not null check (deadlift >= 0),
  total numeric not null generated always as (squat + bench + deadlift) stored,
  wilks numeric not null,
  dots numeric not null,
  ipf_gl numeric not null,
  reshel numeric not null
);

-- Turn on Row Level Security
alter table public.lifts enable row level security;

-- Policy: Users can only see their own lifts
create policy "Users can view their own lifts"
  on public.lifts for select
  using ( auth.uid() = user_id );

-- Policy: Users can only insert their own lifts
create policy "Users can insert their own lifts"
  on public.lifts for insert
  with check ( auth.uid() = user_id );

-- Policy: Users can only delete their own lifts
create policy "Users can delete their own lifts"
  on public.lifts for delete
  using ( auth.uid() = user_id );
