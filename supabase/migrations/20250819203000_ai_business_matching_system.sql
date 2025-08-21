-- AI Business Matching Platform Migration
-- Creates comprehensive business matching system with AI algorithms, profiles, ratings, and flagging

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Business Profiles Table
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL CHECK (business_type IN (
        'farmer', 'buyer', 'processor', 'distributor', 'retailer', 
        'logistics_provider', 'input_supplier', 'cooperative', 'exporter'
    )),
    industry_sector VARCHAR(100) NOT NULL,
    business_size VARCHAR(50) NOT NULL CHECK (business_size IN (
        'micro', 'small', 'medium', 'large', 'enterprise'
    )),
    
    -- Location and Contact
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    coordinates POINT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Business Details
    description TEXT,
    established_year INTEGER,
    annual_revenue_range VARCHAR(50),
    employee_count_range VARCHAR(50),
    certifications TEXT[], -- Array of certification names
    languages_supported TEXT[],
    
    -- Capabilities and Preferences
    commodities_handled TEXT[], -- What they deal with
    services_offered TEXT[], -- Services they provide
    target_markets TEXT[], -- Geographic markets they serve
    preferred_deal_size_min DECIMAL(15,2),
    preferred_deal_size_max DECIMAL(15,2),
    payment_terms_accepted TEXT[],
    quality_standards TEXT[],
    
    -- AI Matching Attributes
    matching_keywords TEXT[], -- Keywords for matching
    business_goals TEXT[], -- What they want to achieve
    partnership_preferences TEXT[], -- Types of partnerships sought
    seasonal_patterns JSONB, -- When they're most active
    capacity_utilization DECIMAL(5,2) DEFAULT 0, -- Current capacity usage %
    
    -- Profile Status
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN (
        'pending', 'verified', 'premium_verified', 'rejected'
    )),
    profile_completeness DECIMAL(5,2) DEFAULT 0, -- Percentage complete
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Matching Algorithm Scores
CREATE TABLE business_matching_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_a_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    profile_b_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    
    -- Matching Score Components (0-100 each)
    commodity_compatibility_score DECIMAL(5,2) DEFAULT 0,
    geographic_proximity_score DECIMAL(5,2) DEFAULT 0,
    business_size_compatibility_score DECIMAL(5,2) DEFAULT 0,
    quality_standards_alignment_score DECIMAL(5,2) DEFAULT 0,
    payment_terms_compatibility_score DECIMAL(5,2) DEFAULT 0,
    capacity_complementarity_score DECIMAL(5,2) DEFAULT 0,
    seasonal_alignment_score DECIMAL(5,2) DEFAULT 0,
    historical_success_score DECIMAL(5,2) DEFAULT 0,
    
    -- Overall Scores
    overall_compatibility_score DECIMAL(5,2) DEFAULT 0,
    ai_confidence_score DECIMAL(5,2) DEFAULT 0,
    
    -- Matching Metadata
    match_reason TEXT, -- AI explanation of why they match
    potential_synergies TEXT[],
    risk_factors TEXT[],
    recommended_partnership_types TEXT[],
    
    -- Status
    is_mutual_interest BOOLEAN DEFAULT false,
    match_status VARCHAR(50) DEFAULT 'suggested' CHECK (match_status IN (
        'suggested', 'viewed', 'interested', 'contacted', 'negotiating', 
        'partnered', 'declined', 'expired'
    )),
    
    -- Timestamps
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    last_interaction_at TIMESTAMP WITH TIME ZONE
);

-- Business Interactions and Communications
CREATE TABLE business_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiator_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    recipient_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    matching_score_id UUID REFERENCES business_matching_scores(id),
    
    -- Interaction Details
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN (
        'profile_view', 'interest_expressed', 'message_sent', 'meeting_requested',
        'proposal_sent', 'contract_shared', 'partnership_formed', 'feedback_given'
    )),
    message TEXT,
    attachments JSONB, -- File references
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'acknowledged', 'responded', 'accepted', 'declined', 'expired'
    )),
    is_read BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Business Ratings and Reviews
