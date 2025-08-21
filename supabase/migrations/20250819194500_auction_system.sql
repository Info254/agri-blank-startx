-- Real-time Auction System Migration
-- Creates comprehensive auction workflow with WebSocket bidding and escrow payments

-- Auctions table
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  commodity TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quality_grade TEXT,
  location TEXT,
  description TEXT,
  starting_price NUMERIC NOT NULL,
  reserve_price NUMERIC,
  current_highest_bid NUMERIC DEFAULT 0,
  current_winner_id UUID REFERENCES auth.users(id),
  bid_increment NUMERIC DEFAULT 10,
  currency TEXT DEFAULT 'KES',
  auction_type TEXT DEFAULT 'standard' CHECK (auction_type IN ('standard', 'dutch', 'sealed_bid', 'reverse')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  auto_extend_minutes INTEGER DEFAULT 5,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'extended', 'ended', 'cancelled', 'completed')),
  images TEXT[],
  quality_certificates TEXT[],
  shipping_terms TEXT,
  payment_terms TEXT,
  inspection_period_hours INTEGER DEFAULT 24,
  total_bids INTEGER DEFAULT 0,
  unique_bidders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  
  -- Ensure end time is after start time
  CONSTRAINT valid_auction_times CHECK (end_time > start_time)
);

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES auth.users(id) NOT NULL,
  amount NUMERIC NOT NULL,
  bid_type TEXT DEFAULT 'standard' CHECK (bid_type IN ('standard', 'auto', 'proxy')),
  max_amount NUMERIC, -- For proxy bidding
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'outbid', 'winning', 'won', 'lost')),
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  
  -- Ensure positive bid amount
  CONSTRAINT positive_bid_amount CHECK (amount > 0)
);

-- Auction payments and escrow
CREATE TABLE IF NOT EXISTS public.auction_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  winning_bid_id UUID REFERENCES public.bids(id),
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  payment_method TEXT,
  escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending', 'deposited', 'released', 'refunded', 'disputed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  escrow_release_conditions TEXT[],
  milestone_payments JSONB,
  dispute_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deposited_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- Auction watchers (for notifications)
CREATE TABLE IF NOT EXISTS public.auction_watchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  notification_preferences JSONB DEFAULT '{"bid_updates": true, "ending_soon": true, "outbid_alerts": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(auction_id, user_id)
);

-- Auction history and events
CREATE TABLE IF NOT EXISTS public.auction_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'started', 'bid_placed', 'extended', 'ended', 'cancelled', 'payment_made', 'dispute_raised')),
  user_id UUID REFERENCES auth.users(id),
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-bidding configurations
CREATE TABLE IF NOT EXISTS public.auto_bidding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES auth.users(id) NOT NULL,
  max_bid_amount NUMERIC NOT NULL,
  bid_increment NUMERIC DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(auction_id, bidder_id)
);

-- Auction analytics
CREATE TABLE IF NOT EXISTS public.auction_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  total_watchers INTEGER DEFAULT 0,
  bid_frequency JSONB, -- Time-series data of bidding activity
  price_progression JSONB, -- Price changes over time
  geographic_distribution JSONB, -- Bidder locations
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_auctions_status ON public.auctions(status);
CREATE INDEX idx_auctions_start_time ON public.auctions(start_time);
CREATE INDEX idx_auctions_end_time ON public.auctions(end_time);
CREATE INDEX idx_auctions_commodity ON public.auctions(commodity);
CREATE INDEX idx_auctions_seller ON public.auctions(seller_id);
CREATE INDEX idx_bids_auction ON public.bids(auction_id);
CREATE INDEX idx_bids_bidder ON public.bids(bidder_id);
CREATE INDEX idx_bids_placed_at ON public.bids(placed_at);
CREATE INDEX idx_auction_payments_status ON public.auction_payments(escrow_status, payment_status);
CREATE INDEX idx_auction_events_auction ON public.auction_events(auction_id);
CREATE INDEX idx_auction_events_type ON public.auction_events(event_type);

