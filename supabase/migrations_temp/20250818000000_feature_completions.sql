-- Create functions for inventory management
CREATE OR REPLACE FUNCTION update_inventory_quantity(
  p_item_id UUID,
  p_quantity_change NUMERIC
) RETURNS VOID AS $$
BEGIN
  UPDATE inventory_items
  SET quantity = quantity + p_quantity_change,
      updated_at = NOW()
  WHERE id = p_item_id;

  -- Check for low stock and trigger notifications
  INSERT INTO notifications (user_id, type, message)
  SELECT user_id, 'low_stock', 'Item ' || item_name || ' is running low on stock'
  FROM inventory_items
  WHERE id = p_item_id AND quantity <= minimum_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for inventory transfers
CREATE OR REPLACE FUNCTION transfer_inventory(
  p_from_item_id UUID,
  p_to_item_id UUID,
  p_quantity NUMERIC,
  p_reason TEXT
) RETURNS VOID AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Reduce quantity from source
    UPDATE inventory_items
    SET quantity = quantity - p_quantity
    WHERE id = p_from_item_id AND quantity >= p_quantity;

    -- Add quantity to destination
    UPDATE inventory_items
    SET quantity = quantity + p_quantity
    WHERE id = p_to_item_id;

    -- Record transfer transaction
    INSERT INTO inventory_transactions (
      item_id,
      transaction_type,
      quantity,
      reason,
      reference_number
    ) VALUES
    (p_from_item_id, 'out', p_quantity, p_reason, 'TR-' || NOW()::text),
    (p_to_item_id, 'in', p_quantity, p_reason, 'TR-' || NOW()::text);

    -- Commit transaction
    COMMIT;
  EXCEPTION WHEN OTHERS THEN
    -- Rollback on error
    ROLLBACK;
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for market analytics
CREATE OR REPLACE FUNCTION get_market_metrics(
  p_market_id UUID
) RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH metrics AS (
    SELECT
      COUNT(*) as total_listings,
      AVG(price) as avg_price,
      MAX(price) as max_price,
      MIN(price) as min_price,
      SUM(quantity) as total_volume,
      COUNT(*) FILTER (WHERE status = 'sold') as completed_deals
    FROM city_market_products
    WHERE market_id = p_market_id
      AND created_at >= NOW() - INTERVAL '24 hours'
  ),
  prev_metrics AS (
    SELECT
      AVG(price) as prev_avg_price,
      SUM(quantity) as prev_volume
    FROM city_market_products
    WHERE market_id = p_market_id
      AND created_at >= NOW() - INTERVAL '48 hours'
      AND created_at < NOW() - INTERVAL '24 hours'
  )
  SELECT json_build_object(
    'totalVolume', m.total_volume,
    'averagePrice', m.avg_price,
    'highestPrice', m.max_price,
    'lowestPrice', m.min_price,
    'priceChange24h', COALESCE((m.avg_price - p.prev_avg_price) / p.prev_avg_price * 100, 0),
    'volumeChange24h', COALESCE((m.total_volume - p.prev_volume) / p.prev_volume * 100, 0),
    'activeListings', m.total_listings,
    'completedDeals', m.completed_deals
  ) INTO result
  FROM metrics m
  CROSS JOIN prev_metrics p;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for reputation management
CREATE OR REPLACE FUNCTION calculate_trust_level(
  p_user_id UUID
) RETURNS TEXT AS $$
DECLARE
  transaction_count INTEGER;
  success_rate NUMERIC;
  avg_rating NUMERIC;
  account_age INTERVAL;
  trust_level TEXT;
BEGIN
  -- Get user metrics
  SELECT
    COUNT(*),
    AVG(CASE WHEN status = 'completed' THEN 1 ELSE 0 END),
    AVG(rating)
  INTO
    transaction_count,
    success_rate,
    avg_rating
  FROM (
    SELECT status, rating
    FROM city_market_products
    WHERE seller_user_id = p_user_id
    UNION ALL
    SELECT status, rating
    FROM bulk_orders
    WHERE buyer_id = p_user_id
  ) combined;

  -- Get account age
  SELECT NOW() - created_at INTO account_age
  FROM auth.users
  WHERE id = p_user_id;

  -- Calculate trust level
  trust_level := CASE
    WHEN transaction_count >= 100 AND success_rate >= 0.95 AND avg_rating >= 4.5 AND account_age >= INTERVAL '1 year' THEN 'expert'
    WHEN transaction_count >= 50 AND success_rate >= 0.9 AND avg_rating >= 4.0 AND account_age >= INTERVAL '6 months' THEN 'trusted'
    WHEN transaction_count >= 10 AND success_rate >= 0.8 AND avg_rating >= 3.5 AND account_age >= INTERVAL '1 month' THEN 'basic'
    ELSE 'new'
  END;

  RETURN trust_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
