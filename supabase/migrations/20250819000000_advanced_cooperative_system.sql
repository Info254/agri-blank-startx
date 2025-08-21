-- Advanced Cooperative Management System
-- This migration creates comprehensive tables for cooperative registration, management, and analytics

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Cooperative registration and management
CREATE TABLE cooperatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    type cooperative_type NOT NULL,
    description TEXT,
    mission_statement TEXT,
    vision_statement TEXT,
    
    -- Location data with GIS support
    county VARCHAR(100) NOT NULL,
    subcounty VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    physical_address TEXT,
    postal_address VARCHAR(255),
    coordinates POINT,
    service_radius_km INTEGER DEFAULT 50,
    
    -- Registration details
    registration_date DATE NOT NULL,
    certificate_number VARCHAR(100) UNIQUE,
    registration_status registration_status DEFAULT 'pending',
    renewal_date DATE,
    compliance_score DECIMAL(3,1) DEFAULT 0.0,
    
    -- Leadership structure
    leadership JSONB NOT NULL DEFAULT '{}',
    board_members JSONB DEFAULT '[]',
    management_team JSONB DEFAULT '[]',
    
    -- Financial information
    share_capital DECIMAL(15,2) DEFAULT 0.00,
    minimum_share_value DECIMAL(10,2) NOT NULL,
    joining_fee DECIMAL(10,2) NOT NULL,
    monthly_contribution DECIMAL(10,2) DEFAULT 0.00,
    annual_turnover DECIMAL(15,2) DEFAULT 0.00,
    
    -- Membership details
    current_members INTEGER DEFAULT 0,
    maximum_members INTEGER,
    target_members INTEGER,
    member_retention_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Operational data
    activities JSONB DEFAULT '[]',
    services_offered JSONB DEFAULT '[]',
    commodities_handled JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    
    -- Performance metrics
    performance_score DECIMAL(3,1) DEFAULT 0.0,
    member_satisfaction_score DECIMAL(3,1) DEFAULT 0.0,
    financial_health_score DECIMAL(3,1) DEFAULT 0.0,
    governance_score DECIMAL(3,1) DEFAULT 0.0,
    
    -- Contact and digital presence
    primary_phone VARCHAR(20),
    secondary_phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    social_media JSONB DEFAULT '{}',
    
    -- Operational status
    is_active BOOLEAN DEFAULT true,
    is_recruiting BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verification_level verification_level DEFAULT 'unverified',
    last_audit_date DATE,
    next_audit_date DATE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Member management with comprehensive tracking
CREATE TABLE cooperative_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Membership details
    membership_number VARCHAR(50) UNIQUE NOT NULL,
    member_type member_type NOT NULL,
    membership_status membership_status DEFAULT 'active',
    join_date DATE NOT NULL,
    probation_end_date DATE,
    termination_date DATE,
    termination_reason TEXT,
    
    -- Financial tracking
    shares_owned INTEGER DEFAULT 0,
    share_value DECIMAL(10,2) DEFAULT 0.00,
    total_contributions DECIMAL(12,2) DEFAULT 0.00,
    outstanding_contributions DECIMAL(10,2) DEFAULT 0.00,
    dividend_earned DECIMAL(10,2) DEFAULT 0.00,
    loan_balance DECIMAL(12,2) DEFAULT 0.00,
    
    -- Role and responsibilities
    roles JSONB DEFAULT '[]',
    committee_memberships JSONB DEFAULT '[]',
    leadership_positions JSONB DEFAULT '[]',
    
    -- Performance and engagement
    attendance_rate DECIMAL(5,2) DEFAULT 0.00,
    participation_score DECIMAL(3,1) DEFAULT 0.0,
    contribution_consistency DECIMAL(3,1) DEFAULT 0.0,
    leadership_potential DECIMAL(3,1) DEFAULT 0.0,
    
    -- Activity tracking
    last_meeting_attended DATE,
    last_contribution_date DATE,
    last_transaction_date DATE,
    total_transactions INTEGER DEFAULT 0,
    transaction_volume DECIMAL(15,2) DEFAULT 0.00,
    
    -- Behavioral metrics
    reliability_score DECIMAL(3,1) DEFAULT 0.0,
    collaboration_score DECIMAL(3,1) DEFAULT 0.0,
    innovation_adoption DECIMAL(3,1) DEFAULT 0.0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(cooperative_id, member_id)
);

