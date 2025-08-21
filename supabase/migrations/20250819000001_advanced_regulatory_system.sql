-- Advanced Regulatory Alerts and Supply Chain Intelligence System
-- This migration creates comprehensive tables for regulatory monitoring, behavioral analytics, and predictive intelligence

-- Regulatory alerts with advanced categorization and impact tracking
CREATE TABLE regulatory_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Alert identification
    alert_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    category alert_category NOT NULL,
    subcategory VARCHAR(100),
    severity alert_severity NOT NULL,
    urgency_level INTEGER DEFAULT 3, -- 1-5 scale
    
    -- Content and description
    description TEXT NOT NULL,
    detailed_impact TEXT,
    scientific_basis TEXT,
    regulatory_reference VARCHAR(255),
    legal_implications TEXT,
    
    -- Affected scope
    affected_products JSONB DEFAULT '[]',
    affected_regions JSONB DEFAULT '[]',
    affected_counties JSONB DEFAULT '[]',
    affected_value_chains JSONB DEFAULT '[]',
    estimated_affected_farmers INTEGER,
    economic_impact_estimate DECIMAL(15,2),
    
    -- Source and authority
    source_organization VARCHAR(255) NOT NULL,
    source_type source_type NOT NULL,
    authority_level authority_level NOT NULL,
    verification_status verification_status DEFAULT 'pending',
    credibility_score DECIMAL(3,1) DEFAULT 0.0,
    
    -- Author information
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(255),
    author_organization VARCHAR(255),
    author_credentials JSONB DEFAULT '{}',
    is_verified_author BOOLEAN DEFAULT false,
    
    -- Timeline and validity
    date_posted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effective_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    update_frequency update_frequency,
    
    -- Action requirements
    action_required action_required NOT NULL,
    compliance_deadline TIMESTAMP WITH TIME ZONE,
    grace_period_days INTEGER DEFAULT 0,
    penalty_for_non_compliance TEXT,
    
    -- Recommendations and alternatives
    recommended_actions JSONB DEFAULT '[]',
    alternative_solutions JSONB DEFAULT '[]',
    mitigation_strategies JSONB DEFAULT '[]',
    support_resources JSONB DEFAULT '[]',
    
    -- Attachments and evidence
    attachments JSONB DEFAULT '[]',
    supporting_documents JSONB DEFAULT '[]',
    evidence_links JSONB DEFAULT '[]',
    related_alerts JSONB DEFAULT '[]',
    
    -- Engagement metrics
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    
    -- Impact tracking
    implementation_rate DECIMAL(5,2) DEFAULT 0.0,
    compliance_rate DECIMAL(5,2) DEFAULT 0.0,
    effectiveness_score DECIMAL(3,1) DEFAULT 0.0,
    
    -- Status and workflow
    status alert_status DEFAULT 'active',
    workflow_stage INTEGER DEFAULT 1,
    review_status review_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', title || ' ' || description || ' ' || COALESCE(detailed_impact, ''))
    ) STORED
);

