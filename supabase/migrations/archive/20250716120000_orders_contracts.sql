-- Add timeline_events table for export orders
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_order_id UUID REFERENCES public.export_orders(id),
  event_type TEXT NOT NULL, -- created, updated, shipped, delivered, cancelled, etc.
  event_description TEXT,
  event_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  actor_id UUID REFERENCES auth.users(id)
);

-- Add farmer_contract_networks table
CREATE TABLE public.farmer_contract_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_farmer_id UUID REFERENCES auth.users(id),
  contract_title TEXT NOT NULL,
  description TEXT,
  input_purchasing_terms TEXT,
  mentorship_terms TEXT,
  bargaining_terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add farmer_contract_members table
CREATE TABLE public.farmer_contract_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_network_id UUID REFERENCES public.farmer_contract_networks(id),
  farmer_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Add RLS policy for deleting export orders (only creator or admin)
ALTER TABLE public.export_orders ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

CREATE POLICY "User can delete their own export order"
ON public.export_orders
FOR DELETE
USING (auth.uid() = created_by OR auth.role() = 'admin'); 