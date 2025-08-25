import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { BulkOrder } from '@/types/database';

export const useBulkOrders = (userOrders = false) => {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('bulk_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (userOrders) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            setError('User not authenticated');
            return;
          }
          query = query.eq('buyer_id', user.id);
        } else {
          query = query.eq('status', 'open');
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userOrders]);

  const createOrder = async (order: Omit<BulkOrder, 'id' | 'buyer_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bulk_orders')
        .insert({ ...order, buyer_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setOrders(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    }
  };

  const updateOrder = async (id: string, updates: Partial<BulkOrder>) => {
    try {
      const { data, error } = await supabase
        .from('bulk_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOrders(prev => prev.map(order => order.id === id ? data : order));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bulk_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
      throw err;
    }
  };

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch: () => {
      setIsLoading(true);
      const fetchOrders = async () => {
        try {
          let query = supabase
            .from('bulk_orders')
            .select('*')
            .order('created_at', { ascending: false });

          if (userOrders) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            query = query.eq('buyer_id', user.id);
          } else {
            query = query.eq('status', 'open');
          }

          const { data, error: fetchError } = await query;
          if (fetchError) throw fetchError;
          setOrders(data || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  };
};