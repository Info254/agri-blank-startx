
-- Create delivery_requests table to track logistics activities
CREATE TABLE public.delivery_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users NOT NULL,
  provider_id UUID REFERENCES public.logistics_providers,
  pickup_location TEXT NOT NULL,
  pickup_county TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  delivery_county TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  cargo_weight_tons NUMERIC NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE,
  special_requirements TEXT[] DEFAULT '{}',
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'in_transit', 'delivered', 'cancelled'
  tracking_number TEXT,
  notes TEXT,
  requester_rating INTEGER,
  provider_rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;

-- Warehouses and logistics_providers policies already created in earlier migration

-- Delivery requests policies
CREATE POLICY "Users can view their own delivery requests" 
  ON public.delivery_requests 
  FOR SELECT 
  USING (auth.uid() = requester_id OR auth.uid() IN (
    SELECT user_id FROM public.logistics_providers WHERE id = provider_id
  ));

CREATE POLICY "Users can create delivery requests" 
  ON public.delivery_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters and providers can update delivery requests" 
  ON public.delivery_requests 
  FOR UPDATE 
  USING (auth.uid() = requester_id OR auth.uid() IN (
    SELECT user_id FROM public.logistics_providers WHERE id = provider_id
  ));

-- Warehouses and logistics_providers triggers already created in earlier migration



CREATE TRIGGER set_timestamp_delivery_requests
  BEFORE UPDATE ON public.delivery_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Sample data already inserted in earlier migration
