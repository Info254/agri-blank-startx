-- Secure export-related tables and add basic ownership

-- 1) export_opportunities: add created_by and RLS
alter table if exists public.export_opportunities
  add column if not exists created_by uuid;

alter table public.export_opportunities enable row level security;

-- Select open opportunities or own
CREATE POLICY "Export: select open or own"
  on public.export_opportunities
  for select
  using (status = 'open' or created_by = auth.uid());

-- Insert only as self
CREATE POLICY "Export: insert own"
  on public.export_opportunities
  for insert
  with check (created_by = auth.uid());

-- Update/Delete only own
CREATE POLICY "Export: update own"
  on public.export_opportunities
  for update
  using (created_by = auth.uid());

CREATE POLICY "Export: delete own"
  on public.export_opportunities
  for delete
  using (created_by = auth.uid());

-- 2) export_documentation RLS
alter table if exists public.export_documentation enable row level security;

CREATE POLICY "Export docs: select own"
  on public.export_documentation
  for select
  using (uploaded_by = auth.uid());

CREATE POLICY "Export docs: insert own"
  on public.export_documentation
  for insert
  with check (uploaded_by = auth.uid());

CREATE POLICY "Export docs: update own"
  on public.export_documentation
  for update
  using (uploaded_by = auth.uid());

CREATE POLICY "Export docs: delete own"
  on public.export_documentation
  for delete
  using (uploaded_by = auth.uid());

-- 3) farmer_consolidations RLS
alter table if exists public.farmer_consolidations enable row level security;

CREATE POLICY "Consolidations: select own"
  on public.farmer_consolidations
  for select
  using (consolidator_id = auth.uid());

CREATE POLICY "Consolidations: insert own"
  on public.farmer_consolidations
  for insert
  with check (consolidator_id = auth.uid());

CREATE POLICY "Consolidations: update own"
  on public.farmer_consolidations
  for update
  using (consolidator_id = auth.uid());

CREATE POLICY "Consolidations: delete own"
  on public.farmer_consolidations
  for delete
  using (consolidator_id = auth.uid());