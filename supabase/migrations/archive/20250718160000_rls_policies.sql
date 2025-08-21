-- Enable RLS on all relevant tables
ALTER TABLE public.marketplace_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_ban_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_categories ENABLE ROW LEVEL SECURITY;

-- Allow users to view, insert, and update their own flags
CREATE POLICY "Users can view their own flags"
  ON public.marketplace_flags
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own flags"
  ON public.marketplace_flags
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own flags"
  ON public.marketplace_flags
  FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all flags" ON public.marketplace_flags;
DROP POLICY IF EXISTS "Admins can update all flags" ON public.marketplace_flags;
CREATE POLICY "Admins can view all flags"
  ON public.marketplace_flags
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all flags"
  ON public.marketplace_flags
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

-- Allow users to view, insert, and update their own ban recommendations
CREATE POLICY "Users can view their own ban recommendations"
  ON public.marketplace_ban_recommendations
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own ban recommendations"
  ON public.marketplace_ban_recommendations
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own ban recommendations"
  ON public.marketplace_ban_recommendations
  FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all ban recommendations" ON public.marketplace_ban_recommendations;
DROP POLICY IF EXISTS "Admins can update all ban recommendations" ON public.marketplace_ban_recommendations;
CREATE POLICY "Admins can view all ban recommendations"
  ON public.marketplace_ban_recommendations
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all ban recommendations"
  ON public.marketplace_ban_recommendations
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

-- Allow everyone to view farm input categories
CREATE POLICY "Public can view farm input categories"
  ON public.farm_input_categories
  FOR SELECT
  USING (true);
