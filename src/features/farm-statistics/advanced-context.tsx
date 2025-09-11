// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdvancedFarmAnalyticsService from './advanced-service';
import type {
  FarmYield,
  ResourceUsage,
  FarmBudget,
  WeatherImpact,
  AdvancedAnalytics
} from './types';

interface AdvancedFarmStatisticsContextType {
  // Data
  yields: FarmYield[];
  resources: ResourceUsage[];
  budget: FarmBudget[];
  analytics: WeatherImpact[];
  advancedAnalytics: AdvancedAnalytics | null;
  
  // Actions
  loadData: () => Promise<void>;
  processImage: (image: File) => Promise<any>;
  optimizeResources: () => Promise<any>;
  getWeatherPredictions: () => Promise<any>;
  
  // Loading States
  isLoading: boolean;
  error: Error | null;
}

const AdvancedFarmStatisticsContext = createContext<AdvancedFarmStatisticsContextType | undefined>(undefined);

export function AdvancedFarmStatisticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [yields, setYields] = useState<FarmYield[]>([]);
  const [resources, setResources] = useState<ResourceUsage[]>([]);
  const [budget, setBudget] = useState<FarmBudget[]>([]);
  const [analytics, setAnalytics] = useState<WeatherImpact[]>([]);
  const [advancedAnalytics, setAdvancedAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyticsService = AdvancedFarmAnalyticsService.getInstance();

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      
      // Load advanced analytics
      const advancedData = await analyticsService.getAdvancedAnalytics(user.id);
      setAdvancedAnalytics(advancedData);
      
      // Mock data for demonstration - replace with actual API calls
      setYields([
        {
          id: '1',
          farm_id: user.id,
          planting_date: '2024-01-15',
          crop_type: 'Maize',
          expected_yield: 2500,
          actual_yield: 2300,
          yield_unit: 'kg',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ]);
      
      setResources([
        {
          id: '1',
          farm_id: user.id,
          resource_type: 'Fertilizer',
          usage_date: '2024-01-20',
          quantity: 50,
          unit: 'kg',
          total_cost: 5000,
          efficiency_score: 0.85,
          created_at: '2024-01-20T00:00:00Z',
          updated_at: '2024-01-20T00:00:00Z'
        }
      ]);
      
      setBudget([
        {
          id: '1',
          farm_id: user.id,
          category: 'Seeds',
          date: '2024-01-01',
          planned_amount: 10000,
          actual_amount: 9500,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]);
      
      setAnalytics([
        {
          id: '1',
          farm_id: user.id,
          date: '2024-01-25',
          temperature: 28.5,
          rainfall: 15.2,
          soil_moisture: 65.8,
          impact_score: 0.75,
          created_at: '2024-01-25T00:00:00Z',
          updated_at: '2024-01-25T00:00:00Z'
        }
      ]);
      
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user, analyticsService]);

  const processImage = useCallback(async (image: File) => {
    try {
      setIsLoading(true);
      return await analyticsService.processImageData(image);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [analyticsService]);

  const optimizeResources = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      return await analyticsService.optimizeResourceAllocation(user.id);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, analyticsService]);

  const getWeatherPredictions = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      return await analyticsService.getWeatherPredictions(user.id);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, analyticsService]);

  // Initial load
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const value = {
    yields,
    resources,
    budget,
    analytics,
    advancedAnalytics,
    loadData,
    processImage,
    optimizeResources,
    getWeatherPredictions,
    isLoading,
    error
  };

  return (
    <AdvancedFarmStatisticsContext.Provider value={value}>
      {children}
    </AdvancedFarmStatisticsContext.Provider>
  );
}

export function useAdvancedFarmStatistics() {
  const context = useContext(AdvancedFarmStatisticsContext);
  if (context === undefined) {
    throw new Error('useAdvancedFarmStatistics must be used within an AdvancedFarmStatisticsProvider');
  }
  return context;
}
