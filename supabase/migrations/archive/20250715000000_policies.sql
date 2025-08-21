-- Drop existing migration tables if they exist to recreate without sample data
DROP TABLE IF EXISTS market_prices CASCADE;
DROP TABLE IF EXISTS user_notification_preferences CASCADE;
DROP TABLE IF EXISTS price_alerts CASCADE;
DROP TABLE IF EXISTS user_bookmarks CASCADE;
DROP TABLE IF EXISTS service_providers CASCADE;
DROP TABLE IF EXISTS farmer_inventory CASCADE;
DROP TABLE IF EXISTS farmer_financial_transactions CASCADE;
DROP TABLE IF EXISTS land_parcels CASCADE;

-- Create market_prices table for real market data
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  county TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  market_id TEXT NOT NULL,
  confidence_score DECIMAL(3,2) DEFAULT 0.85,
  date_recorded TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'KAMIS',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user notification preferences
CREATE TABLE user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  price_alerts BOOLEAN DEFAULT true,
  market_updates BOOLEAN DEFAULT true,
  weather_alerts BOOLEAN DEFAULT true,
  training_notifications BOOLEAN DEFAULT true,
  preferred_counties TEXT[] DEFAULT '{}',
  preferred_commodities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price alerts table
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  commodity_name TEXT NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('above', 'below')) NOT NULL,
  county TEXT,
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user bookmarks table
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bookmark_type TEXT CHECK (bookmark_type IN ('market_data', 'service_provider', 'training_event')) NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive service providers table
CREATE TABLE service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  business_name TEXT NOT NULL,
  name TEXT,
  description TEXT NOT NULL,
  businessType TEXT CHECK (businessType IN (
    'storage', 'transport', 'quality-control', 'market-linkage', 'training',
    'input-supplier', 'inspector', 'insurance-provider', 'soil-testing-provider',
    'drone-satellite-imagery-provider', 'iot-sensor-data-provider', 
    'export-transporters', 'shippers'
  )) NOT NULL,
  provider_category TEXT NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  location JSONB NOT NULL,
  contact JSONB NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.0,
  reviewCount INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  licenses TEXT[],
  insurance_details TEXT,
  certifications TEXT[],
  experience TEXT,
  pricing JSONB,
  availability JSONB,
  capacity JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farmer inventory management table
CREATE TABLE farmer_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  unit_price DECIMAL(10,2),
  total_value DECIMAL(12,2),
  status TEXT CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')) DEFAULT 'in_stock',
  expiry_date DATE,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farmer financial transactions table
CREATE TABLE farmer_financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT,
  reference_number TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create land parcels table
CREATE TABLE land_parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  parcel_name TEXT NOT NULL,
  size_acres DECIMAL(8,2) NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB,
  soil_type TEXT,
  current_crop TEXT,
  crop_rotation_plan TEXT[],
  last_soil_test_date DATE,
  irrigation_system TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_parcels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for market_prices
CREATE POLICY "Anyone can view market prices" ON market_prices FOR SELECT USING (true);
CREATE POLICY "Admins can manage market prices" ON market_prices FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for user_notification_preferences
CREATE POLICY "Users can manage their notification preferences" ON user_notification_preferences 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for price_alerts
CREATE POLICY "Users can manage their price alerts" ON price_alerts 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_bookmarks
CREATE POLICY "Users can manage their bookmarks" ON user_bookmarks 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for service_providers
CREATE POLICY "Anyone can view verified service providers" ON service_providers FOR SELECT USING (verified = true);
CREATE POLICY "Users can manage their service provider profiles" ON service_providers 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for farmer_inventory
CREATE POLICY "Users can manage their inventory" ON farmer_inventory 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for farmer_financial_transactions
CREATE POLICY "Users can manage their financial transactions" ON farmer_financial_transactions 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for land_parcels
CREATE POLICY "Users can manage their land parcels" ON land_parcels 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_market_prices BEFORE UPDATE ON market_prices 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_user_notification_preferences BEFORE UPDATE ON user_notification_preferences 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_service_providers BEFORE UPDATE ON service_providers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_farmer_inventory BEFORE UPDATE ON farmer_inventory 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_farmer_financial_transactions BEFORE UPDATE ON farmer_financial_transactions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_land_parcels BEFORE UPDATE ON land_parcels 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create performance indexes
CREATE INDEX idx_market_prices_commodity ON market_prices(commodity_name);
CREATE INDEX idx_market_prices_county ON market_prices(county);
CREATE INDEX idx_market_prices_date ON market_prices(date_recorded DESC);
CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active);
CREATE INDEX idx_service_providers_type ON service_providers(businessType);
CREATE INDEX idx_service_providers_county ON service_providers((location->>'county'));
CREATE INDEX idx_farmer_inventory_user ON farmer_inventory(user_id);
CREATE INDEX idx_farmer_transactions_user ON farmer_financial_transactions(user_id);
CREATE INDEX idx_land_parcels_user ON land_parcels(user_id);