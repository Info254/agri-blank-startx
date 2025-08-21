
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { simulateDelay } from '@/services/api';

interface OrdersTabProps {
  isLoading: boolean;
  searchTerm: string;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ isLoading, searchTerm }) => {
  // Mock market orders
  const [orders, setOrders] = useState<any[]>([
    { id: 1, type: 'buy', commodity: 'Maize', quantity: 1000, price: 42, buyer: 'Nairobi Mills' },
    { id: 2, type: 'sell', commodity: 'Maize', quantity: 500, price: 45, seller: 'John Kamau' },
    { id: 3, type: 'buy', commodity: 'Coffee', quantity: 300, price: 340, buyer: 'Kenya Coffee Exporters' },
    { id: 4, type: 'sell', commodity: 'Coffee', quantity: 200, price: 350, seller: 'Mary Wanjiku' },
    { id: 5, type: 'buy', commodity: 'Tea', quantity: 400, price: 270, buyer: 'Global Tea Traders' },
    { id: 6, type: 'sell', commodity: 'Tea', quantity: 300, price: 280, seller: 'Sarah Muthoni' },
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Mock function to place an order
  const placeOrder = async (type: 'buy' | 'sell', commodity: string, quantity: number, price: number) => {
    try {
      // Simulate API call
      await simulateDelay(1000);
      
      // Add new order to the list
      const newOrder = {
        id: orders.length + 1,
        type,
        commodity,
        quantity,
        price,
        buyer: type === 'buy' ? 'Your Company' : '',
        seller: type === 'sell' ? 'Your Company' : ''
      };
      
      setOrders([...orders, newOrder]);
      
      // Show success message
      alert(`${type === 'buy' ? 'Buy' : 'Sell'} order placed successfully for ${quantity} ${commodity} at KES ${price} per unit`);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Commodity</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price (KES)</TableHead>
                <TableHead>Buyer/Seller</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.type === 'buy' ? 'Buy' : 'Sell'}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{order.commodity}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.price}</TableCell>
                  <TableCell>{order.type === 'buy' ? order.buyer : order.seller}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant={order.type === 'buy' ? 'outline' : 'default'}
                      onClick={() => placeOrder(order.type === 'buy' ? 'sell' : 'buy', order.commodity, order.quantity, order.price)}
                    >
                      {order.type === 'buy' ? 'Sell to' : 'Buy from'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No active orders found. Try a different search or place a new order.</p>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Place New Order</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Buy Order</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="buy-commodity">Commodity</Label>
                  <Select defaultValue="Maize">
                    <SelectTrigger id="buy-commodity">
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maize">Maize</SelectItem>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="Tea">Tea</SelectItem>
                      <SelectItem value="Beans">Beans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="buy-quantity">Quantity (kg)</Label>
                  <Input id="buy-quantity" type="number" min="1" defaultValue="100" />
                </div>
                <div>
                  <Label htmlFor="buy-price">Price per kg (KES)</Label>
                  <Input id="buy-price" type="number" min="1" defaultValue="45" />
                </div>
                <Button 
                  type="button" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => placeOrder('buy', 'Maize', 100, 45)}
                >
                  Place Buy Order
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Sell Order</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="sell-commodity">Commodity</Label>
                  <Select defaultValue="Beans">
                    <SelectTrigger id="sell-commodity">
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maize">Maize</SelectItem>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="Tea">Tea</SelectItem>
                      <SelectItem value="Beans">Beans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sell-quantity">Quantity (kg)</Label>
                  <Input id="sell-quantity" type="number" min="1" defaultValue="200" />
                </div>
                <div>
                  <Label htmlFor="sell-price">Price per kg (KES)</Label>
                  <Input id="sell-price" type="number" min="1" defaultValue="110" />
                </div>
                <Button 
                  type="button" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => placeOrder('sell', 'Beans', 200, 110)}
                >
                  Place Sell Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrdersTab;
