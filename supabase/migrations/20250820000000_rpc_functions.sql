-- RPC Functions for Advanced Cooperative and Regulatory Operations
-- This migration creates all the RPC functions referenced in the Kotlin repositories

-- Function to search cooperatives within a radius using PostGIS
CREATE OR REPLACE FUNCTION cooperatives_within_radius(
    lat FLOAT,
    lng FLOAT,
    radius_km FLOAT DEFAULT 50,
    result_limit INT DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    type cooperative_type,
    description TEXT,
    location JSONB,
    member_count INT,
    max_members INT,
    established TEXT,
    is_recruiting BOOLEAN,
    organic_certified BOOLEAN,
    distance_km FLOAT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.type,
        c.description,
        c.location,
        c.member_count,
        c.max_members,
        c.established,
        c.is_recruiting,
        c.organic_certified,
        ST_Distance(
            ST_GeogFromText('POINT(' || lng || ' ' || lat || ')'),
            ST_GeogFromText('POINT(' || (c.location->>'coordinates'->>'longitude')::FLOAT || ' ' || (c.location->>'coordinates'->>'latitude')::FLOAT || ')')
        ) / 1000 AS distance_km
    FROM cooperatives c
    WHERE ST_DWithin(
        ST_GeogFromText('POINT(' || lng || ' ' || lat || ')'),
        ST_GeogFromText('POINT(' || (c.location->>'coordinates'->>'longitude')::FLOAT || ' ' || (c.location->>'coordinates'->>'latitude')::FLOAT || ')'),
        radius_km * 1000
    )
    ORDER BY distance_km
    LIMIT result_limit;
END;
$$;

-- Function to find nearby cooperatives with enhanced filtering
CREATE OR REPLACE FUNCTION find_nearby_cooperatives(
    user_lat FLOAT,
    user_lng FLOAT,
    max_distance_km FLOAT DEFAULT 25,
    result_limit INT DEFAULT 10,
    coop_type cooperative_type DEFAULT NULL,
    min_rating FLOAT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    type cooperative_type,
    description TEXT,
    location JSONB,
    member_count INT,
    is_recruiting BOOLEAN,
    organic_certified BOOLEAN,
    performance JSONB,
    distance_km FLOAT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.type,
        c.description,
        c.location,
        c.member_count,
        c.is_recruiting,
        c.organic_certified,
        c.performance,
        ST_Distance(
            ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
            ST_GeogFromText('POINT(' || (c.location->>'coordinates'->>'longitude')::FLOAT || ' ' || (c.location->>'coordinates'->>'latitude')::FLOAT || ')')
        ) / 1000 AS distance_km
    FROM cooperatives c
    WHERE ST_DWithin(
        ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
        ST_GeogFromText('POINT(' || (c.location->>'coordinates'->>'longitude')::FLOAT || ' ' || (c.location->>'coordinates'->>'latitude')::FLOAT || ')'),
        max_distance_km * 1000
    )
    AND (coop_type IS NULL OR c.type = coop_type)
    AND (min_rating IS NULL OR (c.performance->>'rating')::FLOAT >= min_rating)
    ORDER BY distance_km
    LIMIT result_limit;
END;
$$;

-- Function to calculate cooperative performance metrics
CREATE OR REPLACE FUNCTION calculate_cooperative_performance(
    cooperative_id UUID
)
RETURNS TABLE (
    member_satisfaction FLOAT,
    financial_health FLOAT,
    governance_score FLOAT,
    overall_score FLOAT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    total_members INT;
    active_members INT;
    total_income DECIMAL;
    total_expenses DECIMAL;
    meeting_count INT;
    expected_meetings INT := 12; -- Monthly meetings expected
BEGIN
    -- Calculate member satisfaction (active members / total members)
    SELECT COUNT(*) INTO total_members 
    FROM cooperative_memberships 
    WHERE cooperative_id = calculate_cooperative_performance.cooperative_id;
    
    SELECT COUNT(*) INTO active_members 
    FROM cooperative_memberships 
    WHERE cooperative_id = calculate_cooperative_performance.cooperative_id 
    AND status = 'ACTIVE';
    
    -- Calculate financial health
    SELECT 
        COALESCE(SUM(CASE WHEN transaction_type = 'INCOME' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'EXPENSE' THEN amount ELSE 0 END), 0)
    INTO total_income, total_expenses
    FROM cooperative_transactions 
    WHERE cooperative_id = calculate_cooperative_performance.cooperative_id
    AND transaction_date >= CURRENT_DATE - INTERVAL '1 year';
    
    -- Calculate governance score (meeting frequency)
    SELECT COUNT(*) INTO meeting_count
    FROM cooperative_meetings 
    WHERE cooperative_id = calculate_cooperative_performance.cooperative_id
    AND meeting_date >= CURRENT_DATE - INTERVAL '1 year';
    
    RETURN QUERY
    SELECT 
        CASE WHEN total_members > 0 THEN (active_members::FLOAT / total_members::FLOAT) * 100 ELSE 0 END,
        CASE WHEN total_income > 0 THEN LEAST(((total_income - total_expenses) / total_income) * 100, 100) ELSE 0 END,
        LEAST((meeting_count::FLOAT / expected_meetings::FLOAT) * 100, 100),
        -- Overall score is weighted average
        CASE WHEN total_members > 0 THEN
            ((active_members::FLOAT / total_members::FLOAT) * 100 * 0.4) +
            (CASE WHEN total_income > 0 THEN LEAST(((total_income - total_expenses) / total_income) * 100, 100) ELSE 0 END * 0.4) +
            (LEAST((meeting_count::FLOAT / expected_meetings::FLOAT) * 100, 100) * 0.2)
        ELSE 0 END;
END;
$$;

-- Function to analyze churn risk for players
CREATE OR REPLACE FUNCTION analyze_player_churn_risk(
    player_type_filter player_type DEFAULT NULL,
    risk_threshold FLOAT DEFAULT 50.0
)
RETURNS TABLE (
    player_id TEXT,
    player_type player_type,
    risk_score FLOAT,
    risk_level risk_level,
    last_activity DATE,
    engagement_score FLOAT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bm.player_id,
        bm.player_type,
        -- Calculate risk score based on behavioral metrics
        CASE 
            WHEN (bm.metrics->>'engagement_level')::FLOAT < 3 THEN 80.0
            WHEN (bm.metrics->>'engagement_level')::FLOAT < 5 THEN 60.0
            WHEN (bm.metrics->>'engagement_level')::FLOAT < 7 THEN 40.0
            ELSE 20.0
        END +
        CASE 
            WHEN (bm.metrics->>'compliance_rate')::FLOAT < 60 THEN 20.0
            WHEN (bm.metrics->>'compliance_rate')::FLOAT < 80 THEN 10.0
            ELSE 0.0
        END AS calculated_risk_score,
        CASE 
            WHEN (
                CASE 
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 3 THEN 80.0
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 5 THEN 60.0
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 7 THEN 40.0
                    ELSE 20.0
                END +
                CASE 
                    WHEN (bm.metrics->>'compliance_rate')::FLOAT < 60 THEN 20.0
                    WHEN (bm.metrics->>'compliance_rate')::FLOAT < 80 THEN 10.0
                    ELSE 0.0
                END
            ) >= 80 THEN 'CRITICAL'::risk_level
            WHEN (
                CASE 
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 3 THEN 80.0
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 5 THEN 60.0
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 7 THEN 40.0
                    ELSE 20.0
                END +
                CASE 
                    WHEN (bm.metrics->>'compliance_rate')::FLOAT < 60 THEN 20.0
                    WHEN (bm.metrics->>'compliance_rate')::FLOAT < 80 THEN 10.0
                    ELSE 0.0
                END
            ) >= 60 THEN 'HIGH'::risk_level
            WHEN (
                CASE 
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 3 THEN 80.0
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 5 THEN 60.0
                    WHEN (bm.metrics->>'engagement_level')::FLOAT < 7 THEN 40.0
                    ELSE 20.0
                END +
                CASE 
                    WHEN (bm.metrics->>'compliance_rate')::FLOAT < 60 THEN 20.0
                    WHEN (bm.metrics->>'compliance_rate')::FLOAT < 80 THEN 10.0
                    ELSE 0.0
                END
            ) >= 40 THEN 'MEDIUM'::risk_level
            ELSE 'LOW'::risk_level
        END,
        bm.report_date::DATE,
        (bm.metrics->>'engagement_level')::FLOAT
    FROM behavioral_metrics bm
    WHERE (player_type_filter IS NULL OR bm.player_type = player_type_filter)
    AND bm.report_date >= CURRENT_DATE - INTERVAL '90 days'
    ORDER BY calculated_risk_score DESC;
END;
$$;

-- Function to calculate relationship health between partners
CREATE OR REPLACE FUNCTION calculate_relationship_health(
    partner_1_id TEXT,
    partner_2_id TEXT
)
RETURNS TABLE (
    health_score FLOAT,
    transaction_volume DECIMAL,
    payment_timeliness FLOAT,
    quality_compliance FLOAT,
    communication_frequency INT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    tx_count INT;
    on_time_payments INT;
    total_volume DECIMAL;
    quality_issues INT;
    comm_count INT;
BEGIN
    -- Get transaction metrics
    SELECT 
        COUNT(*),
        SUM(amount),
        COUNT(CASE WHEN payment_delay_days <= 7 THEN 1 END),
        COUNT(CASE WHEN quality_issues IS NOT NULL AND jsonb_array_length(quality_issues) > 0 THEN 1 END)
    INTO tx_count, total_volume, on_time_payments, quality_issues
    FROM cooperative_transactions
    WHERE (from_partner = partner_1_id AND to_partner = partner_2_id)
       OR (from_partner = partner_2_id AND to_partner = partner_1_id)
    AND transaction_date >= CURRENT_DATE - INTERVAL '1 year';
    
    -- Get communication frequency (placeholder - would need interaction tracking)
    comm_count := tx_count; -- Simplified assumption
    
    RETURN QUERY
    SELECT 
        -- Health score calculation
        CASE 
            WHEN tx_count = 0 THEN 0.0
            ELSE (
                (CASE WHEN tx_count > 0 THEN LEAST(tx_count * 10.0, 100.0) ELSE 0.0 END * 0.3) +
                (CASE WHEN tx_count > 0 THEN (on_time_payments::FLOAT / tx_count::FLOAT) * 100 ELSE 0.0 END * 0.3) +
                (CASE WHEN tx_count > 0 THEN ((tx_count - quality_issues)::FLOAT / tx_count::FLOAT) * 100 ELSE 100.0 END * 0.2) +
                (LEAST(comm_count * 5.0, 100.0) * 0.2)
            )
        END,
        COALESCE(total_volume, 0),
        CASE WHEN tx_count > 0 THEN (on_time_payments::FLOAT / tx_count::FLOAT) * 100 ELSE 0.0 END,
        CASE WHEN tx_count > 0 THEN ((tx_count - quality_issues)::FLOAT / tx_count::FLOAT) * 100 ELSE 100.0 END,
        comm_count;
END;
$$;

-- Function to identify supply chain optimization opportunities
CREATE OR REPLACE FUNCTION identify_optimization_opportunities(
    optimization_type optimization_type DEFAULT NULL,
    min_roi FLOAT DEFAULT 15.0,
    result_limit INT DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    type optimization_type,
    title TEXT,
    description TEXT,
    potential_savings DECIMAL,
    roi FLOAT,
    affected_players TEXT[],
    timeline TEXT,
    status optimization_status
) 
LANGUAGE plpgsql
AS $$
BEGIN
    -- This is a simplified version - in practice would analyze actual data patterns
    RETURN QUERY
    SELECT 
        gen_random_uuid(),
        'AGGREGATION'::optimization_type,
        'Bulk Input Purchasing Opportunity',
        'Aggregate demand from multiple cooperatives for volume discounts',
        50000.00::DECIMAL,
        25.5::FLOAT,
        ARRAY['coop1', 'coop2', 'coop3']::TEXT[],
        '6-8 weeks',
        'IDENTIFIED'::optimization_status
    WHERE optimization_type IS NULL OR optimization_type = 'AGGREGATION'
    
    UNION ALL
    
    SELECT 
        gen_random_uuid(),
        'ROUTE_OPTIMIZATION'::optimization_type,
        'Collection Route Optimization',
        'Optimize collection routes to reduce fuel costs',
        15000.00::DECIMAL,
        35.2::FLOAT,
        ARRAY['coop1', 'transporter1']::TEXT[],
        '2-3 weeks',
        'PROPOSED'::optimization_status
    WHERE optimization_type IS NULL OR optimization_type = 'ROUTE_OPTIMIZATION'
    
    LIMIT result_limit;
END;
$$;

-- Function to get alert engagement statistics
CREATE OR REPLACE FUNCTION get_alert_engagement_stats(
    alert_id UUID
)
RETURNS TABLE (
    total_views BIGINT,
    total_likes BIGINT,
    total_shares BIGINT,
    total_comments BIGINT,
    engagement_rate FLOAT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    views_count BIGINT;
    likes_count BIGINT;
    shares_count BIGINT;
    comments_count BIGINT;
BEGIN
    SELECT 
        COUNT(CASE WHEN engagement_type = 'view' THEN 1 END),
        COUNT(CASE WHEN engagement_type = 'like' THEN 1 END),
        COUNT(CASE WHEN engagement_type = 'share' THEN 1 END),
        COUNT(CASE WHEN engagement_type = 'comment' THEN 1 END)
    INTO views_count, likes_count, shares_count, comments_count
    FROM alert_engagements
    WHERE alert_id = get_alert_engagement_stats.alert_id;
    
    RETURN QUERY
    SELECT 
        views_count,
        likes_count,
        shares_count,
        comments_count,
        CASE 
            WHEN views_count > 0 THEN ((likes_count + shares_count + comments_count)::FLOAT / views_count::FLOAT) * 100
            ELSE 0.0
        END;
END;
$$;

-- Function to update cooperative performance scores
CREATE OR REPLACE FUNCTION update_cooperative_performance_scores()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    coop_record RECORD;
    perf_metrics RECORD;
BEGIN
    FOR coop_record IN SELECT id FROM cooperatives LOOP
        SELECT * INTO perf_metrics 
        FROM calculate_cooperative_performance(coop_record.id);
        
        INSERT INTO cooperative_performance (
            cooperative_id,
            member_satisfaction,
            financial_health,
            governance_score,
            overall_score,
            last_calculated
        ) VALUES (
            coop_record.id,
            perf_metrics.member_satisfaction,
            perf_metrics.financial_health,
            perf_metrics.governance_score,
            perf_metrics.overall_score,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (cooperative_id) 
        DO UPDATE SET
            member_satisfaction = EXCLUDED.member_satisfaction,
            financial_health = EXCLUDED.financial_health,
            governance_score = EXCLUDED.governance_score,
            overall_score = EXCLUDED.overall_score,
            last_calculated = EXCLUDED.last_calculated;
    END LOOP;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cooperatives_location_gist ON cooperatives USING GIST (ST_GeogFromText('POINT(' || (location->>'coordinates'->>'longitude') || ' ' || (location->>'coordinates'->>'latitude') || ')'));
CREATE INDEX IF NOT EXISTS idx_cooperative_transactions_partners ON cooperative_transactions (from_partner, to_partner);
CREATE INDEX IF NOT EXISTS idx_behavioral_metrics_player ON behavioral_metrics (player_id, player_type);
CREATE INDEX IF NOT EXISTS idx_alert_engagements_alert_type ON alert_engagements (alert_id, engagement_type);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cooperatives_within_radius TO authenticated;
GRANT EXECUTE ON FUNCTION find_nearby_cooperatives TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_cooperative_performance TO authenticated;
GRANT EXECUTE ON FUNCTION analyze_player_churn_risk TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_relationship_health TO authenticated;
GRANT EXECUTE ON FUNCTION identify_optimization_opportunities TO authenticated;
GRANT EXECUTE ON FUNCTION get_alert_engagement_stats TO authenticated;
GRANT EXECUTE ON FUNCTION update_cooperative_performance_scores TO authenticated;
