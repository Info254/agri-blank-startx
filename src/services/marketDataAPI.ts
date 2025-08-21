import { supabase } from '@/integrations/supabase/client';

export interface KamisMarketData {
  id: string;
  product: string;
  market: string;
  county: string;
  date: string;
  min_price: number;
  max_price: number;
  average_price: number;
  currency: string;
  unit: string;
  source: string;
  verified: boolean;
}

export interface MarketInsight {
  id: string;
  product: string;
  trend: 'rising' | 'falling' | 'stable';
  prediction: string;
  recommendation: string;
  confidence: number;
  basis: string;
}

/**
 * Fetch real market data from KAMIS API
 * @returns Promise<KamisMarketData[]>
 */
export const fetchKamisRealData = async (): Promise<KamisMarketData[]> => {
  try {
    // First check our local database for cached data
    const { data: cachedData, error } = await supabase
      .from('market_prices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching cached market data:', error);
    }

    // Try to fetch fresh data from KAMIS API
    const response = await fetch('https://kamis.kilimo.go.ke/api/market-data', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const freshData = await response.json();
      console.log('Fresh KAMIS data fetched successfully');
      
      // Transform and return fresh data
      return transformKamisData(freshData);
    } else {
      console.warn('KAMIS API unavailable, using cached data');
      return transformSupabaseData(cachedData || []);
    }
  } catch (error) {
    console.error('Error fetching KAMIS data:', error);
    
    // Fallback to Supabase cached data
    const { data: fallbackData } = await supabase
      .from('market_prices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    return transformSupabaseData(fallbackData || []);
  }
};

/**
 * Transform KAMIS API data to our format
 */
const transformKamisData = (data: any[]): KamisMarketData[] => {
  return data.map((item, index) => ({
    id: item.id || `kamis-${index}`,
    product: item.product_name || item.commodity || 'Unknown',
    market: item.market_name || item.market || 'Various Markets',
    county: item.county || 'Multiple Counties',
    date: item.price_date || new Date().toISOString(),
    min_price: parseFloat(item.min_price) || 0,
    max_price: parseFloat(item.max_price) || 0,
    average_price: parseFloat(item.average_price) || parseFloat(item.price) || 0,
    currency: 'KES',
    unit: item.unit || 'kg',
    source: 'KAMIS - Ministry of Agriculture',
    verified: true
  }));
};

/**
 * Transform Supabase data to our format
 */
const transformSupabaseData = (data: any[]): KamisMarketData[] => {
  return data.map(item => ({
    id: item.id,
    product: item.commodity_name,
    market: item.market_name,
    county: item.county,
    date: item.price_date,
    min_price: item.min_price,
    max_price: item.max_price,
    average_price: item.average_price,
    currency: item.currency || 'KES',
    unit: item.unit || 'kg',
    source: item.source || 'Verified Market Data',
    verified: item.verified || true
  }));
};

/**
 * Generate market insights and recommendations
 */
export const generateMarketInsights = (marketData: KamisMarketData[]): MarketInsight[] => {
  const insights: MarketInsight[] = [];
  
  // Group by product to analyze trends
  const productGroups = marketData.reduce((acc, item) => {
    if (!acc[item.product]) acc[item.product] = [];
    acc[item.product].push(item);
    return acc;
  }, {} as Record<string, KamisMarketData[]>);

  Object.entries(productGroups).forEach(([product, prices]) => {
    if (prices.length < 2) return;

    // Sort by date
    prices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const latest = prices[prices.length - 1];
    const previous = prices[prices.length - 2];
    
    const priceChange = latest.average_price - previous.average_price;
    const percentChange = (priceChange / previous.average_price) * 100;
    
    let trend: 'rising' | 'falling' | 'stable' = 'stable';
    let recommendation = 'Monitor market conditions';
    let prediction = 'Prices expected to remain stable';
    
    if (Math.abs(percentChange) > 5) {
      trend = percentChange > 0 ? 'rising' : 'falling';
      
      if (trend === 'rising') {
        recommendation = 'Good time to sell if you have stock. Consider storage if prices may continue rising.';
        prediction = `${product} prices trending upward (+${percentChange.toFixed(1)}%)`;
      } else {
        recommendation = 'Hold inventory if possible. Prices may recover. Good buying opportunity.';
        prediction = `${product} prices declining (${percentChange.toFixed(1)}%)`;
      }
    }

    insights.push({
      id: `insight-${product.toLowerCase().replace(/\s+/g, '-')}`,
      product,
      trend,
      prediction,
      recommendation,
      confidence: Math.min(90, 60 + Math.abs(percentChange) * 2),
      basis: `Based on ${prices.length} recent price points from verified markets`
    });
  });

  return insights;
};

/**
 * Save market data to Supabase for caching
 */
export const saveMarketDataToSupabase = async (data: KamisMarketData[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('market_prices')
      .upsert(data.map(item => ({
        id: item.id,
        commodity_name: item.product,
        market_id: item.id, // Use id as market_id for now
        market_name: item.market,
        county: item.county,
        price: item.average_price, // Map average_price to price
        date_recorded: item.date,
        currency: item.currency,
        unit: item.unit,
        source: item.source,
        verified: item.verified
      })));

    if (error) {
      console.error('Error saving market data:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveMarketDataToSupabase:', error);
    return false;
  }
};