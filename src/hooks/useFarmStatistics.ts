import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { FarmStatistics } from '@/types/database';

export const useFarmStatistics = () => {
  const [statistics, setStatistics] = useState<FarmStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('User not authenticated');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('farm_statistics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (!data) {
          // Create initial statistics record
          const { data: newStats, error: createError } = await supabase
            .from('farm_statistics')
            .insert({
              user_id: user.id,
              monthly_revenue: 0,
              total_area: 0,
              average_yield: 0,
              active_alerts: 0
            })
            .select()
            .single();

          if (createError) throw createError;
          setStatistics(newStats);
        } else {
          setStatistics(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const updateStatistics = async (updates: Partial<Omit<FarmStatistics, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !statistics) return;

      const { data, error } = await supabase
        .from('farm_statistics')
        .update(updates)
        .eq('id', statistics.id)
        .select()
        .single();

      if (error) throw error;
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update statistics');
    }
  };

  return {
    statistics,
    isLoading,
    error,
    updateStatistics
  };
};