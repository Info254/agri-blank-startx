-- Advanced Logistics Tracking System Migration
-- Creates comprehensive logistics workflow with GPS tracking, route optimization, and 8-factor costing

-- Logistics providers table
CREATE TABLE IF NOT EXISTS public.logistics_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  business_registration TEXT,
  contact_person TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  business_address TEXT NOT NULL,
  service_areas TEXT[],
  vehicle_types TEXT[],
  capacity_ranges JSONB, -- {"small": "0-500kg", "medium": "500-2000kg", "large": "2000kg+"}
  specializations TEXT[], -- refrigerated, bulk, fragile, etc
  operating_hours JSONB, -- {"monday": {"start": "08:00", "end": "18:00"}, ...}
  pricing_model TEXT DEFAULT 'per_km' CHECK (pricing_model IN ('per_km', 'per_kg', 'flat_rate', 'time_based')),
  base_rate NUMERIC NOT NULL,
  per_km_rate NUMERIC,
  per_kg_rate NUMERIC,
  fuel_surcharge_rate NUMERIC DEFAULT 0,
  insurance_coverage NUMERIC,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'suspended')),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_deliveries INTEGER DEFAULT 0,
  on_time_percentage DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.logistics_providers(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  make_model TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  capacity_kg NUMERIC NOT NULL,
  capacity_volume NUMERIC, -- cubic meters
  fuel_type TEXT DEFAULT 'petrol' CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  fuel_consumption_per_100km NUMERIC, -- liters per 100km
  insurance_expiry DATE,
  inspection_expiry DATE,
  gps_device_id TEXT,
  features TEXT[], -- refrigerated, GPS, loading_ramp, etc
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
  current_location POINT,
  last_location_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.logistics_providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  license_expiry DATE NOT NULL,
  experience_years INTEGER DEFAULT 0,
  specializations TEXT[], -- hazmat, refrigerated, livestock, etc
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_trips INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'on_trip', 'off_duty', 'suspended')),
  current_vehicle_id UUID REFERENCES public.vehicles(id),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipments table
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipper_id UUID REFERENCES auth.users(id) NOT NULL,
  provider_id UUID REFERENCES public.logistics_providers(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES public.drivers(id),
  
  -- Shipment details
  title TEXT NOT NULL,
  commodity TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  volume_m3 NUMERIC,
  quantity INTEGER DEFAULT 1,
  unit TEXT DEFAULT 'kg',
  special_requirements TEXT[],
  
  -- Locations
  pickup_address TEXT NOT NULL,
  pickup_coordinates POINT,
  delivery_address TEXT NOT NULL,
  delivery_coordinates POINT,
  
  -- Scheduling
  pickup_date DATE NOT NULL,
  pickup_time_start TIME,
  pickup_time_end TIME,
  delivery_date DATE,
  delivery_time_start TIME,
  delivery_time_end TIME,
  
  -- Route and tracking
  planned_route JSONB, -- GeoJSON route from OpenRouteService
  actual_route JSONB, -- Actual GPS tracking points
  distance_km NUMERIC,
  estimated_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,
  
  -- Pricing (8-factor calculation)
  base_cost NUMERIC NOT NULL,
  distance_cost NUMERIC DEFAULT 0,
  weight_cost NUMERIC DEFAULT 0,
  fuel_cost NUMERIC DEFAULT 0,
  driver_cost NUMERIC DEFAULT 0,
  toll_cost NUMERIC DEFAULT 0,
  insurance_cost NUMERIC DEFAULT 0,
  seasonal_adjustment NUMERIC DEFAULT 0,
  total_cost NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  
  -- Status tracking
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'pickup_scheduled', 'in_transit', 'delivered', 'cancelled', 'failed')),
  pickup_confirmed_at TIMESTAMPTZ,
  delivery_confirmed_at TIMESTAMPTZ,
  
  -- Customer satisfaction
  shipper_rating INTEGER CHECK (shipper_rating >= 1 AND shipper_rating <= 5),
  shipper_feedback TEXT,
  provider_rating INTEGER CHECK (provider_rating >= 1 AND provider_rating <= 5),
  provider_feedback TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time tracking events
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('pickup_started', 'pickup_completed', 'in_transit', 'delivery_started', 'delivery_completed', 'delay', 'issue')),
  location POINT,
  address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  photo_urls TEXT[],
  created_by UUID REFERENCES auth.users(id)
);

