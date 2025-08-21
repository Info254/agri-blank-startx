-- Security Fix Migration: RLS Policies and Role Protection (Fixed v2)
-- This migration addresses critical security vulnerabilities

-- 1. Create security definer function to prevent recursive RLS issues
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 2. Fix profiles table - prevent role escalation (only admins can change roles)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile (except role)" ON public.profiles;

CREATE POLICY "Users can update their own profile (except role)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (public.get_current_user_role() = 'admin')
);

-- 3. Add missing user_id column to animals table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'animals' AND column_name = 'user_id') THEN
    ALTER TABLE public.animals ADD COLUMN user_id UUID;
    -- Set default user_id for existing records to prevent RLS issues
    UPDATE public.animals SET user_id = '00000000-0000-0000-0000-000000000000'::uuid WHERE user_id IS NULL;
  END IF;
END $$;

-- 4. Enable RLS on animals table
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own animals" ON public.animals;
CREATE POLICY "Users can manage their own animals" 
ON public.animals 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Create and secure animal health table
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

DROP POLICY IF EXISTS "Users can manage their own animal health records" ON public.animal_health;
CREATE POLICY "Users can manage their own animal health records" 
ON public.animal_health 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Create and secure animal records table
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

DROP POLICY IF EXISTS "Users can manage their own animal records" ON public.animal_records;
CREATE POLICY "Users can manage their own animal records" 
ON public.animal_records 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Create and secure animal sales table
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

DROP POLICY IF EXISTS "Users can manage their own animal sales" ON public.animal_sales;
CREATE POLICY "Users can manage their own animal sales" 
ON public.animal_sales 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. Create and secure inventory items table
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

DROP POLICY IF EXISTS "Users can manage their own inventory" ON public.inventory_items;
CREATE POLICY "Users can manage their own inventory" 
ON public.inventory_items 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 9. Secure export documentation
ALTER TABLE public.export_documentation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view export documentation" ON public.export_documentation;
DROP POLICY IF EXISTS "Users can upload documentation" ON public.export_documentation;
DROP POLICY IF EXISTS "Admins can manage all documentation" ON public.export_documentation;

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

-- 10. Secure export opportunities
ALTER TABLE public.export_opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view export opportunities" ON public.export_opportunities;
DROP POLICY IF EXISTS "Admins can manage export opportunities" ON public.export_opportunities;

CREATE POLICY "Anyone can view export opportunities" 
ON public.export_opportunities 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage export opportunities" 
ON public.export_opportunities 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- 11. Secure farmer consolidations
ALTER TABLE public.farmer_consolidations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Consolidators can manage their consolidations" ON public.farmer_consolidations;
DROP POLICY IF EXISTS "Farmers can view consolidations they're part of" ON public.farmer_consolidations;

CREATE POLICY "Consolidators can manage their consolidations" 
ON public.farmer_consolidations 
FOR ALL 
USING (auth.uid() = consolidator_id);

CREATE POLICY "Farmers can view consolidations they're part of" 
ON public.farmer_consolidations 
FOR SELECT 
USING (auth.uid() = ANY(farmer_ids));

-- 12. Secure farmer contract members
ALTER TABLE public.farmer_contract_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Farmers can manage their own memberships" ON public.farmer_contract_members;

CREATE POLICY "Farmers can manage their own memberships" 
ON public.farmer_contract_members 
FOR ALL 
USING (auth.uid() = farmer_id);

-- 13. Create security audit log table
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

DROP POLICY IF EXISTS "Only admins can view security audit logs" ON public.security_audit_log;

CREATE POLICY "Only admins can view security audit logs" 
ON public.security_audit_log 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- 14. Create function to validate user permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_current_user_role() = required_role OR public.get_current_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;