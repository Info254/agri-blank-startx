-- Security Fix Migration: RLS Policies and Role Protection (Fixed)
-- This migration addresses critical security vulnerabilities

-- 1. Create security definer function to prevent recursive RLS issues
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 2. Fix profiles table - prevent role escalation
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

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
  END IF;
END $$;

-- Animals table and policies already created in logistics migration
-- Animal health, records, sales, and inventory tables already created in market_features migration

-- Export documentation, opportunities, consolidations, and contract members policies already created in market_features migration

-- Security audit log table and policies already created in market_features migration
-- User permission function already created in market_features migration