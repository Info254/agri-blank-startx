import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Truck, 
  Package, 
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  category: 'efficiency' | 'quality' | 'cost' | 'sustainability';
  status: 'good' | 'warning' | 'critical';
}

interface SupplyChainKPIsProps {
  farmerId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

const SupplyChainKPIs: React.FC<SupplyChainKPIsProps> = ({ 
  farmerId = 'current_user',
  timeRange = '30d' 
}) => {
  const [kpis, setKpis] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, [farmerId, timeRange]);

  const fetchKPIs = async () => {
    setLoading(true);
    
    // Mock KPI data - in production, this would come from analytics service
    const mockKPIs: KPIMetric[] = [
      // Efficiency KPIs
      {
        id: 'order_fulfillment_rate',
        name: 'Order Fulfillment Rate',
        value: 94.5,
        target: 95,
        unit: '%',
        trend: 'up',
        trendValue: 2.3,
        category: 'efficiency',
        status: 'warning'
      },
      {
        id: 'delivery_time',
        name: 'Average Delivery Time',
        value: 2.8,
        target: 2.5,
        unit: 'days',
        trend: 'down',
        trendValue: -0.5,
        category: 'efficiency',
        status: 'good'
      },
      {
        id: 'inventory_turnover',
        name: 'Inventory Turnover',
        value: 8.2,
        target: 10,
        unit: 'times/year',
        trend: 'up',
        trendValue: 1.2,
        category: 'efficiency',
        status: 'warning'
      },
      
      // Quality KPIs
      {
        id: 'quality_rejection_rate',
        name: 'Quality Rejection Rate',
        value: 3.2,
        target: 2,
        unit: '%',
        trend: 'up',
        trendValue: 0.8,
        category: 'quality',
        status: 'critical'
      },
      {
        id: 'customer_satisfaction',
        name: 'Customer Satisfaction',
        value: 4.6,
        target: 4.5,
        unit: '/5',
        trend: 'up',
        trendValue: 0.2,
        category: 'quality',
        status: 'good'
      },
      {
        id: 'organic_compliance',
        name: 'Organic Compliance Rate',
        value: 98.5,
        target: 99,
        unit: '%',
        trend: 'stable',
        trendValue: 0,
        category: 'quality',
        status: 'good'
      },
      
      // Cost KPIs
      {
        id: 'cost_per_delivery',
        name: 'Cost per Delivery',
        value: 450,
        target: 400,
        unit: 'KES',
        trend: 'down',
        trendValue: -25,
        category: 'cost',
        status: 'warning'
      },
      {
        id: 'storage_cost_efficiency',
        name: 'Storage Cost Efficiency',
        value: 85,
        target: 90,
        unit: '%',
        trend: 'up',
        trendValue: 3,
        category: 'cost',
        status: 'warning'
      },
      
      // Sustainability KPIs
      {
        id: 'carbon_footprint',
        name: 'Carbon Footprint',
        value: 2.1,
        target: 1.8,
        unit: 'kg CO2/kg',
        trend: 'down',
        trendValue: -0.3,
        category: 'sustainability',
        status: 'warning'
      },
      {
        id: 'waste_reduction',
        name: 'Waste Reduction',
        value: 12,
        target: 15,
        unit: '%',
        trend: 'up',
        trendValue: 2,
        category: 'sustainability',
        status: 'warning'
      }
    ];

    setTimeout(() => {
      setKpis(mockKPIs);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'efficiency': return <Clock className="h-5 w-5" />;
      case 'quality': return <Target className="h-5 w-5" />;
      case 'cost': return <DollarSign className="h-5 w-5" />;
      case 'sustainability': return <Package className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const filterKPIsByCategory = (category: string) => {
    return kpis.filter(kpi => kpi.category === category);
  };

  const calculateOverallScore = (categoryKPIs: KPIMetric[]) => {
    if (categoryKPIs.length === 0) return 0;
    const totalScore = categoryKPIs.reduce((sum, kpi) => {
      const achievementRate = Math.min((kpi.value / kpi.target) * 100, 100);
      return sum + achievementRate;
    }, 0);
    return Math.round(totalScore / categoryKPIs.length);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supply Chain KPIs</h2>
        <Badge variant="outline">Last updated: {new Date().toLocaleDateString()}</Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['efficiency', 'quality', 'cost', 'sustainability'].map((category) => {
              const categoryKPIs = filterKPIsByCategory(category);
              const score = calculateOverallScore(categoryKPIs);
              
              return (
                <Card key={category}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {category}
                    </CardTitle>
                    {getCategoryIcon(category)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{score}%</div>
                    <Progress value={score} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {categoryKPIs.length} metrics tracked
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Critical Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {kpis.filter(kpi => kpi.status === 'critical').map((kpi) => (
                  <div key={kpi.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(kpi.status)}
                      <span className="font-medium">{kpi.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">
                        {kpi.value}{kpi.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Target: {kpi.target}{kpi.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {kpis.filter(kpi => kpi.status === 'good').slice(0, 3).map((kpi) => (
                  <div key={kpi.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(kpi.status)}
                      <span className="font-medium">{kpi.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {kpi.value}{kpi.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Target: {kpi.target}{kpi.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {['efficiency', 'quality', 'cost', 'sustainability'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterKPIsByCategory(category).map((kpi) => (
                <Card key={kpi.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {kpi.name}
                    </CardTitle>
                    {getStatusIcon(kpi.status)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpi.value}{kpi.unit}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {getTrendIcon(kpi.trend)}
                      <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {kpi.trendValue > 0 ? '+' : ''}{kpi.trendValue}{kpi.unit} vs last period
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((kpi.value / kpi.target) * 100, 100)} 
                      className="mt-3" 
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Target: {kpi.target}{kpi.unit}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SupplyChainKPIs;
