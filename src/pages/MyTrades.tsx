
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Package, TrendingUp, Eye, MessageSquare } from 'lucide-react';

const MyTrades: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');

  const activeTrades = [
    {
      id: '1',
      type: 'sale',
      commodity: 'Maize',
      quantity: '50 bags (90kg each)',
      price: 'KES 4,500 per bag',
      buyer: 'Nakuru Grain Millers',
      status: 'confirmed',
      deliveryDate: '2024-01-20',
      totalValue: 'KES 225,000'
    },
    {
      id: '2',
      type: 'purchase',
      commodity: 'NPK Fertilizer',
      quantity: '20 bags (50kg each)',
      price: 'KES 3,200 per bag',
      seller: 'Agro-Supplies Ltd',
      status: 'pending',
      deliveryDate: '2024-01-18',
      totalValue: 'KES 64,000'
    }
  ];

  const completedTrades = [
    {
      id: '3',
      type: 'sale',
      commodity: 'French Beans',
      quantity: '200 kg',
      price: 'KES 120 per kg',
      buyer: 'Export Company Ltd',
      status: 'completed',
      completedDate: '2024-01-10',
      totalValue: 'KES 24,000'
    },
    {
      id: '4',
      type: 'purchase',
      commodity: 'Seeds - Maize',
      quantity: '10 kg',
      price: 'KES 450 per kg',
      seller: 'Kenya Seed Company',
      status: 'completed',
      completedDate: '2024-01-05',
      totalValue: 'KES 4,500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'sale' ? 'text-green-600' : 'text-blue-600';
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">My Trades</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Track and manage your agricultural trading activities
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Value (Active)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES 289,000</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">95%</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Trades</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6">
            {activeTrades.map((trade) => (
              <Card key={trade.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5" />
                        {trade.commodity}
                        <Badge variant="outline" className={getTypeColor(trade.type)}>
                          {trade.type === 'sale' ? 'Selling' : 'Buying'}
                        </Badge>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {trade.type === 'sale' ? `Buyer: ${trade.buyer}` : `Seller: ${trade.seller}`}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(trade.status)}>
                      {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Quantity</div>
                      <div className="font-medium">{trade.quantity}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="font-medium">{trade.price}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Delivery Date</div>
                      <div className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(trade.deliveryDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Value</div>
                      <div className="font-medium text-lg">{trade.totalValue}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact {trade.type === 'sale' ? 'Buyer' : 'Seller'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {completedTrades.map((trade) => (
              <Card key={trade.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5" />
                        {trade.commodity}
                        <Badge variant="outline" className={getTypeColor(trade.type)}>
                          {trade.type === 'sale' ? 'Sold' : 'Purchased'}
                        </Badge>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {trade.type === 'sale' ? `Buyer: ${trade.buyer}` : `Seller: ${trade.seller}`}
                      </div>
                    </div>
                    <Badge variant="default">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Quantity</div>
                      <div className="font-medium">{trade.quantity}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Price</div>
                      <div className="font-medium">{trade.price}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Completed Date</div>
                      <div className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(trade.completedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Value</div>
                      <div className="font-medium text-lg">{trade.totalValue}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trading Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Trades This Year</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Sales Value</span>
                      <span className="font-medium text-green-600">KES 1,250,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Purchases</span>
                      <span className="font-medium text-blue-600">KES 340,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Profit</span>
                      <span className="font-medium text-primary">KES 910,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Commodities Traded</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Maize</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-sm">12 trades</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>French Beans</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full w-1/2"></div>
                        </div>
                        <span className="text-sm">8 trades</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fertilizer</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full w-1/4"></div>
                        </div>
                        <span className="text-sm">4 trades</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyTrades;
