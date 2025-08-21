
-- Create farm input marketplace tables
CREATE TABLE public.farm_input_suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  supplier_name TEXT NOT NULL,
  business_registration_number TEXT,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  sub_county TEXT,
  specialization TEXT[] NOT NULL, -- seeds, fertilizers, pesticides, equipment, etc
  certifications TEXT[] DEFAULT '{}',
  years_in_business INTEGER DEFAULT 0,
  delivery_radius_km INTEGER DEFAULT 50,
  minimum_order_value DECIMAL(10,2) DEFAULT 0,
  payment_terms TEXT[] DEFAULT '{}', -- cash, credit, mobile_money, bank_transfer
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.farm_input_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.farm_input_suppliers(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL, -- seeds, fertilizers, pesticides, equipment, tools
  product_subcategory TEXT, -- maize_seeds, npk_fertilizer, herbicide, tractor, etc
  brand_name TEXT,
  product_description TEXT,
  specifications JSONB, -- technical specs, active ingredients, etc
  unit_of_measure TEXT NOT NULL, -- kg, litres, pieces, bags
  price_per_unit DECIMAL(10,2) NOT NULL,
  minimum_order_quantity INTEGER DEFAULT 1,
  stock_quantity INTEGER DEFAULT 0,
  restock_level INTEGER DEFAULT 10,
  expiry_date DATE,
  batch_number TEXT,
  manufacturer TEXT,
  country_of_origin TEXT DEFAULT 'Kenya',
  organic_certified BOOLEAN DEFAULT FALSE,
  image_urls TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.farm_input_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users NOT NULL,
  supplier_id UUID REFERENCES public.farm_input_suppliers(id) NOT NULL,
  order_number TEXT UNIQUE NOT NULL DEFAULT ('FIO-' || EXTRACT(YEAR FROM now()) || '-' || LPAD(EXTRACT(DOY FROM now())::TEXT, 3, '0') || '-' || LPAD(EXTRACT(EPOCH FROM now())::TEXT, 10, '0')),
  order_status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, partial, failed
  payment_method TEXT, -- cash, mobile_money, bank_transfer, credit
  delivery_method TEXT NOT NULL, -- pickup, delivery, agent_delivery
  delivery_address TEXT,
  delivery_county TEXT,
  delivery_coordinates JSONB,
  requested_delivery_date DATE,
  actual_delivery_date DATE,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_email TEXT,
  special_instructions TEXT,
  order_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.farm_input_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.farm_input_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.farm_input_products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create smart network logistics tables
CREATE TABLE public.aggregators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  aggregator_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'aggregator', -- aggregator, cooperative, group
  registration_number TEXT,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  sub_county TEXT,
  coordinates JSONB,
  commodities_handled TEXT[] NOT NULL,
  storage_capacity_tons DECIMAL(10,2) DEFAULT 0,
  has_cold_storage BOOLEAN DEFAULT FALSE,
  has_drying_facilities BOOLEAN DEFAULT FALSE,
  has_packaging_facilities BOOLEAN DEFAULT FALSE,
  collection_points TEXT[] DEFAULT '{}',
  service_radius_km INTEGER DEFAULT 100,
  minimum_quantity_tons DECIMAL(8,2) DEFAULT 1,
  farmers_network_size INTEGER DEFAULT 0,
  pricing_model TEXT DEFAULT 'market_based', -- market_based, fixed_margin, negotiated
  commission_rate_percent DECIMAL(5,2) DEFAULT 0,
  payment_terms TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_transactions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.processors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  processor_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'processor', -- miller, oil_extractor, packager, value_adder
  registration_number TEXT,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  sub_county TEXT,
  coordinates JSONB,
  raw_materials_needed TEXT[] NOT NULL,
  processed_products TEXT[] NOT NULL,
  processing_capacity_tons_per_day DECIMAL(8,2) NOT NULL,
  processing_methods TEXT[] DEFAULT '{}',
  quality_standards TEXT[] DEFAULT '{}',
  minimum_quantity_tons DECIMAL(8,2) DEFAULT 1,
  service_radius_km INTEGER DEFAULT 200,
  pricing_model TEXT DEFAULT 'market_based',
  processing_fee_per_ton DECIMAL(8,2),
  payment_terms TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.micro_creditors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  institution_name TEXT NOT NULL,
  institution_type TEXT NOT NULL, -- microfinance, sacco, bank, fintech, ngo
  license_number TEXT,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  county TEXT NOT NULL,
  sub_county TEXT,
  coordinates JSONB,
  loan_products JSONB NOT NULL, -- [{name, min_amount, max_amount, interest_rate, term_months, requirements}]
  target_sectors TEXT[] NOT NULL, -- agriculture, livestock, agribusiness, equipment
  minimum_loan_amount DECIMAL(10,2) NOT NULL,
  maximum_loan_amount DECIMAL(10,2) NOT NULL,
  interest_rate_range TEXT NOT NULL, -- e.g., "12-18% per annum"
  collateral_requirements TEXT[] DEFAULT '{}',
  loan_processing_time_days INTEGER DEFAULT 7,
  service_counties TEXT[] NOT NULL,
  total_disbursed_amount DECIMAL(15,2) DEFAULT 0,
  active_borrowers INTEGER DEFAULT 0,
  default_rate_percent DECIMAL(5,2) DEFAULT 0,
  is_licensed BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.p2p_lending_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lender_id UUID REFERENCES auth.users NOT NULL,
  offer_title TEXT NOT NULL,
  loan_amount DECIMAL(10,2) NOT NULL,
  interest_rate_percent DECIMAL(5,2) NOT NULL,
  loan_term_months INTEGER NOT NULL,
  purpose_category TEXT NOT NULL, -- farm_input, equipment, livestock, processing, marketing
  specific_purpose TEXT,
  collateral_required BOOLEAN DEFAULT FALSE,
  collateral_description TEXT,
  risk_level TEXT NOT NULL, -- low, medium, high
  counties_served TEXT[] NOT NULL,
  minimum_borrower_rating DECIMAL(3,2) DEFAULT 0.0,
  application_deadline DATE,
  funding_status TEXT NOT NULL DEFAULT 'available', -- available, funded, closed
  borrower_requirements TEXT[] DEFAULT '{}',
  lender_name TEXT NOT NULL,
  lender_phone TEXT NOT NULL,
  lender_email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create city markets tables
CREATE TABLE public.city_markets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_name TEXT NOT NULL,
  market_type TEXT NOT NULL, -- wholesale, retail, specialized, mixed
  city TEXT NOT NULL,
  county TEXT NOT NULL,
  physical_address TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  operating_hours TEXT NOT NULL,
  operating_days TEXT[] NOT NULL,
  market_fee_structure JSONB, -- {daily_fee, monthly_fee, commission_percent}
  facilities TEXT[] DEFAULT '{}', -- cold_storage, parking, banking, loading_bay
  commodities_traded TEXT[] NOT NULL,
  average_daily_traders INTEGER DEFAULT 0,
  average_daily_buyers INTEGER DEFAULT 0,
  established_year INTEGER,
  market_authority TEXT, -- county, private, cooperative
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  social_media JSONB, -- {facebook, twitter, whatsapp_group}
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.market_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  agent_name TEXT NOT NULL,
  agent_phone TEXT NOT NULL,
  agent_email TEXT,
  markets_covered UUID[] NOT NULL, -- Array of market IDs
  agent_type TEXT NOT NULL, -- official, community, private
  commission_structure JSONB, -- {onboarding_fee, transaction_percent, monthly_fee}
  services_offered TEXT[] NOT NULL, -- onboarding, brokerage, quality_assurance, logistics, training
  network_size INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  success_rate_percent DECIMAL(5,2) DEFAULT 0,
  languages_spoken TEXT[] DEFAULT '{"English", "Swahili"}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.market_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  agent_id UUID REFERENCES public.market_agents(id),
  market_id UUID REFERENCES public.city_markets(id) NOT NULL,
  participant_name TEXT NOT NULL,
  participant_type TEXT NOT NULL, -- seller, buyer, transporter
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  business_name TEXT,
  specialization TEXT[] NOT NULL, -- specific commodities or services
  location_details TEXT,
  coordinates JSONB,
  operating_schedule TEXT,
  capacity_description TEXT,
  price_range TEXT,
  quality_standards TEXT[] DEFAULT '{}',
  payment_methods TEXT[] NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_transactions INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  onboarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.market_demand_supply (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  market_id UUID REFERENCES public.city_markets(id) NOT NULL,
  commodity_name TEXT NOT NULL,
  entry_type TEXT NOT NULL, -- demand, supply
  quantity_needed DECIMAL(10,2),
  quantity_available DECIMAL(10,2),
  unit_of_measure TEXT NOT NULL,
  price_range_min DECIMAL(8,2),
  price_range_max DECIMAL(8,2),
  quality_requirements TEXT[] DEFAULT '{}',
  urgency_level TEXT DEFAULT 'normal', -- urgent, normal, flexible
  valid_until DATE NOT NULL,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  additional_notes TEXT,
  participant_id UUID REFERENCES public.market_participants(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.farm_input_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_creditors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.p2p_lending_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_demand_supply ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for farm input marketplace
CREATE POLICY "Anyone can view active suppliers" ON public.farm_input_suppliers FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create their supplier profile" ON public.farm_input_suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their supplier profile" ON public.farm_input_suppliers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view available products" ON public.farm_input_products FOR SELECT USING (is_available = true AND is_active = true);
CREATE POLICY "Suppliers can manage their products" ON public.farm_input_products FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.farm_input_suppliers WHERE id = supplier_id));

CREATE POLICY "Users can view their orders" ON public.farm_input_orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() IN (SELECT user_id FROM public.farm_input_suppliers WHERE id = supplier_id));
CREATE POLICY "Users can create orders" ON public.farm_input_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update their orders" ON public.farm_input_orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() IN (SELECT user_id FROM public.farm_input_suppliers WHERE id = supplier_id));

