-- City Market Engagement & Seller/Auction Tables

CREATE TABLE IF NOT EXISTS public.city_market_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id uuid NOT NULL REFERENCES city_markets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.city_market_ratings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id uuid NOT NULL REFERENCES city_markets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.city_market_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id uuid NOT NULL REFERENCES city_markets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.city_market_flags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id uuid NOT NULL REFERENCES city_markets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.city_market_ban_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id uuid NOT NULL REFERENCES city_markets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.city_market_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_user_id uuid NOT NULL,
  market_id uuid NOT NULL REFERENCES city_markets(id) ON DELETE CASCADE,
  product_type text NOT NULL,
  quantity numeric NOT NULL,
  price numeric NOT NULL,
  auction_status text DEFAULT 'none',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.city_market_auctions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES city_market_products(id) ON DELETE CASCADE,
  auction_start timestamptz NOT NULL,
  auction_end timestamptz NOT NULL,
  starting_price numeric NOT NULL,
  current_bid numeric,
  winner_user_id uuid,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.city_market_bids (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id uuid NOT NULL REFERENCES city_market_auctions(id) ON DELETE CASCADE,
  bidder_user_id uuid NOT NULL,
  bid_amount numeric NOT NULL,
  bid_time timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  market_id uuid REFERENCES city_markets(id),
  role text NOT NULL,
  profile_info text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.city_market_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_ban_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can manage their own, admins can manage all)
-- Drop existing policies if they exist to avoid duplicate errors
DROP POLICY IF EXISTS "Users can manage their own city market likes" ON public.city_market_likes;
DROP POLICY IF EXISTS "Admins can manage all city market likes" ON public.city_market_likes;
CREATE POLICY "Users can manage their own city market likes"
  ON public.city_market_likes
  FOR ALL
  USING (user_id = auth.uid()::uuid);
CREATE POLICY "Admins can manage all city market likes"
  ON public.city_market_likes
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can manage their own city market ratings" ON public.city_market_ratings;
DROP POLICY IF EXISTS "Admins can manage all city market ratings" ON public.city_market_ratings;
CREATE POLICY "Users can manage their own city market ratings"
  ON public.city_market_ratings
  FOR ALL
  USING (user_id = auth.uid()::uuid);
CREATE POLICY "Admins can manage all city market ratings"
  ON public.city_market_ratings
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can manage their own city market comments" ON public.city_market_comments;
DROP POLICY IF EXISTS "Admins can manage all city market comments" ON public.city_market_comments;
CREATE POLICY "Users can manage their own city market comments"
  ON public.city_market_comments
  FOR ALL
  USING (user_id = auth.uid()::uuid);
CREATE POLICY "Admins can manage all city market comments"
  ON public.city_market_comments
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can manage their own city market flags" ON public.city_market_flags;
DROP POLICY IF EXISTS "Admins can manage all city market flags" ON public.city_market_flags;
CREATE POLICY "Users can manage their own city market flags"
  ON public.city_market_flags
  FOR ALL
  USING (user_id = auth.uid()::uuid);
CREATE POLICY "Admins can manage all city market flags"
  ON public.city_market_flags
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can manage their own city market ban recommendations" ON public.city_market_ban_recommendations;
DROP POLICY IF EXISTS "Admins can manage all city market ban recommendations" ON public.city_market_ban_recommendations;
CREATE POLICY "Users can manage their own city market ban recommendations"
  ON public.city_market_ban_recommendations
  FOR ALL
  USING (user_id = auth.uid()::uuid);
CREATE POLICY "Admins can manage all city market ban recommendations"
  ON public.city_market_ban_recommendations
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can manage their own city market products" ON public.city_market_products;
DROP POLICY IF EXISTS "Admins can manage all city market products" ON public.city_market_products;
CREATE POLICY "Users can manage their own city market products"
  ON public.city_market_products
  FOR ALL
  USING (seller_user_id = auth.uid()::uuid);
CREATE POLICY "Admins can manage all city market products"
  ON public.city_market_products
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can manage their own city market auctions" ON public.city_market_auctions;
DROP POLICY IF EXISTS "Admins can manage all city market auctions" ON public.city_market_auctions;
CREATE POLICY "Users can manage their own city market auctions"
  ON public.city_market_auctions
  FOR ALL
  USING (EXISTS (SELECT 1 FROM city_market_products WHERE id = product_id AND seller_user_id = auth.uid()::uuid));
CREATE POLICY "Admins can manage all city market auctions"
  ON public.city_market_auctions
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can manage their own city market bids" ON public.city_market_bids;
DROP POLICY IF EXISTS "Admins can manage all city market bids" ON public.city_market_bids;
CREATE POLICY "Users can manage their own city market bids"
  ON public.city_market_bids
  FOR ALL
  USING (bidder_user_id = auth.uid()::uuid);
CREATE POLICY "Admins can manage all city market bids"
  ON public.city_market_bids
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users can manage their own agent profile" ON public.agents;
DROP POLICY IF EXISTS "Admins can manage all agent profiles" ON public.agents;
CREATE POLICY "Users can manage their own agent profile"
  ON public.agents
  FOR ALL
  USING (user_id = auth.uid()::uuid);
CREATE POLICY "Admins can manage all agent profiles"
  ON public.agents
  FOR ALL
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND role = 'admin'));
