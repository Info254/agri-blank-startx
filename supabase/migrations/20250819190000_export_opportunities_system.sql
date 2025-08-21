-- Soko Connect Export Opportunities System Migration
-- Creates comprehensive export workflow with double farmer verification

-- Export opportunities table
CREATE TABLE IF NOT EXISTS public.export_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exporter_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  commodity TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  destination_city TEXT,
  volume_required NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  price_per_unit NUMERIC,
  currency TEXT DEFAULT 'KES',
  quality_requirements TEXT[],
  certification_requirements TEXT[],
  shipping_terms TEXT, -- FOB, CIF, etc
  payment_terms TEXT,
  deadline DATE,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'suspended')),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  farmer_verifier_1 UUID REFERENCES auth.users(id),
  farmer_verifier_2 UUID REFERENCES auth.users(id),
  verification_date_1 TIMESTAMPTZ,
  verification_date_2 TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Ensure different farmers verify
  CONSTRAINT different_verifiers CHECK (farmer_verifier_1 != farmer_verifier_2)
);

-- Export applications table
CREATE TABLE IF NOT EXISTS public.export_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.export_opportunities(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES auth.users(id) NOT NULL,
  proposed_volume NUMERIC NOT NULL,
  proposed_price NUMERIC,
  delivery_timeline TEXT,
  quality_certifications TEXT[],
  sample_images TEXT[],
  cover_letter TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')),
  exporter_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Export document links table (external storage)
CREATE TABLE IF NOT EXISTS public.export_document_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.export_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- certificate, permit, invoice, quality_report, etc
  document_name TEXT NOT NULL,
  external_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users(id),
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Export workflow status tracking
CREATE TABLE IF NOT EXISTS public.export_workflow_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.export_applications(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('inquiry', 'negotiation', 'contract', 'documentation', 'shipping', 'payment', 'completed')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  updated_by UUID REFERENCES auth.users(id)
);

-- Export verifications tracking
CREATE TABLE IF NOT EXISTS public.export_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.export_opportunities(id) ON DELETE CASCADE,
  verifier_id UUID REFERENCES auth.users(id) NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('exporter_profile', 'opportunity_details', 'business_legitimacy')),
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected', 'needs_info')),
  comments TEXT,
  evidence_links TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exporter profiles for verification
CREATE TABLE IF NOT EXISTS public.exporter_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  business_registration_number TEXT,
  export_license_number TEXT,
  tax_id TEXT,
  business_address TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  website_url TEXT,
  years_in_business INTEGER,
  export_markets TEXT[],
  commodities_handled TEXT[],
  annual_export_volume NUMERIC,
  certifications TEXT[],
  verification_badge TEXT DEFAULT 'unverified' CHECK (verification_badge IN ('unverified', 'basic', 'verified', 'premium')),
  farmer_verifications_count INTEGER DEFAULT 0,
  successful_exports_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_export_opportunities_commodity ON public.export_opportunities(commodity);
CREATE INDEX idx_export_opportunities_destination ON public.export_opportunities(destination_country);
CREATE INDEX idx_export_opportunities_status ON public.export_opportunities(status, verification_status);
CREATE INDEX idx_export_opportunities_deadline ON public.export_opportunities(deadline);
CREATE INDEX idx_export_applications_farmer ON public.export_applications(farmer_id);
CREATE INDEX idx_export_applications_opportunity ON public.export_applications(opportunity_id);
CREATE INDEX idx_export_workflow_stage ON public.export_workflow_status(stage, status);

-- Enable RLS
ALTER TABLE public.export_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_document_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_workflow_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exporter_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Export opportunities
CREATE POLICY "Anyone can view verified opportunities" ON public.export_opportunities
  FOR SELECT USING (verification_status = 'verified' AND status = 'active');

CREATE POLICY "Exporters can manage their opportunities" ON public.export_opportunities
  FOR ALL USING (auth.uid() = exporter_id);

CREATE POLICY "Farmers can verify opportunities" ON public.export_opportunities
  FOR UPDATE USING (
    auth.uid() IN (farmer_verifier_1, farmer_verifier_2) OR
    (farmer_verifier_1 IS NULL AND verification_status = 'pending') OR
    (farmer_verifier_2 IS NULL AND verification_status = 'pending' AND farmer_verifier_1 IS NOT NULL AND farmer_verifier_1 != auth.uid())
  );

-- Export applications
CREATE POLICY "Farmers can manage their applications" ON public.export_applications
  FOR ALL USING (auth.uid() = farmer_id);

CREATE POLICY "Exporters can view applications to their opportunities" ON public.export_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.export_opportunities 
      WHERE id = opportunity_id AND exporter_id = auth.uid()
    )
  );

-- Document links
CREATE POLICY "Users can manage their document links" ON public.export_document_links
  FOR ALL USING (auth.uid() = uploaded_by);

CREATE POLICY "Exporters can view application documents" ON public.export_document_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.export_applications ea
      JOIN public.export_opportunities eo ON ea.opportunity_id = eo.id
      WHERE ea.id = application_id AND eo.exporter_id = auth.uid()
    )
  );

-- Workflow status
CREATE POLICY "Application participants can view workflow" ON public.export_workflow_status
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.export_applications ea
      LEFT JOIN public.export_opportunities eo ON ea.opportunity_id = eo.id
      WHERE ea.id = application_id AND (ea.farmer_id = auth.uid() OR eo.exporter_id = auth.uid())
    )
  );

-- Verifications
CREATE POLICY "Farmers can create verifications" ON public.export_verifications
  FOR INSERT WITH CHECK (auth.uid() = verifier_id);

CREATE POLICY "Anyone can view verifications" ON public.export_verifications
  FOR SELECT USING (true);

-- Exporter profiles
CREATE POLICY "Anyone can view verified exporter profiles" ON public.exporter_profiles
  FOR SELECT USING (verification_badge != 'unverified');

CREATE POLICY "Exporters can manage their profiles" ON public.exporter_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_export_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update verification status when both farmers have verified
  IF NEW.farmer_verifier_2 IS NOT NULL AND NEW.verification_date_2 IS NOT NULL THEN
    NEW.verification_status = 'verified';
  END IF;
  
  -- Update exporter profile verification count
  IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
    UPDATE public.exporter_profiles 
    SET farmer_verifications_count = farmer_verifications_count + 1
    WHERE user_id = NEW.exporter_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER export_verification_trigger
  BEFORE UPDATE ON public.export_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_export_verification_status();

-- Function to automatically create workflow stages
CREATE OR REPLACE FUNCTION create_export_workflow_stages()
RETURNS TRIGGER AS $$
DECLARE
  stage_name TEXT;
BEGIN
  -- Create initial workflow stages for new applications
  FOR stage_name IN SELECT unnest(ARRAY['inquiry', 'negotiation', 'contract', 'documentation', 'shipping', 'payment', 'completed']) LOOP
    INSERT INTO public.export_workflow_status (application_id, stage, status)
    VALUES (NEW.id, stage_name, CASE WHEN stage_name = 'inquiry' THEN 'completed' ELSE 'pending' END);
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_workflow_stages_trigger
  AFTER INSERT ON public.export_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_export_workflow_stages();

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_export_opportunities_updated_at
  BEFORE UPDATE ON public.export_opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_export_applications_updated_at
  BEFORE UPDATE ON public.export_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exporter_profiles_updated_at
  BEFORE UPDATE ON public.exporter_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
