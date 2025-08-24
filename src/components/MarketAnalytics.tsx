import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface MarketStats {
  date: string;
  averagePrice: number;
  totalVolume: number;
  activeListings: number;
}

interface ProductPriceHistory {
  date: string;
  price: number;
  product: string;
}

export const MarketAnalytics: React.FC = () => {
  const [marketStats, setMarketStats] = useState<MarketStats[]>([]);
  const [priceHistory, setPriceHistory] = useState<ProductPriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      // Fetch market statistics
      const { data: statsData, error: statsError } = await supabase
        .from('city_market_products')
        .select('price, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (statsError) throw statsError;

      // Process data for stats
      const processedStats = processMarketStats(statsData);
      setMarketStats(processedStats);

      // Fetch price history for top products
      const { data: priceData, error: priceError } = await supabase
        .from('city_market_products')
        .select('product_type, price, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (priceError) throw priceError;

      // Process price history data
      const processedPrices = processPriceHistory(priceData);
      setPriceHistory(processedPrices);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMarketStats = (data: any[]): MarketStats[] => {
    // Group data by date and calculate averages
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          prices: [],
          count: 0,
        };
      }
      acc[date].prices.push(item.price);
      acc[date].count++;
      return acc;
    }, {});

    // Convert to array format for charts
    return Object.entries(groupedData).map(([date, stats]: [string, any]) => ({
      date,
      averagePrice: stats.prices.reduce((a: number, b: number) => a + b, 0) / stats.prices.length,
      totalVolume: stats.count,
      activeListings: stats.count,
    }));
  };

  const processPriceHistory = (data: any[]): ProductPriceHistory[] => {
    // Group by product and date
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      const key = `${item.product_type}-${date}`;
      if (!acc[key]) {
        acc[key] = {
          date,
          price: item.price,
          product: item.product_type,
        };
      }
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  if (loading) {
    return <div>Loading market analytics...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Market Analytics</h2>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold">Average Price</h3>
          <p className="text-2xl">
            ${marketStats[marketStats.length - 1]?.averagePrice.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Total Volume</h3>
          <p className="text-2xl">
            {marketStats[marketStats.length - 1]?.totalVolume}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Active Listings</h3>
          <p className="text-2xl">
            {marketStats[marketStats.length - 1]?.activeListings}
          </p>
        </Card>
      </div>

      {/* Price Trends Chart */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Price Trends</h3>
        <LineChart width={800} height={400} data={marketStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="averagePrice"
            stroke="#8884d8"
            name="Average Price"
          />
          <Line
            type="monotone"
            dataKey="totalVolume"
            stroke="#82ca9d"
            name="Total Volume"
          />
        </LineChart>
      </Card>

      {/* Product Price History */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Product Price History</h3>
        <LineChart width={800} height={400} data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            name="Price"
          />
        </LineChart>
      </Card>
    </div>
  );
};
