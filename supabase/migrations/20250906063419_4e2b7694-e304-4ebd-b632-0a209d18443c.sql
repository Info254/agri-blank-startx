-- Create table for client needs assessments
create table if not exists public.client_needs_assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  role text check (role in ('farmer','buyer','exporter','logistics','partner','other')),
  phone text,
  email text,
  county text,
  goals text,
  crop_interest text[],
  budget numeric,
  preferred_contact text check (preferred_contact in ('phone','email','whatsapp')),
  referral_source text,
  status text not null default 'new'
);

-- Enable RLS
alter table public.client_needs_assessments enable row level security;

-- Insert policy: allow anyone to submit
create policy if not exists "Anyone can submit needs assessments"
  on public.client_needs_assessments
  for insert
  to anon, authenticated
  with check (true);

-- Optional: restrict select to authenticated only (no select for anon by default with RLS)
create policy if not exists "Authenticated users can view assessments"
  on public.client_needs_assessments
  for select
  to authenticated
  using (true);

-- Update timestamp trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

create trigger set_updated_at_client_needs
before update on public.client_needs_assessments
for each row execute function public.update_updated_at_column();

-- Index for sorting
create index if not exists idx_client_needs_created_at on public.client_needs_assessments (created_at desc);