CREATE POLICY "Order items visible to order participants" ON public.farm_input_order_items FOR SELECT USING (order_id IN (SELECT id FROM public.farm_input_orders WHERE auth.uid() = buyer_id OR auth.uid() IN (SELECT user_id FROM public.farm_input_suppliers WHERE id = supplier_id)));

-- Create RLS policies for smart network logistics
CREATE POLICY "Anyone can view active aggregators" ON public.aggregators FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create their aggregator profile" ON public.aggregators FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their aggregator profile" ON public.aggregators FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active processors" ON public.processors FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create their processor profile" ON public.processors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their processor profile" ON public.processors FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active creditors" ON public.micro_creditors FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create their creditor profile" ON public.micro_creditors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their creditor profile" ON public.micro_creditors FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active lending offers" ON public.p2p_lending_offers FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create lending offers" ON public.p2p_lending_offers FOR INSERT WITH CHECK (auth.uid() = lender_id);
CREATE POLICY "Users can update their lending offers" ON public.p2p_lending_offers FOR UPDATE USING (auth.uid() = lender_id);

-- Create RLS policies for city markets
CREATE POLICY "Anyone can view active markets" ON public.city_markets FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage markets" ON public.city_markets FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin.%'));

CREATE POLICY "Anyone can view verified agents" ON public.market_agents FOR SELECT USING (is_verified = true AND is_active = true);
CREATE POLICY "Users can create agent profile" ON public.market_agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their agent profile" ON public.market_agents FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active participants" ON public.market_participants FOR SELECT USING (is_active = true);
CREATE POLICY "Agents can manage their participants" ON public.market_participants FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.market_agents WHERE id = agent_id));
CREATE POLICY "Users can create participant profile" ON public.market_participants FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM public.market_agents WHERE id = agent_id));