-- Group formation system for organic group creation
CREATE TABLE group_formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    initiator_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Group details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    group_type group_type NOT NULL,
    focus_areas JSONB DEFAULT '[]',
    objectives JSONB DEFAULT '[]',
    
    -- Membership planning
    target_members INTEGER NOT NULL,
    current_members INTEGER DEFAULT 1,
    minimum_members INTEGER DEFAULT 5,
    maximum_members INTEGER,
    
    -- Geographic scope
    target_location VARCHAR(255) NOT NULL,
    service_area JSONB DEFAULT '[]',
    meeting_location TEXT,
    
    -- Requirements and criteria
    membership_requirements TEXT,
    financial_commitment DECIMAL(10,2),
    time_commitment VARCHAR(255),
    skill_requirements JSONB DEFAULT '[]',
    
    -- Formation progress
    formation_status formation_status DEFAULT 'forming',
    formation_stage INTEGER DEFAULT 1, -- 1-5 stages
    milestone_progress JSONB DEFAULT '{}',
    expected_completion_date DATE,
    
    -- Interest and applications
    interested_members JSONB DEFAULT '[]',
    applications_received INTEGER DEFAULT 0,
    applications_approved INTEGER DEFAULT 0,
    
    -- Communication
    communication_channels JSONB DEFAULT '{}',
    meeting_schedule VARCHAR(255),
    next_meeting_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days')
);

-- Advanced application system with workflow
CREATE TABLE cooperative_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE,
    group_formation_id UUID REFERENCES group_formations(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Application type
    application_type application_type NOT NULL,
    
    -- Application data
    application_data JSONB NOT NULL DEFAULT '{}',
    supporting_documents JSONB DEFAULT '[]',
    references JSONB DEFAULT '[]',
    
    -- Workflow tracking
    status application_status DEFAULT 'submitted',
    workflow_stage INTEGER DEFAULT 1,
    priority_level INTEGER DEFAULT 3, -- 1-5 scale
    
    -- Review process
    assigned_reviewer UUID REFERENCES auth.users(id),
    review_committee JSONB DEFAULT '[]',
    review_notes TEXT,
    review_score DECIMAL(3,1),
    decision_reason TEXT,
    conditions JSONB DEFAULT '[]',
    
    -- Timeline tracking
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_started_at TIMESTAMP WITH TIME ZONE,
    decision_made_at TIMESTAMP WITH TIME ZONE,
    appeal_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Communication log
    communication_log JSONB DEFAULT '[]',
    notifications_sent JSONB DEFAULT '[]',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CHECK (
        (cooperative_id IS NOT NULL AND group_formation_id IS NULL) OR
        (cooperative_id IS NULL AND group_formation_id IS NOT NULL)
    )
);

-- Financial transactions and contributions
CREATE TABLE cooperative_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
    member_id UUID REFERENCES auth.users(id),
    
    -- Transaction details
    transaction_type transaction_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    
    -- Transaction metadata
    description TEXT,
    reference_number VARCHAR(100) UNIQUE,
    external_reference VARCHAR(255),
    
    -- Payment details
    payment_method payment_method,
    payment_status payment_status DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    
    -- Approval workflow
    requires_approval BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Meeting management system
CREATE TABLE cooperative_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
    
    -- Meeting details
    title VARCHAR(255) NOT NULL,
    meeting_type meeting_type NOT NULL,
    description TEXT,
    agenda JSONB DEFAULT '[]',
    
    -- Scheduling
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    location TEXT,
    meeting_mode meeting_mode DEFAULT 'physical',
    virtual_link VARCHAR(500),
    
    -- Attendance tracking
    expected_attendees JSONB DEFAULT '[]',
    actual_attendees JSONB DEFAULT '[]',
    attendance_count INTEGER DEFAULT 0,
    quorum_met BOOLEAN DEFAULT false,
    
    -- Meeting outcomes
    minutes TEXT,
    decisions_made JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    next_meeting_date TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status meeting_status DEFAULT 'scheduled',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create enums for cooperative system
CREATE TYPE cooperative_type AS ENUM (
    'farming', 'processing', 'marketing', 'savings', 'multipurpose', 
    'transport', 'housing', 'consumer', 'worker', 'service'
);

CREATE TYPE registration_status AS ENUM (
    'pending', 'active', 'suspended', 'expired', 'cancelled', 'under_review'
);

CREATE TYPE verification_level AS ENUM (
    'unverified', 'basic', 'verified', 'premium', 'gold'
);

CREATE TYPE member_type AS ENUM (
    'farmer', 'agro_dealer', 'processor', 'transporter', 'service_provider', 
    'buyer', 'supplier', 'other'
);

CREATE TYPE membership_status AS ENUM (
    'active', 'inactive', 'suspended', 'terminated', 'probation', 'pending'
);

CREATE TYPE group_type AS ENUM (
    'farming_group', 'savings_group', 'marketing_group', 'processing_group',
    'training_group', 'youth_group', 'women_group', 'mixed_group'
);

CREATE TYPE formation_status AS ENUM (
    'forming', 'active', 'dissolved', 'merged', 'converted_to_cooperative'
);

CREATE TYPE application_type AS ENUM (
    'membership', 'group_interest', 'leadership_position', 'service_provider'
);

CREATE TYPE application_status AS ENUM (
    'submitted', 'under_review', 'additional_info_required', 'approved', 
    'rejected', 'withdrawn', 'expired', 'appealed'
);

CREATE TYPE transaction_type AS ENUM (
    'contribution', 'share_purchase', 'loan_disbursement', 'loan_repayment',
    'dividend_payment', 'service_fee', 'penalty', 'refund', 'grant'
);

