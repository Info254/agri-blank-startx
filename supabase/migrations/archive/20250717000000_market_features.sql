-- Security Fix Migration: RLS Policies and Role Protection
-- This migration addresses critical security vulnerabilities

-- 1. Create security definer function to prevent recursive RLS issues
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 2. Fix profiles table - prevent role escalation
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Role update policy handled in later migrations

-- 3. Add RLS policies for unprotected tables

-- Animals table and policies already created in logistics migration

-- Animal Health table (needs to be created first)
CREATE TABLE IF NOT EXISTS public.animal_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  health_status TEXT NOT NULL,
  veterinarian_notes TEXT,
  treatment_date DATE,
  next_checkup DATE,
  vaccination_record JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.animal_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own animal health records" 
ON public.animal_health 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Animal Records table
CREATE TABLE IF NOT EXISTS public.animal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  record_type TEXT NOT NULL,
  record_data JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.animal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own animal records" 
ON public.animal_records 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Animal Sales table
CREATE TABLE IF NOT EXISTS public.animal_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES public.animals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  buyer_name TEXT,
  sale_price NUMERIC,
  sale_date DATE NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.animal_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own animal sales" 
ON public.animal_sales 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Inventory Items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  cost_per_unit NUMERIC,
  supplier TEXT,
  purchase_date DATE,
  expiry_date DATE,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own inventory" 
ON public.inventory_items 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix existing tables without proper RLS
-- Export Documentation
ALTER TABLE public.export_documentation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view export documentation" 
ON public.export_documentation 
FOR SELECT 
USING (true);

CREATE POLICY "Users can upload documentation" 
ON public.export_documentation 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all documentation" 
ON public.export_documentation 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Export Opportunities
ALTER TABLE public.export_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view export opportunities" 
ON public.export_opportunities 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage export opportunities" 
ON public.export_opportunities 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Farmer Consolidations
ALTER TABLE public.farmer_consolidations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consolidators can manage their consolidations" 
ON public.farmer_consolidations 
FOR ALL 
USING (auth.uid() = consolidator_id);

CREATE POLICY "Farmers can view consolidations they're part of" 
ON public.farmer_consolidations 
FOR SELECT 
USING (auth.uid() = ANY(farmer_ids));

-- Farmer Contract Members
ALTER TABLE public.farmer_contract_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can manage their own memberships" 
ON public.farmer_contract_members 
FOR ALL 
USING (auth.uid() = farmer_id);

-- Create contract_farming_networks table
CREATE TABLE IF NOT EXISTS public.contract_farming_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  network_name TEXT NOT NULL,
  commodity_type TEXT NOT NULL,
  contract_terms JSONB DEFAULT '{}',
  minimum_quantity NUMERIC,
  maximum_quantity NUMERIC,
  price_per_unit NUMERIC,
  payment_terms TEXT,
  delivery_requirements TEXT,
  quality_standards TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.contract_farming_networks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can manage their own networks" 
ON public.contract_farming_networks 
FOR ALL 
USING (auth.uid() = buyer_id);

CREATE POLICY "Anyone can view active networks" 
ON public.contract_farming_networks 
FOR SELECT 
USING (is_active = true);

-- Contract owners policy

-- Add missing user_id column to animals table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'animals' AND column_name = 'user_id') THEN
    ALTER TABLE public.animals ADD COLUMN user_id UUID;
  END IF;
END $$;

-- Update animals table to have proper user association
UPDATE public.animals SET user_id = auth.uid() WHERE user_id IS NULL;

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view security audit logs" 
ON public.security_audit_log 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Create trigger for audit logging
CREATE OR REPLACE FUNCTION public.log_security_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, table_name, record_id, old_values, new_values
  ) VALUES (
    auth.uid(), 
    TG_OP, 
    TG_TABLE_NAME, 
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
CREATE TRIGGER profiles_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_action();

-- Create function to validate user permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_current_user_role() = required_role OR public.get_current_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;