CREATE POLICY "Anyone can view active demand/supply" ON public.market_demand_supply FOR SELECT USING (is_active = true);
CREATE POLICY "Participants can manage their listings" ON public.market_demand_supply FOR ALL USING (auth.uid() IN (SELECT COALESCE(user_id, (SELECT user_id FROM public.market_agents WHERE id = agent_id)) FROM public.market_participants WHERE id = participant_id));

-- Create indexes for better performance
CREATE INDEX idx_farm_input_products_supplier ON public.farm_input_products(supplier_id);
CREATE INDEX idx_farm_input_products_category ON public.farm_input_products(product_category);
CREATE INDEX idx_farm_input_orders_buyer ON public.farm_input_orders(buyer_id);
CREATE INDEX idx_farm_input_orders_supplier ON public.farm_input_orders(supplier_id);
CREATE INDEX idx_aggregators_county ON public.aggregators(county);
CREATE INDEX idx_processors_county ON public.processors(county);
CREATE INDEX idx_city_markets_county ON public.city_markets(county);
CREATE INDEX idx_market_participants_market ON public.market_participants(market_id);
CREATE INDEX idx_market_participants_agent ON public.market_participants(agent_id);
CREATE INDEX idx_market_demand_supply_market ON public.market_demand_supply(market_id);