-- Behavioral metrics for supply chain participants
CREATE TABLE behavioral_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Subject identification
    player_id UUID NOT NULL REFERENCES auth.users(id),
    player_type player_type NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    organization_name VARCHAR(255),
    
    -- Reporter information
    reported_by UUID NOT NULL REFERENCES auth.users(id),
    reporter_role reporter_role NOT NULL,
    reporter_organization VARCHAR(255),
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    
    -- Core behavioral scores (0-10 scale)
    engagement_level DECIMAL(3,1) NOT NULL,
    compliance_rate DECIMAL(5,2) NOT NULL, -- percentage
    responsiveness DECIMAL(3,1) NOT NULL,
    collaboration_score DECIMAL(3,1) NOT NULL,
    innovation_adoption DECIMAL(3,1) NOT NULL,
    risk_tolerance DECIMAL(3,1) NOT NULL,
    
    -- Advanced behavioral indicators
    communication_effectiveness DECIMAL(3,1) DEFAULT 0.0,
    conflict_resolution_ability DECIMAL(3,1) DEFAULT 0.0,
    leadership_potential DECIMAL(3,1) DEFAULT 0.0,
    mentorship_capability DECIMAL(3,1) DEFAULT 0.0,
    adaptability_score DECIMAL(3,1) DEFAULT 0.0,
    sustainability_commitment DECIMAL(3,1) DEFAULT 0.0,
    
    -- Quantitative metrics
    transaction_frequency INTEGER DEFAULT 0,
    average_transaction_value DECIMAL(12,2) DEFAULT 0.0,
    payment_timeliness_score DECIMAL(3,1) DEFAULT 0.0,
    quality_consistency_score DECIMAL(3,1) DEFAULT 0.0,
    delivery_reliability_score DECIMAL(3,1) DEFAULT 0.0,
    
    -- Qualitative observations
    observations TEXT NOT NULL,
    strengths JSONB DEFAULT '[]',
    areas_for_improvement JSONB DEFAULT '[]',
    concerns JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    
    -- Intervention tracking
    interventions_suggested JSONB DEFAULT '[]',
    interventions_implemented JSONB DEFAULT '[]',
    intervention_effectiveness JSONB DEFAULT '{}',
    
    -- Follow-up planning
    next_review_date DATE NOT NULL,
    follow_up_actions JSONB DEFAULT '[]',
    monitoring_frequency monitoring_frequency DEFAULT 'monthly',
    
    -- Risk assessment
    churn_risk_score DECIMAL(3,1) DEFAULT 0.0,
    performance_trend performance_trend DEFAULT 'stable',
    risk_factors JSONB DEFAULT '[]',
    protective_factors JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure valid reporting period
    CHECK (reporting_period_end >= reporting_period_start),
    CHECK (next_review_date > reporting_period_end)
);

-- AI-powered churn predictions
CREATE TABLE churn_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Subject identification
    player_id UUID NOT NULL REFERENCES auth.users(id),
    player_name VARCHAR(255) NOT NULL,
    player_type player_type NOT NULL,
    organization_name VARCHAR(255),
    
    -- Prediction details
    risk_score DECIMAL(5,2) NOT NULL, -- 0-100 scale
    risk_level risk_level NOT NULL,
    confidence_level DECIMAL(5,2) NOT NULL, -- 0-100 scale
    
    -- Prediction timeline
    prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    predicted_churn_date TIMESTAMP WITH TIME ZONE,
    time_to_churn_days INTEGER,
    
    -- Key indicators and factors
    key_indicators JSONB NOT NULL DEFAULT '{}',
    contributing_factors JSONB DEFAULT '[]',
    warning_signals JSONB DEFAULT '[]',
    
    -- Historical patterns
    engagement_trend engagement_trend NOT NULL,
    transaction_trend transaction_trend NOT NULL,
    satisfaction_trend satisfaction_trend NOT NULL,
    
    -- Behavioral analysis
    behavioral_changes JSONB DEFAULT '[]',
    communication_patterns JSONB DEFAULT '{}',
    interaction_frequency_change DECIMAL(5,2) DEFAULT 0.0,
    
    -- Recommended interventions
    intervention_priority intervention_priority NOT NULL,
    recommended_actions JSONB DEFAULT '[]',
    intervention_timeline VARCHAR(255),
    estimated_retention_probability DECIMAL(5,2),
    
    -- Success factors
    retention_strategies JSONB DEFAULT '[]',
    success_indicators JSONB DEFAULT '[]',
    monitoring_checkpoints JSONB DEFAULT '[]',
    
    -- Model information
    model_version VARCHAR(50) NOT NULL,
    model_accuracy DECIMAL(5,2),
    feature_importance JSONB DEFAULT '{}',
    
    -- Outcome tracking
    intervention_implemented BOOLEAN DEFAULT false,
    intervention_date TIMESTAMP WITH TIME ZONE,
    actual_outcome churn_outcome,
    outcome_date TIMESTAMP WITH TIME ZONE,
    prediction_accuracy DECIMAL(5,2),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Supply chain optimization opportunities
