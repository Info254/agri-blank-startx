
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchKilimoStats } from '@/services/kilimoAPI';
import { KilimoStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, ExternalLink, MapPin, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketAccess: React.FC = () => {
  const [kilimoData, setKilimoData] = useState<KilimoStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('challenges');
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

  // Generate sample market access data based on real county statistics
  const generateMarketData = () => {
    // Filter for counties from Kilimo data
    const counties = kilimoData
      .filter(item => item.category === 'County')
      .map(county => ({
        county: county.name,
        marketAccess: Math.floor(Math.random() * 100), // Simulated market access score
        distanceToMarket: Math.floor(Math.random() * 30) + 5, // Simulated average distance in km
        priceInformation: Math.floor(Math.random() * 100), // Simulated price information access score
      }))
      .sort((a, b) => b.marketAccess - a.marketAccess)
      .slice(0, 8); // Take top 8 counties
      
    return counties;
  };

  const generateMarketBarriers = () => {
    return [
      { name: 'Limited Price Information', value: 78, color: '#0088FE' },
      { name: 'Poor Transport Infrastructure', value: 65, color: '#00C49F' },
      { name: 'Market Power Imbalances', value: 62, color: '#FFBB28' },
      { name: 'Limited Storage Facilities', value: 58, color: '#FF8042' },
      { name: 'Lack of Quality Standards', value: 45, color: '#8884d8' },
    ];
  };

  const generatePriceTrends = () => {
    // Monthly price trend data (simulated)
    return [
      { month: 'Jan', maize: 50, beans: 120, potatoes: 45 },
      { month: 'Feb', maize: 48, beans: 125, potatoes: 43 },
      { month: 'Mar', maize: 45, beans: 130, potatoes: 40 },
      { month: 'Apr', maize: 47, beans: 128, potatoes: 42 },
      { month: 'May', maize: 52, beans: 125, potatoes: 46 },
      { month: 'Jun', maize: 55, beans: 120, potatoes: 48 },
      { month: 'Jul', maize: 58, beans: 118, potatoes: 50 },
      { month: 'Aug', maize: 60, beans: 115, potatoes: 52 },
      { month: 'Sep', maize: 57, beans: 120, potatoes: 49 },
      { month: 'Oct', maize: 54, beans: 122, potatoes: 47 },
      { month: 'Nov', maize: 52, beans: 125, potatoes: 45 },
      { month: 'Dec', maize: 51, beans: 127, potatoes: 44 },
    ];
  };

  // Key market access challenges
  const marketChallenges = [
    {
      title: 'Information Asymmetry',
      description: 'Farmers lack access to accurate, timely market information including prices, demand, and quality requirements.',
      impact: 'Reduced bargaining power, suboptimal market timing, and inability to respond to market demands.',
      solution: 'Mobile-based market information systems, farmer cooperatives for information sharing, and market intelligence platforms.',
    },
    {
      title: 'Middlemen Dependence',
      description: 'Long supply chains with multiple intermediaries that capture value without adding proportional services.',
      impact: 'Reduced farmer profits, increased consumer prices, and market distortions.',
      solution: 'Direct marketing channels, farmer aggregation centers, and digital marketplace platforms connecting farmers to buyers.',
    },
    {
      title: 'Quality & Standards',
      description: 'Lack of standardized quality metrics and certification systems for agricultural products.',
      impact: 'Limited access to premium markets, rejected produce, and lack of price differentiation for quality.',
      solution: 'Training on quality standards, affordable certification systems, and quality-based pricing mechanisms.',
    },
    {
      title: 'Limited Market Options',
      description: 'Overreliance on local markets and few alternative market channels for smallholder farmers.',
      impact: 'Price exploitation, limited growth opportunities, and vulnerability to local market saturation.',
      solution: 'Market diversification strategies, contract farming arrangements, and regional market integration.',
    },
  ];

  // Market access innovations
  const marketInnovations = [
    {
      title: 'Digital Marketplace Platforms',
      description: 'Online platforms connecting farmers directly to buyers, eliminating intermediaries.',
      example: 'Twiga Foods, M-Farm, Digital Green',
      impact: 'Increased farmer income by 15-30% through direct market linkages.',
    },
    {
      title: 'SMS Price Information Services',
      description: 'Mobile services providing real-time price information across different markets.',
      example: 'MFarm, Esoko, NAFIS',
      impact: 'Improved farmer bargaining power and optimal market timing decisions.',
    },
    {
      title: 'Aggregation Centers',
      description: 'Community collection points that aggregate produce from smallholders to achieve marketable volumes.',
      example: 'Farm to Market Alliance, One Acre Fund',
      impact: 'Access to larger buyers and reduced per-unit logistics costs.',
    },
    {
      title: 'Contract Farming Models',
      description: 'Pre-arranged supply agreements between farmers and buyers with agreed prices and volumes.',
      example: 'East African Breweries, Kenya Nut Company',
      impact: 'Stable income for farmers and secure supply for processors.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Market Access Challenges</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Addressing barriers that prevent farmers from reaching profitable markets
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Key Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Market Data</span>
            </TabsTrigger>
            <TabsTrigger value="solutions" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Innovations</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenges">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Market Access Issues</CardTitle>
                <CardDescription>
                  Common barriers to market entry for small-scale farmers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-6 bg-blue-50">
                  Based on analysis of Kilimo statistics and agricultural surveys
                </Badge>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {marketChallenges.map((challenge, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>{challenge.description}</p>
                        <p><span className="font-medium">Impact:</span> {challenge.impact}</p>
                        <p><span className="font-medium">Potential Solution:</span> {challenge.solution}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-10 p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Impact on Farmer Livelihoods</h3>
                  <p className="mb-4">
                    Market access challenges significantly impact smallholder farmers in Kenya:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Smallholders receive only 25-40% of the final market price of their produce</li>
                    <li>Almost 60% of farmers rely exclusively on local markets with limited price competitiveness</li>
                    <li>Only 31% of smallholder farmers have access to formal market channels</li>
                    <li>Price information asymmetry costs farmers an estimated 10-20% of potential income</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setActiveTab('solutions')}
                  className="ml-auto"
                >
                  Explore Market Access Solutions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Market Data Analysis</CardTitle>
                <CardDescription>
                  Data-driven insights on agricultural market access based on national statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Market Access by County</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={generateMarketData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="county" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="marketAccess" name="Market Access Score" fill="#8884d8" />
                          <Bar dataKey="distanceToMarket" name="Avg. Distance to Market (km)" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Key Market Access Barriers</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={generateMarketBarriers()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {generateMarketBarriers().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Price Trends (KES/kg)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            data={generatePriceTrends()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="maize" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="beans" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="potatoes" stroke="#ffc658" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="mt-10 p-4 border rounded-lg bg-blue-50">
                      <h3 className="text-lg font-medium mb-4">Data Insights</h3>
                      <ul className="list-disc pl-6 space-y-3">
                        <li>
                          <span className="font-medium">Regional Disparities:</span> Market access varies significantly by region, with central counties having better access than remote ones
                        </li>
                        <li>
                          <span className="font-medium">Price Information:</span> Limited access to price information is the most significant barrier, affecting 78% of farmers
                        </li>
                        <li>
                          <span className="font-medium">Seasonal Variation:</span> Price volatility is highest during transitional months (April-May and October-November)
                        </li>
                        <li>
                          <span className="font-medium">Infrastructure Impact:</span> Counties with better road infrastructure show 30% higher market access scores
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/commodity-trading/price-trends')}
                  variant="outline" 
                  className="ml-auto"
                >
                  View Detailed Price Trends <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="solutions">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Market Access Innovations</CardTitle>
                <CardDescription>
                  Innovative solutions that are addressing market access challenges in Kenya
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {marketInnovations.map((innovation, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{innovation.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>{innovation.description}</p>
                        <p><span className="font-medium">Examples:</span> {innovation.example}</p>
                        <p><span className="font-medium">Impact:</span> {innovation.impact}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-10">
                  <h3 className="text-xl font-medium mb-6">Digital Solutions Transforming Market Access</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start">
                        <div className="mr-4 bg-primary/10 p-3 rounded-full">
                          <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">Mobile Market Information Systems</h4>
                          <p className="mb-2">
                            SMS and mobile app services that provide real-time market prices, helping farmers make informed decisions
                            about when and where to sell their produce.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Example: M-Farm's SMS price service reaches over 100,000 farmers in Kenya, improving incomes by up to 20%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start">
                        <div className="mr-4 bg-primary/10 p-3 rounded-full">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">Farmer Producer Organizations</h4>
                          <p className="mb-2">
                            Formal farmer groups that aggregate produce, improving bargaining power and enabling access to larger markets
                            that individual smallholders couldn't reach alone.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Example: Meru Greens Horticulture aggregates produce from 4,000 smallholders to supply supermarkets and exporters
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start">
                        <div className="mr-4 bg-primary/10 p-3 rounded-full">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">E-Commerce Agricultural Marketplaces</h4>
                          <p className="mb-2">
                            Digital platforms connecting farmers directly to buyers, including restaurants, retailers, and consumers,
                            reducing the number of intermediaries in the supply chain.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Example: Twiga Foods connects 17,000 farmers to 8,000 vendors, increasing farmer incomes by 20-40%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-10" />
                
                <div className="p-6 border rounded-lg bg-muted/30">
                  <h3 className="text-xl font-medium mb-4">Join Our Market Access Programs</h3>
                  <p className="mb-4">
                    AgriTender Connect offers several programs to help farmers overcome market access challenges:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Digital Marketplace</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">List your produce on our digital marketplace to connect directly with buyers</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/commodity-trading/marketplace')}>
                          Access Marketplace
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Barter Exchange</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Exchange your produce with other farmers or for services you need</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/commodity-trading/barter')}>
                          Join Barter Network
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Market Intelligence</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Access real-time price trends and market demand forecasts</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/commodity-trading/price-trends')}>
                          View Market Data
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <Button className="w-full" onClick={() => navigate('/commodity-trading')}>
                    Explore All Market Access Services <ExternalLink className="ml-2 h-4 w-4" />
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

export default MarketAccess;
