-- Create audit log table
CREATE TABLE IF NOT EXISTS public.farm_statistics_audit (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name text NOT NULL,
    record_id uuid NOT NULL,
    operation text NOT NULL,
    old_data jsonb,
    new_data jsonb,
    changed_by uuid REFERENCES auth.users(id),
    changed_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security on audit table
ALTER TABLE public.farm_statistics_audit ENABLE ROW LEVEL SECURITY;

-- Create policy for audit table
CREATE POLICY "Admins can view all audit logs" ON public.farm_statistics_audit
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.user_roles WHERE role = 'admin'
        )
    );

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.farm_statistics_audit_trigger_fn()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.farm_statistics_audit (
        table_name,
        record_id,
        operation,
        old_data,
        new_data,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb ELSE NULL END,
        auth.uid()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create validation trigger function for farm_statistics
CREATE OR REPLACE FUNCTION public.validate_farm_statistics()
RETURNS trigger AS $$
BEGIN
    -- Validate total_area
    IF NEW.total_area <= 0 THEN
        RAISE EXCEPTION 'Total area must be greater than 0';
    END IF;

    -- Validate active_parcels
    IF NEW.active_parcels < 0 THEN
        RAISE EXCEPTION 'Active parcels cannot be negative';
    END IF;

    -- Validate monthly_revenue and monthly_expenses
    IF NEW.monthly_revenue < 0 OR NEW.monthly_expenses < 0 THEN
        RAISE EXCEPTION 'Revenue and expenses cannot be negative';
    END IF;

    -- Validate average_yield
    IF NEW.average_yield < 0 THEN
        RAISE EXCEPTION 'Average yield cannot be negative';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger function for yield_tracking
CREATE OR REPLACE FUNCTION public.validate_yield_tracking()
RETURNS trigger AS $$
BEGIN
    -- Validate dates
    IF NEW.planting_date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Planting date cannot be in the future';
    END IF;

    IF NEW.harvest_date IS NOT NULL THEN
        IF NEW.harvest_date < NEW.planting_date THEN
            RAISE EXCEPTION 'Harvest date cannot be before planting date';
        END IF;
        IF NEW.harvest_date > CURRENT_DATE THEN
            RAISE EXCEPTION 'Harvest date cannot be in the future';
        END IF;
    END IF;

    -- Validate area and yields
    IF NEW.area_planted <= 0 THEN
        RAISE EXCEPTION 'Area planted must be greater than 0';
    END IF;

    IF NEW.expected_yield <= 0 THEN
        RAISE EXCEPTION 'Expected yield must be greater than 0';
    END IF;

    IF NEW.actual_yield IS NOT NULL AND NEW.actual_yield < 0 THEN
        RAISE EXCEPTION 'Actual yield cannot be negative';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger function for resource_usage
CREATE OR REPLACE FUNCTION public.validate_resource_usage()
RETURNS trigger AS $$
BEGIN
    -- Validate quantities and costs
    IF NEW.quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than 0';
    END IF;

    IF NEW.cost_per_unit <= 0 THEN
        RAISE EXCEPTION 'Cost per unit must be greater than 0';
    END IF;

    -- Validate resource type
    IF NEW.resource_type NOT IN ('water', 'fertilizer', 'pesticide', 'labor', 'electricity', 'fuel') THEN
        RAISE EXCEPTION 'Invalid resource type';
    END IF;

    -- Validate usage date
    IF NEW.usage_date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Usage date cannot be in the future';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger function for farm_budget
CREATE OR REPLACE FUNCTION public.validate_farm_budget()
RETURNS trigger AS $$
BEGIN
    -- Validate fiscal year
    IF NEW.fiscal_year < EXTRACT(YEAR FROM CURRENT_DATE) - 1 OR 
       NEW.fiscal_year > EXTRACT(YEAR FROM CURRENT_DATE) + 5 THEN
        RAISE EXCEPTION 'Fiscal year must be within reasonable range';
    END IF;

    -- Validate amounts
    IF NEW.planned_amount <= 0 THEN
        RAISE EXCEPTION 'Planned amount must be greater than 0';
    END IF;

    IF NEW.actual_amount IS NOT NULL AND NEW.actual_amount < 0 THEN
        RAISE EXCEPTION 'Actual amount cannot be negative';
    END IF;

    -- Validate category
    IF NEW.category NOT IN ('seeds', 'fertilizer', 'pesticides', 'labor', 'equipment', 'utilities', 'maintenance', 'other') THEN
        RAISE EXCEPTION 'Invalid budget category';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger function for revenue_tracking
CREATE OR REPLACE FUNCTION public.validate_revenue_tracking()
RETURNS trigger AS $$
BEGIN
    -- Validate amounts
    IF NEW.amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be greater than 0';
    END IF;

    IF NEW.quantity IS NOT NULL AND NEW.quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be greater than 0';
    END IF;

    IF NEW.price_per_unit IS NOT NULL AND NEW.price_per_unit <= 0 THEN
        RAISE EXCEPTION 'Price per unit must be greater than 0';
    END IF;

    -- Validate date
    IF NEW.date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Revenue date cannot be in the future';
    END IF;

    -- Validate source
    IF NEW.source NOT IN ('crop_sales', 'livestock', 'services', 'subsidies', 'other') THEN
        RAISE EXCEPTION 'Invalid revenue source';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger function for farm_analytics
CREATE OR REPLACE FUNCTION public.validate_farm_analytics()
RETURNS trigger AS $$
BEGIN
    -- Validate date
    IF NEW.date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Analytics date cannot be in the future';
    END IF;

    -- Validate metric name
    IF NEW.metric_name NOT IN (
        'soil_moisture', 'temperature', 'rainfall', 'humidity', 
        'ph_level', 'nitrogen_level', 'phosphorus_level', 'potassium_level'
    ) THEN
        RAISE EXCEPTION 'Invalid metric name';
    END IF;

    -- Validate metric value based on type
    CASE NEW.metric_name
        WHEN 'soil_moisture' THEN
            IF NEW.metric_value < 0 OR NEW.metric_value > 100 THEN
                RAISE EXCEPTION 'Soil moisture must be between 0 and 100 percent';
            END IF;
        WHEN 'temperature' THEN
            IF NEW.metric_value < -50 OR NEW.metric_value > 60 THEN
                RAISE EXCEPTION 'Temperature must be between -50 and 60 degrees Celsius';
            END IF;
        WHEN 'rainfall' THEN
            IF NEW.metric_value < 0 OR NEW.metric_value > 1000 THEN
                RAISE EXCEPTION 'Rainfall must be between 0 and 1000 mm';
            END IF;
        WHEN 'humidity' THEN
            IF NEW.metric_value < 0 OR NEW.metric_value > 100 THEN
                RAISE EXCEPTION 'Humidity must be between 0 and 100 percent';
            END IF;
        WHEN 'ph_level' THEN
            IF NEW.metric_value < 0 OR NEW.metric_value > 14 THEN
                RAISE EXCEPTION 'pH level must be between 0 and 14';
            END IF;
        ELSE
            IF NEW.metric_value < 0 THEN
                RAISE EXCEPTION 'Metric value cannot be negative';
            END IF;
    END CASE;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach audit triggers to all tables
CREATE TRIGGER farm_statistics_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.farm_statistics
    FOR EACH ROW EXECUTE FUNCTION public.farm_statistics_audit_trigger_fn();

CREATE TRIGGER yield_tracking_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.yield_tracking
    FOR EACH ROW EXECUTE FUNCTION public.farm_statistics_audit_trigger_fn();

CREATE TRIGGER resource_usage_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.resource_usage
    FOR EACH ROW EXECUTE FUNCTION public.farm_statistics_audit_trigger_fn();

CREATE TRIGGER farm_budget_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.farm_budget
    FOR EACH ROW EXECUTE FUNCTION public.farm_statistics_audit_trigger_fn();

CREATE TRIGGER revenue_tracking_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.revenue_tracking
    FOR EACH ROW EXECUTE FUNCTION public.farm_statistics_audit_trigger_fn();

CREATE TRIGGER farm_analytics_audit
    AFTER INSERT OR UPDATE OR DELETE ON public.farm_analytics
    FOR EACH ROW EXECUTE FUNCTION public.farm_statistics_audit_trigger_fn();

-- Attach validation triggers to all tables
CREATE TRIGGER farm_statistics_validation
    BEFORE INSERT OR UPDATE ON public.farm_statistics
    FOR EACH ROW EXECUTE FUNCTION public.validate_farm_statistics();

CREATE TRIGGER yield_tracking_validation
    BEFORE INSERT OR UPDATE ON public.yield_tracking
    FOR EACH ROW EXECUTE FUNCTION public.validate_yield_tracking();

CREATE TRIGGER resource_usage_validation
    BEFORE INSERT OR UPDATE ON public.resource_usage
    FOR EACH ROW EXECUTE FUNCTION public.validate_resource_usage();

CREATE TRIGGER farm_budget_validation
    BEFORE INSERT OR UPDATE ON public.farm_budget
    FOR EACH ROW EXECUTE FUNCTION public.validate_farm_budget();

CREATE TRIGGER revenue_tracking_validation
    BEFORE INSERT OR UPDATE ON public.revenue_tracking
    FOR EACH ROW EXECUTE FUNCTION public.validate_revenue_tracking();

CREATE TRIGGER farm_analytics_validation
    BEFORE INSERT OR UPDATE ON public.farm_analytics
    FOR EACH ROW EXECUTE FUNCTION public.validate_farm_analytics();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS farm_statistics_user_last_updated_idx 
    ON public.farm_statistics(user_id, last_updated);

CREATE INDEX IF NOT EXISTS yield_tracking_user_dates_idx 
    ON public.yield_tracking(user_id, planting_date, harvest_date);

CREATE INDEX IF NOT EXISTS resource_usage_user_date_type_idx 
    ON public.resource_usage(user_id, usage_date, resource_type);

CREATE INDEX IF NOT EXISTS farm_budget_user_year_category_idx 
    ON public.farm_budget(user_id, fiscal_year, category);

CREATE INDEX IF NOT EXISTS revenue_tracking_user_date_source_idx 
    ON public.revenue_tracking(user_id, date, source);

CREATE INDEX IF NOT EXISTS farm_analytics_user_date_metric_idx 
    ON public.farm_analytics(user_id, date, metric_name);

-- Create materialized view for monthly statistics
CREATE MATERIALIZED VIEW public.monthly_farm_statistics AS
SELECT
    user_id,
    date_trunc('month', date) as month,
    SUM(amount) as total_revenue,
    COUNT(DISTINCT source) as revenue_sources,
    AVG(amount) as average_transaction
FROM public.revenue_tracking
GROUP BY user_id, date_trunc('month', date)
WITH DATA;

CREATE UNIQUE INDEX monthly_farm_statistics_user_month_idx 
    ON public.monthly_farm_statistics(user_id, month);

-- Create refresh function for materialized view
CREATE OR REPLACE FUNCTION public.refresh_monthly_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.monthly_farm_statistics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
