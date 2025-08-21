-- Add materialized views for performance optimization
CREATE MATERIALIZED VIEW farm_yield_analytics AS
WITH recursive dates AS (
    SELECT min(planting_date)::date AS date
    FROM public.farm_yields
    UNION ALL
    SELECT (date + interval '1 day')::date
    FROM dates
    WHERE date < current_date
),
daily_yields AS (
    SELECT 
        d.date,
        f.farm_id,
        f.crop_type,
        f.expected_yield,
        f.actual_yield,
        avg(f.actual_yield) OVER (
            PARTITION BY f.farm_id, f.crop_type
            ORDER BY d.date
            ROWS BETWEEN 30 PRECEDING AND CURRENT ROW
        ) AS moving_avg_yield,
        first_value(f.actual_yield) OVER (
            PARTITION BY f.farm_id, f.crop_type
            ORDER BY d.date DESC
        ) - first_value(f.actual_yield) OVER (
            PARTITION BY f.farm_id, f.crop_type
            ORDER BY d.date
        ) AS yield_trend
    FROM dates d
    LEFT JOIN public.farm_yields f ON d.date = f.planting_date
)
SELECT * FROM daily_yields;

-- Add table partitioning for large datasets
CREATE TABLE farm_yields_partitioned (
    id uuid NOT NULL,
    farm_id uuid NOT NULL,
    crop_type text NOT NULL,
    planting_date date NOT NULL,
    harvest_date date,
    expected_yield numeric(10,2) NOT NULL,
    actual_yield numeric(10,2),
    area_planted numeric(10,2) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT farm_yields_partitioned_pkey PRIMARY KEY (id, planting_date)
) PARTITION BY RANGE (planting_date);

CREATE TABLE farm_yields_y2024 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE farm_yields_y2025 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE farm_yields_y2026 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- Add advanced triggers for data quality and ML predictions
CREATE OR REPLACE FUNCTION validate_yield_data() 
RETURNS trigger AS $$
BEGIN
    -- Validate data quality
    IF NEW.expected_yield <= 0 THEN
        RAISE EXCEPTION 'Expected yield must be positive';
    END IF;
    IF NEW.actual_yield IS NOT NULL AND NEW.actual_yield < 0 THEN
        RAISE EXCEPTION 'Actual yield cannot be negative';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER farm_yields_validation
    BEFORE INSERT OR UPDATE ON public.farm_yields
    FOR EACH ROW
    EXECUTE FUNCTION validate_yield_data();

-- Add change data capture
CREATE TABLE IF NOT EXISTS farm_yields_audit (
    operation char(1),
    stamp timestamp,
    userid text,
    farm_yield_id uuid,
    old_data jsonb,
    new_data jsonb
);

CREATE OR REPLACE FUNCTION audit_farm_yields()
RETURNS trigger AS $$
BEGIN
    INSERT INTO farm_yields_audit (
        operation,
        stamp,
        userid,
        farm_yield_id,
        old_data,
        new_data
    )
    SELECT
        CASE
            WHEN TG_OP = 'INSERT' THEN 'I'
            WHEN TG_OP = 'UPDATE' THEN 'U'
            ELSE 'D'
        END,
        now(),
        auth.uid(),
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb
            WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb
            ELSE null
        END,
        CASE
            WHEN TG_OP = 'DELETE' THEN null
            ELSE row_to_json(NEW)::jsonb
        END;
    RETURN null;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER farm_yields_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.farm_yields
    FOR EACH ROW EXECUTE FUNCTION audit_farm_yields();

-- Add hypertable for time-series optimization
SELECT create_hypertable(
    'weather_impact',
    'date',
    chunk_time_interval => interval '1 month',
    if_not_exists => TRUE
);

-- Add advanced analytics functions
CREATE OR REPLACE FUNCTION calculate_crop_performance_metrics(
    farm_id_param uuid,
    start_date date,
    end_date date
)
RETURNS TABLE (
    crop_type text,
    total_yield numeric,
    yield_per_hectare numeric,
    efficiency_score numeric,
    roi numeric,
    weather_impact_score numeric,
    predicted_next_yield numeric,
    confidence_interval numeric,
    sustainability_score numeric
) AS $$
DECLARE
    weather_weight numeric := 0.3;
    resource_weight numeric := 0.3;
    yield_weight numeric := 0.4;
BEGIN
    RETURN QUERY
    WITH yield_metrics AS (
        SELECT
            fy.crop_type,
            sum(fy.actual_yield) AS total_yield,
            avg(fy.actual_yield) AS avg_yield,
            stddev(fy.actual_yield) AS yield_stddev,
            sum(fy.actual_yield) / nullif(count(*), 0) AS yield_per_hectare,
            corr(fy.actual_yield, wi.temperature) AS temp_correlation,
            corr(fy.actual_yield, wi.rainfall) AS rain_correlation,
            avg(rue.efficiency_score) AS avg_efficiency
        FROM public.farm_yields fy
        JOIN public.weather_impact wi ON 
            wi.farm_id = fy.farm_id 
            AND wi.date = fy.planting_date
        JOIN public.resource_usage_efficiency rue ON
            rue.farm_id = fy.farm_id
            AND rue.usage_date = fy.planting_date
        WHERE fy.farm_id = farm_id_param
        AND fy.planting_date BETWEEN start_date AND end_date
        GROUP BY fy.crop_type
    ),
    predictions AS (
        SELECT
            ym.crop_type,
            ym.avg_yield + (
                ym.temp_correlation * (
                    SELECT avg(temperature) - avg(lag(temperature)) OVER ()
                    FROM public.weather_impact
                    WHERE farm_id = farm_id_param
                    AND date BETWEEN start_date AND end_date
                )
            ) + (
                ym.rain_correlation * (
                    SELECT avg(rainfall) - avg(lag(rainfall)) OVER ()
                    FROM public.weather_impact
                    WHERE farm_id = farm_id_param
                    AND date BETWEEN start_date AND end_date
                )
            ) AS predicted_yield,
            ym.yield_stddev * 1.96 AS confidence_95
        FROM yield_metrics ym
    )
    SELECT
        ym.crop_type,
        ym.total_yield,
        ym.yield_per_hectare,
        ym.avg_efficiency,
        (
            SELECT avg((ru.quantity * ru.cost_per_unit) / NULLIF(ym.total_yield, 0))
            FROM public.resource_usage ru
            WHERE ru.farm_id = farm_id_param
            AND ru.usage_date BETWEEN start_date AND end_date
        ) AS roi,
        (
            weather_weight * (
                SELECT avg(impact_score)
                FROM public.weather_impact
                WHERE farm_id = farm_id_param
                AND date BETWEEN start_date AND end_date
            ) +
            resource_weight * ym.avg_efficiency +
            yield_weight * (ym.avg_yield / nullif(max(ym.avg_yield) OVER (), 0) * 100)
        ) AS weather_impact_score,
        p.predicted_yield,
        p.confidence_95,
        (
            SELECT avg(rue.efficiency_score)
            FROM public.resource_usage_efficiency rue
            WHERE rue.farm_id = farm_id_param
            AND rue.usage_date BETWEEN start_date AND end_date
        ) AS sustainability_score
    FROM yield_metrics ym
    JOIN predictions p ON p.crop_type = ym.crop_type;
END;
$$ LANGUAGE plpgsql;