-- Enable RLS
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_bidding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Auctions
CREATE POLICY "Anyone can view active auctions" ON public.auctions
  FOR SELECT USING (status IN ('scheduled', 'active', 'extended', 'ended'));

CREATE POLICY "Sellers can manage their auctions" ON public.auctions
  FOR ALL USING (auth.uid() = seller_id);

-- Bids
CREATE POLICY "Bidders can view their own bids" ON public.bids
  FOR SELECT USING (auth.uid() = bidder_id);

CREATE POLICY "Bidders can place bids" ON public.bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Sellers can view bids on their auctions" ON public.bids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.auctions 
      WHERE id = auction_id AND seller_id = auth.uid()
    )
  );

-- Auction payments
CREATE POLICY "Participants can view their payments" ON public.auction_payments
  FOR SELECT USING (auth.uid() IN (buyer_id, seller_id));

CREATE POLICY "Buyers can create payments" ON public.auction_payments
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Auction watchers
CREATE POLICY "Users can manage their watchlist" ON public.auction_watchers
  FOR ALL USING (auth.uid() = user_id);

-- Auction events
CREATE POLICY "Anyone can view auction events" ON public.auction_events
  FOR SELECT USING (true);

-- Auto bidding
CREATE POLICY "Users can manage their auto-bidding" ON public.auto_bidding
  FOR ALL USING (auth.uid() = bidder_id);

-- Auction analytics
CREATE POLICY "Sellers can view their auction analytics" ON public.auction_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.auctions 
      WHERE id = auction_id AND seller_id = auth.uid()
    )
  );

-- Functions and Triggers

-- Function to update auction status
CREATE OR REPLACE FUNCTION update_auction_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-start scheduled auctions
  IF NEW.status = 'scheduled' AND NEW.start_time <= NOW() THEN
    NEW.status = 'active';
  END IF;
  
  -- Auto-end active auctions
  IF NEW.status = 'active' AND NEW.end_time <= NOW() THEN
    NEW.status = 'ended';
    NEW.ended_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auction_status_trigger
  BEFORE UPDATE ON public.auctions
  FOR EACH ROW
  EXECUTE FUNCTION update_auction_status();

-- Function to handle new bids
CREATE OR REPLACE FUNCTION process_new_bid()
RETURNS TRIGGER AS $$
DECLARE
  auction_record RECORD;
  previous_winner_id UUID;
BEGIN
  -- Get auction details
  SELECT * INTO auction_record FROM public.auctions WHERE id = NEW.auction_id;
  
  -- Validate bid amount
  IF NEW.amount <= auction_record.current_highest_bid THEN
    RAISE EXCEPTION 'Bid amount must be higher than current highest bid';
  END IF;
  
  -- Check if auction is active
  IF auction_record.status NOT IN ('active', 'extended') THEN
    RAISE EXCEPTION 'Auction is not active for bidding';
  END IF;
  
  -- Store previous winner
  previous_winner_id := auction_record.current_winner_id;
  
  -- Update auction with new highest bid
  UPDATE public.auctions 
  SET 
    current_highest_bid = NEW.amount,
    current_winner_id = NEW.bidder_id,
    total_bids = total_bids + 1,
    updated_at = NOW()
  WHERE id = NEW.auction_id;
  
  -- Update previous winning bid status
  IF previous_winner_id IS NOT NULL THEN
    UPDATE public.bids 
    SET status = 'outbid' 
    WHERE auction_id = NEW.auction_id AND bidder_id = previous_winner_id AND status = 'winning';
  END IF;
  
  -- Set new bid as winning
  NEW.status = 'winning';
  
  -- Auto-extend auction if bid placed in last few minutes
  IF auction_record.end_time - NOW() < INTERVAL '5 minutes' THEN
    UPDATE public.auctions 
    SET 
      end_time = end_time + INTERVAL '5 minutes',
      status = 'extended'
    WHERE id = NEW.auction_id;
  END IF;
  
  -- Log auction event
  INSERT INTO public.auction_events (auction_id, event_type, user_id, event_data)
  VALUES (NEW.auction_id, 'bid_placed', NEW.bidder_id, 
          jsonb_build_object('amount', NEW.amount, 'previous_high', auction_record.current_highest_bid));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_bid_trigger
  BEFORE INSERT ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION process_new_bid();

