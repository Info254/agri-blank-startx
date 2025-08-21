import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  getCityMarkets,
  getCityMarketById,
  createCityMarket as createMarket,
  updateCityMarket as updateMarket,
  deleteCityMarket as deleteMarket,
  CityMarket,
  CityMarketFormData,
  CityMarketFilters,
} from '@/services/cityMarketService';

export function useCityMarkets(initialFilters: CityMarketFilters = {}) {
  const [markets, setMarkets] = useState<CityMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<CityMarketFilters>(initialFilters);
  const { toast } = useToast();

  const fetchMarkets = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await getCityMarkets(filters);
      
      if (fetchError) throw fetchError;
      
      setMarkets(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch markets:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch markets'));
      toast({
        title: 'Error',
        description: 'Failed to load markets. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const getMarket = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await getCityMarketById(id);
      
      if (fetchError) throw fetchError;
      
      return data;
    } catch (err) {
      console.error(`Failed to fetch market ${id}:`, err);
      setError(err instanceof Error ? err : new Error('Failed to fetch market'));
      toast({
        title: 'Error',
        description: 'Failed to load market details. Please try again later.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createCityMarket = useCallback(async (marketData: CityMarketFormData) => {
    try {
      setLoading(true);
      const { data, error: createError } = await createMarket(marketData);
      
      if (createError) throw createError;
      
      await fetchMarkets();
      toast({
        title: 'Success',
        description: 'Market created successfully!',
      });
      
      return data;
    } catch (err) {
      console.error('Failed to create market:', err);
      setError(err instanceof Error ? err : new Error('Failed to create market'));
      toast({
        title: 'Error',
        description: 'Failed to create market. Please try again.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMarkets, toast]);

  const updateCityMarket = useCallback(async (id: string, updates: Partial<CityMarketFormData>) => {
    try {
      setLoading(true);
      const { data, error: updateError } = await updateMarket(id, updates);
      
      if (updateError) throw updateError;
      
      await fetchMarkets();
      toast({
        title: 'Success',
        description: 'Market updated successfully!',
      });
      
      return data;
    } catch (err) {
      console.error(`Failed to update market ${id}:`, err);
      setError(err instanceof Error ? err : new Error('Failed to update market'));
      toast({
        title: 'Error',
        description: 'Failed to update market. Please try again.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMarkets, toast]);

  const deleteCityMarket = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteMarket(id);
      
      await fetchMarkets();
      toast({
        title: 'Success',
        description: 'Market deleted successfully!',
      });
      
      return true;
    } catch (err) {
      console.error(`Failed to delete market ${id}:`, err);
      setError(err instanceof Error ? err : new Error('Failed to delete market'));
      toast({
        title: 'Error',
        description: 'Failed to delete market. Please try again.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMarkets, toast]);

  // Initial fetch
  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  return {
    markets,
    loading,
    error,
    filters,
    setFilters,
    getMarket,
    createCityMarket,
    updateCityMarket,
    deleteCityMarket,
    refresh: fetchMarkets,
  };
}
