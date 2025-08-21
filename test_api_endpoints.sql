-- Test API Endpoints Script
-- This script creates minimal tables to test the repository functionality

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create auth schema and users table (simplified)
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic cooperatives table for testing
CREATE TABLE IF NOT EXISTS cooperatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    location JSONB DEFAULT '{}',
    member_count INTEGER DEFAULT 0,
    max_members INTEGER,
    established TEXT,
    registration JSONB DEFAULT '{}',
    leadership JSONB DEFAULT '{}',
    activities TEXT[] DEFAULT '{}',
    requirements JSONB DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    contact_info JSONB DEFAULT '{}',
    performance JSONB DEFAULT '{}',
    is_recruiting BOOLEAN DEFAULT false,
    organic_certified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cooperative memberships table
CREATE TABLE IF NOT EXISTS cooperative_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooperative_id UUID REFERENCES cooperatives(id),
    member_id UUID REFERENCES auth.users(id),
    member_name VARCHAR(255),
    member_type TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'ACTIVE',
    contributions_paid DECIMAL(10,2) DEFAULT 0,
    shares_owned INTEGER DEFAULT 0,
    role TEXT DEFAULT 'MEMBER',
    performance_score DECIMAL(3,1) DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group formations table
CREATE TABLE IF NOT EXISTS group_formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiator_id UUID REFERENCES auth.users(id),
    initiator_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_members INTEGER,
    current_members INTEGER DEFAULT 0,
    location VARCHAR(255),
    focus TEXT[] DEFAULT '{}',
    requirements TEXT,
    status TEXT DEFAULT 'FORMING',
    interested_members TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create regulatory alerts table
CREATE TABLE IF NOT EXISTS regulatory_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT,
    affected_products TEXT[] DEFAULT '{}',
    affected_regions TEXT[] DEFAULT '{}',
    source VARCHAR(255),
    date_posted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    author JSONB DEFAULT '{}',
    attachments JSONB,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    action_required TEXT,
    alternative_recommendations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create behavioral metrics table
CREATE TABLE IF NOT EXISTS behavioral_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    player_type TEXT NOT NULL,
    reported_by VARCHAR(255),
    reporter_role TEXT,
    metrics JSONB DEFAULT '{}',
    observations TEXT,
    concerns TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    report_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_follow_up TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create churn predictions table
CREATE TABLE IF NOT EXISTS churn_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    player_name VARCHAR(255),
    player_type TEXT NOT NULL,
    risk_score DECIMAL(5,2),
    risk_level TEXT,
    key_indicators JSONB DEFAULT '{}',
    predicted_churn_date TIMESTAMP WITH TIME ZONE,
    recommended_actions TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supply chain optimizations table
CREATE TABLE IF NOT EXISTS supply_chain_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    potential_savings DECIMAL(15,2),
    implementation_effort TEXT,
    affected_players TEXT[] DEFAULT '{}',
    timeline VARCHAR(255),
    status TEXT DEFAULT 'IDENTIFIED',
    roi DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationship health table
CREATE TABLE IF NOT EXISTS relationship_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id_1 VARCHAR(255) NOT NULL,
    partner_id_2 VARCHAR(255) NOT NULL,
    partner_names TEXT[] DEFAULT '{}',
    relationship_type TEXT,
    health_score DECIMAL(5,2),
    health_trend TEXT,
    key_metrics JSONB DEFAULT '{}',
    risk_factors TEXT[] DEFAULT '{}',
    strength_factors TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    last_assessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alert engagements table
CREATE TABLE IF NOT EXISTS alert_engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES regulatory_alerts(id),
    user_id UUID REFERENCES auth.users(id),
    engagement_type TEXT NOT NULL,
    engagement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test data
INSERT INTO auth.users (id, email) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com'),
    ('550e8400-e29b-41d4-a716-446655440001', 'farmer@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert test cooperatives
INSERT INTO cooperatives (id, name, type, description, location, member_count, max_members, established, is_recruiting, organic_certified) VALUES 
    ('660e8400-e29b-41d4-a716-446655440000', 'Meru Organic Farmers Cooperative', 'FARMING', 'Certified organic farming cooperative', '{"county": "Meru", "coordinates": {"latitude": -0.0236, "longitude": 37.6556}}', 245, 300, '2018', true, true),
    ('660e8400-e29b-41d4-a716-446655440001', 'Nakuru Dairy Farmers Cooperative', 'FARMING', 'Leading dairy cooperative', '{"county": "Nakuru", "coordinates": {"latitude": -0.3031, "longitude": 36.0800}}', 180, 250, '2015', true, false)
ON CONFLICT (id) DO NOTHING;

-- Insert test regulatory alerts
INSERT INTO regulatory_alerts (id, title, category, severity, description, affected_regions, source, views, likes, comments) VALUES 
    ('770e8400-e29b-41d4-a716-446655440000', 'URGENT: Paraquat Herbicide Banned', 'PESTICIDE_BAN', 'CRITICAL', 'Immediate ban on Paraquat-based herbicides', ARRAY['All Counties'], 'KEBS', 2847, 156, 89),
    ('770e8400-e29b-41d4-a716-446655440001', 'Aflatoxin Contamination Alert', 'CONTAMINATION', 'HIGH', 'High aflatoxin levels detected in maize', ARRAY['Busia County'], 'KEBS', 1923, 78, 45)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cooperatives_type ON cooperatives(type);
CREATE INDEX IF NOT EXISTS idx_cooperatives_location ON cooperatives USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_regulatory_alerts_category ON regulatory_alerts(category);
CREATE INDEX IF NOT EXISTS idx_behavioral_metrics_player ON behavioral_metrics(player_id, player_type);

COMMENT ON TABLE cooperatives IS 'Test table for cooperative data';
COMMENT ON TABLE regulatory_alerts IS 'Test table for regulatory alerts';
