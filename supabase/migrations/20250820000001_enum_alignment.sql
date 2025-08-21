-- Enum Alignment Migration
-- This migration aligns database enums with Kotlin model enums to fix schema mismatches

-- Update cooperative_type enum to match Kotlin CooperativeType
DROP TYPE IF EXISTS cooperative_type CASCADE;
CREATE TYPE cooperative_type AS ENUM (
    'FARMING', 'PROCESSING', 'MARKETING', 'SAVINGS', 'MULTIPURPOSE', 
    'TRANSPORT', 'HOUSING', 'CONSUMER', 'WORKER', 'SERVICE'
);

-- Update registration_status to match Kotlin RegistrationStatus
DROP TYPE IF EXISTS registration_status CASCADE;
CREATE TYPE registration_status AS ENUM (
    'PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED', 'UNDER_REVIEW', 'DISSOLVED'
);

-- Update verification_level to match Kotlin VerificationLevel
DROP TYPE IF EXISTS verification_level CASCADE;
CREATE TYPE verification_level AS ENUM (
    'UNVERIFIED', 'BASIC', 'VERIFIED', 'PREMIUM', 'GOLD'
);

-- Update member_type to match Kotlin MemberType
DROP TYPE IF EXISTS member_type CASCADE;
CREATE TYPE member_type AS ENUM (
    'FARMER', 'AGRO_DEALER', 'PROCESSOR', 'TRANSPORTER', 'SERVICE_PROVIDER', 
    'BUYER', 'SUPPLIER', 'OTHER'
);

-- Update membership_status to match Kotlin MembershipStatus
DROP TYPE IF EXISTS membership_status CASCADE;
CREATE TYPE membership_status AS ENUM (
    'ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED', 'PROBATION', 'PENDING'
);

-- Create player_type enum for regulatory models
CREATE TYPE player_type AS ENUM (
    'FARMER', 'AGRO_DEALER', 'TRANSPORTER', 'COOPERATIVE', 'PROCESSOR', 'BUYER'
);

-- Create alert_category enum
CREATE TYPE alert_category AS ENUM (
    'PESTICIDE_BAN', 'CONTAMINATION', 'MARKET_REJECTION', 'POLICY_CHANGE', 
    'WEATHER_WARNING', 'DISEASE_OUTBREAK', 'PRICE_ALERT', 'REGULATORY_UPDATE'
);

-- Create alert_severity enum
CREATE TYPE alert_severity AS ENUM (
    'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'URGENT'
);

-- Create alert_status enum
CREATE TYPE alert_status AS ENUM (
    'ACTIVE', 'UNDER_INVESTIGATION', 'RESOLVED', 'EXPIRED', 'DRAFT'
);

-- Create reporter_role enum
CREATE TYPE reporter_role AS ENUM (
    'EXTENSION_OFFICER', 'FIELD_AGENT', 'COOPERATIVE_LEADER', 'GOVERNMENT_OFFICIAL',
    'RESEARCHER', 'FARMER_REPRESENTATIVE', 'INDUSTRY_EXPERT'
);

-- Create trend enum
CREATE TYPE trend AS ENUM (
    'INCREASING', 'STABLE', 'DECLINING', 'VOLATILE'
);

-- Create risk_level enum
CREATE TYPE risk_level AS ENUM (
    'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
);

-- Create optimization_type enum
CREATE TYPE optimization_type AS ENUM (
    'AGGREGATION', 'ROUTE_OPTIMIZATION', 'INVENTORY_BALANCE', 
    'QUALITY_IMPROVEMENT', 'COST_REDUCTION', 'PROCESS_AUTOMATION'
);

-- Create implementation_effort enum
CREATE TYPE implementation_effort AS ENUM (
    'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'
);

-- Create optimization_status enum
CREATE TYPE optimization_status AS ENUM (
    'IDENTIFIED', 'PROPOSED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
);

-- Create relationship_type enum
CREATE TYPE relationship_type AS ENUM (
    'BUYER_SELLER', 'COOPERATIVE_MEMBER', 'SUPPLIER_DEALER', 
    'FARMER_PROCESSOR', 'TRANSPORTER_CLIENT'
);

-- Create group_formation_status enum
CREATE TYPE group_formation_status AS ENUM (
    'FORMING', 'ACTIVE', 'DISSOLVED', 'MERGED', 'CONVERTED_TO_COOPERATIVE'
);

-- Update existing enums to match Kotlin models
DROP TYPE IF EXISTS transaction_type CASCADE;
CREATE TYPE transaction_type AS ENUM (
    'CONTRIBUTION', 'SHARE_PURCHASE', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT',
    'DIVIDEND_PAYMENT', 'SERVICE_FEE', 'PENALTY', 'REFUND', 'GRANT', 'INCOME', 'EXPENSE'
);

DROP TYPE IF EXISTS payment_method CASCADE;
CREATE TYPE payment_method AS ENUM (
    'CASH', 'MPESA', 'BANK_TRANSFER', 'CHEQUE', 'MOBILE_MONEY', 'CRYPTO'
);

DROP TYPE IF EXISTS payment_status CASCADE;
CREATE TYPE payment_status AS ENUM (
    'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED'
);

DROP TYPE IF EXISTS meeting_type CASCADE;
CREATE TYPE meeting_type AS ENUM (
    'ANNUAL_GENERAL', 'MONTHLY', 'EMERGENCY', 'BOARD', 'COMMITTEE', 
    'TRAINING', 'PLANNING', 'REVIEW'
);

