
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Produce } from '@/types';
import { simulateDelay } from '@/services/api';

interface MarketplaceTabProps {
  isLoading: boolean;
  filteredProduce: Produce[];
}

const MarketplaceTab: React.FC<MarketplaceTabProps> = ({ isLoading, filteredProduce }) => {
  const { toast } = useToast();
  const [processingOrders, setProcessingOrders] = useState<Record<string, boolean>>({});
  
  // Function to place an order
  const placeOrder = async (type: 'buy' | 'sell', commodity: string, itemId: string, quantity: number, price: number) => {
    try {
      // Mark this item as processing
      setProcessingOrders(prev => ({ ...prev, [itemId]: true }));
      
      // Simulate API call
      await simulateDelay(1000);
      
      // Show success message with toast
      toast({
        title: "Order Placed Successfully",
        description: `${type === 'buy' ? 'Buy' : 'Sell'} order placed for ${quantity} ${commodity} at KES ${price} per unit`,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: `Could not place your order. Please try again.`,
        variant: "destructive",
      });
    } finally {
      // Mark item as done processing
      setProcessingOrders(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredProduce.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No commodities found. Try a different search or filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Commodity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead>Available From</TableHead>
            <TableHead>County</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProduce.map((item) => {
            const itemPrice = Math.floor(Math.random() * 100) + 50;
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity} {item.unit}</TableCell>
                <TableCell>{item.qualityGrade}</TableCell>
                <TableCell>{item.availableFrom}</TableCell>
                <TableCell>{item.county}</TableCell>
                <TableCell>{item.farmer}</TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    onClick={() => placeOrder('buy', item.name, item.id, item.quantity, itemPrice)}
                    disabled={processingOrders[item.id]}
                  >
                    {processingOrders[item.id] ? 'Processing...' : 'Buy'}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarketplaceTab;
