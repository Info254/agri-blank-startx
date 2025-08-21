import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getContractFarmingWithRelations } from '@/lib/supabase/client';
import type { ContractFarming, ContractFarmingQueryResult } from '@/types/database.types';

export const useContractFarming = () => {
  const [opportunities, setOpportunities] = useState<ContractFarming[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOpportunities = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await getContractFarmingWithRelations();

      if (error) throw error;

      if (!data || data.length === 0) {
        setOpportunities([]);
        return [];
      }

      const processedData = data.map(processOpportunity);
      setOpportunities(processedData);
      return processedData;
    } catch (error) {
      console.error('Error fetching contract farming opportunities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contract farming opportunities',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const processOpportunity = (opp: ContractFarmingQueryResult): ContractFarming => {
    const reviews = opp.reviews || [];
    const ratingSum = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const average_rating = reviews.length > 0 
      ? Number((ratingSum / reviews.length).toFixed(1))
      : null;

    return {
      ...opp,
      documents: opp.documents || [],
      reviews: reviews.map(r => ({
        ...r,
        user: r.user || { id: '', full_name: 'Anonymous', avatar_url: null }
      })),
      average_rating,
      review_count: reviews.length
    };
  };

  // Initial fetch
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const cropSet = new Set<string>();
    const locationSet = new Set<string>();
    
    opportunities.forEach(opp => {
      if (opp.crop_type) cropSet.add(opp.crop_type);
      if (opp.location) locationSet.add(opp.location);
    });
    
    return {
      crops: Array.from(cropSet).sort(),
      locations: Array.from(locationSet).sort(),
      statuses: ['all', 'active', 'completed'] as const
    };
  }, [opportunities]);

  // Filter opportunities based on criteria
  const filterOpportunities = useCallback(({
    searchTerm = '',
    cropType = 'all',
    status = 'all'
  }: {
    searchTerm?: string;
    cropType?: string;
    status?: string;
  }) => {
    let filtered = [...opportunities];
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(opp => {
        const searchText = [
          opp.title,
          opp.description,
          opp.crop_type,
          opp.company_name,
          opp.location,
          opp.requirements,
          opp.benefits
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        
        return searchText.includes(term);
      });
    }

    // Apply crop type filter
    if (cropType !== 'all') {
      filtered = filtered.filter(opp => opp.crop_type === cropType);
    }

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(opp => opp.status === status);
    }

    return filtered;
  }, [opportunities]);

  return {
    opportunities,
    isLoading,
    filterOptions,
    filterOpportunities,
    refresh: fetchOpportunities
  };
};