-- GPS tracking points
CREATE TABLE IF NOT EXISTS public.gps_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id),
  location POINT NOT NULL,
  speed_kmh NUMERIC,
  heading_degrees NUMERIC,
  altitude_m NUMERIC,
  accuracy_m NUMERIC,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Geospatial index for efficient location queries
  CONSTRAINT valid_coordinates CHECK (ST_X(location) BETWEEN -180 AND 180 AND ST_Y(location) BETWEEN -90 AND 90)
);

-- Route optimization requests
CREATE TABLE IF NOT EXISTS public.route_optimization (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.logistics_providers(id) NOT NULL,
  optimization_date DATE NOT NULL,
  shipment_ids UUID[],
  vehicle_constraints JSONB,
  optimization_result JSONB, -- Routes, distances, times from OpenRouteService
  total_distance_km NUMERIC,
  total_duration_minutes INTEGER,
  fuel_savings_percentage NUMERIC,
  cost_savings NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Logistics KPIs and analytics
CREATE TABLE IF NOT EXISTS public.logistics_kpis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.logistics_providers(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Delivery performance
  total_deliveries INTEGER DEFAULT 0,
  on_time_deliveries INTEGER DEFAULT 0,
  on_time_percentage DECIMAL(5,2) DEFAULT 0.00,
  average_delay_minutes INTEGER DEFAULT 0,
  
  -- Cost efficiency
  total_distance_km NUMERIC DEFAULT 0,
  total_fuel_consumption NUMERIC DEFAULT 0,
  fuel_efficiency_km_per_liter NUMERIC DEFAULT 0,
  cost_per_km NUMERIC DEFAULT 0,
  cost_per_kg NUMERIC DEFAULT 0,
  
  -- Customer satisfaction
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_ratings INTEGER DEFAULT 0,
  complaint_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Vehicle utilization
  vehicle_utilization_percentage DECIMAL(5,2) DEFAULT 0.00,
  average_load_factor DECIMAL(5,2) DEFAULT 0.00,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(provider_id, period_start, period_end)
);

-- Cost factors configuration
CREATE TABLE IF NOT EXISTS public.cost_factors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.logistics_providers(id),
  factor_name TEXT NOT NULL,
  factor_type TEXT NOT NULL CHECK (factor_type IN ('distance', 'weight', 'fuel', 'driver', 'tolls', 'insurance', 'seasonal', 'base')),
  calculation_method TEXT NOT NULL CHECK (calculation_method IN ('fixed', 'per_km', 'per_kg', 'percentage', 'time_based')),
  rate NUMERIC NOT NULL,
  minimum_charge NUMERIC DEFAULT 0,
  maximum_charge NUMERIC,
  is_active BOOLEAN DEFAULT true,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_logistics_providers_service_areas ON public.logistics_providers USING GIN(service_areas);
CREATE INDEX idx_vehicles_provider ON public.vehicles(provider_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_drivers_provider ON public.drivers(provider_id);
CREATE INDEX idx_drivers_status ON public.drivers(status);
CREATE INDEX idx_shipments_shipper ON public.shipments(shipper_id);
CREATE INDEX idx_shipments_provider ON public.shipments(provider_id);
CREATE INDEX idx_shipments_status ON public.shipments(status);
CREATE INDEX idx_shipments_pickup_date ON public.shipments(pickup_date);
CREATE INDEX idx_tracking_events_shipment ON public.tracking_events(shipment_id);
CREATE INDEX idx_gps_tracking_shipment ON public.gps_tracking(shipment_id);
CREATE INDEX idx_gps_tracking_timestamp ON public.gps_tracking(timestamp);
CREATE INDEX idx_gps_tracking_location ON public.gps_tracking USING GIST(location);

-- Enable RLS
ALTER TABLE public.logistics_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gps_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_factors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Logistics providers
CREATE POLICY "Anyone can view verified providers" ON public.logistics_providers
  FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Providers can manage their profile" ON public.logistics_providers
  FOR ALL USING (auth.uid() = user_id);

-- Vehicles
CREATE POLICY "Providers can manage their vehicles" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.logistics_providers 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view available vehicles" ON public.vehicles
  FOR SELECT USING (status = 'available');

-- Drivers
CREATE POLICY "Providers can manage their drivers" ON public.drivers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.logistics_providers 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- Shipments
CREATE POLICY "Shippers can manage their shipments" ON public.shipments
  FOR ALL USING (auth.uid() = shipper_id);

CREATE POLICY "Providers can view assigned shipments" ON public.shipments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.logistics_providers 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update assigned shipments" ON public.shipments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.logistics_providers 
      WHERE id = provider_id AND user_id = auth.uid()
    )
  );

