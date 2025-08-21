-- Migration: Add status field to farm_input_orders
ALTER TABLE public.farm_input_orders
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Optionally, add an index for status
CREATE INDEX IF NOT EXISTS idx_farm_input_orders_status ON public.farm_input_orders(status);
