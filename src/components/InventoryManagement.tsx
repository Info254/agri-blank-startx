// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface InventoryItem {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_value: number;
  minimum_stock: number;
  status: 'normal' | 'warning' | 'critical';
}

export const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    item_name: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    unit_price: 0,
    minimum_stock: 0,
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setItems(data?.map(item => ({
          ...item,
          total_value: item.total_value || 0
        })) || []);
      }
    } catch (error) {
      toast({
        title: 'Error fetching inventory',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      if (user?.id) {
        const { error } = await supabase.from('inventory_items').insert([
          {
            ...newItem,
            user_id: user.id,
          },
        ]);

        if (error) throw error;

        toast({
          title: 'Item added successfully',
          variant: 'default',
        });

        setNewItem({
          item_name: '',
          category: '',
          quantity: 0,
          unit: 'kg',
          unit_price: 0,
          minimum_stock: 0,
        });

        fetchInventory();
      }
    } catch (error) {
      toast({
        title: 'Error adding item',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStock = async (id: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({ quantity: newQuantity })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Stock updated successfully',
        variant: 'default',
      });

      fetchInventory();
    } catch (error) {
      toast({
        title: 'Error updating stock',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      
      {/* Add New Item Form */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            placeholder="Item Name"
            value={newItem.item_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewItem({ ...newItem, item_name: e.target.value })
            }
          />
          <Input
            placeholder="Category"
            value={newItem.category}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewItem({ ...newItem, quantity: Number(e.target.value) })
            }
          />
          <select
            value={newItem.unit}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setNewItem({ ...newItem, unit: e.target.value })
            }
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="g">Grams (g)</option>
            <option value="l">Liters (l)</option>
            <option value="units">Units</option>
          </select>
          <Input
            type="number"
            placeholder="Unit Price"
            value={newItem.unit_price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewItem({ ...newItem, unit_price: Number(e.target.value) })
            }
          />
          <Input
            type="number"
            placeholder="Minimum Stock"
            value={newItem.minimum_stock}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewItem({ ...newItem, minimum_stock: Number(e.target.value) })
            }
          />
        </div>
        <Button onClick={handleAddItem} className="mt-4">
          Add Item
        </Button>
      </Card>

      {/* Inventory List */}
      {loading ? (
        <div>Loading inventory...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{item.item_name}</h3>
                <p>Category: {item.category}</p>
                <p>
                  Stock: {item.quantity} {item.unit}
                </p>
                <p>Unit Price: ${item.unit_price}</p>
                <p>Total Value: ${item.total_value}</p>
                <p className={`font-medium ${
                  item.status === 'critical'
                    ? 'text-red-500'
                    : item.status === 'warning'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}>
                  Status: {item.status}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() =>
                      handleUpdateStock(item.id, item.quantity + 1)
                    }
                    variant="outline"
                  >
                    +
                  </Button>
                  <Button
                    onClick={() =>
                      handleUpdateStock(item.id, Math.max(0, item.quantity - 1))
                    }
                    variant="outline"
                  >
                    -
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
