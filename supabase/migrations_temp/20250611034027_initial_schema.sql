
-- Create API keys table for user authentication
CREATE TABLE public.api_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash text NOT NULL UNIQUE,
  key_preview text NOT NULL, -- First 8 chars for display
  name text NOT NULL DEFAULT 'Default API Key',
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone
);

-- Add RLS policies for API keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API keys" 
  ON public.api_keys 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" 
  ON public.api_keys 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" 
  ON public.api_keys 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" 
  ON public.api_keys 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create API usage tracking table
CREATE TABLE public.api_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key_id uuid NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL DEFAULT 'GET',
  status_code integer NOT NULL,
  response_time_ms integer,
  request_size_bytes integer DEFAULT 0,
  response_size_bytes integer DEFAULT 0,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add index for performance
CREATE INDEX idx_api_usage_user_date ON public.api_usage(user_id, created_at);
CREATE INDEX idx_api_usage_key_date ON public.api_usage(api_key_id, created_at);

-- Enable RLS for API usage
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own API usage" 
  ON public.api_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create function to check API rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_subscription_type text,
  p_time_window interval DEFAULT '1 minute'::interval
) RETURNS jsonb AS $$
DECLARE
  request_count integer;
  rate_limit integer;
  reset_time timestamp with time zone;
BEGIN
  -- Set rate limits based on subscription type
  CASE p_subscription_type
    WHEN 'free' THEN rate_limit := 100;
    WHEN 'developer' THEN rate_limit := 500;
    WHEN 'enterprise' THEN rate_limit := 2000;
    ELSE rate_limit := 10; -- Very restrictive for invalid subscriptions
  END CASE;
  
  -- Calculate reset time (next minute boundary)
  reset_time := date_trunc('minute', now()) + interval '1 minute';
  
  -- Count requests in the current time window
  SELECT COUNT(*)
  INTO request_count
  FROM public.api_usage
  WHERE user_id = p_user_id
    AND created_at >= (now() - p_time_window);
  
  RETURN jsonb_build_object(
    'allowed', request_count < rate_limit,
    'limit', rate_limit,
    'remaining', GREATEST(0, rate_limit - request_count),
    'reset_time', reset_time,
    'current_usage', request_count
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to validate API key and get user info
CREATE OR REPLACE FUNCTION validate_api_key(p_key_hash text)
RETURNS jsonb AS $$
DECLARE
  key_record record;
  subscription_info record;
  result jsonb;
BEGIN
  -- Get API key info
  SELECT ak.*, p.id as profile_id, p.full_name, p.email
  INTO key_record
  FROM public.api_keys ak
  LEFT JOIN public.profiles p ON ak.user_id = p.id
  WHERE ak.key_hash = p_key_hash 
    AND ak.is_active = true
    AND (ak.expires_at IS NULL OR ak.expires_at > now());
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired API key');
  END IF;
  
  -- Get subscription info from business advertisements
  SELECT 
    CASE 
      WHEN MAX(amount_paid) >= 15000 THEN 'enterprise'
      WHEN MAX(amount_paid) >= 2500 THEN 'developer'
      ELSE 'free'
    END as subscription_type,
    COUNT(*) as active_ads
  INTO subscription_info
  FROM public.business_advertisements
  WHERE user_id = key_record.user_id
    AND payment_status = 'paid'
    AND expires_at > now()
    AND is_active = true;
  
  -- Update last used timestamp
  UPDATE public.api_keys 
  SET last_used_at = now() 
  WHERE id = key_record.id;
  
  result := jsonb_build_object(
    'valid', true,
    'user_id', key_record.user_id,
    'api_key_id', key_record.id,
    'subscription_type', COALESCE(subscription_info.subscription_type, 'free'),
    'user_name', key_record.full_name,
    'user_email', key_record.email
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
