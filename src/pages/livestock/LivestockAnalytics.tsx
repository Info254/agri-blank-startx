import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Download, BarChart2, PieChart, LineChart, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type LivestockType = 'cattle' | 'goats' | 'sheep' | 'poultry' | 'pigs' | 'camels';

interface AnalyticsData {
  totalLivestock: number;
  totalValue: number;
  averageWeight: number;
  averageAge: number;
  mortalityRate: number;
  salesRevenue: number;
  expenses: number;
  profit: number;
  livestockByType: { type: string; count: number }[];
  livestockByStatus: { status: string; count: number }[];
  monthlySales: { month: string; sales: number }[];
  monthlyExpenses: { month: string; expenses: number }[];
}

export default function LivestockAnalytics() {
  const [timeframe, setTimeframe] = useState('12m');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Generate mock data
  useEffect(() => {
    const generateMockData = () => {
      const now = new Date();
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(now, 11 - i);
        return format(date, 'MMM yyyy');
      });

      const livestockTypes: LivestockType[] = ['cattle', 'goats', 'sheep', 'poultry', 'pigs', 'camels'];
      const statuses = ['active', 'sold', 'deceased', 'traded'];
      
      const typeCounts = livestockTypes.map(type => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: Math.floor(Math.random() * 50) + 10,
      }));

      const statusCounts = statuses.map(status => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count: Math.floor(Math.random() * 100) + 20,
      }));

      const monthlySales = months.map(month => ({
        month,
        sales: Math.floor(Math.random() * 500000) + 100000,
      }));

      const monthlyExpenses = months.map(month => ({
        month,
        expenses: Math.floor(Math.random() * 300000) + 50000,
      }));

      const totalLivestock = typeCounts.reduce((sum, type) => sum + type.count, 0);
      const salesRevenue = monthlySales.reduce((sum, item) => sum + item.sales, 0);
      const expenses = monthlyExpenses.reduce((sum, item) => sum + item.expenses, 0);

      return {
        totalLivestock,
        totalValue: Math.floor(salesRevenue * 0.7),
        averageWeight: Math.floor(Math.random() * 200) + 50,
        averageAge: Math.floor(Math.random() * 5) + 1,
        mortalityRate: Math.floor(Math.random() * 10) + 1,
        salesRevenue,
        expenses,
        profit: salesRevenue - expenses,
        livestockByType: typeCounts,
        livestockByStatus: statusCounts,
        monthlySales,
        monthlyExpenses,
      };
    };

    // Simulate API call
    const timer = setTimeout(() => {
      setAnalyticsData(generateMockData());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeframe]);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              if (['sales', 'expenses', 'profit', 'value'].some(term => 
                context.dataset.label?.toLowerCase().includes(term))) {
                return label + new Intl.NumberFormat('en-KE', { 
                  style: 'currency', 
                  currency: 'KES' 
                }).format(context.parsed.y);
              }
              return label + context.parsed.y;
            }
            return label;
          }
        }
      },
    },
  };

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Livestock Analytics</h1>
          <p className="text-gray-600">Track and analyze your livestock performance</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="financial">
            <LineChart className="h-4 w-4 mr-2" />
            Financials
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <PieChart className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalLivestock}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' })
                    .format(analyticsData.totalValue)}
                </div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.averageWeight} kg</div>
                <p className="text-xs text-muted-foreground">+2.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.mortalityRate}%</div>
                <p className="text-xs text-muted-foreground">-0.5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Livestock by Type</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Pie
                  data={{
                    labels: analyticsData.livestockByType.map(item => item.type),
                    datasets: [{
                      data: analyticsData.livestockByType.map(item => item.count),
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                      ],
                    }],
                  }}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Livestock by Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Bar
                  data={{
                    labels: analyticsData.livestockByStatus.map(item => item.status),
                    datasets: [{
                      label: 'Number of Animals',
                      data: analyticsData.livestockByStatus.map(item => item.count),
                      backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    }],
                  }}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sales Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' })
                    .format(analyticsData.salesRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">+8.2% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' })
                    .format(analyticsData.expenses)}
                </div>
                <p className="text-xs text-muted-foreground">+3.5% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  analyticsData.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' })
                    .format(analyticsData.profit)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.profit >= 0 ? '+' : ''}
                  {((analyticsData.salesRevenue - analyticsData.expenses) / analyticsData.expenses * 100).toFixed(1)}% margin
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales & Expenses</CardTitle>
              <CardDescription>Monthly overview</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Line
                data={{
                  labels: analyticsData.monthlySales.map(item => item.month),
                  datasets: [
                    {
                      label: 'Sales',
                      data: analyticsData.monthlySales.map(item => item.sales),
                      borderColor: 'rgb(54, 162, 235)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      tension: 0.3,
                      fill: true,
                    },
                    {
                      label: 'Expenses',
                      data: analyticsData.monthlyExpenses.map(item => item.expenses),
                      borderColor: 'rgb(255, 99, 132)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Livestock Distribution</CardTitle>
                <CardDescription>Breakdown by animal type and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar
                    data={{
                      labels: analyticsData.livestockByType.map(item => item.type),
                      datasets: [
                        {
                          label: 'Active',
                          data: analyticsData.livestockByType.map(() => 
                            Math.floor(Math.random() * 50) + 10
                          ),
                          backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        },
                        {
                          label: 'Sold',
                          data: analyticsData.livestockByType.map(() => 
                            Math.floor(Math.random() * 30) + 5
                          ),
                          backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        },
                        {
                          label: 'Deceased',
                          data: analyticsData.livestockByType.map(() => 
                            Math.floor(Math.random() * 10) + 1
                          ),
                          backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line
                    data={{
                      labels: analyticsData.monthlySales.map(item => item.month),
                      datasets: [
                        {
                          label: 'Average Sale Price',
                          data: analyticsData.monthlySales.map(() => 
                            Math.floor(Math.random() * 50000) + 10000
                          ),
                          borderColor: 'rgb(255, 159, 64)',
                          backgroundColor: 'rgba(255, 159, 64, 0.2)',
                          tension: 0.3,
                          yAxisID: 'y',
                        },
                        {
                          label: 'Livestock Count',
                          data: analyticsData.monthlySales.map(() => 
                            Math.floor(Math.random() * 100) + 50
                          ),
                          borderColor: 'rgb(54, 162, 235)',
                          backgroundColor: 'rgba(54, 162, 235, 0.2)',
                          tension: 0.3,
                          yAxisID: 'y1',
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          title: {
                            display: true,
                            text: 'Average Sale Price (KES)',
                          },
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                          },
                          title: {
                            display: true,
                            text: 'Livestock Count',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
