create table if not exists feature_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  email text,
  created_at timestamp with time zone default now()
); 