// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SupplyChainKPIs from '@/components/analytics/SupplyChainKPIs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Package, 
  Truck, 
  Users, 
  DollarSign,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

const SupplyChainAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock data for charts
  const deliveryPerformanceData = [
    { month: 'Jan', onTime: 85, delayed: 15, cancelled: 5 },
    { month: 'Feb', onTime: 88, delayed: 12, cancelled: 3 },
    { month: 'Mar', onTime: 92, delayed: 8, cancelled: 2 },
    { month: 'Apr', onTime: 89, delayed: 11, cancelled: 4 },
    { month: 'May', onTime: 94, delayed: 6, cancelled: 2 },
    { month: 'Jun', onTime: 91, delayed: 9, cancelled: 3 }
  ];

  const costAnalysisData = [
    { category: 'Transportation', cost: 45000, percentage: 35 },
    { category: 'Storage', cost: 28000, percentage: 22 },
    { category: 'Processing', cost: 32000, percentage: 25 },
    { category: 'Packaging', cost: 15000, percentage: 12 },
    { category: 'Quality Control', cost: 8000, percentage: 6 }
  ];

  const supplierPerformanceData = [
    { supplier: 'Meru Organic Co-op', reliability: 95, quality: 92, cost: 88 },
    { supplier: 'Nakuru Fresh Farms', reliability: 88, quality: 94, cost: 85 },
    { supplier: 'Kisumu Agri Partners', reliability: 92, quality: 89, cost: 91 },
    { supplier: 'Eldoret Produce Ltd', reliability: 85, quality: 87, cost: 93 },
    { supplier: 'Thika Valley Farms', reliability: 90, quality: 91, cost: 86 }
  ];

  const wasteReductionData = [
    { month: 'Jan', waste: 12, recovered: 8, donated: 3 },
    { month: 'Feb', waste: 10, recovered: 9, donated: 4 },
    { month: 'Mar', waste: 8, recovered: 11, donated: 5 },
    { month: 'Apr', waste: 9, recovered: 10, donated: 4 },
    { month: 'May', waste: 7, recovered: 12, donated: 6 },
    { month: 'Jun', waste: 6, recovered: 13, donated: 7 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const exportData = () => {
    // Mock export functionality
    const data = {
      timeRange,
      deliveryPerformance: deliveryPerformanceData,
      costAnalysis: costAnalysisData,
      supplierPerformance: supplierPerformanceData,
      wasteReduction: wasteReductionData,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supply-chain-analytics-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Supply Chain Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights into your agricultural supply chain performance
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="kpis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          </TabsList>

          <TabsContent value="kpis">
            <SupplyChainKPIs timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">91.5%</div>
                  <p className="text-xs text-muted-foreground">+2.3% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.8 days</div>
                  <p className="text-xs text-muted-foreground">-0.5 days improvement</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivery Issues</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">8.5%</div>
                  <p className="text-xs text-muted-foreground">-1.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={deliveryPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="onTime" stackId="1" stroke="#22c55e" fill="#22c55e" />
                    <Area type="monotone" dataKey="delayed" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="cancelled" stackId="1" stroke="#ef4444" fill="#ef4444" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={costAnalysisData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cost"
                      >
                        {costAnalysisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, 'Cost']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {costAnalysisData.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">KES {item.cost.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={supplierPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="supplier" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reliability" fill="#8884d8" name="Reliability %" />
                    <Bar dataKey="quality" fill="#82ca9d" name="Quality %" />
                    <Bar dataKey="cost" fill="#ffc658" name="Cost Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supplierPerformanceData.map((supplier, index) => (
                <Card key={supplier.supplier}>
                  <CardHeader>
                    <CardTitle className="text-lg">{supplier.supplier}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Reliability</span>
                        <span className="font-bold text-blue-600">{supplier.reliability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality</span>
                        <span className="font-bold text-green-600">{supplier.quality}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost Efficiency</span>
                        <span className="font-bold text-yellow-600">{supplier.cost}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">15.2%</div>
                  <p className="text-xs text-muted-foreground">+3.1% improvement</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.1 kg CO₂/kg</div>
                  <p className="text-xs text-muted-foreground">-0.3 kg reduction</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Food Donated</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,240 kg</div>
                  <p className="text-xs text-muted-foreground">+180 kg this month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Waste Management Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={wasteReductionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={2} name="Waste %" />
                    <Line type="monotone" dataKey="recovered" stroke="#22c55e" strokeWidth={2} name="Recovered %" />
                    <Line type="monotone" dataKey="donated" stroke="#3b82f6" strokeWidth={2} name="Donated %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SupplyChainAnalytics;
