// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export interface MarketMetrics {
  totalVolume: number;
  averagePrice: number;
  highestPrice: number;
  lowestPrice: number;
  priceChange24h: number;
  volumeChange24h: number;
  activeListings: number;
  completedDeals: number;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface MarketTrend {
  timeframe: '1h' | '24h' | '7d' | '30d';
  direction: 'up' | 'down' | 'stable';
  percentageChange: number;
  absoluteChange: number;
}

export class MarketAnalytics {
  private supabase;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  async getMarketMetrics(marketId: string): Promise<MarketMetrics> {
    const { data, error } = await this.supabase.rpc('get_market_metrics', {
      p_market_id: marketId
    });

    if (error) throw error;
    return data;
  }

  async getPriceHistory(
    marketId: string,
    productType: string,
    timeframe: '1h' | '24h' | '7d' | '30d'
  ): Promise<PricePoint[]> {
    const { data, error } = await this.supabase.rpc('get_price_history', {
      p_market_id: marketId,
      p_product_type: productType,
      p_timeframe: timeframe
    });

    if (error) throw error;
    return data;
  }

  async getMarketTrends(marketId: string): Promise<MarketTrend[]> {
    const { data, error } = await this.supabase.rpc('get_market_trends', {
      p_market_id: marketId
    });

    if (error) throw error;
    return data;
  }

  async getPricePredictions(
    marketId: string,
    productType: string,
    daysAhead: number
  ): Promise<PricePoint[]> {
    const { data, error } = await this.supabase.rpc('predict_prices', {
      p_market_id: marketId,
      p_product_type: productType,
      p_days_ahead: daysAhead
    });

    if (error) throw error;
    return data;
  }
}

export function useRealtimeMarketMetrics(marketId: string) {
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const analytics = new MarketAnalytics(supabase);

  useEffect(() => {
    fetchMetrics();

    const subscription = supabase
      .channel('market_metrics')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'city_market_products',
          filter: `market_id=eq.${marketId}`
        },
        async () => {
          // Refresh metrics on any product changes
          await fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [marketId, supabase]);

  const fetchMetrics = async () => {
    try {
      const data = await analytics.getMarketMetrics(marketId);
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching market metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading };
}
