-- Export Documentation Checklist
CREATE TABLE public.export_documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_opportunity_id UUID REFERENCES public.export_opportunities(id),
  document_type TEXT NOT NULL,
  required BOOLEAN DEFAULT TRUE,
  uploaded_by UUID REFERENCES auth.users(id),
  file_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Price Comparisons
CREATE TABLE public.price_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_name TEXT NOT NULL,
  domestic_price NUMERIC,
  export_price NUMERIC,
  market_id UUID REFERENCES public.city_markets(id),
  export_opportunity_id UUID REFERENCES public.export_opportunities(id),
  comparison_date DATE DEFAULT CURRENT_DATE
);

-- Transporter Booking System
CREATE TABLE public.transporter_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transporter_id UUID REFERENCES public.service_providers(id),
  export_order_id UUID REFERENCES public.export_orders(id),
  booking_date DATE,
  cargo_type TEXT,
  distance_km NUMERIC,
  price NUMERIC,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- GPS Tracking Events/History
CREATE TABLE public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_order_id UUID REFERENCES public.export_orders(id),
  event_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  location TEXT,
  gps_coordinates JSONB,
  status TEXT,
  shared_with UUID[],
  notes TEXT
);

-- Peer Mentorship Sessions
CREATE TABLE public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_network_id UUID REFERENCES public.farmer_contract_networks(id),
  mentor_id UUID REFERENCES auth.users(id),
  mentee_id UUID REFERENCES auth.users(id),
  session_date TIMESTAMP WITH TIME ZONE,
  topic TEXT,
  notes TEXT,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Invitations
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invited_email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  contract_network_id UUID REFERENCES public.farmer_contract_networks(id),
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Notifications table already created in auth_setup migration 