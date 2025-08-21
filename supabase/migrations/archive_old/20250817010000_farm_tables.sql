-- Drop any existing objects
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS plpython3u;
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create tables
CREATE TABLE public.farm_statistics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    total_area numeric(10,2) NOT NULL,
    active_parcels integer NOT NULL DEFAULT 0,
    monthly_revenue numeric(15,2) NOT NULL DEFAULT 0,
    monthly_expenses numeric(15,2) NOT NULL DEFAULT 0,
    average_yield numeric(10,2) NOT NULL DEFAULT 0,
    active_alerts integer NOT NULL DEFAULT 0,
    last_updated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.yield_tracking (
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

CREATE TABLE public.resource_usage (
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

CREATE TABLE public.weather_impact (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    farm_id uuid REFERENCES auth.users(id),
    date timestamp with time zone NOT NULL,
    temperature numeric(5,2) NOT NULL,
    rainfall numeric(6,2) NOT NULL,
    soil_moisture numeric(5,2) NOT NULL,
    impact_score numeric(5,2) GENERATED ALWAYS AS (
        (temperature * 0.3 + rainfall * 0.4 + soil_moisture * 0.3)
    ) STORED,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create hypertable for weather_impact
SELECT create_hypertable('weather_impact', 'date');

-- Enable RLS
ALTER TABLE public.farm_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yield_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_impact ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own farm statistics" ON public.farm_statistics
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own farm statistics" ON public.farm_statistics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own yield tracking" ON public.yield_tracking
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own yield tracking" ON public.yield_tracking
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own resource usage" ON public.resource_usage
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own resource usage" ON public.resource_usage
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weather impact" ON public.weather_impact
    FOR SELECT USING (auth.uid() = farm_id);
CREATE POLICY "Users can modify their own weather impact" ON public.weather_impact
    FOR ALL USING (auth.uid() = farm_id);
