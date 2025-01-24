create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    description text,
    status text default 'planning' not null,
    progress integer default 0,
    user_id uuid references auth.users(id) not null
);

-- Add RLS (Row Level Security) policies
alter table public.projects enable row level security;

create policy "Users can create their own projects" on projects
    for insert with check (auth.uid() = user_id);

create policy "Users can view their own projects" on projects
    for select using (auth.uid() = user_id);

create policy "Users can update their own projects" on projects
    for update using (auth.uid() = user_id); 