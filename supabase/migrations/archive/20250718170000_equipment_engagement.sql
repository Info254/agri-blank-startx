-- Equipment Marketplace Engagement Tables

CREATE TABLE IF NOT EXISTS public.equipment_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.equipment_bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.equipment_ratings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.equipment_flags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.equipment_ban_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.equipment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_ban_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can manage their own, admins can manage all)
CREATE POLICY "Users can manage their own equipment likes"
  ON public.equipment_likes
  FOR ALL
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Admins can manage all equipment likes"
  ON public.equipment_likes
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can manage their own equipment bookmarks"
  ON public.equipment_bookmarks
  FOR ALL
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Admins can manage all equipment bookmarks"
  ON public.equipment_bookmarks
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can manage their own equipment ratings"
  ON public.equipment_ratings
  FOR ALL
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Admins can manage all equipment ratings"
  ON public.equipment_ratings
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can manage their own equipment flags"
  ON public.equipment_flags
  FOR ALL
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Admins can manage all equipment flags"
  ON public.equipment_flags
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can manage their own equipment ban recommendations"
  ON public.equipment_ban_recommendations
  FOR ALL
  USING (user_id = auth.uid()::uuid);

CREATE POLICY "Admins can manage all equipment ban recommendations"
  ON public.equipment_ban_recommendations
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));
