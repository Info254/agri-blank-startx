-- Create the partitioned table with correct primary key
DROP TABLE IF EXISTS public.farm_yields_partitioned CASCADE;

CREATE TABLE public.farm_yields_partitioned (
    id UUID DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    planting_date DATE NOT NULL,
    yield_amount DECIMAL(10,2) NOT NULL,
    area_size DECIMAL(10,2) NOT NULL,
    weather_conditions JSONB,
    soil_conditions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, planting_date)
) PARTITION BY RANGE (planting_date);

-- Create partitions
CREATE TABLE farm_yields_2024 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE farm_yields_2025 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE farm_yields_2026 PARTITION OF farm_yields_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- Create indexes on the partitioned table
CREATE INDEX ON farm_yields_partitioned (farm_id, planting_date);
CREATE INDEX ON farm_yields_partitioned (crop_type, planting_date);

-- Add materialized views for performance optimization
CREATE MATERIALIZED VIEW farm_yield_analytics AS
WITH recursive dates AS (
    SELECT min(planting_date)::date AS date
    FROM farm_yields_partitioned
    UNION ALL
    SELECT (date + interval '1 day')::date
    FROM dates
    WHERE date < current_date
),
daily_yields as (
    select 
        d.date,
        f.farm_id,
        f.crop_type,
        f.expected_yield,
        f.actual_yield,
        avg(f.actual_yield) over (
            partition by f.farm_id, f.crop_type
            order by d.date
            rows between 30 preceding and current row
        ) as moving_avg_yield,
        first_value(f.actual_yield) over (
            partition by f.farm_id, f.crop_type
            order by d.date desc
        ) - first_value(f.actual_yield) over (
            partition by f.farm_id, f.crop_type
            order by d.date
        ) as yield_trend
    from dates d
    left join farm_yields f on d.date = f.planting_date
)
select * from daily_yields;

-- Add table partitioning for large datasets
create table farm_yields_partitioned (
    like farm_yields including all
) partition by range (planting_date);

create table farm_yields_y2024 partition of farm_yields_partitioned
    for values from ('2024-01-01') to ('2025-01-01');
create table farm_yields_y2025 partition of farm_yields_partitioned
    for values from ('2025-01-01') to ('2026-01-01');
create table farm_yields_y2026 partition of farm_yields_partitioned
    for values from ('2026-01-01') to ('2027-01-01');

-- Add advanced triggers for data quality and ML predictions
create extension if not exists plpython3u;

CREATE OR REPLACE FUNCTION public.validate_and_predict_yield(
    p_crop_type VARCHAR,
    p_area_size DECIMAL,
    p_weather_conditions JSONB,
    p_soil_conditions JSONB
) RETURNS DECIMAL AS $$
import json
from datetime import datetime

def validate_input(crop, area, weather, soil):
    if not crop or area <= 0:
        return None
    if not isinstance(weather, dict) or not isinstance(soil, dict):
        return None
    return True

def predict_yield(crop, area, weather, soil):
    # Basic yield prediction logic
    base_yield = {
        'maize': 7.5,
        'wheat': 4.2,
        'rice': 6.0
    }.get(crop.lower(), 5.0)
    
    # Apply weather impact
    weather_factor = 1.0
    if weather.get('rainfall', 0) > 100:
        weather_factor *= 1.2
    elif weather.get('rainfall', 0) < 30:
        weather_factor *= 0.8
        
    # Apply soil impact
    soil_factor = 1.0
    if soil.get('ph', 7) > 6.5 and soil.get('ph', 7) < 7.5:
        soil_factor *= 1.1
        
    return round(base_yield * area * weather_factor * soil_factor, 2)

data = get_historical_data()
if data is not None:
    X, y = data
    model = RandomForestRegressor(n_estimators=100)
    model.fit(X, y)
    
    # Get current weather data
    weather = plpy.execute("""
        select temperature, rainfall, soil_moisture
        from weather_impact
        where farm_id = $1
        and date = $2
    """, [TD["new"]["farm_id"], TD["new"]["planting_date"]])[0]
    
    prediction = model.predict([[
        weather["temperature"],
        weather["rainfall"],
        weather["soil_moisture"]
    ]])[0]
    
    # Update expected yield with ML prediction
    TD["new"]["expected_yield"] = prediction

# Validate data quality
if TD["new"]["expected_yield"] <= 0:
    plpy.error("Expected yield must be positive")
if TD["new"]["actual_yield"] is not None and TD["new"]["actual_yield"] < 0:
    plpy.error("Actual yield cannot be negative")

return "MODIFY"
$$ language plpython3u;

create trigger farm_yields_ml_prediction
    before insert or update on farm_yields
    for each row
    execute function validate_and_predict_yield();

-- Add change data capture
create table farm_yields_audit (
    operation char(1),
    stamp timestamp,
    userid text,
    farm_yield_id uuid,
    old_data jsonb,
    new_data jsonb
);

