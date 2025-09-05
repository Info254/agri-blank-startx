// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CityMarketProduct } from '@/types/database';

export const useMarketProducts = (marketId?: string) => {
  const [products, setProducts] = useState<CityMarketProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('city_market_products')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (marketId) {
          query = query.eq('market_id', marketId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [marketId]);

  const addProduct = async (product: Omit<CityMarketProduct, 'id' | 'seller_user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('city_market_products')
        .insert({ ...product, seller_user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<CityMarketProduct>) => {
    try {
      const { data, error } = await supabase
        .from('city_market_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => prev.map(product => product.id === id ? data : product));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('city_market_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: () => {
      setIsLoading(true);
      const fetchProducts = async () => {
        try {
          let query = supabase
            .from('city_market_products')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false });

          if (marketId) {
            query = query.eq('market_id', marketId);
          }

          const { data, error: fetchError } = await query;
          if (fetchError) throw fetchError;
          setProducts(data || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  };
};