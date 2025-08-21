-- Profiles table already created in earlier migration

-- Create P2P lenders table
CREATE TABLE IF NOT EXISTS public.p2p_lenders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lender_name TEXT NOT NULL,
  lender_type TEXT NOT NULL DEFAULT 'individual',
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  sub_county TEXT,
  loan_types JSONB NOT NULL DEFAULT '[]',
  minimum_loan_amount NUMERIC NOT NULL,
  maximum_loan_amount NUMERIC NOT NULL,
  interest_rate_range TEXT NOT NULL,
  loan_term_months_min INTEGER DEFAULT 1,
  loan_term_months_max INTEGER DEFAULT 60,
  collateral_requirements TEXT[],
  service_counties TEXT[] NOT NULL,
  total_loans_disbursed NUMERIC DEFAULT 0,
  active_borrowers INTEGER DEFAULT 0,
  default_rate_percent NUMERIC DEFAULT 0,
  platform_rating NUMERIC DEFAULT 0.0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on p2p_lenders
ALTER TABLE public.p2p_lenders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for p2p_lenders
CREATE POLICY "Anyone can view active P2P lenders" 
ON public.p2p_lenders 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create their P2P lender profile" 
ON public.p2p_lenders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their P2P lender profile" 
ON public.p2p_lenders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create updated_at trigger for p2p_lenders
CREATE TRIGGER update_p2p_lenders_updated_at
  BEFORE UPDATE ON public.p2p_lenders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Warehouses table already created in logistics migration with correct schema

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_county ON public.profiles(county);
CREATE INDEX IF NOT EXISTS idx_profiles_farm_type ON public.profiles(farm_type);
CREATE INDEX IF NOT EXISTS idx_p2p_lenders_county ON public.p2p_lenders(county);
CREATE INDEX IF NOT EXISTS idx_p2p_lenders_loan_amounts ON public.p2p_lenders(minimum_loan_amount, maximum_loan_amount);
CREATE INDEX IF NOT EXISTS idx_warehouses_county ON public.warehouses(county);
CREATE INDEX IF NOT EXISTS idx_warehouses_capacity ON public.warehouses(capacity_tons);
-- Transporters table doesn't exist, using logistics_providers instead
-- These tables don't exist yet, will be created in future migrations