create or replace function audit_farm_yields()
returns trigger as $$
begin
    insert into farm_yields_audit (
        operation,
        stamp,
        userid,
        farm_yield_id,
        old_data,
        new_data
    )
    select
        case
            when TG_OP = 'INSERT' then 'I'
            when TG_OP = 'UPDATE' then 'U'
            else 'D'
        end,
        now(),
        auth.uid(),
        case
            when TG_OP = 'DELETE' then old.id
            else new.id
        end,
        case
            when TG_OP = 'DELETE' then row_to_json(old)::jsonb
            when TG_OP = 'UPDATE' then row_to_json(old)::jsonb
            else null
        end,
        case
            when TG_OP = 'DELETE' then null
            else row_to_json(new)::jsonb
        end;
    return null;
end;
$$ language plpgsql security definer;

create trigger farm_yields_audit_trigger
    after insert or update or delete on farm_yields
    for each row execute function audit_farm_yields();

-- Add hypertable for time-series optimization
create extension if not exists timescaledb;

DROP TABLE IF EXISTS public.weather_impact CASCADE;

-- Create the weather_impact hypertable
CREATE TABLE public.weather_impact (
    measurement_time TIMESTAMPTZ NOT NULL,
    location_id UUID NOT NULL,
    temperature DECIMAL(5,2),
    rainfall DECIMAL(5,2),
    humidity DECIMAL(5,2),
    wind_speed DECIMAL(5,2),
    crop_health_index DECIMAL(5,2)
);

-- Convert to hypertable
SELECT create_hypertable('weather_impact', 'measurement_time', if_not_exists => TRUE);

-- Add advanced analytics functions
create or replace function calculate_crop_performance_metrics(
    farm_id_param uuid,
    start_date date,
    end_date date
)
returns table (
    crop_type text,
    total_yield numeric,
    yield_per_hectare numeric,
    efficiency_score numeric,
    roi numeric,
    weather_impact_score numeric,
    predicted_next_yield numeric,
    confidence_interval numeric,
    sustainability_score numeric
) as $$
declare
    weather_weight numeric := 0.3;
    resource_weight numeric := 0.3;
    yield_weight numeric := 0.4;
begin
    return query
    with yield_metrics as (
        select
            fy.crop_type,
            sum(fy.actual_yield) as total_yield,
            avg(fy.actual_yield) as avg_yield,
            stddev(fy.actual_yield) as yield_stddev,
            sum(fy.actual_yield) / nullif(count(*), 0) as yield_per_hectare,
            corr(fy.actual_yield, wi.temperature) as temp_correlation,
            corr(fy.actual_yield, wi.rainfall) as rain_correlation,
            avg(ru.efficiency_score) as avg_efficiency
        from farm_yields fy
        join weather_impact wi on 
            wi.farm_id = fy.farm_id 
            and wi.date = fy.planting_date
        join resource_usage ru on
            ru.farm_id = fy.farm_id
            and ru.usage_date = fy.planting_date
        where fy.farm_id = farm_id_param
        and fy.planting_date between start_date and end_date
        group by fy.crop_type
    ),
    predictions as (
        select
            ym.crop_type,
            ym.avg_yield + (
                ym.temp_correlation * (
                    select avg(temperature) - avg(lag(temperature)) over ()
                    from weather_impact
                    where farm_id = farm_id_param
                    and date between start_date and end_date
                )
            ) + (
                ym.rain_correlation * (
                    select avg(rainfall) - avg(lag(rainfall)) over ()
                    from weather_impact
                    where farm_id = farm_id_param
                    and date between start_date and end_date
                )
            ) as predicted_yield,
            ym.yield_stddev * 1.96 as confidence_95
        from yield_metrics ym
    )
    select
        ym.crop_type,
        ym.total_yield,
        ym.yield_per_hectare,
        ym.avg_efficiency,
        (
            select avg((actual_amount - planned_amount) / nullif(planned_amount, 0) * 100)
            from farm_budget
            where farm_id = farm_id_param
            and date between start_date and end_date
        ) as roi,
        (
            weather_weight * (
                select avg(impact_score)
                from weather_impact
                where farm_id = farm_id_param
                and date between start_date and end_date
            ) +
            resource_weight * ym.avg_efficiency +
            yield_weight * (ym.avg_yield / nullif(max(ym.avg_yield) over (), 0) * 100)
        ) as weather_impact_score,
        p.predicted_yield,
        p.confidence_95,
        (
            select avg(
                case
                    when ru.resource_type = 'water' then
                        (1 - ru.quantity / nullif(max(ru.quantity) over (), 0)) * 100
                    when ru.resource_type = 'fertilizer' then
                        (1 - ru.quantity / nullif(max(ru.quantity) over (), 0)) * 100
                    else 0
                end
            )
            from resource_usage ru
            where ru.farm_id = farm_id_param
            and ru.usage_date between start_date and end_date
        ) as sustainability_score
    from yield_metrics ym
    join predictions p on p.crop_type = ym.crop_type;
end;
$$ language plpgsql;
