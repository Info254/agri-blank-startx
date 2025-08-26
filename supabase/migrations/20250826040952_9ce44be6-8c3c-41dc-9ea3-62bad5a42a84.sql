-- Create missing tables for components that are failing

-- Create market_prices table for AmisKe data
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commodity TEXT NOT NULL,
  market TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  date DATE NOT NULL,
  county TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for market prices (public data)
CREATE POLICY "Anyone can view market prices" 
ON public.market_prices 
FOR SELECT 
USING (true);

-- Create city_market_bids table
CREATE TABLE public.city_market_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID NOT NULL,
  bidder_user_id UUID NOT NULL,
  bid_amount NUMERIC NOT NULL,
  bid_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.city_market_bids ENABLE ROW LEVEL SECURITY;

-- Create policies for bids
CREATE POLICY "Bidders can view their own bids" 
ON public.city_market_bids 
FOR SELECT 
USING (auth.uid() = bidder_user_id);

CREATE POLICY "Bidders can insert their own bids" 
ON public.city_market_bids 
FOR INSERT 
WITH CHECK (auth.uid() = bidder_user_id);

CREATE POLICY "Bidders can update their own bids" 
ON public.city_market_bids 
FOR UPDATE 
USING (auth.uid() = bidder_user_id);

-- Create city_market_auctions table (referenced by bids)
CREATE TABLE public.city_market_auctions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  seller_user_id UUID NOT NULL,
  starting_price NUMERIC NOT NULL,
  current_price NUMERIC,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active',
  winner_bid_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.city_market_auctions ENABLE ROW LEVEL SECURITY;

-- Create policies for auctions
CREATE POLICY "Anyone can view active auctions" 
ON public.city_market_auctions 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Sellers can manage own auctions" 
ON public.city_market_auctions 
FOR ALL 
USING (auth.uid() = seller_user_id);

CREATE POLICY "Users can insert own auctions" 
ON public.city_market_auctions 
FOR INSERT 
WITH CHECK (auth.uid() = seller_user_id);

-- Add foreign key constraints
ALTER TABLE public.city_market_bids 
ADD CONSTRAINT fk_bids_auction 
FOREIGN KEY (auction_id) REFERENCES public.city_market_auctions(id) ON DELETE CASCADE;

ALTER TABLE public.city_market_auctions 
ADD CONSTRAINT fk_auctions_product 
FOREIGN KEY (product_id) REFERENCES public.city_market_products(id) ON DELETE CASCADE;

-- Create triggers for updated_at
CREATE TRIGGER update_market_prices_updated_at
BEFORE UPDATE ON public.market_prices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_city_market_bids_updated_at
BEFORE UPDATE ON public.city_market_bids
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_city_market_auctions_updated_at
BEFORE UPDATE ON public.city_market_auctions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();