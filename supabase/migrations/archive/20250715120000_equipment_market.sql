-- Add equipment table
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- e.g. Tractor, Harvester, Drone, etc.
  available_for TEXT[] NOT NULL, -- e.g. ['rental', 'lease', 'purchase']
  price NUMERIC,
  owner_id UUID REFERENCES auth.users(id),
  location TEXT,
  county TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add app_market_selection table
CREATE TABLE public.app_market_selection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_name TEXT NOT NULL,
  city TEXT NOT NULL,
  county_code TEXT NOT NULL,
  county_name TEXT NOT NULL,
  market_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add market_details table
CREATE TABLE public.market_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_name TEXT NOT NULL,
  county_name TEXT NOT NULL,
  market_type TEXT,
  primary_goods TEXT[],
  operating_days TEXT[],
  market_description TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add provider_category to service_providers
ALTER TABLE public.service_providers
ADD COLUMN IF NOT EXISTS provider_category TEXT NOT NULL DEFAULT 'General';
-- You can now use provider_category for Insurance, Soil Testing, Drone/Satellite Imagery, IoT Sensor, etc. 