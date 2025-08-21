
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const PriceTrends: React.FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('maize');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const priceData = {
    maize: [
      { month: 'Jul 2023', price: 4200, market: 'Average' },
      { month: 'Aug 2023', price: 4350, market: 'Average' },
      { month: 'Sep 2023', price: 4100, market: 'Average' },
      { month: 'Oct 2023', price: 4500, market: 'Average' },
      { month: 'Nov 2023', price: 4800, market: 'Average' },
      { month: 'Dec 2023', price: 4650, market: 'Average' },
      { month: 'Jan 2024', price: 4400, market: 'Average' }
    ],
    beans: [
      { month: 'Jul 2023', price: 8500, market: 'Average' },
      { month: 'Aug 2023', price: 9200, market: 'Average' },
      { month: 'Sep 2023', price: 8800, market: 'Average' },
      { month: 'Oct 2023', price: 9500, market: 'Average' },
      { month: 'Nov 2023', price: 10200, market: 'Average' },
      { month: 'Dec 2023', price: 9800, market: 'Average' },
      { month: 'Jan 2024', price: 9400, market: 'Average' }
    ]
  };

  const currentData = priceData[selectedCommodity as keyof typeof priceData] || priceData.maize;
  const latestPrice = currentData[currentData.length - 1]?.price || 0;
  const previousPrice = currentData[currentData.length - 2]?.price || 0;
  const priceChange = latestPrice - previousPrice;
  const percentageChange = previousPrice ? ((priceChange / previousPrice) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Price Trends Analysis</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Track historical price movements and market trends for agricultural commodities
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select Commodity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="beans">Beans</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="2years">Last 2 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {latestPrice.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">per 90kg bag</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Price Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-2 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {priceChange >= 0 ? '+' : ''}KES {priceChange.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {priceChange >= 0 ? '+' : ''}{percentageChange}% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Stable</div>
              <p className="text-xs text-muted-foreground">Based on seasonal trends</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price Trend Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, 'Price']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  name="Price (KES per 90kg bag)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Factors Affecting Prices:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Seasonal demand patterns</li>
                    <li>• Weather conditions and rainfall</li>
                    <li>• Input costs (fertilizer, fuel)</li>
                    <li>• Regional supply and demand</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Price Forecast:</h4>
                  <p className="text-sm text-muted-foreground">
                    Prices expected to remain stable over the next month, with potential 
                    increase during dry season (March-May).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Price Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Nairobi Market</span>
                  <span className="font-medium">KES 4,600</span>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Nakuru Market</span>
                  <span className="font-medium">KES 4,200</span>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Kitale Market</span>
                  <span className="font-medium">KES 3,900</span>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Mombasa Market</span>
                  <span className="font-medium">KES 4,800</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PriceTrends;