CREATE TABLE supply_chain_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Optimization details
    title VARCHAR(500) NOT NULL,
    type optimization_type NOT NULL,
    category VARCHAR(100),
    description TEXT NOT NULL,
    
    -- Scope and impact
    affected_players JSONB DEFAULT '[]',
    affected_regions JSONB DEFAULT '[]',
    value_chain_segments JSONB DEFAULT '[]',
    
    -- Financial projections
    potential_savings DECIMAL(15,2) NOT NULL,
    implementation_cost DECIMAL(15,2) DEFAULT 0.0,
    roi_percentage DECIMAL(5,2) NOT NULL,
    payback_period_months INTEGER,
    
    -- Implementation details
    implementation_effort implementation_effort NOT NULL,
    complexity_level INTEGER DEFAULT 3, -- 1-5 scale
    required_resources JSONB DEFAULT '[]',
    prerequisites JSONB DEFAULT '[]',
    
    -- Timeline
    estimated_timeline VARCHAR(255) NOT NULL,
    implementation_phases JSONB DEFAULT '[]',
    key_milestones JSONB DEFAULT '[]',
    
    -- Risk assessment
    implementation_risks JSONB DEFAULT '[]',
    risk_mitigation_strategies JSONB DEFAULT '[]',
    success_probability DECIMAL(5,2) DEFAULT 50.0,
    
    -- Status tracking
    status optimization_status DEFAULT 'identified',
    priority_score INTEGER DEFAULT 5, -- 1-10 scale
    approval_status approval_status DEFAULT 'pending',
    
    -- Stakeholder involvement
    key_stakeholders JSONB DEFAULT '[]',
    champion_assigned UUID REFERENCES auth.users(id),
    implementation_team JSONB DEFAULT '[]',
    
    -- Progress tracking
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    completed_phases JSONB DEFAULT '[]',
    current_phase VARCHAR(255),
    next_milestone_date DATE,
    
    -- Results measurement
    success_metrics JSONB DEFAULT '[]',
    actual_savings DECIMAL(15,2) DEFAULT 0.0,
    actual_roi DECIMAL(5,2),
    lessons_learned TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Relationship health monitoring
CREATE TABLE relationship_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relationship identification
    partner_1_id UUID NOT NULL REFERENCES auth.users(id),
    partner_2_id UUID NOT NULL REFERENCES auth.users(id),
    partner_1_name VARCHAR(255) NOT NULL,
    partner_2_name VARCHAR(255) NOT NULL,
    relationship_type relationship_type NOT NULL,
    
    -- Health scoring
    overall_health_score DECIMAL(5,2) NOT NULL, -- 0-100 scale
    health_trend health_trend NOT NULL,
    previous_score DECIMAL(5,2),
    score_change DECIMAL(5,2) DEFAULT 0.0,
    
    -- Key metrics
    transaction_volume DECIMAL(15,2) DEFAULT 0.0,
    transaction_frequency INTEGER DEFAULT 0,
    payment_timeliness DECIMAL(5,2) DEFAULT 0.0,
    quality_compliance DECIMAL(5,2) DEFAULT 0.0,
    communication_frequency DECIMAL(5,2) DEFAULT 0.0,
    dispute_frequency INTEGER DEFAULT 0,
    
    -- Relationship dynamics
    trust_level DECIMAL(3,1) DEFAULT 0.0,
    satisfaction_level DECIMAL(3,1) DEFAULT 0.0,
    collaboration_effectiveness DECIMAL(3,1) DEFAULT 0.0,
    mutual_benefit_score DECIMAL(3,1) DEFAULT 0.0,
    
    -- Risk and strength factors
    risk_factors JSONB DEFAULT '[]',
    strength_factors JSONB DEFAULT '[]',
    warning_indicators JSONB DEFAULT '[]',
    positive_indicators JSONB DEFAULT '[]',
    
    -- Recommendations
    improvement_recommendations JSONB DEFAULT '[]',
    intervention_suggestions JSONB DEFAULT '[]',
    relationship_goals JSONB DEFAULT '[]',
    
    -- Historical context
    relationship_start_date DATE,
    relationship_duration_days INTEGER,
    major_milestones JSONB DEFAULT '[]',
    significant_events JSONB DEFAULT '[]',
    
    -- Assessment details
    last_assessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assessment_method assessment_method NOT NULL,
    assessor_id UUID REFERENCES auth.users(id),
    assessment_notes TEXT,
    
    -- Future planning
    next_assessment_date DATE,
    monitoring_frequency monitoring_frequency DEFAULT 'monthly',
    action_plan JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure partners are different
    CHECK (partner_1_id != partner_2_id),
    -- Ensure unique relationship pairs (bidirectional)
    UNIQUE (LEAST(partner_1_id, partner_2_id), GREATEST(partner_1_id, partner_2_id))
);

-- Alert engagement tracking
CREATE TABLE alert_engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES regulatory_alerts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Engagement details
    engagement_type engagement_type NOT NULL,
    engagement_data JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(alert_id, user_id, engagement_type)
);

