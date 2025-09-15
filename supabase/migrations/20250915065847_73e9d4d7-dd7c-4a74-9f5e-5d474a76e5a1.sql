-- Create farmer_exporter_collaborations table
CREATE TABLE public.farmer_exporter_collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL,
  exporter_id UUID,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  farmer_email TEXT,
  farmer_location TEXT NOT NULL,
  farmer_county TEXT NOT NULL,
  farmer_coordinates JSONB,
  farm_size_acres NUMERIC,
  commodity_name TEXT NOT NULL,
  commodity_variety TEXT,
  estimated_quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  quality_grade TEXT,
  harvest_date DATE,
  availability_period TEXT,
  farmer_experience_years INTEGER,
  has_export_documentation BOOLEAN NOT NULL DEFAULT false,
  documentation_needs TEXT[],
  farmer_profile_description TEXT,
  collaboration_type TEXT NOT NULL,
  target_markets TEXT[],
  pricing_expectations TEXT,
  special_requirements TEXT[],
  farmer_certifications TEXT[],
  collaboration_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT
);

-- Create exporter_profiles table
CREATE TABLE public.exporter_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
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
  export_markets TEXT[] NOT NULL DEFAULT '{}',
  commodities_handled TEXT[] NOT NULL DEFAULT '{}',
  services_offered TEXT[] NOT NULL DEFAULT '{}',
  minimum_quantity_tons NUMERIC,
  maximum_quantity_tons NUMERIC,
  certifications TEXT[],
  documentation_services BOOLEAN NOT NULL DEFAULT false,
  logistics_services BOOLEAN NOT NULL DEFAULT false,
  quality_assurance_services BOOLEAN NOT NULL DEFAULT false,
  financing_services BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC NOT NULL DEFAULT 0,
  total_collaborations INTEGER NOT NULL DEFAULT 0,
  successful_exports INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_documents TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.farmer_exporter_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exporter_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for farmer_exporter_collaborations
CREATE POLICY "Anyone can view active collaborations" 
ON public.farmer_exporter_collaborations 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Farmers can manage own collaborations" 
ON public.farmer_exporter_collaborations 
FOR ALL 
USING (auth.uid() = farmer_id);

CREATE POLICY "Exporters can update assigned collaborations" 
ON public.farmer_exporter_collaborations 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM exporter_profiles WHERE id = farmer_exporter_collaborations.exporter_id));

-- RLS Policies for exporter_profiles
CREATE POLICY "Anyone can view active exporter profiles" 
ON public.exporter_profiles 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can manage own exporter profile" 
ON public.exporter_profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_farmer_exporter_collaborations_updated_at
BEFORE UPDATE ON public.farmer_exporter_collaborations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exporter_profiles_updated_at
BEFORE UPDATE ON public.exporter_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();