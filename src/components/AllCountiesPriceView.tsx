
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchDailyAmisPrices, getAllCommodityPrices } from '@/services/cronJobs';

const AllCountiesPriceView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [countyPrices, setCountyPrices] = useState<Record<string, any[]>>({});
  const [commodityPrices, setCommodityPrices] = useState<Record<string, Record<string, any[]>>>({});
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [view, setView] = useState<'county' | 'commodity'>('county');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Run the daily job to get fresh data
      await fetchDailyAmisPrices();
      
      // Get the processed data
      const data = getAllCommodityPrices();
      setCountyPrices(data.countyPrices);
      setCommodityPrices(data.commodityPrices);
      setHeadlines(data.headlines);
      setLastUpdate(data.lastUpdate);
      
      // Set default selections
      const counties = Object.keys(data.countyPrices);
      if (counties.length > 0 && selectedCounty === 'all') {
        setSelectedCounty('all');
      }
      
      const commodities = Object.keys(data.commodityPrices);
      if (commodities.length > 0 && selectedCommodity === 'all') {
        setSelectedCommodity('all');
      }
    } catch (error) {
      console.error("Error fetching commodity prices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get all counties
  const counties = Object.keys(countyPrices).sort();
  
  // Get all commodities
  const commodities = Object.keys(commodityPrices).sort();
  
  // Filter and prepare data for display
  const getPricesToDisplay = () => {
    let prices: any[] = [];
    
    if (view === 'county') {
      if (selectedCounty === 'all') {
        // Collect all prices from all counties
        Object.values(countyPrices).forEach(countyPriceList => {
          prices = [...prices, ...countyPriceList];
        });
      } else if (countyPrices[selectedCounty]) {
        prices = countyPrices[selectedCounty];
      }
    } else {
      // Commodity view
      if (selectedCommodity === 'all') {
        // Collect all prices for all commodities
        Object.values(commodityPrices).forEach(commodityData => {
          Object.values(commodityData).forEach(countyPriceList => {
            prices = [...prices, ...countyPriceList];
          });
        });
      } else if (commodityPrices[selectedCommodity]) {
        // All counties for selected commodity
        Object.values(commodityPrices[selectedCommodity]).forEach(countyPriceList => {
          prices = [...prices, ...countyPriceList];
        });
      }
    }
    
    // Apply search filter if needed
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      prices = prices.filter(
        price => 
          price.commodity.toLowerCase().includes(query) ||
          price.county.toLowerCase().includes(query) ||
          price.market.toLowerCase().includes(query)
      );
    }
    
    return prices;
  };
  
  const pricesToDisplay = getPricesToDisplay();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>All 47 Counties Commodity Prices</CardTitle>
        <CardDescription>
          Current agricultural commodity prices across all Kenyan counties
        </CardDescription>
        
        {headlines.length > 0 && (
          <div className="mt-4 space-y-2">
            {headlines.map((headline, index) => (
              <div key={index} className="bg-muted p-2 rounded-md font-medium text-sm animate-pulse">
                {headline}
              </div>
            ))}
          </div>
        )}
        
        {lastUpdate && (
          <div className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date(lastUpdate).toLocaleString()}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-auto">
                <Tabs value={view} onValueChange={(v: 'county' | 'commodity') => setView(v)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="county">By County</TabsTrigger>
                    <TabsTrigger value="commodity">By Commodity</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex-1">
                <Input
                  placeholder="Search commodities, counties, or markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Button onClick={fetchData} variant="outline">
                  Refresh Data
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {view === 'county' ? (
                <div className="w-full md:w-64">
                  <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select County" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Counties</SelectItem>
                      {counties.map(county => (
                        <SelectItem key={county} value={county}>{county}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="w-full md:w-64">
                  <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Commodities</SelectItem>
                      {commodities.map(commodity => (
                        <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Commodity</th>
                    <th className="text-left p-2">County</th>
                    <th className="text-left p-2">Market</th>
                    <th className="text-right p-2">Price (KES)</th>
                    <th className="text-left p-2">Unit</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pricesToDisplay.length > 0 ? (
                    pricesToDisplay.map((price, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <Badge variant="outline">{price.commodity}</Badge>
                        </td>
                        <td className="p-2">{price.county}</td>
                        <td className="p-2">{price.market}</td>
                        <td className="p-2 text-right font-medium">{price.price.toFixed(2)}</td>
                        <td className="p-2">{price.unit}</td>
                        <td className="p-2 text-muted-foreground">{price.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No price data available for the selected filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                Displaying {pricesToDisplay.length} price records from a total of {counties.length} counties and {commodities.length} commodities.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AllCountiesPriceView;
