
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { tradingEngine, PriceData, Trade } from '@/services/trading/tradingEngine';
import { COMMODITIES } from '@/config/app';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const TradingDashboard: React.FC = () => {
  const [priceData, setPriceData] = useState<Record<string, PriceData>>({});
  const [userTrades, setUserTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState('maize');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load price data for major commodities
        const majorCommodities = ['maize', 'wheat', 'rice', 'beans'];
        const pricePromises = majorCommodities.map(async (commodity) => {
          const price = await tradingEngine.getPriceData(commodity);
          return { commodity, price };
        });
        
        const priceResults = await Promise.all(pricePromises);
        const priceMap: Record<string, PriceData> = {};
        
        priceResults.forEach(({ commodity, price }) => {
          if (price) {
            priceMap[commodity] = price;
          }
        });
        
        setPriceData(priceMap);
        
        // Load user trades (mock user ID for now)
        const trades = await tradingEngine.getUserTrades('mock-user-id');
        setUserTrades(trades);
        
      } catch (error) {
        console.error('Failed to load trading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Set up real-time price updates
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];
    
    Object.keys(priceData).forEach(commodityId => {
      const unsubscribe = tradingEngine.subscribeToPrice(commodityId, (newPrice) => {
        setPriceData(prev => ({
          ...prev,
          [commodityId]: newPrice
        }));
      });
      
      unsubscribers.push(unsubscribe);
    });
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [priceData]);

  const formatPrice = (price: number) => {
    return `KES ${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner text="Loading trading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(priceData).map(([commodityId, price]) => (
          <Card key={commodityId}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium capitalize">{commodityId}</p>
                  <p className="text-2xl font-bold">{formatPrice(price.currentPrice)}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {getChangeIcon(price.dayChange)}
                    <span className={`text-sm font-medium ${getChangeColor(price.dayChange)}`}>
                      {formatChange(price.dayChange)}
                    </span>
                  </div>
                  <p className={`text-xs ${getChangeColor(price.dayChangePercent)}`}>
                    {formatChange(price.dayChangePercent)}%
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Vol: {price.volume.toLocaleString()}</span>
                  <span>H: {formatPrice(price.high24h)}</span>
                  <span>L: {formatPrice(price.low24h)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trading Interface */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Market Orders</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Active Market Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Market orders functionality coming soon. This will show all active buy and sell orders.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>My Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Portfolio management coming soon. Track your holdings and performance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              {userTrades.length === 0 ? (
                <p className="text-muted-foreground">No trades found.</p>
              ) : (
                <div className="space-y-2">
                  {userTrades.map(trade => (
                    <div key={trade.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{trade.commodityId}</p>
                        <p className="text-sm text-muted-foreground">
                          {trade.quantity} kg @ {formatPrice(trade.pricePerUnit)}
                        </p>
                      </div>
                      <Badge variant={
                        trade.status === 'completed' ? 'default' :
                        trade.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {trade.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Market Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced analytics and charts coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingDashboard;