-- Create comprehensive enums
CREATE TYPE alert_category AS ENUM (
    'pesticide_ban', 'contamination', 'recall', 'safety_warning', 
    'regulation_change', 'market_rejection', 'certification_update',
    'trade_restriction', 'quality_standard', 'environmental_concern',
    'health_advisory', 'technology_alert', 'policy_change'
);

CREATE TYPE alert_severity AS ENUM (
    'critical', 'high', 'medium', 'low', 'informational'
);

CREATE TYPE source_type AS ENUM (
    'government', 'regulatory_body', 'industry_association', 'research_institution',
    'international_organization', 'certification_body', 'community_report'
);

CREATE TYPE authority_level AS ENUM (
    'national', 'regional', 'county', 'local', 'international', 'industry'
);

CREATE TYPE verification_status AS ENUM (
    'pending', 'verified', 'disputed', 'false', 'partially_verified'
);

CREATE TYPE update_frequency AS ENUM (
    'one_time', 'daily', 'weekly', 'monthly', 'as_needed'
);

CREATE TYPE action_required AS ENUM (
    'immediate_action', 'action_within_days', 'action_within_weeks',
    'monitoring_required', 'informational_only', 'prepare_for_change'
);

CREATE TYPE alert_status AS ENUM (
    'active', 'resolved', 'under_investigation', 'expired', 'superseded'
);

CREATE TYPE review_status AS ENUM (
    'pending', 'approved', 'rejected', 'needs_revision'
);

CREATE TYPE player_type AS ENUM (
    'farmer', 'agro_dealer', 'transporter', 'processor', 'cooperative',
    'buyer', 'supplier', 'service_provider', 'financial_institution'
);

CREATE TYPE reporter_role AS ENUM (
    'extension_officer', 'field_agent', 'cooperative_leader', 'peer_farmer',
    'supervisor', 'quality_controller', 'relationship_manager'
);

CREATE TYPE monitoring_frequency AS ENUM (
    'weekly', 'bi_weekly', 'monthly', 'quarterly', 'semi_annually', 'annually'
);

CREATE TYPE performance_trend AS ENUM (
    'improving', 'stable', 'declining', 'volatile'
);

CREATE TYPE risk_level AS ENUM (
    'low', 'medium', 'high', 'critical'
);

CREATE TYPE engagement_trend AS ENUM (
    'increasing', 'stable', 'declining', 'volatile'
);

CREATE TYPE transaction_trend AS ENUM (
    'increasing', 'stable', 'declining', 'seasonal'
);

CREATE TYPE satisfaction_trend AS ENUM (
    'improving', 'stable', 'declining', 'unknown'
);

CREATE TYPE intervention_priority AS ENUM (
    'immediate', 'high', 'medium', 'low', 'monitor_only'
);

CREATE TYPE churn_outcome AS ENUM (
    'retained', 'churned', 'partially_churned', 'unknown'
);

CREATE TYPE optimization_type AS ENUM (
    'aggregation', 'route_optimization', 'inventory_balance', 'quality_improvement',
    'cost_reduction', 'process_automation', 'technology_adoption', 'partnership_formation'
);

CREATE TYPE implementation_effort AS ENUM (
    'low', 'medium', 'high', 'very_high'
);

CREATE TYPE optimization_status AS ENUM (
    'identified', 'proposed', 'approved', 'in_progress', 'completed', 'cancelled'
);

CREATE TYPE approval_status AS ENUM (
    'pending', 'approved', 'rejected', 'conditional_approval'
);

CREATE TYPE relationship_type AS ENUM (
    'buyer_seller', 'cooperative_member', 'supplier_dealer', 'farmer_processor',
    'service_provider_client', 'financial_institution_borrower', 'mentor_mentee'
);

CREATE TYPE health_trend AS ENUM (
    'improving', 'stable', 'declining', 'volatile'
);

CREATE TYPE assessment_method AS ENUM (
    'automated_analysis', 'manual_review', 'survey_based', 'interview_based', 'mixed_method'
);

CREATE TYPE engagement_type AS ENUM (
    'view', 'like', 'share', 'comment', 'bookmark', 'report', 'implement'
);

