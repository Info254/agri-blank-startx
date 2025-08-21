-- Create table for sensor configurations
CREATE TABLE IF NOT EXISTS public.farm_sensors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    sensor_type text NOT NULL,
    location_name text NOT NULL,
    coordinates point,
    configuration jsonb NOT NULL,
    is_active boolean DEFAULT true,
    last_reading timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create table for data collection schedules
CREATE TABLE IF NOT EXISTS public.data_collection_schedules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    collection_type text NOT NULL,
    frequency interval NOT NULL,
    last_run timestamp with time zone,
    next_run timestamp with time zone,
    configuration jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT valid_frequency CHECK (frequency >= interval '5 minutes')
);

-- Create table for data collection logs
CREATE TABLE IF NOT EXISTS public.data_collection_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id uuid REFERENCES public.data_collection_schedules NOT NULL,
    start_time timestamp with time zone DEFAULT now(),
    end_time timestamp with time zone,
    status text NOT NULL,
    records_processed integer DEFAULT 0,
    error_message text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create function to process sensor data
CREATE OR REPLACE FUNCTION public.process_sensor_data()
RETURNS void AS $$
DECLARE
    v_sensor record;
    v_reading jsonb;
    v_log_id uuid;
BEGIN
    -- Create log entry
    INSERT INTO public.data_collection_logs (schedule_id, status)
    SELECT id, 'running'
    FROM public.data_collection_schedules
    WHERE collection_type = 'sensor'
    AND is_active = true
    AND (last_run IS NULL OR now() >= next_run)
    RETURNING id INTO v_log_id;

    -- Process each active sensor
    FOR v_sensor IN
        SELECT fs.*, u.email
        FROM public.farm_sensors fs
        JOIN auth.users u ON fs.user_id = u.id
        WHERE fs.is_active = true
    LOOP
        BEGIN
            -- Simulate reading from actual sensor (replace with real sensor API calls)
            v_reading := jsonb_build_object(
                'timestamp', now(),
                'sensor_id', v_sensor.id,
                'metric_name', v_sensor.sensor_type,
                'metric_value', 
                CASE v_sensor.sensor_type
                    WHEN 'temperature' THEN 
                        20 + (random() * 15)::numeric(10,2)
                    WHEN 'soil_moisture' THEN 
                        40 + (random() * 30)::numeric(10,2)
                    WHEN 'rainfall' THEN 
                        (random() * 10)::numeric(10,2)
                    WHEN 'humidity' THEN 
                        50 + (random() * 30)::numeric(10,2)
                    ELSE 
                        (random() * 100)::numeric(10,2)
                END,
                'unit',
                CASE v_sensor.sensor_type
                    WHEN 'temperature' THEN '°C'
                    WHEN 'soil_moisture' THEN '%'
                    WHEN 'rainfall' THEN 'mm'
                    WHEN 'humidity' THEN '%'
                    ELSE 'units'
                END
            );

            -- Insert reading into analytics
            INSERT INTO public.farm_analytics (
                user_id,
                date,
                metric_name,
                metric_value,
                unit,
                sensor_id,
                notes
            ) VALUES (
                v_sensor.user_id,
                (v_reading->>'timestamp')::timestamp with time zone,
                v_reading->>'metric_name',
                (v_reading->>'metric_value')::numeric,
                v_reading->>'unit',
                v_sensor.id,
                'Automated sensor reading'
            );

            -- Update sensor last reading time
            UPDATE public.farm_sensors
            SET last_reading = now(),
                updated_at = now()
            WHERE id = v_sensor.id;

        EXCEPTION WHEN OTHERS THEN
            -- Log error but continue processing other sensors
            RAISE NOTICE 'Error processing sensor %: %', v_sensor.id, SQLERRM;
        END;
    END LOOP;

    -- Update schedule
    UPDATE public.data_collection_schedules
    SET last_run = now(),
        next_run = now() + frequency,
        updated_at = now()
    WHERE collection_type = 'sensor'
    AND is_active = true;

    -- Update log entry
    UPDATE public.data_collection_logs
    SET end_time = now(),
        status = 'completed',
        records_processed = (
            SELECT count(*)
            FROM public.farm_analytics
            WHERE date >= now() - interval '5 minutes'
        )
    WHERE id = v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to schedule data collection
CREATE OR REPLACE FUNCTION public.schedule_data_collection(
    p_user_id uuid,
    p_collection_type text,
    p_frequency interval,
    p_configuration jsonb
)
RETURNS uuid AS $$
DECLARE
    v_schedule_id uuid;
BEGIN
    INSERT INTO public.data_collection_schedules (
        user_id,
        collection_type,
        frequency,
        next_run,
        configuration
    ) VALUES (
        p_user_id,
        p_collection_type,
        p_frequency,
        now() + p_frequency,
        p_configuration
    ) RETURNING id INTO v_schedule_id;

    RETURN v_schedule_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to register a new sensor
CREATE OR REPLACE FUNCTION public.register_farm_sensor(
    p_user_id uuid,
    p_sensor_type text,
    p_location_name text,
    p_coordinates point,
    p_configuration jsonb
)
RETURNS uuid AS $$
DECLARE
    v_sensor_id uuid;
BEGIN
    INSERT INTO public.farm_sensors (
        user_id,
        sensor_type,
        location_name,
        coordinates,
        configuration
    ) VALUES (
        p_user_id,
        p_sensor_type,
        p_location_name,
        p_coordinates,
        p_configuration
    ) RETURNING id INTO v_sensor_id;

    RETURN v_sensor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables
ALTER TABLE public.farm_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_collection_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_collection_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sensors" ON public.farm_sensors
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sensors" ON public.farm_sensors
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own schedules" ON public.data_collection_schedules
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own schedules" ON public.data_collection_schedules
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs" ON public.data_collection_logs
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.data_collection_schedules WHERE id = data_collection_logs.schedule_id
        )
    );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS farm_sensors_user_type_idx ON public.farm_sensors(user_id, sensor_type);
CREATE INDEX IF NOT EXISTS data_collection_schedules_next_run_idx ON public.data_collection_schedules(next_run) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS data_collection_logs_schedule_time_idx ON public.data_collection_logs(schedule_id, start_time);
