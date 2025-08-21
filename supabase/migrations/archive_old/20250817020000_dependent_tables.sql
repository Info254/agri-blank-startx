-- Create parcels table first
CREATE TABLE IF NOT EXISTS public.parcels (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    size_hectares numeric(10,2) NOT NULL,
    soil_type text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create dependent tables
CREATE TABLE IF NOT EXISTS public.yield_tracking (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    parcel_id uuid REFERENCES public.parcels(id),
    crop_type text NOT NULL,
    planting_date date NOT NULL,
    harvest_date date,
    area_planted numeric(10,2) NOT NULL,
    expected_yield numeric(10,2) NOT NULL,
    actual_yield numeric(10,2),
    yield_per_hectare numeric(10,2) GENERATED ALWAYS AS (
        CASE 
            WHEN area_planted > 0 AND actual_yield IS NOT NULL 
            THEN (actual_yield / area_planted) 
            ELSE 0 
        END
    ) STORED,
    yield_difference_percentage numeric(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN expected_yield > 0 AND actual_yield IS NOT NULL 
            THEN ((actual_yield - expected_yield) / expected_yield * 100)
            ELSE 0 
        END
    ) STORED,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.resource_usage (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    resource_type text NOT NULL,
    parcel_id uuid REFERENCES public.parcels(id),
    usage_date date NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit text NOT NULL,
    cost_per_unit numeric(10,2) NOT NULL,
    total_cost numeric(12,2) GENERATED ALWAYS AS (quantity * cost_per_unit) STORED,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yield_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own yield tracking" ON public.yield_tracking
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own yield tracking" ON public.yield_tracking
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own resource usage" ON public.resource_usage
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own resource usage" ON public.resource_usage
    FOR ALL USING (auth.uid() = user_id);
