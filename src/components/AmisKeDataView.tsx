import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { fetchAmisKePrices, fetchAmisKeMarkets, getAmisKePriceHistory } from '@/services/amis-ke';
import { AmisKePriceData, AmisKeMarket } from '@/services/amis-ke/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const AmisKeDataView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<AmisKePriceData[]>([]);
  const [markets, setMarkets] = useState<AmisKeMarket[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPricesHeadline, setCurrentPricesHeadline] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSupabasePrices, setShowSupabasePrices] = useState(false);
  const [supabasePrices, setSupabasePrices] = useState<any[]>([]);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);

  // Define the loadData function that was missing
  const loadData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [pricesData, marketsData] = await Promise.all([
        fetchAmisKePrices(),
        fetchAmisKeMarkets()
      ]);
      
      setPrices(pricesData);
      setMarkets(marketsData);
      
      // Generate headline for current prices
      if (pricesData.length > 0) {
        const randomIndex = Math.floor(Math.random() * pricesData.length);
        const headline = `Today's ${pricesData[randomIndex].commodity} prices at ${pricesData[randomIndex].market}: KES ${pricesData[randomIndex].price} per ${pricesData[randomIndex].unit}`;
        setCurrentPricesHeadline(headline);
      }
      
      // Set default commodity selection
      if (pricesData.length > 0) {
        const uniqueCommodities = [...new Set(pricesData.map(p => p.commodity))];
        if (uniqueCommodities.length > 0) {
          setSelectedCommodity(uniqueCommodities[0]);
        }
      } else {
        // If no data from API, show fallback error that explains the issue
        setApiError("Unable to connect to AMIS Kenya data service. This could be due to network issues or service unavailability.");
      }
    } catch (error) {
      console.error("Error loading AMIS Kenya data:", error);
      setApiError("Unable to connect to AMIS Kenya data service. This could be due to network issues or service unavailability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const loadPriceHistory = async () => {
      if (!selectedCommodity) return;
      
      setHistoryLoading(true);
      setApiError(null);
      try {
        const history = await getAmisKePriceHistory(selectedCommodity);
        setPriceHistory(history);
      } catch (error) {
        console.error(`Error loading price history for ${selectedCommodity}:`, error);
        setApiError(`Failed to load price history for ${selectedCommodity}. The service may be temporarily unavailable.`);
      } finally {
        setHistoryLoading(false);
      }
    };
    
    loadPriceHistory();
  }, [selectedCommodity]);

  // Get unique commodities
  const commodities = [...new Set(prices.map(p => p.commodity))];

  // Load backup data from Supabase
  const loadSupabaseData = async () => {
    setIsLoadingSupabase(true);
    try {
      const { data: marketPricesData, error } = await supabase
        .from('market_prices')
        .select('*')
        .order('date_recorded', { ascending: false });
      
      if (error) {
        console.error("Error fetching backup data from Supabase:", error);
        setApiError(`Unable to load backup data: ${error.message}`);
      } else if (marketPricesData && marketPricesData.length > 0) {
        setSupabasePrices(marketPricesData);
        setShowSupabasePrices(true);
      } else {
        setApiError("No backup data available in the local database.");
      }
    } catch (err: any) {
      console.error("Unexpected error loading backup data:", err);
      setApiError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  // Generate sample data for demo purposes when all else fails
  const generateSampleData = () => {
    const sampleCommodities = ["Maize", "Beans", "Potatoes", "Tomatoes", "Rice"];
    const sampleMarkets = ["Wakulima Market", "Mombasa Central", "Kisumu Market", "Eldoret Market"];
    const sampleCounties = ["Nairobi", "Mombasa", "Kisumu", "Uasin Gishu"];
    
    const generatedSamples = [];
    
    for (let i = 0; i < 10; i++) {
      const commodity = sampleCommodities[Math.floor(Math.random() * sampleCommodities.length)];
      const market = sampleMarkets[Math.floor(Math.random() * sampleMarkets.length)];
      const county = sampleCounties[Math.floor(Math.random() * sampleCounties.length)];
      
      generatedSamples.push({
        id: `sample-${i}`,
        commodity: commodity,
        market: market,
        county: county,
        price: Math.floor(Math.random() * 200) + 50,
        unit: "Kg",
        date: new Date().toISOString().split('T')[0]
      });
    }
    
    setPrices(generatedSamples);
    setShowSupabasePrices(false);
    setApiError("Using demonstration data for preview purposes. This is not real market data.");
  };

  // Refresh data
  const handleRefresh = () => {
    setApiError(null);
    setShowSupabasePrices(false);
    loadData();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AMIS Kenya Price Data</CardTitle>
        <CardDescription>
          Agricultural commodity prices from the Ministry of Agriculture
        </CardDescription>
        {currentPricesHeadline && !apiError && (
          <div className="mt-2 bg-muted p-2 rounded-md font-medium text-sm">
            {currentPricesHeadline}
          </div>
        )}
        {apiError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Retry Connection
              </Button>
              {!showSupabasePrices && (
                <Button variant="secondary" size="sm" onClick={loadSupabaseData} disabled={isLoadingSupabase}>
                  {isLoadingSupabase ? "Loading..." : "Load Cached Data"} 
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={generateSampleData}>
                Use Demo Data
              </Button>
            </div>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Tabs defaultValue="prices">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prices">Current Prices</TabsTrigger>
                <TabsTrigger value="trends">Price Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="prices" className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Commodity</th>
                        <th className="text-left p-2">Market</th>
                        <th className="text-left p-2">County</th>
                        <th className="text-right p-2">Price (KES)</th>
                        <th className="text-left p-2">Unit</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.length > 0 || (showSupabasePrices && supabasePrices.length > 0) ? (
                        (showSupabasePrices ? supabasePrices : prices).map((price) => (
                          <tr key={price.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              <Badge variant="outline">{showSupabasePrices ? price.commodity_name : price.commodity}</Badge>
                            </td>
                            <td className="p-2">{showSupabasePrices ? price.market_name : price.market}</td>
                            <td className="p-2">{price.county}</td>
                            <td className="p-2 text-right font-medium">
                              {typeof price.price === 'number' ? price.price.toFixed(2) : price.price}
                            </td>
                            <td className="p-2">{price.unit}</td>
                            <td className="p-2 text-muted-foreground">
                              {showSupabasePrices 
                                ? new Date(price.date_recorded).toLocaleDateString() 
                                : price.date}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-muted-foreground">
                            No price data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="pt-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Commodity</label>
                  <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities.map(commodity => (
                        <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {historyLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-[400px] w-full">
                    {priceHistory.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{fontSize: 12}}
                            tickFormatter={(tick) => {
                              const date = new Date(tick);
                              return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                          />
                          <YAxis 
                            domain={['auto', 'auto']}
                            label={{ value: 'KES', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value) => [`KES ${value}`, 'Price']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#2563eb" 
                            activeDot={{ r: 8 }} 
                            name={selectedCommodity}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">
                          {apiError ? 'Failed to load price history' : 'No price history available for this commodity'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">{priceHistory.length > 0 ? `KES ${priceHistory[priceHistory.length - 1].price}` : '-'}</div>
                      <div className="text-sm text-muted-foreground">Current Price</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">
                        {priceHistory.length > 0 ? 
                          `KES ${(priceHistory.reduce((sum, item) => sum + item.price, 0) / priceHistory.length).toFixed(2)}` : 
                          '-'}
                      </div>
                      <div className="text-sm text-muted-foreground">Average Price</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">
                        {priceHistory.length > 0 ? 
                          (() => {
                            const prices = priceHistory.map(item => item.price);
                            return `KES ${Math.max(...prices) - Math.min(...prices)}`;
                          })() : 
                          '-'}
                      </div>
                      <div className="text-sm text-muted-foreground">Price Range</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AmisKeDataView;
