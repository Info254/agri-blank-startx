
import { supabase } from "@/integrations/supabase/client";
import { MarketPriceRecord, MarketForecastRecord, MarketSentimentRecord, Market, Forecast } from "@/types";
import { AmisKePriceData, AmisKeMarket } from "./amis-ke/types";

/**
 * Fetches market prices from the Supabase database
 */
export const fetchRealMarketPrices = async (): Promise<MarketPriceRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('market_prices')
      .select('*')
      .order('date_recorded', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching market prices from Supabase:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching market prices:', error);
    return [];
  }
};

/**
 * Fetches market forecasts from the Supabase database
 */
export const fetchRealMarketForecasts = async (): Promise<MarketForecastRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('market_forecasts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching market forecasts from Supabase:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching market forecasts:', error);
    return [];
  }
};

/**
 * Fetches market sentiment data from the Supabase database
 */
export const fetchRealMarketSentiment = async (): Promise<MarketSentimentRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('market_sentiment')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching market sentiment from Supabase:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching market sentiment:', error);
    return [];
  }
};

/**
 * Saves AmisKe market prices to our Supabase database
 */
export const saveAmisKePrices = async (prices: AmisKePriceData[]): Promise<boolean> => {
  try {
    if (!prices.length) {
      console.warn('No prices to save');
      return false;
    }
    
    // Transform AMIS KE data to our database format
    const marketPrices = prices.map(price => ({
      market_id: price.id || 'unknown',
      market_name: price.market || 'Unknown Market',
      county: price.county || 'Unknown County',
      commodity_name: price.commodity || 'Unknown Commodity',
      price: price.price || 0,
      unit: price.unit || 'kg',
      date_recorded: price.date || new Date().toISOString(),
      source: 'AMIS_KE',
      confidence_score: 0.9,
      verified: false
    }));
    
    const { error } = await supabase
      .from('market_prices')
      .insert(marketPrices);
    
    if (error) {
      console.error('Error saving market prices to Supabase:', error);
      return false;
    }
    
    console.log(`Successfully saved ${marketPrices.length} prices to Supabase`);
    return true;
  } catch (error) {
    console.error('Unexpected error saving market prices:', error);
    return false;
  }
};

/**
 * Converts database market prices to app Market type
 */
export const convertToMarketFormat = (prices: MarketPriceRecord[]): Market[] => {
  // Group prices by market
  const marketMap = new Map<string, Market>();
  
  prices.forEach(price => {
    const marketId = price.market_id;
    
    if (!marketMap.has(marketId)) {
      marketMap.set(marketId, {
        id: marketId,
        name: price.market_name,
        county: price.county,
        location: {
          county: price.county,
          coordinates: undefined
        },
        producePrices: []
      });
    }
    
    const market = marketMap.get(marketId)!;
    
    market.producePrices.push({
      id: price.id,
      produceName: price.commodity_name,
      price: Number(price.price),
      unit: price.unit,
      date: new Date(price.date_recorded).toISOString().split('T')[0]
    });
  });
  
  return Array.from(marketMap.values());
};

/**
 * Converts database forecasts to app Forecast type
 */
export const convertToForecastFormat = (forecasts: MarketForecastRecord[]): Forecast[] => {
  return forecasts.map(forecast => {
    // Determine confidence level
    let confidenceLevel: 'low' | 'medium' | 'high' = 'medium';
    if (forecast.confidence_level < 0.6) confidenceLevel = 'low';
    else if (forecast.confidence_level >= 0.8) confidenceLevel = 'high';
    
    return {
      id: forecast.id,
      produceName: forecast.commodity_name,
      period: forecast.period,
      expectedProduction: Math.round(forecast.current_price * 0.9), // Simplified calculation
      expectedDemand: Math.round(forecast.forecast_price * 1.1),  // Simplified calculation
      confidenceLevel: confidenceLevel,
      county: forecast.county,
      unit: 'kg' // Default unit
    };
  });
};

/**
 * Fetch AMIS data and save to our database
 */
export const syncAmisDataToDatabase = async (): Promise<boolean> => {
  try {
    // Import functions from amis-ke module
    const { fetchAmisKePrices } = await import('./amis-ke');
    
    console.log('Fetching data from AMIS Kenya API...');
    const amisPrices = await fetchAmisKePrices();
    
    if (amisPrices.length > 0) {
      console.log(`Got ${amisPrices.length} prices from AMIS Kenya, saving to database...`);
      const saved = await saveAmisKePrices(amisPrices);
      return saved;
    } else {
      console.error('No prices returned from AMIS Kenya API');
      return false;
    }
  } catch (error) {
    console.error('Error syncing AMIS data to database:', error);
    return false;
  }
};