CREATE TABLE business_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rater_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    rated_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    interaction_id UUID REFERENCES business_interactions(id),
    
    -- Rating Categories (1-5 scale)
    overall_rating DECIMAL(3,2) NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    communication_rating DECIMAL(3,2) CHECK (communication_rating >= 1 AND communication_rating <= 5),
    reliability_rating DECIMAL(3,2) CHECK (reliability_rating >= 1 AND reliability_rating <= 5),
    quality_rating DECIMAL(3,2) CHECK (quality_rating >= 1 AND quality_rating <= 5),
    timeliness_rating DECIMAL(3,2) CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    professionalism_rating DECIMAL(3,2) CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    
    -- Review Details
    review_title VARCHAR(255),
    review_text TEXT,
    partnership_duration VARCHAR(50), -- How long they worked together
    deal_value_range VARCHAR(50), -- Size of deals conducted
    would_recommend BOOLEAN,
    
    -- Status
    is_verified BOOLEAN DEFAULT false, -- Verified actual business relationship
    is_featured BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate ratings for same interaction
    UNIQUE(rater_profile_id, rated_profile_id, interaction_id)
);

-- Business Flags and Reports
CREATE TABLE business_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flagger_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    flagged_profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    
    -- Flag Details
    flag_type VARCHAR(50) NOT NULL CHECK (flag_type IN (
        'spam', 'fraud', 'inappropriate_content', 'fake_profile', 
        'harassment', 'breach_of_contract', 'poor_business_practices',
        'misleading_information', 'other'
    )),
    flag_reason TEXT NOT NULL,
    evidence_urls TEXT[], -- Links to supporting evidence
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'under_review', 'resolved', 'dismissed', 'escalated'
    )),
    moderator_notes TEXT,
    resolution_action VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Prevent duplicate flags
    UNIQUE(flagger_profile_id, flagged_profile_id, flag_type)
);

-- AI Matching Algorithm Configuration
CREATE TABLE matching_algorithm_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    algorithm_version VARCHAR(20) NOT NULL,
    
    -- Scoring Weights (must sum to 100)
    commodity_weight DECIMAL(5,2) DEFAULT 25.0,
    geographic_weight DECIMAL(5,2) DEFAULT 20.0,
    business_size_weight DECIMAL(5,2) DEFAULT 15.0,
    quality_standards_weight DECIMAL(5,2) DEFAULT 15.0,
    payment_terms_weight DECIMAL(5,2) DEFAULT 10.0,
    capacity_weight DECIMAL(5,2) DEFAULT 10.0,
    seasonal_weight DECIMAL(5,2) DEFAULT 5.0,
    
    -- Algorithm Parameters
    min_match_threshold DECIMAL(5,2) DEFAULT 60.0, -- Minimum score to suggest match
    max_distance_km INTEGER DEFAULT 1000, -- Maximum distance for geographic matching
    max_matches_per_profile INTEGER DEFAULT 50, -- Max suggestions per profile
    refresh_interval_hours INTEGER DEFAULT 24, -- How often to recalculate
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Profile Analytics
CREATE TABLE business_profile_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Engagement Metrics
    profile_views INTEGER DEFAULT 0,
    unique_viewers INTEGER DEFAULT 0,
    interests_received INTEGER DEFAULT 0,
    interests_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    
    -- Matching Metrics
    new_matches_suggested INTEGER DEFAULT 0,
    matches_viewed INTEGER DEFAULT 0,
    matches_contacted INTEGER DEFAULT 0,
    successful_partnerships INTEGER DEFAULT 0,
    
    -- Rating Metrics
    new_ratings_received INTEGER DEFAULT 0,
    average_rating_received DECIMAL(3,2),
    ratings_given INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint for daily analytics
    UNIQUE(profile_id, date)
);

-- Create indexes for performance
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_business_profiles_business_type ON business_profiles(business_type);
CREATE INDEX idx_business_profiles_location ON business_profiles USING GIST(coordinates);
CREATE INDEX idx_business_profiles_commodities ON business_profiles USING GIN(commodities_handled);
CREATE INDEX idx_business_profiles_keywords ON business_profiles USING GIN(matching_keywords);
CREATE INDEX idx_business_profiles_verification ON business_profiles(verification_status, is_active);

CREATE INDEX idx_matching_scores_profile_a ON business_matching_scores(profile_a_id);
CREATE INDEX idx_matching_scores_profile_b ON business_matching_scores(profile_b_id);
CREATE INDEX idx_matching_scores_overall ON business_matching_scores(overall_compatibility_score DESC);
CREATE INDEX idx_matching_scores_status ON business_matching_scores(match_status);
CREATE INDEX idx_matching_scores_expires ON business_matching_scores(expires_at);

CREATE INDEX idx_interactions_initiator ON business_interactions(initiator_profile_id);
CREATE INDEX idx_interactions_recipient ON business_interactions(recipient_profile_id);
CREATE INDEX idx_interactions_type ON business_interactions(interaction_type);
CREATE INDEX idx_interactions_status ON business_interactions(status);

