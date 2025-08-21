-- Enable required extensions first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- We'll add TimescaleDB after basic tables are created
-- CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;

-- Create basic tables first
CREATE TABLE IF NOT EXISTS public.parcels (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id uuid NOT NULL,
    name text NOT NULL,
    size_hectares numeric(10,2) NOT NULL,
    soil_type text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS and create policy
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own parcels" ON public.parcels
    FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Users can modify their own parcels" ON public.parcels
    FOR ALL USING (owner_id = auth.uid());

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to parcels
CREATE TRIGGER set_timestamp_parcels
    BEFORE UPDATE ON public.parcels
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();
