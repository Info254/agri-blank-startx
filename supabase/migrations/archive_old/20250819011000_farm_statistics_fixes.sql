-- Drop existing objects to avoid conflicts
DROP TABLE IF EXISTS farm_yields_partitioned CASCADE;
DROP TABLE IF EXISTS farm_yields_2024, farm_yields_2025, farm_yields_2026 CASCADE;
DROP FUNCTION IF EXISTS validate_and_predict_yield CASCADE;
DROP FUNCTION IF EXISTS validate_yield_data CASCADE;

-- Create partitioned table with correct primary key
CREATE TABLE farm_yields_partitioned (
    id uuid DEFAULT gen_random_uuid(),
    farm_id uuid REFERENCES auth.users(id),
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

-- Create partitions with correct names
CREATE TABLE farm_yields_y2024 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE farm_yields_y2025 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE farm_yields_y2026 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- Create validation function
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

-- Create trigger using the validation function
CREATE TRIGGER farm_yields_validation
    BEFORE INSERT OR UPDATE ON farm_yields
    FOR EACH ROW
    EXECUTE FUNCTION validate_yield_data();

-- Update weather_impact table
DROP TABLE IF EXISTS weather_impact CASCADE;
CREATE TABLE weather_impact (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Create hypertable for time-series data
SELECT create_hypertable('weather_impact', 'date', if_not_exists => true);

-- Create farm yields audit table
CREATE TABLE IF NOT EXISTS farm_yields_audit (
    operation char(1),
    stamp timestamp,
    userid text,
    farm_yield_id uuid,
    old_data jsonb,
    new_data jsonb
);

-- Create audit function
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