-- Tracking events
CREATE POLICY "Shipment participants can view tracking" ON public.tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shipments s
      LEFT JOIN public.logistics_providers lp ON s.provider_id = lp.id
      WHERE s.id = shipment_id AND (s.shipper_id = auth.uid() OR lp.user_id = auth.uid())
    )
  );

CREATE POLICY "Providers can create tracking events" ON public.tracking_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shipments s
      LEFT JOIN public.logistics_providers lp ON s.provider_id = lp.id
      WHERE s.id = shipment_id AND lp.user_id = auth.uid()
    )
  );

-- GPS tracking
CREATE POLICY "Providers can manage GPS data" ON public.gps_tracking
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.shipments s
      LEFT JOIN public.logistics_providers lp ON s.provider_id = lp.id
      WHERE s.id = shipment_id AND lp.user_id = auth.uid()
    )
  );

-- Functions

-- Function to calculate 8-factor shipping cost
CREATE OR REPLACE FUNCTION calculate_shipping_cost(
  p_provider_id UUID,
  p_distance_km NUMERIC,
  p_weight_kg NUMERIC,
  p_pickup_date DATE DEFAULT CURRENT_DATE
) RETURNS NUMERIC AS $$
DECLARE
  v_total_cost NUMERIC := 0;
  v_factor RECORD;
  v_seasonal_multiplier NUMERIC := 1.0;
