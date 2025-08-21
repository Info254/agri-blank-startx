-- Create public schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Create core tables for farm statistics
CREATE TABLE IF NOT EXISTS public.parcels (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id uuid NOT NULL,
    name text NOT NULL,
    size_hectares numeric(10,2) NOT NULL,
    soil_type text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on parcels
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;

-- Create policy for parcels
CREATE POLICY "Users can manage their own parcels"
ON public.parcels
FOR ALL
USING (owner_id = auth.uid());
