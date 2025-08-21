-- Security Fix Phase 1: Add missing RLS policies for critical tables

-- Create security definer function for role checking to prevent recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Animals RLS policies already created in logistics migration

-- RLS policies for these tables already created in later migrations

-- Collaboration proposals RLS policies already created in marketplace migration

-- Profiles and notification policies already created in earlier migrations

-- Bulk order bids policies will be created when table exists