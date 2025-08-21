import React, { useState } from 'react';
import { useFarmStatistics } from '@/features/farm-statistics/context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  ResponsiveContainer
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sprout,
  BarChart2,
  Calendar,
  Drop,
  Zap
} from 'lucide-react';

const FarmStatisticsDashboard: React.FC = () => {
  const {
    farmStats,
    yields,
    resources,
    budget,
    revenue,
    analytics,
    monthlyStats,
    loadYields,
    loadResources,
    loadBudget,
    loadRevenue,
    loadAnalytics,
    loadMonthlyStats,
    isLoading
  } = useFarmStatistics();

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    end: new Date()
  });

  // Filter handlers for each section
  const handleYieldDateChange = (date: Date | null, type: 'start' | 'end') => {
    if (!date) return;
    setDateRange(prev => ({
      ...prev,
      [type]: date
    }));
    loadYields({
      start_date: type === 'start' ? date.toISOString() : dateRange.start.toISOString(),
      end_date: type === 'end' ? date.toISOString() : dateRange.end.toISOString()
    });
  };

  // Calculate summary metrics
  const currentMonthStats = monthlyStats || {
    total_revenue: 0,
    total_expenses: 0,
    net_profit: 0,
    yield_achievement_percentage: 0,
    resource_utilization_cost: 0
  };

  const yieldPerformance = yields.reduce((acc, curr) => {
    if (curr.actual_yield && curr.expected_yield) {
      acc.actual += curr.actual_yield;
      acc.expected += curr.expected_yield;
    }
    return acc;
  }, { actual: 0, expected: 0 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farm Statistics</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your farm's performance
          </p>
        </div>
        <div className="flex gap-4">
          <DatePicker
            selected={dateRange.start}
            onChange={(date) => handleYieldDateChange(date, 'start')}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={dateRange.end}
            onChange={(date) => handleYieldDateChange(date, 'end')}
            placeholderText="End Date"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  KES {currentMonthStats.total_revenue.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-4 w-4 text-green-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Yield Performance</p>
                <p className="text-2xl font-bold">
                  {currentMonthStats.yield_achievement_percentage.toFixed(1)}%
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Sprout className="h-4 w-4 text-blue-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-500">+5.2%</span>
              <span className="text-muted-foreground ml-2">yield achievement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resource Utilization</p>
                <p className="text-2xl font-bold">
                  KES {currentMonthStats.resource_utilization_cost.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Zap className="h-4 w-4 text-yellow-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-yellow-500">-3.1%</span>
              <span className="text-muted-foreground ml-2">resource costs</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">
                  KES {currentMonthStats.net_profit.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChart2 className="h-4 w-4 text-purple-700" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-purple-500">+8.4%</span>
              <span className="text-muted-foreground ml-2">profit margin</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics Tabs */}
      <Tabs defaultValue="yields" className="space-y-4">
        <TabsList>
          <TabsTrigger value="yields">Yields</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="yields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yield Tracking</CardTitle>
              <CardDescription>Compare expected vs actual yields across crops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yields}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="crop_type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="expected_yield" fill="#8884d8" name="Expected Yield" />
                    <Bar dataKey="actual_yield" fill="#82ca9d" name="Actual Yield" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>Track resource consumption and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={resources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="usage_date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="quantity" stroke="#8884d8" name="Usage Quantity" />
                    <Line type="monotone" dataKey="total_cost" stroke="#82ca9d" name="Total Cost" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Track planned vs actual expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Planned</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Variance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budget.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>KES {item.planned_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          {item.actual_amount
                            ? `KES ${item.actual_amount.toLocaleString()}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {item.variance_amount
                            ? `KES ${item.variance_amount.toLocaleString()}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <span className={item.variance_percentage > 0 ? 'text-red-500' : 'text-green-500'}>
                            {item.variance_percentage}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Farm Analytics</CardTitle>
              <CardDescription>Monitor key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="metric_value"
                      stroke="#8884d8"
                      name="Metric Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmStatisticsDashboard;
