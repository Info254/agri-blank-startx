import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FarmStatisticsService } from '@/services/farm-statistics';
import type {
  FarmStatistics,
  YieldTracking,
  ResourceUsage,
  FarmBudget,
  RevenueTracking,
  FarmAnalytics,
  MonthlyStats
} from '@/types/farm-statistics';

interface FarmStatisticsContextType {
  // Farm Statistics
  farmStats: FarmStatistics | null;
  refreshFarmStats: () => Promise<void>;
  updateFarmStats: (stats: Partial<FarmStatistics>) => Promise<void>;
  
  // Yield Tracking
  yields: YieldTracking[];
  addYield: (data: Omit<YieldTracking, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loadYields: (filters?: { parcel_id?: string; crop_type?: string; start_date?: string; end_date?: string }) => Promise<void>;
  
  // Resource Usage
  resources: ResourceUsage[];
  addResource: (data: Omit<ResourceUsage, 'id' | 'total_cost' | 'created_at' | 'updated_at'>) => Promise<void>;
  loadResources: (filters?: { resource_type?: string; parcel_id?: string; start_date?: string; end_date?: string }) => Promise<void>;
  
  // Budget
  budget: FarmBudget[];
  addBudgetItem: (data: Omit<FarmBudget, 'id' | 'variance_amount' | 'variance_percentage' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBudgetItem: (id: string, data: Partial<FarmBudget>) => Promise<void>;
  loadBudget: (fiscalYear: number) => Promise<void>;
  
  // Revenue
  revenue: RevenueTracking[];
  addRevenue: (data: Omit<RevenueTracking, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loadRevenue: (filters?: { source?: string; start_date?: string; end_date?: string }) => Promise<void>;
  
  // Analytics
  analytics: FarmAnalytics[];
  addAnalytics: (data: Omit<FarmAnalytics, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loadAnalytics: (filters?: { metric_name?: string; parcel_id?: string; start_date?: string; end_date?: string }) => Promise<void>;
  
  // Monthly Stats
  monthlyStats: MonthlyStats | null;
  loadMonthlyStats: (year: number, month: number) => Promise<void>;
  
  // Loading States
  isLoading: boolean;
  error: Error | null;
}

const FarmStatisticsContext = createContext<FarmStatisticsContextType | undefined>(undefined);

export function FarmStatisticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [farmStats, setFarmStats] = useState<FarmStatistics | null>(null);
  const [yields, setYields] = useState<YieldTracking[]>([]);
  const [resources, setResources] = useState<ResourceUsage[]>([]);
  const [budget, setBudget] = useState<FarmBudget[]>([]);
  const [revenue, setRevenue] = useState<RevenueTracking[]>([]);
  const [analytics, setAnalytics] = useState<FarmAnalytics[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshFarmStats = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const stats = await FarmStatisticsService.getFarmStatistics(user.id);
      setFarmStats(stats);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateFarmStats = useCallback(async (stats: Partial<FarmStatistics>) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const updatedStats = await FarmStatisticsService.updateFarmStatistics(user.id, stats);
      setFarmStats(updatedStats);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addYield = useCallback(async (data: Omit<YieldTracking, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      await FarmStatisticsService.addYieldTracking(data);
      await loadYields();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadYields = useCallback(async (filters?: { parcel_id?: string; crop_type?: string; start_date?: string; end_date?: string }) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await FarmStatisticsService.getYieldTracking(user.id, filters);
      setYields(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addResource = useCallback(async (data: Omit<ResourceUsage, 'id' | 'total_cost' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      await FarmStatisticsService.addResourceUsage(data);
      await loadResources();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadResources = useCallback(async (filters?: { resource_type?: string; parcel_id?: string; start_date?: string; end_date?: string }) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await FarmStatisticsService.getResourceUsage(user.id, filters);
      setResources(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addBudgetItem = useCallback(async (data: Omit<FarmBudget, 'id' | 'variance_amount' | 'variance_percentage' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      await FarmStatisticsService.addBudgetItem(data);
      await loadBudget(data.fiscal_year);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBudgetItem = useCallback(async (id: string, data: Partial<FarmBudget>) => {
    try {
      setIsLoading(true);
      await FarmStatisticsService.updateBudgetItem(id, data);
      if (farmStats) {
        await loadBudget(new Date().getFullYear());
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [farmStats]);

  const loadBudget = useCallback(async (fiscalYear: number) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await FarmStatisticsService.getBudget(user.id, fiscalYear);
      setBudget(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addRevenue = useCallback(async (data: Omit<RevenueTracking, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      await FarmStatisticsService.addRevenue(data);
      await loadRevenue();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRevenue = useCallback(async (filters?: { source?: string; start_date?: string; end_date?: string }) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await FarmStatisticsService.getRevenue(user.id, filters);
      setRevenue(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addAnalytics = useCallback(async (data: Omit<FarmAnalytics, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      await FarmStatisticsService.addAnalytics(data);
      await loadAnalytics();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async (filters?: { metric_name?: string; parcel_id?: string; start_date?: string; end_date?: string }) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await FarmStatisticsService.getAnalytics(user.id, filters);
      setAnalytics(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadMonthlyStats = useCallback(async (year: number, month: number) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await FarmStatisticsService.getMonthlyStats(user.id, year, month);
      setMonthlyStats(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user) {
      refreshFarmStats();
    }
  }, [user, refreshFarmStats]);

  const value = {
    farmStats,
    refreshFarmStats,
    updateFarmStats,
    yields,
    addYield,
    loadYields,
    resources,
    addResource,
    loadResources,
    budget,
    addBudgetItem,
    updateBudgetItem,
    loadBudget,
    revenue,
    addRevenue,
    loadRevenue,
    analytics,
    addAnalytics,
    loadAnalytics,
    monthlyStats,
    loadMonthlyStats,
    isLoading,
    error
  };

  return (
    <FarmStatisticsContext.Provider value={value}>
      {children}
    </FarmStatisticsContext.Provider>
  );
}

export function useFarmStatistics() {
  const context = useContext(FarmStatisticsContext);
  if (context === undefined) {
    throw new Error('useFarmStatistics must be used within a FarmStatisticsProvider');
  }
  return context;
}
