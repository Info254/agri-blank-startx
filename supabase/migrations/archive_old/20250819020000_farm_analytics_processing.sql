-- Real-time analytics processing functions

-- Function to calculate real-time yield projections
CREATE OR REPLACE FUNCTION public.calculate_yield_projection(
    p_user_id uuid,
    p_crop_type text,
    p_area numeric
)
RETURNS TABLE (
    projected_yield numeric,
    confidence_level numeric,
    factors_affecting jsonb
) AS $$
DECLARE
    v_historical_yield numeric;
    v_weather_factor numeric;
    v_soil_factor numeric;
    v_pest_factor numeric;
BEGIN
    -- Get historical yield average
    SELECT AVG(actual_yield / area_planted)
    INTO v_historical_yield
    FROM public.yield_tracking
    WHERE user_id = p_user_id 
    AND crop_type = p_crop_type
    AND harvest_date IS NOT NULL;

    -- Calculate weather impact factor
    SELECT 
        CASE
            WHEN AVG(metric_value) BETWEEN 20 AND 30 THEN 1.1 -- optimal temperature
            WHEN AVG(metric_value) BETWEEN 15 AND 35 THEN 1.0 -- acceptable temperature
            ELSE 0.9 -- suboptimal temperature
        END
    INTO v_weather_factor
    FROM public.farm_analytics
    WHERE user_id = p_user_id
    AND metric_name = 'temperature'
    AND date >= CURRENT_DATE - interval '30 days';

    -- Calculate soil health factor
    SELECT 
        CASE
            WHEN AVG(metric_value) BETWEEN 6.0 AND 7.0 THEN 1.1 -- optimal pH
            WHEN AVG(metric_value) BETWEEN 5.5 AND 7.5 THEN 1.0 -- acceptable pH
            ELSE 0.9 -- suboptimal pH
        END
    INTO v_soil_factor
    FROM public.farm_analytics
    WHERE user_id = p_user_id
    AND metric_name = 'ph_level'
    AND date >= CURRENT_DATE - interval '30 days';

    -- Calculate pest pressure factor
    SELECT 
        CASE
            WHEN COUNT(*) = 0 THEN 1.1 -- no pest issues
            WHEN COUNT(*) <= 3 THEN 1.0 -- manageable pest issues
            ELSE 0.9 -- significant pest issues
        END
    INTO v_pest_factor
    FROM public.resource_usage
    WHERE user_id = p_user_id
    AND resource_type = 'pesticide'
    AND usage_date >= CURRENT_DATE - interval '30 days';

    -- Calculate projected yield
    RETURN QUERY
    SELECT
        ROUND((v_historical_yield * p_area * v_weather_factor * v_soil_factor * v_pest_factor)::numeric, 2),
        ROUND(((v_weather_factor + v_soil_factor + v_pest_factor) / 3 * 100)::numeric, 2),
        jsonb_build_object(
            'weather_factor', v_weather_factor,
            'soil_factor', v_soil_factor,
            'pest_factor', v_pest_factor,
            'historical_yield', v_historical_yield
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate real-time resource efficiency
CREATE OR REPLACE FUNCTION public.calculate_resource_efficiency(
    p_user_id uuid,
    p_resource_type text,
    p_start_date date,
    p_end_date date
)
RETURNS TABLE (
    resource_type text,
    total_usage numeric,
    total_cost numeric,
    usage_per_hectare numeric,
    cost_per_hectare numeric,
    efficiency_score numeric,
    recommendations jsonb
) AS $$
DECLARE
    v_total_area numeric;
    v_benchmark_usage numeric;
    v_benchmark_cost numeric;
BEGIN
    -- Get total farm area
    SELECT total_area
    INTO v_total_area
    FROM public.farm_statistics
    WHERE user_id = p_user_id;

    -- Get benchmark data (simplified - should be replaced with actual benchmarks)
    SELECT 
        CASE p_resource_type
            WHEN 'water' THEN 5000 -- liters per hectare
            WHEN 'fertilizer' THEN 250 -- kg per hectare
            WHEN 'pesticide' THEN 10 -- liters per hectare
            WHEN 'labor' THEN 40 -- hours per hectare
            ELSE 100
        END,
        CASE p_resource_type
            WHEN 'water' THEN 5000 -- cost per hectare
            WHEN 'fertilizer' THEN 15000
            WHEN 'pesticide' THEN 8000
            WHEN 'labor' THEN 12000
            ELSE 10000
        END
    INTO v_benchmark_usage, v_benchmark_cost;

    RETURN QUERY
    WITH resource_stats AS (
        SELECT
            ru.resource_type,
            SUM(ru.quantity) as total_usage,
            SUM(ru.quantity * ru.cost_per_unit) as total_cost
        FROM public.resource_usage ru
        WHERE ru.user_id = p_user_id
        AND ru.resource_type = p_resource_type
        AND ru.usage_date BETWEEN p_start_date AND p_end_date
        GROUP BY ru.resource_type
    )
    SELECT
        rs.resource_type,
        ROUND(rs.total_usage::numeric, 2),
        ROUND(rs.total_cost::numeric, 2),
        ROUND((rs.total_usage / v_total_area)::numeric, 2),
        ROUND((rs.total_cost / v_total_area)::numeric, 2),
        ROUND(((v_benchmark_usage / (rs.total_usage / v_total_area)) * 100)::numeric, 2),
        jsonb_build_object(
            'benchmark_usage_per_ha', v_benchmark_usage,
            'benchmark_cost_per_ha', v_benchmark_cost,
            'potential_savings', GREATEST(0, rs.total_cost - (v_benchmark_cost * v_total_area)),
            'recommendations', 
            CASE 
                WHEN (rs.total_usage / v_total_area) > v_benchmark_usage * 1.2 
                THEN jsonb_build_array(
                    'Consider implementing precision application techniques',
                    'Review application schedules',
                    'Check for leaks or waste in the system'
                )
                WHEN (rs.total_usage / v_total_area) < v_benchmark_usage * 0.8
                THEN jsonb_build_array(
                    'Verify if current usage is sufficient for optimal yield',
                    'Consider soil testing to confirm nutrient levels',
                    'Review application coverage'
                )
                ELSE jsonb_build_array(
                    'Current usage is within optimal range',
                    'Continue monitoring for efficiency opportunities',
                    'Document successful practices'
                )
            END
        )
    FROM resource_stats rs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate ROI and financial projections
CREATE OR REPLACE FUNCTION public.calculate_financial_projections(
    p_user_id uuid,
    p_fiscal_year integer
)
RETURNS TABLE (
    category text,
    projected_revenue numeric,
    projected_costs numeric,
    projected_roi numeric,
    confidence_level numeric,
    projections_detail jsonb
) AS $$
DECLARE
    v_historical_revenue numeric;
    v_historical_costs numeric;
    v_market_growth_factor numeric;
    v_weather_risk_factor numeric;
    v_price_volatility_factor numeric;
BEGIN
    -- Get historical averages
    SELECT 
        AVG(amount),
        STDDEV(amount)
    INTO v_historical_revenue, v_price_volatility_factor
    FROM public.revenue_tracking
    WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - interval '1 year';

    SELECT AVG(actual_amount)
    INTO v_historical_costs
    FROM public.farm_budget
    WHERE user_id = p_user_id
    AND fiscal_year = EXTRACT(YEAR FROM CURRENT_DATE);

    -- Calculate market growth factor based on recent trends
    SELECT 
        CASE
            WHEN trend > 0.05 THEN 1.1
            WHEN trend > 0 THEN 1.05
            WHEN trend > -0.05 THEN 0.95
            ELSE 0.9
        END
    INTO v_market_growth_factor
    FROM (
        SELECT 
            (LAST_VALUE(amount) OVER w - FIRST_VALUE(amount) OVER w) / 
            NULLIF(FIRST_VALUE(amount) OVER w, 0) as trend
        FROM public.revenue_tracking
        WHERE user_id = p_user_id
        AND date >= CURRENT_DATE - interval '6 months'
        WINDOW w AS (ORDER BY date)
        LIMIT 1
    ) trends;

    -- Calculate weather risk factor
    SELECT 
        CASE
            WHEN COUNT(*) = 0 THEN 1.0
            WHEN COUNT(*) <= 2 THEN 0.95
            ELSE 0.9
        END
    INTO v_weather_risk_factor
    FROM public.farm_analytics
    WHERE user_id = p_user_id
    AND metric_name IN ('temperature', 'rainfall')
    AND metric_value NOT BETWEEN 
        CASE metric_name
            WHEN 'temperature' THEN 15
            WHEN 'rainfall' THEN 10
        END 
        AND
        CASE metric_name
            WHEN 'temperature' THEN 35
            WHEN 'rainfall' THEN 100
        END
    AND date >= CURRENT_DATE - interval '30 days';

    RETURN QUERY
    SELECT
        'Overall'::text as category,
        ROUND((v_historical_revenue * v_market_growth_factor * v_weather_risk_factor)::numeric, 2) as projected_revenue,
        ROUND((v_historical_costs * (2 - v_weather_risk_factor))::numeric, 2) as projected_costs,
        ROUND(((v_historical_revenue * v_market_growth_factor * v_weather_risk_factor - 
               v_historical_costs * (2 - v_weather_risk_factor)) / 
              (v_historical_costs * (2 - v_weather_risk_factor)) * 100)::numeric, 2) as projected_roi,
        ROUND((v_weather_risk_factor * v_market_growth_factor * 100)::numeric, 2) as confidence_level,
        jsonb_build_object(
            'market_growth_factor', v_market_growth_factor,
            'weather_risk_factor', v_weather_risk_factor,
            'price_volatility', v_price_volatility_factor,
            'historical_revenue', v_historical_revenue,
            'historical_costs', v_historical_costs,
            'risk_factors', jsonb_build_object(
                'market_volatility', (1 - v_market_growth_factor),
                'weather_risk', (1 - v_weather_risk_factor),
                'price_volatility', COALESCE(v_price_volatility_factor / NULLIF(v_historical_revenue, 0), 0)
            ),
            'recommendations', 
            CASE 
                WHEN v_weather_risk_factor < 0.95 THEN 
                    jsonb_build_array(
                        'Consider weather risk mitigation strategies',
                        'Review crop insurance options',
                        'Implement protective measures'
                    )
                WHEN v_market_growth_factor < 1 THEN
                    jsonb_build_array(
                        'Explore market diversification',
                        'Consider value-added products',
                        'Review pricing strategy'
                    )
                ELSE
                    jsonb_build_array(
                        'Maintain current strategies',
                        'Monitor market conditions',
                        'Prepare for expansion opportunities'
                    )
            END
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to automatically refresh analytics
CREATE OR REPLACE FUNCTION public.refresh_farm_analytics()
RETURNS trigger AS $$
BEGIN
    -- Refresh materialized views
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.monthly_farm_statistics;
    
    -- Notify clients of updates
    PERFORM pg_notify(
        'farm_analytics_update',
        json_build_object(
            'user_id', NEW.user_id,
            'metric', NEW.metric_name,
            'value', NEW.metric_value,
            'timestamp', CURRENT_TIMESTAMP
        )::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for real-time analytics updates
CREATE TRIGGER farm_analytics_refresh
    AFTER INSERT OR UPDATE ON public.farm_analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.refresh_farm_analytics();

-- Create function to calculate and store daily analytics summaries
CREATE OR REPLACE FUNCTION public.calculate_daily_analytics_summary()
RETURNS void AS $$
BEGIN
    INSERT INTO public.farm_analytics_summary (
        user_id,
        summary_date,
        metrics_summary,
        alerts_generated
    )
    SELECT
        fa.user_id,
        DATE_TRUNC('day', fa.date),
        jsonb_build_object(
            'temperature_avg', AVG(CASE WHEN metric_name = 'temperature' THEN metric_value END),
            'soil_moisture_avg', AVG(CASE WHEN metric_name = 'soil_moisture' THEN metric_value END),
            'rainfall_total', SUM(CASE WHEN metric_name = 'rainfall' THEN metric_value END),
            'metrics_count', COUNT(*)
        ),
        jsonb_agg(
            DISTINCT jsonb_build_object(
                'metric', metric_name,
                'alert_level',
                CASE
                    WHEN metric_name = 'temperature' AND metric_value > 35 THEN 'high'
                    WHEN metric_name = 'soil_moisture' AND metric_value < 20 THEN 'low'
                    WHEN metric_name = 'rainfall' AND metric_value > 50 THEN 'high'
                    ELSE 'normal'
                END
            )
        )
    FROM public.farm_analytics fa
    WHERE fa.date >= CURRENT_DATE - interval '1 day'
    GROUP BY fa.user_id, DATE_TRUNC('day', fa.date)
    ON CONFLICT (user_id, summary_date)
    DO UPDATE SET
        metrics_summary = EXCLUDED.metrics_summary,
        alerts_generated = EXCLUDED.alerts_generated,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