BEGIN
  -- Get seasonal multiplier (higher costs during harvest seasons)
  IF EXTRACT(MONTH FROM p_pickup_date) IN (3,4,5,10,11,12) THEN
    v_seasonal_multiplier := 1.2; -- 20% increase during peak seasons
  END IF;
  
  -- Calculate cost for each factor
  FOR v_factor IN 
    SELECT * FROM public.cost_factors 
    WHERE provider_id = p_provider_id AND is_active = true
    AND (effective_from IS NULL OR effective_from <= p_pickup_date)
    AND (effective_to IS NULL OR effective_to >= p_pickup_date)
  LOOP
    CASE v_factor.factor_type
      WHEN 'base' THEN
        v_total_cost := v_total_cost + v_factor.rate;
      WHEN 'distance' THEN
        v_total_cost := v_total_cost + (p_distance_km * v_factor.rate);
      WHEN 'weight' THEN
        v_total_cost := v_total_cost + (p_weight_kg * v_factor.rate);
      WHEN 'fuel' THEN
        v_total_cost := v_total_cost + (p_distance_km * v_factor.rate * v_seasonal_multiplier);
      WHEN 'seasonal' THEN
        v_total_cost := v_total_cost + (v_total_cost * v_factor.rate * (v_seasonal_multiplier - 1));
      ELSE
        v_total_cost := v_total_cost + v_factor.rate;
    END CASE;
    
    -- Apply minimum and maximum charges
    IF v_factor.minimum_charge IS NOT NULL AND v_total_cost < v_factor.minimum_charge THEN
      v_total_cost := v_factor.minimum_charge;
    END IF;
    
    IF v_factor.maximum_charge IS NOT NULL AND v_total_cost > v_factor.maximum_charge THEN
      v_total_cost := v_factor.maximum_charge;
    END IF;
  END LOOP;
  
  RETURN GREATEST(v_total_cost, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to update KPIs
CREATE OR REPLACE FUNCTION update_logistics_kpis()
RETURNS TRIGGER AS $$
DECLARE
  v_provider_id UUID;
  v_period_start DATE;
  v_period_end DATE;
BEGIN
  -- Get provider ID and period
  v_provider_id := COALESCE(NEW.provider_id, OLD.provider_id);
  v_period_start := DATE_TRUNC('month', COALESCE(NEW.updated_at, OLD.updated_at))::DATE;
  v_period_end := (DATE_TRUNC('month', COALESCE(NEW.updated_at, OLD.updated_at)) + INTERVAL '1 month - 1 day')::DATE;
  
  -- Update or insert KPI record
  INSERT INTO public.logistics_kpis (provider_id, period_start, period_end)
  VALUES (v_provider_id, v_period_start, v_period_end)
  ON CONFLICT (provider_id, period_start, period_end) DO NOTHING;
  
  -- Recalculate KPIs for the period
  UPDATE public.logistics_kpis 
  SET 
    total_deliveries = (
      SELECT COUNT(*) FROM public.shipments 
      WHERE provider_id = v_provider_id 
      AND status = 'delivered'
      AND delivery_confirmed_at::DATE BETWEEN v_period_start AND v_period_end
    ),
    on_time_deliveries = (
      SELECT COUNT(*) FROM public.shipments 
      WHERE provider_id = v_provider_id 
      AND status = 'delivered'
      AND delivery_confirmed_at <= (pickup_date + COALESCE(estimated_duration_minutes, 0) * INTERVAL '1 minute')
      AND delivery_confirmed_at::DATE BETWEEN v_period_start AND v_period_end
    ),
    total_distance_km = (
      SELECT COALESCE(SUM(distance_km), 0) FROM public.shipments 
      WHERE provider_id = v_provider_id 
      AND status = 'delivered'
      AND delivery_confirmed_at::DATE BETWEEN v_period_start AND v_period_end
    ),
    average_rating = (
      SELECT COALESCE(AVG(provider_rating), 0) FROM public.shipments 
      WHERE provider_id = v_provider_id 
      AND provider_rating IS NOT NULL
      AND delivery_confirmed_at::DATE BETWEEN v_period_start AND v_period_end
    ),
    updated_at = NOW()
  WHERE provider_id = v_provider_id 
  AND period_start = v_period_start 
  AND period_end = v_period_end;
  
  -- Update on-time percentage
  UPDATE public.logistics_kpis 
  SET on_time_percentage = CASE 
    WHEN total_deliveries > 0 THEN (on_time_deliveries::DECIMAL / total_deliveries * 100)
    ELSE 0 
  END
  WHERE provider_id = v_provider_id 
  AND period_start = v_period_start 
  AND period_end = v_period_end;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kpis_on_shipment_change
  AFTER UPDATE ON public.shipments
  FOR EACH ROW
  WHEN (OLD.status != NEW.status OR OLD.provider_rating != NEW.provider_rating)
  EXECUTE FUNCTION update_logistics_kpis();

-- Function to update vehicle location
CREATE OR REPLACE FUNCTION update_vehicle_location()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.vehicles 
  SET 
    current_location = NEW.location,
    last_location_update = NEW.timestamp
  WHERE id = NEW.vehicle_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_location_trigger
  AFTER INSERT ON public.gps_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_vehicle_location();

-- Updated timestamp triggers
CREATE TRIGGER update_logistics_providers_updated_at
  BEFORE UPDATE ON public.logistics_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_factors_updated_at
  BEFORE UPDATE ON public.cost_factors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
