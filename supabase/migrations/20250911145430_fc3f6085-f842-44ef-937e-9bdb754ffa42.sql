-- Create missing tables for the agricultural platform

-- Subscription boxes table
CREATE TABLE public.subscription_boxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  producer_id UUID NOT NULL,
  contents JSONB,
  available_slots INTEGER DEFAULT 0,
  delivery_frequency TEXT DEFAULT 'weekly',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subscription box deliveries
CREATE TABLE public.subscription_box_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  box_id UUID NOT NULL REFERENCES public.subscription_boxes(id),
  consumer_id UUID NOT NULL,
  delivery_date DATE NOT NULL,
  status TEXT DEFAULT 'scheduled',
  delivery_address TEXT,
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Equipment marketplace
CREATE TABLE public.equipment_marketplace (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  location TEXT,
  county TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  available_for TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Translation cache for multilingual support
CREATE TABLE public.translation_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_language TEXT NOT NULL DEFAULT 'en',
  target_language TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Food rescue coordination
CREATE TABLE public.food_rescue_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  food_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  pickup_before DATE NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transport coordination for group buying
CREATE TABLE public.transport_coordination (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_name TEXT NOT NULL,
  coordinator_id UUID NOT NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  max_capacity NUMERIC NOT NULL,
  current_bookings NUMERIC DEFAULT 0,
  cost_per_kg NUMERIC,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bluetooth mesh coordination
CREATE TABLE public.bluetooth_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_id TEXT NOT NULL,
  device_name TEXT,
  connection_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Price alerts system
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  commodity TEXT NOT NULL,
  county TEXT,
  target_price NUMERIC NOT NULL,
  alert_type TEXT DEFAULT 'above', -- 'above', 'below'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Nairobi-Nakuru corridor marketplaces
CREATE TABLE public.corridor_marketplaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  gps_coordinates TEXT,
  market_days TEXT[],
  specialties TEXT[],
  contact_info TEXT,
  facilities JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_box_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_rescue_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bluetooth_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corridor_marketplaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own subscription boxes" ON public.subscription_boxes FOR ALL USING (auth.uid() = producer_id);
CREATE POLICY "Anyone can view active subscription boxes" ON public.subscription_boxes FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own deliveries" ON public.subscription_box_deliveries FOR ALL USING (auth.uid() = consumer_id);

CREATE POLICY "Users can manage own equipment" ON public.equipment_marketplace FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Anyone can view active equipment" ON public.equipment_marketplace FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read translations" ON public.translation_cache FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert translations" ON public.translation_cache FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own food rescue requests" ON public.food_rescue_requests FOR ALL USING (auth.uid() = requester_id);
CREATE POLICY "Anyone can view active food rescue requests" ON public.food_rescue_requests FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage own transport coordination" ON public.transport_coordination FOR ALL USING (auth.uid() = coordinator_id);
CREATE POLICY "Anyone can view open transport options" ON public.transport_coordination FOR SELECT USING (status = 'open');

CREATE POLICY "Users can manage own bluetooth connections" ON public.bluetooth_connections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own price alerts" ON public.price_alerts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view corridor marketplaces" ON public.corridor_marketplaces FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage marketplaces" ON public.corridor_marketplaces FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data for Nairobi-Nakuru corridor
INSERT INTO public.corridor_marketplaces (name, location, county, market_days, specialties, facilities) VALUES
('Kijabe Market', 'Kijabe Town', 'Kiambu', ARRAY['Tuesday', 'Friday'], ARRAY['Potatoes', 'Cabbages', 'Carrots'], '{"parking": true, "toilets": true, "banking": false}'),
('Uplands Market', 'Uplands Area', 'Kiambu', ARRAY['Wednesday', 'Saturday'], ARRAY['Dairy Products', 'Vegetables'], '{"parking": true, "toilets": true, "banking": true}'),
('Makutano Junction', 'Makutano', 'Kiambu', ARRAY['Monday', 'Thursday'], ARRAY['Grains', 'Legumes'], '{"parking": false, "toilets": true, "banking": false}'),
('Soko Mjinga', 'Kijabe-Naivasha Road', 'Kiambu', ARRAY['Daily'], ARRAY['Mixed Produce', 'Livestock Feed'], '{"parking": true, "toilets": false, "banking": false}');

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_boxes_updated_at BEFORE UPDATE ON public.subscription_boxes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_box_deliveries_updated_at BEFORE UPDATE ON public.subscription_box_deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_marketplace_updated_at BEFORE UPDATE ON public.equipment_marketplace FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_food_rescue_requests_updated_at BEFORE UPDATE ON public.food_rescue_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transport_coordination_updated_at BEFORE UPDATE ON public.transport_coordination FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON public.price_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_corridor_marketplaces_updated_at BEFORE UPDATE ON public.corridor_marketplaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();