CREATE INDEX idx_ratings_rated_profile ON business_ratings(rated_profile_id);
CREATE INDEX idx_ratings_overall ON business_ratings(overall_rating DESC);
CREATE INDEX idx_ratings_created ON business_ratings(created_at DESC);

CREATE INDEX idx_flags_flagged_profile ON business_flags(flagged_profile_id);
CREATE INDEX idx_flags_status ON business_flags(status);
CREATE INDEX idx_flags_severity ON business_flags(severity);

-- Row Level Security (RLS) Policies
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_matching_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profile_analytics ENABLE ROW LEVEL SECURITY;

-- Business Profiles RLS
CREATE POLICY "Users can view all active business profiles" ON business_profiles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own business profile" ON business_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Matching Scores RLS
CREATE POLICY "Users can view their own matching scores" ON business_matching_scores
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM business_profiles WHERE id = profile_a_id AND user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM business_profiles WHERE id = profile_b_id AND user_id = auth.uid())
    );

-- Interactions RLS
CREATE POLICY "Users can view their own interactions" ON business_interactions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM business_profiles WHERE id = initiator_profile_id AND user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM business_profiles WHERE id = recipient_profile_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can create interactions from their profile" ON business_interactions
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM business_profiles WHERE id = initiator_profile_id AND user_id = auth.uid())
    );

-- Ratings RLS
CREATE POLICY "Users can view ratings for any profile" ON business_ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can create ratings from their profile" ON business_ratings
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM business_profiles WHERE id = rater_profile_id AND user_id = auth.uid())
    );

-- Flags RLS
CREATE POLICY "Users can create flags from their profile" ON business_flags
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM business_profiles WHERE id = flagger_profile_id AND user_id = auth.uid())
    );

-- Analytics RLS
CREATE POLICY "Users can view their own analytics" ON business_profile_analytics
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM business_profiles WHERE id = profile_id AND user_id = auth.uid())
    );

-- Functions and Triggers

-- Update profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
    completeness DECIMAL(5,2) := 0;
    total_fields INTEGER := 20;
    filled_fields INTEGER := 0;
BEGIN
    -- Count filled fields
    IF NEW.business_name IS NOT NULL AND NEW.business_name != '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.business_type IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.industry_sector IS NOT NULL AND NEW.industry_sector != '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.business_size IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.country IS NOT NULL AND NEW.country != '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.description IS NOT NULL AND NEW.description != '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.email IS NOT NULL AND NEW.email != '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.established_year IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.annual_revenue_range IS NOT NULL AND NEW.annual_revenue_range != '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.employee_count_range IS NOT NULL AND NEW.employee_count_range != '' THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.certifications IS NOT NULL AND array_length(NEW.certifications, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.commodities_handled IS NOT NULL AND array_length(NEW.commodities_handled, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.services_offered IS NOT NULL AND array_length(NEW.services_offered, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.target_markets IS NOT NULL AND array_length(NEW.target_markets, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.preferred_deal_size_min IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.preferred_deal_size_max IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.payment_terms_accepted IS NOT NULL AND array_length(NEW.payment_terms_accepted, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.quality_standards IS NOT NULL AND array_length(NEW.quality_standards, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.business_goals IS NOT NULL AND array_length(NEW.business_goals, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;

    -- Calculate percentage
    completeness := (filled_fields::DECIMAL / total_fields::DECIMAL) * 100;
    NEW.profile_completeness := completeness;
    NEW.updated_at := NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_profile_completeness
    BEFORE INSERT OR UPDATE ON business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION calculate_profile_completeness();

-- Update business profile analytics
CREATE OR REPLACE FUNCTION update_profile_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics based on interaction type
    IF TG_OP = 'INSERT' THEN
        INSERT INTO business_profile_analytics (profile_id, date, profile_views, interests_received, messages_received)
        VALUES (
            NEW.recipient_profile_id, 
            CURRENT_DATE,
            CASE WHEN NEW.interaction_type = 'profile_view' THEN 1 ELSE 0 END,
            CASE WHEN NEW.interaction_type = 'interest_expressed' THEN 1 ELSE 0 END,
            CASE WHEN NEW.interaction_type = 'message_sent' THEN 1 ELSE 0 END
        )
        ON CONFLICT (profile_id, date) DO UPDATE SET
            profile_views = business_profile_analytics.profile_views + EXCLUDED.profile_views,
            interests_received = business_profile_analytics.interests_received + EXCLUDED.interests_received,
            messages_received = business_profile_analytics.messages_received + EXCLUDED.messages_received;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_analytics
    AFTER INSERT ON business_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_analytics();

-- Insert default algorithm configuration
INSERT INTO matching_algorithm_config (algorithm_version) VALUES ('1.0');

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
