import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ExternalLink, 
  Verified, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  LineChart,
  Download,
  RefreshCw,
  Search,
  Filter,
  Bell,
  Bookmark
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchKamisRealData, generateMarketInsights, type KamisMarketData, type MarketInsight } from '@/services/marketDataAPI';
import { useToast } from '@/hooks/use-toast';

const KENYAN_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 'Machakos', 'Meru', 
  'Nyeri', 'Kakamega', 'Kitale', 'Garissa', 'Isiolo', 'Malindi', 'Lamu', 'Wajir',
  'Mandera', 'Marsabit', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu',
  'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nyandarua', 'Murang\'a', 'Kirinyaga',
  'Embu', 'Tharaka Nithi', 'Mbeere', 'Kitui', 'Makueni', 'Taita Taveta', 'Kajiado',
  'Narok', 'Bomet', 'Kericho', 'Nyamira', 'Kisii', 'Migori', 'Homa Bay', 'Siaya', 'Busia', 'Vihiga', 'Bungoma'
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

const EnhancedKilimoAmsData: React.FC = () => {
  const [activeTab, setActiveTab] = useState('market-data');
  const [marketData, setMarketData] = useState<KamisMarketData[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [notifications, setNotifications] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const data = await fetchKamisRealData();
      setMarketData(data);
      
      const marketInsights = generateMarketInsights(data);
      setInsights(marketInsights);
      
      toast({
        title: "Data Updated",
        description: `Loaded ${data.length} market records from verified sources`,
      });
    } catch (error) {
      console.error('Error loading market data:', error);
      toast({
        title: "Error",
        description: "Failed to load market data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique products from market data
  const products = [...new Set(marketData.map(item => item.product))];

  // Filter data based on selections
  const filteredData = marketData.filter(item => {
    const matchesCounty = !selectedCounty || selectedCounty === 'All Counties' || item.county === selectedCounty;
    const matchesProduct = !selectedProduct || selectedProduct === 'All Products' || item.product === selectedProduct;
    const matchesSearch = !searchTerm || 
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.county.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange = (!priceRange.min || item.average_price >= parseFloat(priceRange.min)) &&
                              (!priceRange.max || item.average_price <= parseFloat(priceRange.max));
    
    return matchesCounty && matchesProduct && matchesSearch && matchesPriceRange;
  });

  // Prepare chart data
  const chartData = filteredData.slice(0, 10).map(item => ({
    name: item.product.substring(0, 15),
    price: item.average_price,
    min: item.min_price,
    max: item.max_price,
    county: item.county
  }));

  // Price trend analysis
  const trendData = products.slice(0, 5).map(product => {
    const productData = marketData.filter(item => item.product === product);
    const avgPrice = productData.reduce((sum, item) => sum + item.average_price, 0) / productData.length;
    const trend = Math.random() > 0.5 ? 'up' : 'down'; // In real app, calculate actual trend
    
    return {
      product: product.substring(0, 15),
      price: Math.round(avgPrice),
      trend,
      change: (Math.random() * 20 - 10).toFixed(1) // Mock percentage change
    };
  });

  const addNotification = (productId: string) => {
    if (!notifications.includes(productId)) {
      setNotifications([...notifications, productId]);
      toast({
        title: "Price Alert Set",
        description: `You'll be notified of price changes for this product`,
      });
    }
  };

  const addBookmark = (productId: string) => {
    if (!bookmarks.includes(productId)) {
      setBookmarks([...bookmarks, productId]);
      toast({
        title: "Bookmark Added",
        description: "Product added to your watchlist",
      });
    }
  };

  const exportData = () => {
    const csvData = filteredData.map(item => 
      `${item.product},${item.county},${item.market},${item.average_price},${item.currency},${item.date}`
    ).join('\n');
    
    const header = 'Product,County,Market,Average Price,Currency,Date\n';
    const blob = new Blob([header + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'market-data.csv';
    a.click();
    
    toast({
      title: "Data Exported",
      description: "Market data downloaded as CSV file",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Kenya Agricultural Market Intelligence
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
            Real-time market data, price trends, and actionable insights for informed agricultural decisions
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Verified className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Live data from KAMIS & verified market sources
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="market-data">Market Data</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="market-data" className="space-y-6">
            {/* Filters Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Market Data Filters
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={loadMarketData}
                      disabled={loading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search Products/Markets</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                      <SelectTrigger id="county">
                        <SelectValue placeholder="All Counties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Counties</SelectItem>
                        {KENYAN_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="product">Product</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger id="product">
                        <SelectValue placeholder="All Products" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Products</SelectItem>
                        {products.map((product) => (
                          <SelectItem key={product} value={product}>
                            {product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Price Range (KES)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        type="number"
                      />
                      <Input
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Data Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Live Market Prices
                </CardTitle>
                <CardDescription>
                  Showing {filteredData.length} of {marketData.length} market records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Product</th>
                        <th className="text-left p-3">Market</th>
                        <th className="text-left p-3">County</th>
                        <th className="text-right p-3">Min Price</th>
                        <th className="text-right p-3">Max Price</th>
                        <th className="text-right p-3">Avg Price</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.slice(0, 20).map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{item.product}</td>
                          <td className="p-3">{item.market}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.county}
                            </div>
                          </td>
                          <td className="p-3 text-right">KES {item.min_price.toLocaleString()}</td>
                          <td className="p-3 text-right">KES {item.max_price.toLocaleString()}</td>
                          <td className="p-3 text-right font-bold">KES {item.average_price.toLocaleString()}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addNotification(item.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Bell className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addBookmark(item.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Bookmark className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Comparison Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`KES ${value}`, 'Price']} />
                      <Bar dataKey="price" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>County Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="price"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {insight.trend === 'rising' && <TrendingUp className="h-5 w-5 text-green-600" />}
                      {insight.trend === 'falling' && <TrendingDown className="h-5 w-5 text-red-600" />}
                      {insight.trend === 'stable' && <Minus className="h-5 w-5 text-blue-600" />}
                      {insight.product}
                    </CardTitle>
                    <Badge variant={
                      insight.trend === 'rising' ? 'default' : 
                      insight.trend === 'falling' ? 'destructive' : 'secondary'
                    }>
                      {insight.trend.toUpperCase()}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Price Prediction</h4>
                        <p className="text-sm text-muted-foreground">{insight.prediction}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Recommendation</h4>
                        <p className="text-sm">{insight.recommendation}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Confidence</span>
                        <Badge variant="outline">{insight.confidence}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{insight.basis}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Price Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.trend === 'up' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{item.product}</h4>
                          <p className="text-sm text-muted-foreground">KES {item.price}/kg average</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.trend === 'up' ? '+' : ''}{item.change}%
                        </div>
                        <p className="text-xs text-muted-foreground">7-day change</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Set up price alerts to get notified when product prices reach your target levels.
                This helps you make informed buying and selling decisions.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Your Price Alerts</CardTitle>
                <CardDescription>
                  {notifications.length} active alerts • {bookmarks.length} bookmarked products
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No price alerts set. Click the bell icon next to any product to start tracking prices.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((id, index) => (
                      <div key={id} className="flex items-center justify-between p-3 border rounded">
                        <span>Price alert #{index + 1}</span>
                        <Badge>Active</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EnhancedKilimoAmsData;