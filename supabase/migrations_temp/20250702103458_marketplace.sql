
-- Create farmer_exporter_collaborations table
CREATE TABLE public.farmer_exporter_collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES auth.users NOT NULL,
  exporter_id UUID REFERENCES auth.users,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  farmer_email TEXT,
  farmer_location TEXT NOT NULL,
  farmer_county TEXT NOT NULL,
  farmer_coordinates JSONB, -- Store lat/lng coordinates
  farm_size_acres NUMERIC,
  commodity_name TEXT NOT NULL,
  commodity_variety TEXT,
  estimated_quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quality_grade TEXT,
  harvest_date DATE,
  availability_period TEXT,
  farmer_experience_years INTEGER,
  has_export_documentation BOOLEAN DEFAULT false,
  documentation_needs TEXT[], -- What docs they need help with
  farmer_profile_description TEXT,
  collaboration_type TEXT DEFAULT 'supply_partnership', -- supply_partnership, documentation_help, full_service
  target_markets TEXT[], -- International markets they want to reach
  pricing_expectations TEXT,
  special_requirements TEXT[],
  farmer_certifications TEXT[],
  collaboration_status TEXT NOT NULL DEFAULT 'seeking_exporter',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '6 months'),
  is_active BOOLEAN DEFAULT true,
  notes TEXT
);

-- Create exporter_profiles table
CREATE TABLE public.exporter_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  company_name TEXT NOT NULL,
  company_registration_number TEXT,
  business_license_number TEXT,
  export_license_number TEXT,
  company_description TEXT,
  contact_person_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  office_location TEXT NOT NULL,
  office_county TEXT NOT NULL,
  office_coordinates JSONB,
  website_url TEXT,
  years_in_business INTEGER,
  export_markets TEXT[] NOT NULL, -- Countries/regions they export to
  commodities_handled TEXT[] NOT NULL, -- Types of commodities they handle
  services_offered TEXT[] NOT NULL, -- documentation_help, quality_certification, logistics, etc
  minimum_quantity_tons NUMERIC,
  maximum_quantity_tons NUMERIC,
  certifications TEXT[], -- ISO, HACCP, etc
  documentation_services BOOLEAN DEFAULT true,
  logistics_services BOOLEAN DEFAULT false,
  quality_assurance_services BOOLEAN DEFAULT false,
  financing_services BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 0.0,
  total_collaborations INTEGER DEFAULT 0,
  successful_exports INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verification_documents TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaboration_messages table for communication
CREATE TABLE public.collaboration_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaboration_id UUID REFERENCES public.farmer_exporter_collaborations NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  sender_type TEXT NOT NULL, -- 'farmer' or 'exporter'
  message_content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, document, proposal, contract
  attachment_urls TEXT[],
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaboration_proposals table for formal proposals
CREATE TABLE public.collaboration_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaboration_id UUID REFERENCES public.farmer_exporter_collaborations NOT NULL,
  exporter_id UUID REFERENCES auth.users NOT NULL,
  proposal_type TEXT NOT NULL, -- partnership, documentation_only, full_service
  proposed_price_per_unit NUMERIC,
  proposed_total_value NUMERIC,
  service_fees NUMERIC,
  documentation_fee NUMERIC,
  logistics_fee NUMERIC,
  payment_terms TEXT,
  delivery_terms TEXT,
  quality_requirements TEXT[],
  export_timeline TEXT,
  market_destination TEXT[],
  services_included TEXT[],
  terms_and_conditions TEXT,
  proposal_status TEXT DEFAULT 'pending', -- pending, accepted, rejected, negotiating
  farmer_response TEXT,
  exporter_notes TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exporter_reviews table