-- Function to handle auction completion
CREATE OR REPLACE FUNCTION complete_auction()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when auction ends
  IF OLD.status != 'ended' AND NEW.status = 'ended' THEN
    -- Update winning bid
    UPDATE public.bids 
    SET status = 'won' 
    WHERE auction_id = NEW.id AND bidder_id = NEW.current_winner_id AND status = 'winning';
    
    -- Update losing bids
    UPDATE public.bids 
    SET status = 'lost' 
    WHERE auction_id = NEW.id AND bidder_id != NEW.current_winner_id AND status IN ('active', 'outbid');
    
    -- Create payment record if there's a winner
    IF NEW.current_winner_id IS NOT NULL THEN
      INSERT INTO public.auction_payments (
        auction_id, buyer_id, seller_id, amount,
        winning_bid_id
      )
      SELECT 
        NEW.id, NEW.current_winner_id, NEW.seller_id, NEW.current_highest_bid,
        b.id
      FROM public.bids b 
      WHERE b.auction_id = NEW.id AND b.bidder_id = NEW.current_winner_id AND b.status = 'won';
    END IF;
    
    -- Log completion event
    INSERT INTO public.auction_events (auction_id, event_type, event_data)
    VALUES (NEW.id, 'ended', 
            jsonb_build_object('winning_bid', NEW.current_highest_bid, 'winner_id', NEW.current_winner_id));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER complete_auction_trigger
  AFTER UPDATE ON public.auctions
  FOR EACH ROW
  EXECUTE FUNCTION complete_auction();

-- Function to update unique bidders count
CREATE OR REPLACE FUNCTION update_unique_bidders()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.auctions 
  SET unique_bidders = (
    SELECT COUNT(DISTINCT bidder_id) 
    FROM public.bids 
    WHERE auction_id = NEW.auction_id
  )
  WHERE id = NEW.auction_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_unique_bidders_trigger
  AFTER INSERT ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION update_unique_bidders();

-- Function for auto-bidding
CREATE OR REPLACE FUNCTION process_auto_bidding()
RETURNS TRIGGER AS $$
DECLARE
  auto_bid_record RECORD;
  next_bid_amount NUMERIC;
BEGIN
  -- Find active auto-bidding configurations for this auction
  FOR auto_bid_record IN 
    SELECT * FROM public.auto_bidding 
    WHERE auction_id = NEW.auction_id 
    AND is_active = true 
    AND bidder_id != NEW.bidder_id
    AND max_bid_amount > NEW.amount
  LOOP
    -- Calculate next bid amount
    next_bid_amount := NEW.amount + auto_bid_record.bid_increment;
    
    -- Don't exceed max bid amount
    IF next_bid_amount <= auto_bid_record.max_bid_amount THEN
      -- Place auto-bid
      INSERT INTO public.bids (auction_id, bidder_id, amount, bid_type)
      VALUES (NEW.auction_id, auto_bid_record.bidder_id, next_bid_amount, 'auto');
      
      -- Exit after first auto-bid to prevent cascading
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_bidding_trigger
  AFTER INSERT ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION process_auto_bidding();

-- Updated timestamp function
CREATE TRIGGER update_auctions_updated_at
  BEFORE UPDATE ON public.auctions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auction_payments_updated_at
  BEFORE UPDATE ON public.auction_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auto_bidding_updated_at
  BEFORE UPDATE ON public.auto_bidding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auction_analytics_updated_at
  BEFORE UPDATE ON public.auction_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
