import React, { useEffect, useState } from 'react';
import { createInputGroupOrder, joinInputGroupOrder, getInputGroupOrders, updateInputGroupOrderStatus } from '@/services/inputGroupOrderService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { 
  Users, 
  ShoppingCart, 
  TrendingDown, 
  Package, 
  MapPin, 
  Calendar,
  DollarSign,
  Target,
  Info
} from 'lucide-react';

const GroupInputOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [inputType, setInputType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [targetPrice, setTargetPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    getInputGroupOrders().then(({ data }) => setOrders(data || []));
  }, []);

  const handleExpressNeed = async () => {
    await createInputGroupOrder({ 
      input_type: inputType, 
      quantity,
      target_price: targetPrice,
      location,
      delivery_date: deliveryDate
    });
    getInputGroupOrders().then(({ data }) => setOrders(data || []));
    // Reset form
    setInputType('');
    setQuantity(0);
    setTargetPrice(0);
    setLocation('');
    setDeliveryDate('');
  };

  const handleJoinOrder = async (orderId: string) => {
    await joinInputGroupOrder(orderId, 'user_id', { quantity: 100 }); // Example quantity with user_id
    getInputGroupOrders().then(({ data }) => setOrders(data || []));
  };

  const inputTypes = [
    'Seeds - Maize',
    'Seeds - Beans',
    'Seeds - Wheat',
    'Fertilizer - DAP',
    'Fertilizer - NPK',
    'Fertilizer - Urea',
    'Pesticides - Insecticide',
    'Pesticides - Herbicide',
    'Farm Tools',
    'Irrigation Equipment'
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Group Purchasing for Farm Inputs</h1>
          <p className="text-muted-foreground text-lg">
            Join with other farmers to buy inputs in bulk and get better prices through collective bargaining power.
          </p>
        </div>

        {/* What is Group Purchasing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              How Group Purchasing Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">1. Form Groups</h3>
                <p className="text-sm text-muted-foreground">
                  Farmers express their needs for specific inputs and quantities
                </p>
              </div>
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">2. Bulk Orders</h3>
                <p className="text-sm text-muted-foreground">
                  When minimum quantities are reached, we negotiate with suppliers
                </p>
              </div>
              <div className="text-center">
                <TrendingDown className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">3. Better Prices</h3>
                <p className="text-sm text-muted-foreground">
                  Everyone benefits from wholesale prices and shared transportation costs
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="text-center">
              <h3 className="font-semibold mb-2">Benefits of Group Purchasing</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <ul className="space-y-1">
                    <li>• Save 15-30% on input costs</li>
                    <li>• Access to quality certified inputs</li>
                    <li>• Reduced transportation costs</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-1">
                    <li>• Guaranteed supply during peak seasons</li>
                    <li>• Technical support from suppliers</li>
                    <li>• Build relationships with other farmers</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create New Order */}
          <Card>
            <CardHeader>
              <CardTitle>Express Your Input Need</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="inputType">Input Type</Label>
                <Select value={inputType} onValueChange={setInputType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select input type" />
                  </SelectTrigger>
                  <SelectContent>
                    {inputTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity Needed</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 50"
                    value={quantity || ''}
                    onChange={e => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="targetPrice">Target Price (KES)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    placeholder="Per unit"
                    value={targetPrice || ''}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Preferred Delivery Location</Label>
                <Input
                  id="location"
                  placeholder="Your county/town"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="deliveryDate">Needed By Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleExpressNeed} 
                className="w-full"
                disabled={!inputType || !quantity || !location}
              >
                <Package className="h-4 w-4 mr-2" />
                Express Need
              </Button>
            </CardContent>
          </Card>

          {/* Available Group Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Join Existing Group Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active group orders</p>
                  <p className="text-sm">Be the first to express a need</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{order.input_type}</h3>
                          <p className="text-sm text-muted-foreground">
                            Target: {order.quantity} units @ KES {order.target_price}/unit
                          </p>
                        </div>
                        <Badge variant={order.status === 'open' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Minimum Order</span>
                          <span>{order.current_quantity || 0} / {order.quantity} units</span>
                        </div>
                        <Progress 
                          value={getProgressPercentage(order.current_quantity || 0, order.quantity)} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {order.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {order.delivery_date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {order.participants || 1} farmers
                        </div>
                      </div>

                      {order.status === 'open' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinOrder(order.id)}
                          className="w-full"
                        >
                          Join Group Order
                        </Button>
                      )}

                      {order.status === 'ready' && (
                        <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                          <p className="text-sm text-green-800 font-medium">
                            🎉 Order Ready! Final price: KES {order.final_price}/unit
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Input Pricing Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Current Input Prices & Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Seeds</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Maize (1kg)</span>
                    <span className="font-medium">KES 180-220</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beans (1kg)</span>
                    <span className="font-medium">KES 160-200</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    ↓ 5% lower in group orders
                  </div>
                </div>
              </div>
              
              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Fertilizers</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>DAP (50kg)</span>
                    <span className="font-medium">KES 4,200-4,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NPK (50kg)</span>
                    <span className="font-medium">KES 3,800-4,200</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    ↓ 12% lower in group orders
                  </div>
                </div>
              </div>

              <div className="border rounded p-3">
                <h4 className="font-medium mb-2">Group Savings</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Average Savings</span>
                    <span className="font-medium text-green-600">15-30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min. Group Size</span>
                    <span className="font-medium">5 farmers</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    💡 Larger groups = better prices
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupInputOrders;