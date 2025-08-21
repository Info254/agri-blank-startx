-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;

-- Create hypertable for farm statistics
CREATE TABLE IF NOT EXISTS public.farm_statistics (
    id uuid DEFAULT uuid_generate_v4(),
    parcel_id uuid REFERENCES public.parcels(id),
    measurement_time timestamp with time zone NOT NULL,
    temperature numeric(5,2),
    humidity numeric(5,2),
    soil_moisture numeric(5,2),
    rainfall numeric(5,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Convert to hypertable
SELECT create_hypertable('farm_statistics', 'measurement_time');

-- Enable RLS
ALTER TABLE public.farm_statistics ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view statistics for their parcels" ON public.farm_statistics 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.parcels p 
        WHERE p.id = farm_statistics.parcel_id 
        AND p.id IN (
            SELECT parcel_id FROM public.yield_tracking WHERE user_id = auth.uid()
            UNION
            SELECT parcel_id FROM public.resource_usage WHERE user_id = auth.uid()
        )
    ));
