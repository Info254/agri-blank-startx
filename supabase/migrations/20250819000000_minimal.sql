-- Essential setup only
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Just one table to verify everything works
CREATE TABLE IF NOT EXISTS public.parcels (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Basic RLS
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;

-- Simple policy
CREATE POLICY "Enable read access for all users" ON public.parcels
    FOR SELECT USING (true);
