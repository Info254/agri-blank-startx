create table if not exists farm_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  year int not null,
  category text not null, -- e.g., Seeds, Fertilizer, Labor, Equipment
  subcategory text,      -- e.g., Maize seed, NPK fertilizer, Tractor hire
  planned_amount numeric not null,
  actual_amount numeric,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists idx_farm_budgets_user_year on farm_budgets(user_id, year); 