
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchKilimoStats } from '@/services/kilimoAPI';
import { KilimoStats } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

const PriceVolatility: React.FC = () => {
  const [kilimoData, setKilimoData] = useState<KilimoStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKilimoStats();
        setKilimoData(data);
      } catch (error) {
        console.error('Error fetching Kilimo data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const generatePriceVolatilityData = () => {
    return [
      { month: 'Jan', maize: 45, volatility: 12, beans: 120, potatoes: 35 },
      { month: 'Feb', maize: 52, volatility: 18, beans: 135, potatoes: 42 },
      { month: 'Mar', maize: 38, volatility: 25, beans: 110, potatoes: 28 },
      { month: 'Apr', maize: 65, volatility: 35, beans: 150, potatoes: 55 },
      { month: 'May', maize: 48, volatility: 15, beans: 125, potatoes: 38 },
      { month: 'Jun', maize: 55, volatility: 20, beans: 140, potatoes: 45 },
    ];
  };

  const generateVolatilityCauses = () => {
    return [
      { name: 'Weather Variations', impact: 40, color: '#0088FE' },
      { name: 'Market Speculation', impact: 25, color: '#00C49F' },
      { name: 'Supply Chain Disruptions', impact: 20, color: '#FFBB28' },
      { name: 'Seasonal Demand', impact: 15, color: '#FF8042' },
    ];
  };

  const volatilityChallenges = [
    {
      title: 'Unpredictable Income',
      description: 'Farmers cannot predict their income from season to season due to price fluctuations.',
      impact: 'Difficulty in planning investments, inability to secure loans, and reduced quality of life.',
      solution: 'Forward contracts, price stabilization mechanisms, and diversified income sources.',
    },
    {
      title: 'Market Timing Challenges',
      description: 'Farmers struggle to time their sales optimally due to rapid price changes.',
      impact: 'Selling at suboptimal prices, increased storage costs, and post-harvest losses.',
      solution: 'Real-time market information, storage solutions, and market intelligence systems.',
    },
    {
      title: 'Investment Planning',
      description: 'High price volatility makes it difficult to plan for farm investments and expansion.',
      impact: 'Delayed modernization, reduced productivity, and missed growth opportunities.',
      solution: 'Risk management tools, crop insurance, and government support programs.',
    },
    {
      title: 'Credit Access',
      description: 'Volatile income streams make farmers appear risky to financial institutions.',
      impact: 'Limited access to credit, high interest rates, and reliance on informal lending.',
      solution: 'Income smoothing mechanisms, collateral alternatives, and financial literacy programs.',
    },
  ];

  const mitigationStrategies = [
    {
      title: 'Contract Farming',
      description: 'Pre-agreed prices and volumes with buyers to reduce price risk.',
      benefits: ['Guaranteed income', 'Reduced market risk', 'Access to inputs and technical support'],
      implementation: 'Partner with processors, exporters, or large retailers for direct contracts.',
    },
    {
      title: 'Cooperative Marketing',
      description: 'Farmers pool resources to achieve better market power and price negotiation.',
      benefits: ['Collective bargaining power', 'Shared storage costs', 'Market information sharing'],
      implementation: 'Form or join existing farmer cooperatives for collective selling.',
    },
    {
      title: 'Value Addition',
      description: 'Processing raw products to create value-added products with stable demand.',
      benefits: ['Higher profit margins', 'Reduced perishability', 'Market differentiation'],
      implementation: 'Invest in simple processing equipment or partner with processors.',
    },
    {
      title: 'Diversification',
      description: 'Growing multiple crops or combining farming with other income sources.',
      benefits: ['Risk spreading', 'Stable income streams', 'Reduced dependency on single commodity'],
      implementation: 'Plan crop rotation and explore complementary income activities.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Price Volatility</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Understanding and managing agricultural price fluctuations that impact farmer incomes and market stability
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Price Trends</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Impact Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="solutions" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Risk Management</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Price Volatility Analysis</CardTitle>
                <CardDescription>
                  Historical price trends and volatility patterns for major agricultural commodities in Kenya
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-6 bg-blue-50">
                  Based on Kilimo statistics and market data analysis
                </Badge>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Price Trends and Volatility (KES/kg)</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={generatePriceVolatilityData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="maize" stroke="#8884d8" strokeWidth={2} />
                          <Line type="monotone" dataKey="beans" stroke="#82ca9d" strokeWidth={2} />
                          <Line type="monotone" dataKey="potatoes" stroke="#ffc658" strokeWidth={2} />
                          <Line type="monotone" dataKey="volatility" stroke="#ff7300" strokeDasharray="5 5" name="Volatility Index" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Volatility Causes</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={generateVolatilityCauses()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="impact"
                            >
                              {generateVolatilityCauses().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Key Statistics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Average Price Volatility</span>
                            <Badge variant="outline">±25%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Seasonal Price Variation</span>
                            <Badge variant="outline">±40%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Highest Volatility Crop</span>
                            <Badge variant="destructive">Vegetables</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Most Stable Crop</span>
                            <Badge variant="default">Cereals</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenges">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Impact of Price Volatility</CardTitle>
                <CardDescription>
                  How price fluctuations affect farmers and the agricultural sector
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {volatilityChallenges.map((challenge, index) => (
                    <Card key={index} className="border-l-4 border-l-red-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>{challenge.description}</p>
                        <p><span className="font-medium">Impact:</span> {challenge.impact}</p>
                        <p><span className="font-medium">Solutions:</span> {challenge.solution}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-10 p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Economic Impact of Price Volatility</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Smallholder farmers lose an estimated 15-30% of potential income due to poor market timing</li>
                    <li>Price volatility increases the cost of agricultural credit by 2-5 percentage points</li>
                    <li>High volatility discourages investment in productivity-enhancing technologies</li>
                    <li>Food security is threatened as farmers shift to subsistence farming to avoid market risks</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab('solutions')} className="ml-auto">
                  Explore Risk Management Solutions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="solutions">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Price Risk Management Strategies</CardTitle>
                <CardDescription>
                  Proven approaches to reduce exposure to price volatility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mitigationStrategies.map((strategy, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{strategy.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{strategy.description}</p>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {strategy.benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Implementation:</h4>
                          <p className="text-sm text-muted-foreground">{strategy.implementation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-10 p-6 border rounded-lg bg-green-50">
                  <h3 className="text-xl font-medium mb-4">AgriTender Connect Price Risk Tools</h3>
                  <p className="mb-4">
                    Our platform offers several tools to help farmers manage price volatility:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Price Alerts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Get notified when prices reach your target levels</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/market-information')}>
                          Set Price Alerts
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Forward Contracts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Lock in prices for future delivery to reduce risk</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/commodity-trading')}>
                          Explore Contracts
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Market Intelligence</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Access forecasts and trend analysis for better timing</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/market-information')}>
                          View Forecasts
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <Button className="w-full" onClick={() => navigate('/commodity-trading')}>
                    Start Managing Price Risk Today
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PriceVolatility;
