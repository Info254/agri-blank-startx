-- Farm Statistics System Tables

-- Base farm_statistics table for overall farm metrics
CREATE TABLE IF NOT EXISTS public.farm_statistics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
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

-- Detailed yield tracking
CREATE TABLE IF NOT EXISTS public.yield_tracking (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    parcel_id uuid REFERENCES public.parcels NOT NULL,
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

-- Resource utilization tracking
CREATE TABLE IF NOT EXISTS public.resource_usage (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    resource_type text NOT NULL, -- e.g., 'water', 'fertilizer', 'pesticide', 'labor'
    parcel_id uuid REFERENCES public.parcels,
    usage_date date NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit text NOT NULL, -- e.g., 'liters', 'kg', 'hours'
    cost_per_unit numeric(10,2) NOT NULL,
    total_cost numeric(12,2) GENERATED ALWAYS AS (quantity * cost_per_unit) STORED,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Budget tracking
CREATE TABLE IF NOT EXISTS public.farm_budget (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    fiscal_year integer NOT NULL,
    category text NOT NULL, -- e.g., 'seeds', 'fertilizer', 'labor', 'equipment'
    subcategory text,
    planned_amount numeric(15,2) NOT NULL,
    actual_amount numeric(15,2),
    variance_amount numeric(15,2) GENERATED ALWAYS AS (
        CASE 
            WHEN actual_amount IS NOT NULL 
            THEN (actual_amount - planned_amount)
            ELSE 0 
        END
    ) STORED,
    variance_percentage numeric(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN planned_amount > 0 AND actual_amount IS NOT NULL 
            THEN ((actual_amount - planned_amount) / planned_amount * 100)
            ELSE 0 
        END
    ) STORED,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, fiscal_year, category, subcategory)
);

-- Revenue tracking
CREATE TABLE IF NOT EXISTS public.revenue_tracking (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    date date NOT NULL,
    source text NOT NULL, -- e.g., 'crop_sales', 'livestock', 'services'
    subcategory text,
    amount numeric(15,2) NOT NULL,
    quantity numeric(10,2),
    unit text, -- e.g., 'kg', 'bags', 'units'
    price_per_unit numeric(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Analytics data collection
CREATE TABLE IF NOT EXISTS public.farm_analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    date date NOT NULL,
    metric_name text NOT NULL, -- e.g., 'soil_moisture', 'temperature', 'rainfall'
    metric_value numeric NOT NULL,
    unit text NOT NULL,
    parcel_id uuid REFERENCES public.parcels,
    sensor_id text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.farm_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yield_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

CREATE POLICY "Users can view their own farm budget" ON public.farm_budget
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own farm budget" ON public.farm_budget
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own revenue tracking" ON public.revenue_tracking
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own revenue tracking" ON public.revenue_tracking
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own farm analytics" ON public.farm_analytics
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own farm analytics" ON public.farm_analytics
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS farm_statistics_user_id_idx ON public.farm_statistics(user_id);
CREATE INDEX IF NOT EXISTS yield_tracking_user_id_idx ON public.yield_tracking(user_id);
CREATE INDEX IF NOT EXISTS yield_tracking_parcel_crop_idx ON public.yield_tracking(parcel_id, crop_type);
CREATE INDEX IF NOT EXISTS resource_usage_user_date_idx ON public.resource_usage(user_id, usage_date);
CREATE INDEX IF NOT EXISTS farm_budget_user_year_idx ON public.farm_budget(user_id, fiscal_year);
CREATE INDEX IF NOT EXISTS revenue_tracking_user_date_idx ON public.revenue_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS farm_analytics_user_date_idx ON public.farm_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS farm_analytics_metric_idx ON public.farm_analytics(metric_name);

-- Create functions for analytics
CREATE OR REPLACE FUNCTION public.calculate_monthly_stats(
    p_user_id uuid,
    p_year integer,
    p_month integer
)
RETURNS TABLE (
    total_revenue numeric,
    total_expenses numeric,
    net_profit numeric,
    yield_achievement_percentage numeric,
    resource_utilization_cost numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH monthly_revenue AS (
        SELECT COALESCE(SUM(amount), 0) as total
        FROM public.revenue_tracking
        WHERE user_id = p_user_id
        AND EXTRACT(YEAR FROM date) = p_year
        AND EXTRACT(MONTH FROM date) = p_month
    ),
    monthly_expenses AS (
        SELECT COALESCE(SUM(total_cost), 0) as total
        FROM public.resource_usage
        WHERE user_id = p_user_id
        AND EXTRACT(YEAR FROM usage_date) = p_year
        AND EXTRACT(MONTH FROM usage_date) = p_month
    ),
    yield_stats AS (
        SELECT 
            CASE 
                WHEN SUM(expected_yield) > 0 
                THEN (SUM(actual_yield) / SUM(expected_yield) * 100)
                ELSE 0 
            END as achievement_percentage
        FROM public.yield_tracking
        WHERE user_id = p_user_id
        AND EXTRACT(YEAR FROM harvest_date) = p_year
        AND EXTRACT(MONTH FROM harvest_date) = p_month
        AND actual_yield IS NOT NULL
    )
    SELECT 
        r.total as total_revenue,
        e.total as total_expenses,
        (r.total - e.total) as net_profit,
        y.achievement_percentage,
        e.total as resource_utilization_cost
    FROM monthly_revenue r
    CROSS JOIN monthly_expenses e
    CROSS JOIN yield_stats y;
END;
$$;
