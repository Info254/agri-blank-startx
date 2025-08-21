
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, TrendingUp, GripVertical, ShoppingCart, RepeatIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProduce, fetchMarkets } from '@/services/api';
import { Produce, Market } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Import the component tabs
import MarketplaceTab from './tabs/MarketplaceTab';
import OrdersTab from './tabs/OrdersTab';
import MyTradesTab from './tabs/MyTradesTab';
import BarterExchangeTab from './tabs/BarterExchangeTab';
import PriceTrendsTab from './tabs/PriceTrendsTab';

const CommodityTradingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [produce, setProduce] = useState<Produce[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Common categories for filtering
  const categories = [
    'All Categories',
    'Cereals',
    'Legumes',
    'Cash Crops',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Meat'
  ];

  const locations = [
    'All Locations',
    'Nairobi County',
    'Nakuru County',
    'Kiambu County',
    'Meru County',
    'Nyandarua County',
    'Machakos County',
    'Kisumu County'
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch data based on active tab
      if (activeTab === 'marketplace' || activeTab === 'orders') {
        const produceData = await fetchProduce();
        setProduce(produceData);
      }
      
      if (activeTab === 'marketplace' || activeTab === 'price-trends') {
        const marketsData = await fetchMarkets();
        setMarkets(marketsData);
      }
    } catch (error) {
      console.error(`Error fetching data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm('');
    setSelectedCategory('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  // Filter produce based on search term and category
  const filteredProduce = produce.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || 
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agricultural Commodity Exchange</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Buy, sell, and barter agricultural commodities directly with farmers, processors, and exporters across Kenya.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Commodity Exchange Platform</CardTitle>
            <CardDescription>
              Explore available commodities, place orders, barter goods, and track market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-8">
                <TabsTrigger value="marketplace" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Marketplace</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4" />
                  <span>Orders</span>
                </TabsTrigger>
                <TabsTrigger value="my-trades" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>My Trades</span>
                </TabsTrigger>
                <TabsTrigger value="barter-exchange" className="flex items-center gap-2">
                  <RepeatIcon className="h-4 w-4" />
                  <span>Barter Exchange</span>
                </TabsTrigger>
                <TabsTrigger value="price-trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Price Trends</span>
                </TabsTrigger>
              </TabsList>

              {/* Search Form */}
              <div className="mt-2 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="search" className="mb-2 block">Search</Label>
                    <Input
                      id="search"
                      placeholder="Search commodities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="w-full md:w-64">
                    <Label htmlFor="category" className="mb-2 block">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {activeTab === 'barter-exchange' && (
                    <div className="w-full md:w-64">
                      <Label htmlFor="location" className="mb-2 block">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Button type="submit" disabled={isLoading} className="mt-4 md:mt-0">
                    {isLoading ? 'Loading...' : 'Search'}
                  </Button>
                </form>
              </div>

              {/* Tab Contents */}
              <TabsContent value="marketplace" className="mt-6">
                <MarketplaceTab 
                  isLoading={isLoading}
                  filteredProduce={filteredProduce}
                />
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <OrdersTab 
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                />
              </TabsContent>

              <TabsContent value="my-trades" className="mt-6">
                <MyTradesTab 
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                />
              </TabsContent>

              <TabsContent value="barter-exchange">
                <BarterExchangeTab 
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  selectedLocation={selectedLocation}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="price-trends" className="mt-6">
                <PriceTrendsTab 
                  isLoading={isLoading}
                  markets={markets}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CommodityTradingPage;
