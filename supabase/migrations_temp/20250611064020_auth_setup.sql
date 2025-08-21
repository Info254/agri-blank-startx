
-- Create tables for farmer functionality
CREATE TABLE public.farm_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  crop TEXT NOT NULL,
  date TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for farm statistics
CREATE TABLE public.farm_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  monthly_revenue NUMERIC DEFAULT 0,
  total_area NUMERIC DEFAULT 0,
  average_yield NUMERIC DEFAULT 0,
  active_alerts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for weather alerts
CREATE TABLE public.weather_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('Cyclone', 'Rain', 'Drought')),
  region TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'moderate', 'low')),
  description TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  contact_number TEXT,
  county TEXT,
  bio TEXT,
  farm_size NUMERIC,
  farm_type TEXT,
  experience_years INTEGER,
  specialization TEXT[],
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for pricing tiers
CREATE TABLE public.pricing_tiers (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  period TEXT NOT NULL,
  requests INTEGER NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.farm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for farm_tasks
CREATE POLICY "Users can view their own farm tasks" ON public.farm_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own farm tasks" ON public.farm_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own farm tasks" ON public.farm_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own farm tasks" ON public.farm_tasks FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for farm_statistics
CREATE POLICY "Users can view their own farm statistics" ON public.farm_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own farm statistics" ON public.farm_statistics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own farm statistics" ON public.farm_statistics FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for weather_alerts (public read access)
CREATE POLICY "Anyone can view active weather alerts" ON public.weather_alerts FOR SELECT USING (is_active = true);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for pricing_tiers (public read access)
CREATE POLICY "Anyone can view active pricing tiers" ON public.pricing_tiers FOR SELECT USING (is_active = true);

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Insert default pricing tiers
INSERT INTO public.pricing_tiers (id, name, price, currency, period, requests, features, is_popular, is_active) VALUES
('free', 'Free Tier', 0, 'KES', '/month', 1000, ARRAY['Basic API access', 'Community support', 'Standard rate limits'], false, true),
('developer', 'Developer', 2500, 'KES', '/month', 50000, ARRAY['Advanced API access', 'Email support', 'Higher rate limits', 'Analytics dashboard'], true, true),
('enterprise', 'Enterprise', 15000, 'KES', '/month', 500000, ARRAY['Full API access', 'Priority support', 'Custom rate limits', 'Dedicated account manager', 'Custom integrations'], false, true);

-- Create function for updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_farm_tasks_updated_at BEFORE UPDATE ON public.farm_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farm_statistics_updated_at BEFORE UPDATE ON public.farm_statistics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