CREATE TABLE public.exporter_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exporter_id UUID REFERENCES auth.users NOT NULL,
  farmer_id UUID REFERENCES auth.users NOT NULL,
  collaboration_id UUID REFERENCES public.farmer_exporter_collaborations,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_text TEXT,
  services_used TEXT[],
  would_recommend BOOLEAN DEFAULT true,
  export_successful BOOLEAN,
  documentation_quality_rating INTEGER CHECK (documentation_quality_rating >= 1 AND documentation_quality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  timeline_adherence_rating INTEGER CHECK (timeline_adherence_rating >= 1 AND timeline_adherence_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.farmer_exporter_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exporter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exporter_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for farmer_exporter_collaborations
CREATE POLICY "Anyone can view active collaborations" ON public.farmer_exporter_collaborations FOR SELECT USING (is_active = true);
CREATE POLICY "Farmers can create collaborations" ON public.farmer_exporter_collaborations FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update their own collaborations" ON public.farmer_exporter_collaborations FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Exporters can update collaborations they're part of" ON public.farmer_exporter_collaborations FOR UPDATE USING (auth.uid() = exporter_id);

-- RLS policies for exporter_profiles
CREATE POLICY "Anyone can view active exporter profiles" ON public.exporter_profiles FOR SELECT USING (is_active = true);
CREATE POLICY "Exporters can create their own profile" ON public.exporter_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Exporters can update their own profile" ON public.exporter_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for collaboration_messages
CREATE POLICY "Collaboration participants can view messages" ON public.collaboration_messages FOR SELECT USING (
  auth.uid() IN (
    SELECT farmer_id FROM public.farmer_exporter_collaborations WHERE id = collaboration_id
    UNION
    SELECT exporter_id FROM public.farmer_exporter_collaborations WHERE id = collaboration_id
  )
);
CREATE POLICY "Collaboration participants can send messages" ON public.collaboration_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  auth.uid() IN (
    SELECT farmer_id FROM public.farmer_exporter_collaborations WHERE id = collaboration_id
    UNION
    SELECT exporter_id FROM public.farmer_exporter_collaborations WHERE id = collaboration_id
  )
);

-- RLS policies for collaboration_proposals
CREATE POLICY "Collaboration participants can view proposals" ON public.collaboration_proposals FOR SELECT USING (
  auth.uid() IN (
    SELECT farmer_id FROM public.farmer_exporter_collaborations WHERE id = collaboration_id
    UNION
    SELECT exporter_id FROM public.farmer_exporter_collaborations WHERE id = collaboration_id
  )
);
CREATE POLICY "Exporters can create proposals" ON public.collaboration_proposals FOR INSERT WITH CHECK (auth.uid() = exporter_id);
CREATE POLICY "Collaboration participants can update proposals" ON public.collaboration_proposals FOR UPDATE USING (
  auth.uid() IN (
    SELECT farmer_id FROM public.farmer_exporter_collaborations WHERE id = collaboration_id
    UNION
    SELECT exporter_id FROM public.farmer_exporter_collaborations WHERE id = collaboration_id
  )
);

-- RLS policies for exporter_reviews
CREATE POLICY "Anyone can view reviews" ON public.exporter_reviews FOR SELECT USING (true);
CREATE POLICY "Farmers can create reviews" ON public.exporter_reviews FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update their own reviews" ON public.exporter_reviews FOR UPDATE USING (auth.uid() = farmer_id);

-- Add indexes for performance
CREATE INDEX idx_farmer_exporter_collaborations_farmer_id ON public.farmer_exporter_collaborations(farmer_id);
CREATE INDEX idx_farmer_exporter_collaborations_exporter_id ON public.farmer_exporter_collaborations(exporter_id);
CREATE INDEX idx_farmer_exporter_collaborations_county ON public.farmer_exporter_collaborations(farmer_county);
CREATE INDEX idx_farmer_exporter_collaborations_commodity ON public.farmer_exporter_collaborations(commodity_name);
CREATE INDEX idx_farmer_exporter_collaborations_status ON public.farmer_exporter_collaborations(collaboration_status);
CREATE INDEX idx_exporter_profiles_user_id ON public.exporter_profiles(user_id);
CREATE INDEX idx_exporter_profiles_county ON public.exporter_profiles(office_county);
CREATE INDEX idx_collaboration_messages_collaboration_id ON public.collaboration_messages(collaboration_id);
CREATE INDEX idx_collaboration_proposals_collaboration_id ON public.collaboration_proposals(collaboration_id);
CREATE INDEX idx_exporter_reviews_exporter_id ON public.exporter_reviews(exporter_id);

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_farmer_exporter_collaborations BEFORE UPDATE ON public.farmer_exporter_collaborations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_exporter_profiles BEFORE UPDATE ON public.exporter_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_collaboration_proposals BEFORE UPDATE ON public.collaboration_proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
