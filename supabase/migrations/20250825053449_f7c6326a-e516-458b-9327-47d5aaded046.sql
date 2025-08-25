-- Create core 12 tables with proper RLS policies for AgriConnect platform

-- 1. Profiles table (user management)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Farm Statistics (farm dashboard data)
CREATE TABLE public.farm_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_revenue NUMERIC DEFAULT 0,
  total_area NUMERIC DEFAULT 0,
  average_yield NUMERIC DEFAULT 0,
  active_alerts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Inventory Items (inventory management)
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  minimum_stock NUMERIC DEFAULT 0,
  unit_price NUMERIC(10,2) DEFAULT 0.00,
  total_value NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  unit TEXT NOT NULL,
  location TEXT,
  supplier TEXT,
  expiry_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'low_stock', 'out_of_stock', 'expired')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Inventory Transactions (inventory tracking)
CREATE TABLE public.inventory_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('in', 'out', 'adjustment', 'transfer')),
  quantity NUMERIC NOT NULL,
  reason TEXT,
  reference_number TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Notifications (notification system)
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success', 'low_stock')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Community Posts (community features)
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Post Comments (comments on community posts)
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. City Market Products (marketplace products)
CREATE TABLE public.city_market_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id TEXT NOT NULL,
  seller_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  quality_grade TEXT,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Bulk Orders (bulk ordering system)
CREATE TABLE public.bulk_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  max_price NUMERIC(10,2),
  delivery_location TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  requirements TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'partial', 'fulfilled', 'cancelled')),
  rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Logistics Providers (logistics services)
CREATE TABLE public.logistics_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  service_type TEXT[] NOT NULL,
  coverage_areas TEXT[] NOT NULL,
  vehicle_types TEXT[] NOT NULL,
  capacity_tons NUMERIC NOT NULL,
  rates JSONB,
  contact_info TEXT NOT NULL,
  rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_deliveries INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Delivery Requests (delivery tracking)
CREATE TABLE public.delivery_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.logistics_providers(id),
  pickup_location TEXT NOT NULL,
  pickup_county TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  delivery_county TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  cargo_weight_tons NUMERIC NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE,
  special_requirements TEXT[] DEFAULT '{}',
  estimated_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled')),
  tracking_number TEXT,
  notes TEXT,
  requester_rating INTEGER CHECK (requester_rating >= 1 AND requester_rating <= 5),
  provider_rating INTEGER CHECK (provider_rating >= 1 AND provider_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Weather Alerts (weather notification system)
CREATE TABLE public.weather_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('Cyclone', 'Rain', 'Drought', 'Flood', 'Heatwave')),
  region TEXT NOT NULL,
  severity TEXT DEFAULT 'moderate' CHECK (severity IN ('critical', 'moderate', 'low')),
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for farm_statistics
CREATE POLICY "Users can view own farm stats" ON public.farm_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own farm stats" ON public.farm_statistics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farm stats" ON public.farm_statistics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for inventory_items
CREATE POLICY "Users can manage own inventory" ON public.inventory_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON public.inventory_items FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for inventory_transactions
CREATE POLICY "Users can view own transactions" ON public.inventory_transactions FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.inventory_items WHERE id = item_id)
);
CREATE POLICY "Users can insert own transactions" ON public.inventory_transactions FOR INSERT WITH CHECK (
  auth.uid() = created_by AND auth.uid() IN (SELECT user_id FROM public.inventory_items WHERE id = item_id)
);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for community_posts
CREATE POLICY "Anyone can view active posts" ON public.community_posts FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own posts" ON public.community_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Anyone can view active comments" ON public.post_comments FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own comments" ON public.post_comments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for city_market_products
CREATE POLICY "Anyone can view available products" ON public.city_market_products FOR SELECT USING (status = 'available');
CREATE POLICY "Sellers can manage own products" ON public.city_market_products FOR ALL USING (auth.uid() = seller_user_id);
CREATE POLICY "Users can insert own products" ON public.city_market_products FOR INSERT WITH CHECK (auth.uid() = seller_user_id);

-- RLS Policies for bulk_orders
CREATE POLICY "Anyone can view open orders" ON public.bulk_orders FOR SELECT USING (status = 'open');
CREATE POLICY "Buyers can manage own orders" ON public.bulk_orders FOR ALL USING (auth.uid() = buyer_id);
CREATE POLICY "Users can insert own orders" ON public.bulk_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for logistics_providers
CREATE POLICY "Anyone can view active providers" ON public.logistics_providers FOR SELECT USING (is_active = true);
CREATE POLICY "Providers can manage own data" ON public.logistics_providers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own provider data" ON public.logistics_providers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for delivery_requests
CREATE POLICY "Requesters and providers can view requests" ON public.delivery_requests FOR SELECT USING (
  auth.uid() = requester_id OR 
  auth.uid() IN (SELECT user_id FROM public.logistics_providers WHERE id = provider_id)
);
CREATE POLICY "Requesters can create requests" ON public.delivery_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Requesters and providers can update requests" ON public.delivery_requests FOR UPDATE USING (
  auth.uid() = requester_id OR 
  auth.uid() IN (SELECT user_id FROM public.logistics_providers WHERE id = provider_id)
);

-- RLS Policies for weather_alerts
CREATE POLICY "Anyone can view active weather alerts" ON public.weather_alerts FOR SELECT USING (is_active = true);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farm_statistics_updated_at BEFORE UPDATE ON public.farm_statistics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_city_market_products_updated_at BEFORE UPDATE ON public.city_market_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bulk_orders_updated_at BEFORE UPDATE ON public.bulk_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_logistics_providers_updated_at BEFORE UPDATE ON public.logistics_providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_delivery_requests_updated_at BEFORE UPDATE ON public.delivery_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_farm_statistics_user_id ON public.farm_statistics(user_id);
CREATE INDEX idx_inventory_items_user_id ON public.inventory_items(user_id);
CREATE INDEX idx_inventory_items_status ON public.inventory_items(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_community_posts_active ON public.community_posts(is_active);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_city_market_products_status ON public.city_market_products(status);
CREATE INDEX idx_city_market_products_category ON public.city_market_products(category);
CREATE INDEX idx_bulk_orders_status ON public.bulk_orders(status);
CREATE INDEX idx_delivery_requests_status ON public.delivery_requests(status);
CREATE INDEX idx_weather_alerts_active ON public.weather_alerts(is_active);
CREATE INDEX idx_weather_alerts_region ON public.weather_alerts(region);