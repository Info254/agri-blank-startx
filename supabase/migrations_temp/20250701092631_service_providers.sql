
-- Create barter_listings table for commodity trading
CREATE TABLE public.barter_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  commodity TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  description TEXT,
  image_urls TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  seeking_commodities TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quality_control_discussions table
CREATE TABLE public.quality_control_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  organizer TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  attendees INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  author_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create market_linkage_applications table
CREATE TABLE public.market_linkage_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  linkage_id UUID REFERENCES public.market_linkages NOT NULL,
  application_status TEXT DEFAULT 'pending',
  farmer_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  farm_size NUMERIC,
  crops_to_supply TEXT[] NOT NULL,
  estimated_quantity NUMERIC,
  notes TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- Create training_registrations table
CREATE TABLE public.training_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  training_id UUID REFERENCES public.training_events NOT NULL,
  registration_status TEXT DEFAULT 'registered',
  participant_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  organization TEXT,
  experience_level TEXT,
  specific_interests TEXT,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  feedback_rating INTEGER,
  feedback_comments TEXT,
  UNIQUE(user_id, training_id)
);

-- Create service_provider_reviews table (references comprehensive service_providers table)
CREATE TABLE public.service_provider_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  provider_id UUID NOT NULL, -- Will reference service_providers from policies migration
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_used TEXT NOT NULL,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farm_parcels table for land management
CREATE TABLE public.farm_parcels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  parcel_name TEXT NOT NULL,
  size_acres NUMERIC NOT NULL,
  soil_type TEXT,
  slope_type TEXT,
  water_source TEXT,
  coordinates JSONB, -- Store lat/lng coordinates
  current_crop TEXT,
  planting_date DATE,
  expected_harvest DATE,
  irrigation_system TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop_tracking table
CREATE TABLE public.crop_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  parcel_id UUID REFERENCES public.farm_parcels,
  crop_name TEXT NOT NULL,
  variety TEXT,
  planting_date DATE NOT NULL,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  planted_area NUMERIC NOT NULL,
  seeds_used NUMERIC,
  fertilizer_applied JSONB, -- Store fertilizer details
  pesticides_applied JSONB, -- Store pesticide details
  irrigation_schedule JSONB,
  growth_stage TEXT DEFAULT 'planted',
  estimated_yield NUMERIC,
  actual_yield NUMERIC,
  quality_grade TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weather_data table
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  county TEXT NOT NULL,
  date DATE NOT NULL,
  temperature_max NUMERIC,
  temperature_min NUMERIC,
  humidity NUMERIC,
  rainfall NUMERIC,
  wind_speed NUMERIC,
  weather_condition TEXT,
  forecast_data JSONB,
  source TEXT DEFAULT 'weather_api',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(county, date)
);

-- Enable Row Level Security on all new tables
ALTER TABLE public.barter_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_control_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_linkage_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_provider_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for barter_listings
CREATE POLICY "Users can view all active barter listings" ON public.barter_listings FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create their own barter listings" ON public.barter_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own barter listings" ON public.barter_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own barter listings" ON public.barter_listings FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for quality_control_discussions
CREATE POLICY "Users can view all discussions" ON public.quality_control_discussions FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create discussions" ON public.quality_control_discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own discussions" ON public.quality_control_discussions FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for market_linkage_applications
CREATE POLICY "Users can view their own applications" ON public.market_linkage_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create applications" ON public.market_linkage_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications" ON public.market_linkage_applications FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for training_registrations
CREATE POLICY "Users can view their own registrations" ON public.training_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create registrations" ON public.training_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own registrations" ON public.training_registrations FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for service_provider_reviews
CREATE POLICY "Users can view all reviews" ON public.service_provider_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.service_provider_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.service_provider_reviews FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for farm_parcels
CREATE POLICY "Users can view their own parcels" ON public.farm_parcels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own parcels" ON public.farm_parcels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own parcels" ON public.farm_parcels FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own parcels" ON public.farm_parcels FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for crop_tracking
CREATE POLICY "Users can view their own crop tracking" ON public.crop_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own crop tracking" ON public.crop_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own crop tracking" ON public.crop_tracking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own crop tracking" ON public.crop_tracking FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for weather_data (public read access)
CREATE POLICY "Anyone can view weather data" ON public.weather_data FOR SELECT USING (true);

-- Add missing indexes for performance
CREATE INDEX idx_barter_listings_county ON public.barter_listings(county);
CREATE INDEX idx_barter_listings_commodity ON public.barter_listings(commodity);
CREATE INDEX idx_barter_listings_status ON public.barter_listings(status);
CREATE INDEX idx_quality_control_discussions_county ON public.quality_control_discussions(county);
CREATE INDEX idx_market_linkage_applications_status ON public.market_linkage_applications(application_status);
CREATE INDEX idx_training_registrations_training_id ON public.training_registrations(training_id);
CREATE INDEX idx_service_provider_reviews_provider_id ON public.service_provider_reviews(provider_id);
CREATE INDEX idx_farm_parcels_user_id ON public.farm_parcels(user_id);
CREATE INDEX idx_crop_tracking_user_id ON public.crop_tracking(user_id);
CREATE INDEX idx_weather_data_county_date ON public.weather_data(county, date);

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_barter_listings BEFORE UPDATE ON public.barter_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_quality_control_discussions BEFORE UPDATE ON public.quality_control_discussions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_farm_parcels BEFORE UPDATE ON public.farm_parcels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_updated_at_crop_tracking BEFORE UPDATE ON public.crop_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
