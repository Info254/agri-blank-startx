
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';

interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'production' | 'financial' | 'efficiency';
}

const AnalyticsDashboard: React.FC = () => {
  const [kpis] = useState<KPI[]>([
    { id: '1', name: 'Maize Yield', value: 85, target: 90, unit: 'bags/acre', trend: 'up', category: 'production' },
    { id: '2', name: 'Bean Yield', value: 12, target: 15, unit: 'bags/acre', trend: 'down', category: 'production' },
    { id: '3', name: 'Profit per Hectare', value: 45000, target: 50000, unit: 'KES', trend: 'up', category: 'financial' },
    { id: '4', name: 'Cost Efficiency', value: 78, target: 85, unit: '%', trend: 'stable', category: 'efficiency' },
    { id: '5', name: 'Market Price Advantage', value: 12, target: 10, unit: '%', trend: 'up', category: 'financial' },
    { id: '6', name: 'Resource Utilization', value: 88, target: 90, unit: '%', trend: 'up', category: 'efficiency' }
  ]);

  const performanceData = [
    { crop: 'Maize', currentYield: 85, previousYield: 75, efficiency: 88 },
    { crop: 'Beans', currentYield: 12, previousYield: 15, efficiency: 75 },
    { crop: 'Potatoes', currentYield: 45, previousYield: 40, efficiency: 92 },
    { crop: 'Tomatoes', currentYield: 32, previousYield: 28, efficiency: 85 },
    { crop: 'Onions', currentYield: 25, previousYield: 22, efficiency: 80 }
  ];

  const landEfficiencyData = [
    { size: 2.5, profit: 65000, efficiency: 88 },
    { size: 1.8, profit: 45000, efficiency: 85 },
    { size: 3.2, profit: 95000, efficiency: 92 },
    { size: 1.2, profit: 32000, efficiency: 78 },
    { size: 4.1, profit: 125000, efficiency: 95 }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'production': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-blue-100 text-blue-800';
      case 'efficiency': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics & KPIs</h2>
          <p className="text-muted-foreground">Track your farm's key performance indicators and analytics for Kenyan agriculture</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
                  <p className="text-2xl font-bold">{kpi.value.toLocaleString()} {kpi.unit}</p>
                </div>
                {getTrendIcon(kpi.trend)}
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <Badge className={getCategoryColor(kpi.category)}>
                  {kpi.category}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Target: {kpi.target} {kpi.unit}
                </div>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${kpi.value >= kpi.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Crop Performance Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Compare current vs previous season yields for major Kenyan crops
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="currentYield" fill="#22c55e" name="Current Season" />
                  <Bar dataKey="previousYield" fill="#7c2d12" name="Previous Season" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Land Efficiency vs Profitability
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Analyze the relationship between farm size, efficiency, and profit per hectare
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={landEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="size" name="Farm Size (Ha)" />
                  <YAxis dataKey="profit" name="Profit (KES)" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'profit' ? `KES ${value.toLocaleString()}` : `${value}%`,
                      name === 'profit' ? 'Annual Profit' : 'Efficiency'
                    ]}
                    labelFormatter={(value) => `Farm Size: ${value} Ha`}
                  />
                  <Scatter dataKey="profit" fill="#3b82f6">
                    {landEfficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.efficiency > 85 ? '#22c55e' : '#f59e0b'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">KES 2.4M</p>
                <p className="text-sm text-green-600">+15.3% from last season</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">EBITDA Margin</p>
                <p className="text-2xl font-bold">32.5%</p>
                <p className="text-sm text-blue-600">Industry avg: 28%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Reach</p>
                <p className="text-2xl font-bold">8 Counties</p>
                <p className="text-sm text-purple-600">Expanding to 12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