-- Create comprehensive indexes
CREATE INDEX idx_regulatory_alerts_category ON regulatory_alerts (category);
CREATE INDEX idx_regulatory_alerts_severity ON regulatory_alerts (severity);
CREATE INDEX idx_regulatory_alerts_status ON regulatory_alerts (status);
CREATE INDEX idx_regulatory_alerts_date ON regulatory_alerts (date_posted DESC);
CREATE INDEX idx_regulatory_alerts_region ON regulatory_alerts USING GIN (affected_regions);
CREATE INDEX idx_regulatory_alerts_products ON regulatory_alerts USING GIN (affected_products);
CREATE INDEX idx_regulatory_alerts_search ON regulatory_alerts USING GIN (search_vector);

CREATE INDEX idx_behavioral_metrics_player ON behavioral_metrics (player_id);
CREATE INDEX idx_behavioral_metrics_type ON behavioral_metrics (player_type);
CREATE INDEX idx_behavioral_metrics_reporter ON behavioral_metrics (reported_by);
CREATE INDEX idx_behavioral_metrics_period ON behavioral_metrics (reporting_period_start, reporting_period_end);
CREATE INDEX idx_behavioral_metrics_risk ON behavioral_metrics (churn_risk_score DESC);

CREATE INDEX idx_churn_predictions_player ON churn_predictions (player_id);
CREATE INDEX idx_churn_predictions_risk ON churn_predictions (risk_level, risk_score DESC);
CREATE INDEX idx_churn_predictions_date ON churn_predictions (predicted_churn_date);
CREATE INDEX idx_churn_predictions_priority ON churn_predictions (intervention_priority);

CREATE INDEX idx_optimizations_type ON supply_chain_optimizations (type);
CREATE INDEX idx_optimizations_status ON supply_chain_optimizations (status);
CREATE INDEX idx_optimizations_roi ON supply_chain_optimizations (roi_percentage DESC);
CREATE INDEX idx_optimizations_priority ON supply_chain_optimizations (priority_score DESC);

CREATE INDEX idx_relationship_health_partners ON relationship_health (partner_1_id, partner_2_id);
CREATE INDEX idx_relationship_health_type ON relationship_health (relationship_type);
CREATE INDEX idx_relationship_health_score ON relationship_health (overall_health_score DESC);
CREATE INDEX idx_relationship_health_trend ON relationship_health (health_trend);

CREATE INDEX idx_alert_engagements_alert ON alert_engagements (alert_id);
CREATE INDEX idx_alert_engagements_user ON alert_engagements (user_id);
CREATE INDEX idx_alert_engagements_type ON alert_engagements (engagement_type);

-- Create triggers for updated_at
CREATE TRIGGER update_regulatory_alerts_updated_at BEFORE UPDATE ON regulatory_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_behavioral_metrics_updated_at BEFORE UPDATE ON behavioral_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_churn_predictions_updated_at BEFORE UPDATE ON churn_predictions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_optimizations_updated_at BEFORE UPDATE ON supply_chain_optimizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationship_health_updated_at BEFORE UPDATE ON relationship_health
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE regulatory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE churn_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_engagements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Regulatory alerts are viewable by everyone" ON regulatory_alerts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create alerts" ON regulatory_alerts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own behavioral metrics" ON behavioral_metrics
    FOR SELECT USING (auth.uid() = player_id OR auth.uid() = reported_by);

CREATE POLICY "Authorized users can create behavioral metrics" ON behavioral_metrics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create materialized views for analytics
CREATE MATERIALIZED VIEW alert_analytics AS
SELECT 
    category,
    severity,
    COUNT(*) as alert_count,
    AVG(views_count) as avg_views,
    AVG(implementation_rate) as avg_implementation,
    DATE_TRUNC('month', date_posted) as month
FROM regulatory_alerts
WHERE status = 'active'
GROUP BY category, severity, DATE_TRUNC('month', date_posted);

CREATE MATERIALIZED VIEW churn_risk_summary AS
SELECT 
    player_type,
    risk_level,
    COUNT(*) as player_count,
    AVG(risk_score) as avg_risk_score,
    COUNT(CASE WHEN intervention_implemented THEN 1 END) as interventions_count
FROM churn_predictions
WHERE prediction_date >= NOW() - INTERVAL '30 days'
GROUP BY player_type, risk_level;

-- Create refresh functions for materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW alert_analytics;
    REFRESH MATERIALIZED VIEW churn_risk_summary;
END;
$$ LANGUAGE plpgsql;
