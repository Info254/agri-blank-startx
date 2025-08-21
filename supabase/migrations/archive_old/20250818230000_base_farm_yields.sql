-- Add base tables needed for advanced statistics
CREATE TABLE IF NOT EXISTS public.farm_yields (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id uuid REFERENCES auth.users NOT NULL,
    crop_type text NOT NULL,
    planting_date date NOT NULL,
    harvest_date date,
    expected_yield numeric(10,2) NOT NULL,
    actual_yield numeric(10,2),
    area_planted numeric(10,2) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.weather_impact (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id uuid REFERENCES auth.users NOT NULL,
    date date NOT NULL,
    temperature numeric(5,2) NOT NULL,
    rainfall numeric(6,2) NOT NULL,
    soil_moisture numeric(5,2) NOT NULL,
    impact_score numeric(5,2) GENERATED ALWAYS AS (
        (temperature * 0.3 + rainfall * 0.4 + soil_moisture * 0.3)
    ) STORED,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.resource_usage_efficiency (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id uuid REFERENCES auth.users NOT NULL,
    usage_date date NOT NULL,
    efficiency_score numeric(5,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.farm_yields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage_efficiency ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own farm yields" ON public.farm_yields
    FOR SELECT USING (auth.uid() = farm_id);
CREATE POLICY "Users can modify their own farm yields" ON public.farm_yields
    FOR ALL USING (auth.uid() = farm_id);

CREATE POLICY "Users can view their own weather impact" ON public.weather_impact
    FOR SELECT USING (auth.uid() = farm_id);
CREATE POLICY "Users can modify their own weather impact" ON public.weather_impact
    FOR ALL USING (auth.uid() = farm_id);

CREATE POLICY "Users can view their own resource efficiency" ON public.resource_usage_efficiency
    FOR SELECT USING (auth.uid() = farm_id);
CREATE POLICY "Users can modify their own resource efficiency" ON public.resource_usage_efficiency
    FOR ALL USING (auth.uid() = farm_id);
