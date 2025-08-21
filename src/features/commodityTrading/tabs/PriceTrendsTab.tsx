
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Market } from '@/types';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Badge } from '@/components/ui/badge';

interface PriceTrendsTabProps {
  isLoading: boolean;
  markets: Market[];
}

type ChartType = 'line' | 'bar' | 'area';

// Generate some price history data for charts - in a real app, this would come from the API
const generatePriceHistory = (basePrice: number, fluctuation: number = 20, days: number = 30) => {
  const today = new Date();
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const randomChange = (Math.random() * fluctuation * 2) - fluctuation;
    const price = Math.max(basePrice + randomChange, basePrice * 0.7);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 10) / 10,
    });
  }
  
  return data;
};

// Calculate price analytics
const calculatePriceAnalytics = (data: any[]) => {
  if (!data.length) return null;
  
  const prices = data.map(item => item.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const trend = prices[prices.length - 1] > prices[0] ? 'rising' : 'falling';
  const volatility = Math.sqrt(
    prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length
  );

  return {
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    avg: Math.round(avg * 10) / 10,
    trend,
    volatility: Math.round(volatility * 10) / 10,
    priceRange: Math.round((max - min) * 10) / 10
  };
};

const PriceChart: React.FC<{ data: any[]; type: ChartType; height?: number }> = ({ 
  data, 
  type,
  height = 200 
}) => {
  const ChartComponent = {
    line: LineChart,
    bar: BarChart,
    area: AreaChart
  }[type];

  // Correct implementation to render the data component based on chart type
  const renderDataComponent = () => {
    switch (type) {
      case 'line':
        return (
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        );
      case 'bar':
        return (
          <Bar
            dataKey="price"
            fill="#8884d8"
          />
        );
      case 'area':
        return (
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            fill="#8884d8"
          />
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent
        data={data}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
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
          formatter={(value: any) => [`KES ${value}`, 'Price']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        {renderDataComponent()}
      </ChartComponent>
    </ResponsiveContainer>
  );
};

const PriceTrendsTab: React.FC<PriceTrendsTabProps> = ({ isLoading, markets }) => {
  const [chartType, setChartType] = useState<ChartType>('line');

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No market data available. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Price Trends Visualization</h2>
          <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {markets.map((market) => (
          <Card key={market.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{market.name}</CardTitle>
              <div className="text-sm text-muted-foreground">{market.county}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {market.producePrices.map((price, index) => {
                  const priceHistory = generatePriceHistory(price.price);
                  const analytics = calculatePriceAnalytics(priceHistory);
                  
                  return (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span>{price.produceName}</span>
                        <span className="font-medium">KES {price.price} per {price.unit}</span>
                      </div>
                      
                      {analytics && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground">Price Range</div>
                            <div className="font-medium">KES {analytics.priceRange}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground">Average Price</div>
                            <div className="font-medium">KES {analytics.avg}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="text-sm text-muted-foreground">Price Trend</div>
                            <div className="font-medium capitalize">
                              <Badge variant={analytics.trend === 'rising' ? 'default' : 'secondary'}>
                                {analytics.trend}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="h-[200px] mt-2 mb-4">
                        <PriceChart 
                          data={priceHistory} 
                          type={chartType}
                        />
                      </div>
                    </div>
                  );
                })}
                
                <div className="text-sm mt-4">
                  <div><strong>Demand:</strong> {market.demand}</div>
                  <div><strong>Operating Hours:</strong> {market.operatingHours}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PriceTrendsTab;