CREATE TYPE payment_method AS ENUM (
    'cash', 'mpesa', 'bank_transfer', 'cheque', 'mobile_money', 'crypto'
);

CREATE TYPE payment_status AS ENUM (
    'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
);

CREATE TYPE meeting_type AS ENUM (
    'annual_general', 'monthly', 'emergency', 'board', 'committee', 
    'training', 'planning', 'review'
);

CREATE TYPE meeting_mode AS ENUM (
    'physical', 'virtual', 'hybrid'
);

CREATE TYPE meeting_status AS ENUM (
    'scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'
);

-- Create indexes for performance
CREATE INDEX idx_cooperatives_location ON cooperatives USING GIST (coordinates);
CREATE INDEX idx_cooperatives_type ON cooperatives (type);
CREATE INDEX idx_cooperatives_status ON cooperatives (registration_status, is_active);
CREATE INDEX idx_cooperatives_verification ON cooperatives (verification_level, is_verified);
CREATE INDEX idx_cooperatives_performance ON cooperatives (performance_score DESC);

CREATE INDEX idx_memberships_cooperative ON cooperative_memberships (cooperative_id);
CREATE INDEX idx_memberships_member ON cooperative_memberships (member_id);
CREATE INDEX idx_memberships_status ON cooperative_memberships (membership_status);
CREATE INDEX idx_memberships_performance ON cooperative_memberships (participation_score DESC);

CREATE INDEX idx_group_formations_status ON group_formations (formation_status);
CREATE INDEX idx_group_formations_location ON group_formations (target_location);
CREATE INDEX idx_group_formations_type ON group_formations (group_type);

CREATE INDEX idx_applications_status ON cooperative_applications (status);
CREATE INDEX idx_applications_type ON cooperative_applications (application_type);
CREATE INDEX idx_applications_cooperative ON cooperative_applications (cooperative_id);

CREATE INDEX idx_transactions_cooperative ON cooperative_transactions (cooperative_id);
CREATE INDEX idx_transactions_member ON cooperative_transactions (member_id);
CREATE INDEX idx_transactions_type ON cooperative_transactions (transaction_type);
CREATE INDEX idx_transactions_date ON cooperative_transactions (created_at DESC);

CREATE INDEX idx_meetings_cooperative ON cooperative_meetings (cooperative_id);
CREATE INDEX idx_meetings_date ON cooperative_meetings (scheduled_date);
CREATE INDEX idx_meetings_status ON cooperative_meetings (status);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cooperatives_updated_at BEFORE UPDATE ON cooperatives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON cooperative_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_formations_updated_at BEFORE UPDATE ON group_formations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON cooperative_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON cooperative_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON cooperative_meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_meetings ENABLE ROW LEVEL SECURITY;

-- Policies for cooperatives (public read, authenticated write)
CREATE POLICY "Cooperatives are viewable by everyone" ON cooperatives
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create cooperatives" ON cooperatives
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Cooperative leaders can update their cooperative" ON cooperatives
    FOR UPDATE USING (
        auth.uid() = created_by OR 
        auth.uid() IN (
            SELECT member_id FROM cooperative_memberships 
            WHERE cooperative_id = id AND 'leader' = ANY(roles::text[])
        )
    );

-- Policies for memberships
CREATE POLICY "Members can view their own memberships" ON cooperative_memberships
    FOR SELECT USING (auth.uid() = member_id);

CREATE POLICY "Cooperative leaders can view all memberships" ON cooperative_memberships
    FOR SELECT USING (
        auth.uid() IN (
            SELECT member_id FROM cooperative_memberships cm2
            WHERE cm2.cooperative_id = cooperative_id AND 'leader' = ANY(cm2.roles::text[])
        )
    );

-- Add more policies as needed for other tables...

-- Create views for common queries
CREATE VIEW cooperative_summary AS
SELECT 
    c.id,
    c.name,
    c.type,
    c.county,
    c.current_members,
    c.performance_score,
    c.is_recruiting,
    c.verification_level,
    COUNT(cm.id) as active_memberships,
    AVG(cm.participation_score) as avg_member_participation
FROM cooperatives c
LEFT JOIN cooperative_memberships cm ON c.id = cm.cooperative_id AND cm.membership_status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.name, c.type, c.county, c.current_members, c.performance_score, c.is_recruiting, c.verification_level;

CREATE VIEW member_performance_summary AS
SELECT 
    cm.member_id,
    cm.cooperative_id,
    c.name as cooperative_name,
    cm.participation_score,
    cm.attendance_rate,
    cm.total_contributions,
    cm.shares_owned,
    cm.roles,
    CASE 
        WHEN cm.participation_score >= 8.0 THEN 'excellent'
        WHEN cm.participation_score >= 6.0 THEN 'good'
        WHEN cm.participation_score >= 4.0 THEN 'average'
        ELSE 'needs_improvement'
    END as performance_category
FROM cooperative_memberships cm
JOIN cooperatives c ON cm.cooperative_id = c.id
WHERE cm.membership_status = 'active';
