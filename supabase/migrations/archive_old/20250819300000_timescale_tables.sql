-- Add TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Create sensor readings hypertable
CREATE TABLE public.sensor_readings (
    id uuid DEFAULT uuid_generate_v4(),
    parcel_id uuid REFERENCES public.parcels(id) ON DELETE CASCADE,
    timestamp timestamptz NOT NULL,
    sensor_type text NOT NULL,
    value numeric NOT NULL,
    unit text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Convert to hypertable
SELECT create_hypertable('public.sensor_readings', 'timestamp');

-- Create indexes for better query performance
CREATE INDEX ON public.sensor_readings (parcel_id, timestamp DESC);
CREATE INDEX ON public.sensor_readings (sensor_type, timestamp DESC);

-- Enable RLS
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sensor readings"
    ON public.sensor_readings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.parcels
            WHERE parcels.id = sensor_readings.parcel_id
            AND parcels.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can add sensor readings to their parcels"
    ON public.sensor_readings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.parcels
            WHERE parcels.id = sensor_readings.parcel_id
            AND parcels.owner_id = auth.uid()
        )
    );

-- Create view for daily averages
CREATE MATERIALIZED VIEW public.daily_sensor_averages
WITH (timescaledb.continuous) AS
SELECT 
    parcel_id,
    sensor_type,
    time_bucket('1 day', timestamp) AS day,
    AVG(value) as avg_value,
    MIN(value) as min_value,
    MAX(value) as max_value,
    COUNT(*) as reading_count
FROM public.sensor_readings
GROUP BY parcel_id, sensor_type, time_bucket('1 day', timestamp)
WITH NO DATA;

-- Refresh policy for materialized view
SELECT add_continuous_aggregate_policy('daily_sensor_averages',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

-- Enable RLS on the materialized view
ALTER MATERIALIZED VIEW public.daily_sensor_averages ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the materialized view
CREATE POLICY "Users can view their own daily averages"
    ON public.daily_sensor_averages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.parcels
            WHERE parcels.id = daily_sensor_averages.parcel_id
            AND parcels.owner_id = auth.uid()
        )
    );
