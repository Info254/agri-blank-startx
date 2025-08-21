
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchKilimoStats } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const KilimoStatsView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('chart');
  const [todaysHighlight, setTodaysHighlight] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchKilimoStats();
        setData(fetchedData);
        
        // Generate today's highlight
        if (fetchedData.length > 0) {
          const randomIndex = Math.floor(Math.random() * fetchedData.length);
          const item = fetchedData[randomIndex];
          setTodaysHighlight(`Today's focus: ${item.name} in ${item.county} - ${item.category}`);
        }
      } catch (error) {
        console.error("Error loading Kilimo data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Prepare data for charts
  const chartData = data
    .filter(item => item.value > 0)
    .slice(0, 10)
    .map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      value: item.value
    }));

  // Prepare data for pie chart by category
  const categoryData = data.reduce((acc: any[], item) => {
    const existingCategory = acc.find(cat => cat.name === item.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kilimo Statistics</CardTitle>
        <CardDescription>Agricultural data from the Kenya Ministry of Agriculture</CardDescription>
        {todaysHighlight && (
          <div className="mt-2 bg-muted p-2 rounded-md font-medium text-sm animate-pulse">
            {todaysHighlight}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="chart">Charts</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="data">Data Table</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="space-y-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="text-sm text-center text-muted-foreground">
                  <p>Top 10 agricultural statistics by value</p>
                </div>
              </TabsContent>
              
              <TabsContent value="distribution" className="space-y-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="text-sm text-center text-muted-foreground">
                  <p>Distribution of data by category</p>
                </div>
              </TabsContent>
              
              <TabsContent value="data" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">County</th>
                        <th className="text-right p-2">Value</th>
                        <th className="text-left p-2">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 10).map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            {item.name}
                          </td>
                          <td className="p-2">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="p-2">{item.county}</td>
                          <td className="p-2 text-right font-medium">{item.value}</td>
                          <td className="p-2">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="text-center mt-4">
                  <Button size="sm" variant="outline">
                    View All Data <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{data.length}</div>
                  <div className="text-sm text-muted-foreground">Total Data Points</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {Array.from(new Set(data.map(item => item.county))).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Counties</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {Array.from(new Set(data.map(item => item.category))).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KilimoStatsView;
