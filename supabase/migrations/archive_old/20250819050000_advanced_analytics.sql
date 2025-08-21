-- Advanced analytics and machine learning components

-- Create table for ML models
CREATE TABLE IF NOT EXISTS public.ml_models (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    model_name text NOT NULL,
    model_type text NOT NULL,
    model_version text NOT NULL,
    model_parameters jsonb NOT NULL,
    training_metrics jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE (model_name, model_version)
);

-- Create table for model predictions
CREATE TABLE IF NOT EXISTS public.model_predictions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    model_id uuid REFERENCES public.ml_models NOT NULL,
    prediction_type text NOT NULL,
    input_data jsonb NOT NULL,
    prediction_result jsonb NOT NULL,
    confidence_score numeric,
    created_at timestamp with time zone DEFAULT now()
);

-- Create table for anomaly detection
CREATE TABLE IF NOT EXISTS public.anomaly_detection (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    anomaly_type text NOT NULL,
    severity text NOT NULL,
    detection_time timestamp with time zone DEFAULT now(),
    anomaly_data jsonb NOT NULL,
    is_resolved boolean DEFAULT false,
    resolution_notes text,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create materialized view for analytics insights
CREATE MATERIALIZED VIEW public.farm_analytics_insights AS
WITH yield_trends AS (
    SELECT
        user_id,
        crop_type,
        date_trunc('month', planting_date) as month,
        AVG(CASE WHEN actual_yield IS NOT NULL THEN actual_yield / area_planted ELSE 0 END) as yield_per_area,
        COUNT(*) as sample_size
    FROM public.yield_tracking
    GROUP BY user_id, crop_type, date_trunc('month', planting_date)
),
resource_efficiency AS (
    SELECT
        user_id,
        resource_type,
        date_trunc('month', usage_date) as month,
        SUM(quantity) as total_quantity,
        SUM(total_cost) as total_cost,
        COUNT(DISTINCT parcel_id) as parcels_count
    FROM public.resource_usage
    GROUP BY user_id, resource_type, date_trunc('month', usage_date)
),
weather_impact AS (
    SELECT
        user_id,
        date_trunc('day', date) as day,
        jsonb_build_object(
            'temperature', AVG(CASE WHEN metric_name = 'temperature' THEN metric_value END),
            'rainfall', SUM(CASE WHEN metric_name = 'rainfall' THEN metric_value END),
            'soil_moisture', AVG(CASE WHEN metric_name = 'soil_moisture' THEN metric_value END)
        ) as weather_metrics
    FROM public.farm_analytics
    GROUP BY user_id, date_trunc('day', date)
)
SELECT
    yt.user_id,
    yt.crop_type,
    yt.month,
    yt.yield_per_area,
    re.resource_type,
    re.total_quantity as resource_quantity,
    re.total_cost as resource_cost,
    re.parcels_count,
    wi.weather_metrics,
    yt.sample_size,
    now() as generated_at
FROM yield_trends yt
LEFT JOIN resource_efficiency re ON 
    yt.user_id = re.user_id AND 
    yt.month = re.month
LEFT JOIN weather_impact wi ON 
    yt.user_id = wi.user_id AND 
    wi.day >= yt.month AND 
    wi.day < yt.month + interval '1 month'
WHERE yt.sample_size >= 3
WITH DATA;

-- Create unique index for materialized view
CREATE UNIQUE INDEX farm_analytics_insights_idx ON public.farm_analytics_insights (user_id, crop_type, month);

-- Create function to predict yield
CREATE OR REPLACE FUNCTION public.predict_yield(
    p_user_id uuid,
    p_crop_type text,
    p_area numeric,
    p_planting_date date
)
RETURNS TABLE (
    predicted_yield numeric,
    confidence_interval jsonb,
    contributing_factors jsonb
) AS $$
DECLARE
    v_model_id uuid;
    v_weather_data jsonb;
    v_historical_yields numeric[];
    v_prediction jsonb;
BEGIN
    -- Get active model
    SELECT id INTO v_model_id
    FROM public.ml_models
    WHERE model_name = 'yield_prediction'
    AND is_active = true
    ORDER BY model_version DESC
    LIMIT 1;

    -- Get weather forecast data
    SELECT jsonb_build_object(
        'temperature_forecast', AVG(CASE WHEN metric_name = 'temperature' THEN metric_value END),
        'rainfall_forecast', SUM(CASE WHEN metric_name = 'rainfall' THEN metric_value END),
        'soil_moisture_forecast', AVG(CASE WHEN metric_name = 'soil_moisture' THEN metric_value END)
    )
    INTO v_weather_data
    FROM public.farm_analytics
    WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - interval '30 days';

    -- Get historical yields
    SELECT array_agg(actual_yield / area_planted)
    INTO v_historical_yields
    FROM public.yield_tracking
    WHERE user_id = p_user_id
    AND crop_type = p_crop_type
    AND actual_yield IS NOT NULL;

    -- Generate prediction
    v_prediction := jsonb_build_object(
        'input_features', jsonb_build_object(
            'historical_yields', v_historical_yields,
            'weather_data', v_weather_data,
            'area', p_area,
            'planting_date', p_planting_date
        )
    );

    -- Store prediction
    INSERT INTO public.model_predictions (
        user_id,
        model_id,
        prediction_type,
        input_data,
        prediction_result,
        confidence_score
    ) VALUES (
        p_user_id,
        v_model_id,
        'yield',
        v_prediction,
        jsonb_build_object(
            'predicted_yield', 
            -- Simplified prediction logic (replace with actual ML model)
            CASE 
                WHEN array_length(v_historical_yields, 1) > 0 
                THEN (
                    SELECT avg(y) * p_area * 
                    CASE 
                        WHEN (v_weather_data->>'temperature_forecast')::numeric > 30 THEN 0.9
                        WHEN (v_weather_data->>'soil_moisture_forecast')::numeric < 20 THEN 0.8
                        ELSE 1.1
                    END
                    FROM unnest(v_historical_yields) y
                )
                ELSE p_area * 2.5 -- Default yield if no history
            END
        ),
        0.85
    );

    -- Return prediction results
    RETURN QUERY
    SELECT 
        (pred.prediction_result->>'predicted_yield')::numeric,
        jsonb_build_object(
            'lower_bound', (pred.prediction_result->>'predicted_yield')::numeric * 0.9,
            'upper_bound', (pred.prediction_result->>'predicted_yield')::numeric * 1.1
        ),
        jsonb_build_object(
            'weather_impact', 
            CASE 
                WHEN (v_weather_data->>'temperature_forecast')::numeric > 30 THEN 'negative'
                WHEN (v_weather_data->>'soil_moisture_forecast')::numeric < 20 THEN 'negative'
                ELSE 'positive'
            END,
            'historical_performance', 
            CASE 
                WHEN array_length(v_historical_yields, 1) > 3 THEN 'high_confidence'
                WHEN array_length(v_historical_yields, 1) > 0 THEN 'medium_confidence'
                ELSE 'low_confidence'
            END,
            'weather_forecast', v_weather_data
        )
    FROM public.model_predictions pred
    WHERE pred.id = (SELECT currval('public.model_predictions_id_seq'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to detect anomalies
CREATE OR REPLACE FUNCTION public.detect_anomalies(
    p_user_id uuid,
    p_entity_type text,
    p_timeframe interval DEFAULT interval '7 days'
)
RETURNS TABLE (
    anomaly_id uuid,
    anomaly_type text,
    severity text,
    details jsonb
) AS $$
DECLARE
    v_mean numeric;
    v_stddev numeric;
BEGIN
    -- Detect yield anomalies
    IF p_entity_type = 'yield' THEN
        -- Calculate statistics
        SELECT 
            avg(actual_yield / area_planted),
            stddev(actual_yield / area_planted)
        INTO v_mean, v_stddev
        FROM public.yield_tracking
        WHERE user_id = p_user_id
        AND harvest_date >= CURRENT_DATE - p_timeframe;

        -- Detect anomalies
        INSERT INTO public.anomaly_detection (
            user_id,
            entity_type,
            entity_id,
            anomaly_type,
            severity,
            anomaly_data
        )
        SELECT
            user_id,
            'yield',
            id,
            'yield_deviation',
            CASE
                WHEN (actual_yield / area_planted) < (v_mean - 2 * v_stddev) THEN 'high'
                WHEN (actual_yield / area_planted) < (v_mean - v_stddev) THEN 'medium'
                ELSE 'low'
            END,
            jsonb_build_object(
                'expected_yield', v_mean * area_planted,
                'actual_yield', actual_yield,
                'deviation_percentage', 
                round(((actual_yield / area_planted - v_mean) / v_mean * 100)::numeric, 2)
            )
        FROM public.yield_tracking
        WHERE user_id = p_user_id
        AND harvest_date >= CURRENT_DATE - p_timeframe
        AND actual_yield / area_planted < (v_mean - v_stddev);
    END IF;

    -- Return detected anomalies
    RETURN QUERY
    SELECT 
        ad.id,
        ad.anomaly_type,
        ad.severity,
        ad.anomaly_data
    FROM public.anomaly_detection ad
    WHERE ad.user_id = p_user_id
    AND ad.entity_type = p_entity_type
    AND ad.detection_time >= CURRENT_DATE - p_timeframe
    AND NOT ad.is_resolved
    ORDER BY 
        CASE ad.severity
            WHEN 'high' THEN 1
            WHEN 'medium' THEN 2
            WHEN 'low' THEN 3
        END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to refresh analytics insights
CREATE OR REPLACE FUNCTION public.refresh_analytics_insights()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.farm_analytics_insights;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables
ALTER TABLE public.ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_detection ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view model predictions" ON public.model_predictions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their anomalies" ON public.anomaly_detection
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their anomalies" ON public.anomaly_detection
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS model_predictions_user_type_idx ON public.model_predictions(user_id, prediction_type);
CREATE INDEX IF NOT EXISTS anomaly_detection_user_type_status_idx ON public.anomaly_detection(user_id, entity_type, is_resolved);