DROP TYPE IF EXISTS meeting_mode CASCADE;
CREATE TYPE meeting_mode AS ENUM (
    'PHYSICAL', 'VIRTUAL', 'HYBRID'
);

DROP TYPE IF EXISTS meeting_status CASCADE;
CREATE TYPE meeting_status AS ENUM (
    'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED'
);

-- Update application enums
DROP TYPE IF EXISTS application_type CASCADE;
CREATE TYPE application_type AS ENUM (
    'MEMBERSHIP', 'GROUP_INTEREST', 'LEADERSHIP_POSITION', 'SERVICE_PROVIDER'
);

DROP TYPE IF EXISTS application_status CASCADE;
CREATE TYPE application_status AS ENUM (
    'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 
    'REJECTED', 'WITHDRAWN', 'EXPIRED', 'APPEALED'
);

-- Update group formation enums
DROP TYPE IF EXISTS group_type CASCADE;
CREATE TYPE group_type AS ENUM (
    'FARMING_GROUP', 'SAVINGS_GROUP', 'MARKETING_GROUP', 'PROCESSING_GROUP',
    'TRAINING_GROUP', 'YOUTH_GROUP', 'WOMEN_GROUP', 'MIXED_GROUP'
);

DROP TYPE IF EXISTS formation_status CASCADE;
CREATE TYPE formation_status AS ENUM (
    'FORMING', 'ACTIVE', 'DISSOLVED', 'MERGED', 'CONVERTED_TO_COOPERATIVE'
);

-- Create logistics enums
CREATE TYPE logistics_service_type AS ENUM (
    'TRANSPORTATION', 'WAREHOUSING', 'COLD_STORAGE', 'PACKAGING', 
    'LOADING_UNLOADING', 'LAST_MILE_DELIVERY', 'BULK_TRANSPORT', 
    'REFRIGERATED_TRANSPORT', 'CROSS_DOCKING', 'DISTRIBUTION'
);

CREATE TYPE vehicle_type AS ENUM (
    'PICKUP_TRUCK', 'SMALL_TRUCK', 'MEDIUM_TRUCK', 'LARGE_TRUCK',
    'REFRIGERATED_TRUCK', 'FLATBED_TRUCK', 'CONTAINER_TRUCK',
    'MOTORCYCLE', 'VAN', 'TRAILER', 'SEMI_TRAILER'
);

CREATE TYPE fuel_type AS ENUM (
    'PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'
);

-- Create business matching enums
CREATE TYPE business_type AS ENUM (
    'FARMER', 'BUYER', 'PROCESSOR', 'DISTRIBUTOR', 'RETAILER',
    'LOGISTICS_PROVIDER', 'INPUT_SUPPLIER', 'COOPERATIVE', 'EXPORTER'
);

CREATE TYPE interaction_type AS ENUM (
    'PROFILE_VIEW', 'INTEREST_EXPRESSED', 'MESSAGE_SENT', 'MEETING_REQUESTED',
    'PROPOSAL_SENT', 'CONTRACT_SHARED', 'PARTNERSHIP_FORMED', 'FEEDBACK_GIVEN'
);

-- Create auction enums
CREATE TYPE auction_type AS ENUM (
    'STANDARD', 'DUTCH', 'SEALED_BID', 'REVERSE'
);

CREATE TYPE bid_type AS ENUM (
    'STANDARD', 'AUTO', 'PROXY'
);

-- Create export opportunity enums
CREATE TYPE verification_type AS ENUM (
    'EXPORTER_PROFILE', 'OPPORTUNITY_DETAILS', 'BUSINESS_LEGITIMACY'
);

-- Create payment security enums
CREATE TYPE dispute_type AS ENUM (
    'NON_DELIVERY', 'QUALITY_ISSUE', 'WRONG_QUANTITY', 'DAMAGED_GOODS', 
    'LATE_DELIVERY', 'PAYMENT_ISSUE', 'OTHER'
);

CREATE TYPE warning_type AS ENUM (
    'UNVERIFIED_SELLER', 'HIGH_VALUE', 'NEW_SELLER', 'LOW_RATING', 
    'SUSPICIOUS_ACTIVITY', 'GENERAL_PROTECTION', 'PAYMENT_OUTSIDE_PLATFORM', 
    'DELIVERY_DELAY'
);

CREATE TYPE fraud_alert_type AS ENUM (
    'SUSPICIOUS_PAYMENT', 'FAKE_SELLER', 'DUPLICATE_LISTING', 'PRICE_MANIPULATION', 
    'IDENTITY_THEFT', 'MONEY_LAUNDERING', 'FAKE_REVIEWS'
);

-- Add any missing enum values that might be referenced in the code
-- These are based on the Kotlin enum definitions found in the models

COMMENT ON TYPE cooperative_type IS 'Types of cooperatives aligned with Kotlin CooperativeType enum';
COMMENT ON TYPE player_type IS 'Player types for regulatory system aligned with Kotlin PlayerType enum';
COMMENT ON TYPE alert_category IS 'Alert categories aligned with Kotlin AlertCategory enum';
COMMENT ON TYPE alert_severity IS 'Alert severity levels aligned with Kotlin AlertSeverity enum';
COMMENT ON TYPE risk_level IS 'Risk levels aligned with Kotlin RiskLevel enum';
COMMENT ON TYPE optimization_type IS 'Optimization types aligned with Kotlin OptimizationType enum';
COMMENT ON TYPE relationship_type IS 'Relationship types aligned with Kotlin RelationshipType enum';
