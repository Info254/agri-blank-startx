-- Create export_opportunities table
CREATE TABLE public.export_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  quantity_tons NUMERIC NOT NULL,
  specifications TEXT,
  price_per_ton NUMERIC,
  payment_terms TEXT,
  delivery_terms TEXT,
  required_certifications TEXT[],
  min_order_quantity NUMERIC,
  status TEXT DEFAULT 'open', -- open, closed, in-progress
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create farmer_consolidations table
CREATE TABLE public.farmer_consolidations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_opportunity_id UUID REFERENCES public.export_opportunities(id),
  consolidator_id UUID REFERENCES auth.users(id), -- can be an exporter or a lead farmer
  farmer_ids UUID[],
  total_quantity_tons NUMERIC,
  status TEXT DEFAULT 'forming', -- forming, ready, fulfilled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create export_orders table
CREATE TABLE public.export_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_opportunity_id UUID REFERENCES public.export_opportunities(id),
  consolidation_id UUID REFERENCES public.farmer_consolidations(id),
  transporter_id UUID REFERENCES public.service_providers(id),
  status TEXT DEFAULT 'pending', -- pending, shipped, delivered, cancelled
  shipping_date DATE,
  tracking_link TEXT, -- for GPS tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transporter_recommendations table
CREATE TABLE public.transporter_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transporter_id UUID REFERENCES public.service_providers(id),
  reviewer_id UUID REFERENCES auth.users(id),
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  reliability INTEGER,
  pricing INTEGER,
  timeliness INTEGER,
  handling INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update service_providers for export transporters
ALTER TABLE public.service_providers
ADD COLUMN IF NOT EXISTS licenses TEXT[],
ADD COLUMN IF NOT EXISTS insurance_details TEXT; 