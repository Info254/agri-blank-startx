import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { InventoryItem } from '@/types/database';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('User not authenticated');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setItems(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'user_id' | 'total_value' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('inventory_items')
        .insert({ ...item, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    }
  };

  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refetch: () => {
      setIsLoading(true);
      const fetchInventory = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error: fetchError } = await supabase
            .from('inventory_items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (fetchError) throw fetchError;
          setItems(data || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInventory();
    }
  };
};