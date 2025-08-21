import { supabase } from '@/integrations/supabase/client';
import {
  FarmStatistics,
  YieldTracking,
  ResourceUsage,
  FarmBudget,
  RevenueTracking,
  FarmAnalytics,
  MonthlyStats
} from '@/types/farm-statistics';

export class FarmStatisticsService {
  static async getFarmStatistics(userId: string): Promise<FarmStatistics | null> {
    const { data, error } = await supabase
      .from('farm_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateFarmStatistics(userId: string, stats: Partial<FarmStatistics>): Promise<FarmStatistics> {
    const { data, error } = await supabase
      .from('farm_statistics')
      .update({
        ...stats,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getYieldTracking(userId: string, filters?: {
    parcel_id?: string;
    crop_type?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<YieldTracking[]> {
    let query = supabase
      .from('yield_tracking')
      .select('*')
      .eq('user_id', userId);

    if (filters?.parcel_id) {
      query = query.eq('parcel_id', filters.parcel_id);
    }
    if (filters?.crop_type) {
      query = query.eq('crop_type', filters.crop_type);
    }
    if (filters?.start_date) {
      query = query.gte('planting_date', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('harvest_date', filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async addYieldTracking(data: Omit<YieldTracking, 'id' | 'created_at' | 'updated_at'>): Promise<YieldTracking> {
    const { data: result, error } = await supabase
      .from('yield_tracking')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getResourceUsage(userId: string, filters?: {
    resource_type?: string;
    parcel_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ResourceUsage[]> {
    let query = supabase
      .from('resource_usage')
      .select('*')
      .eq('user_id', userId);

    if (filters?.resource_type) {
      query = query.eq('resource_type', filters.resource_type);
    }
    if (filters?.parcel_id) {
      query = query.eq('parcel_id', filters.parcel_id);
    }
    if (filters?.start_date) {
      query = query.gte('usage_date', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('usage_date', filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async addResourceUsage(data: Omit<ResourceUsage, 'id' | 'total_cost' | 'created_at' | 'updated_at'>): Promise<ResourceUsage> {
    const { data: result, error } = await supabase
      .from('resource_usage')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getBudget(userId: string, fiscalYear: number): Promise<FarmBudget[]> {
    const { data, error } = await supabase
      .from('farm_budget')
      .select('*')
      .eq('user_id', userId)
      .eq('fiscal_year', fiscalYear);

    if (error) throw error;
    return data || [];
  }

  static async addBudgetItem(data: Omit<FarmBudget, 'id' | 'variance_amount' | 'variance_percentage' | 'created_at' | 'updated_at'>): Promise<FarmBudget> {
    const { data: result, error } = await supabase
      .from('farm_budget')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async updateBudgetItem(id: string, data: Partial<FarmBudget>): Promise<FarmBudget> {
    const { data: result, error } = await supabase
      .from('farm_budget')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getRevenue(userId: string, filters?: {
    source?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<RevenueTracking[]> {
    let query = supabase
      .from('revenue_tracking')
      .select('*')
      .eq('user_id', userId);

    if (filters?.source) {
      query = query.eq('source', filters.source);
    }
    if (filters?.start_date) {
      query = query.gte('date', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('date', filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async addRevenue(data: Omit<RevenueTracking, 'id' | 'created_at' | 'updated_at'>): Promise<RevenueTracking> {
    const { data: result, error } = await supabase
      .from('revenue_tracking')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getAnalytics(userId: string, filters?: {
    metric_name?: string;
    parcel_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<FarmAnalytics[]> {
    let query = supabase
      .from('farm_analytics')
      .select('*')
      .eq('user_id', userId);

    if (filters?.metric_name) {
      query = query.eq('metric_name', filters.metric_name);
    }
    if (filters?.parcel_id) {
      query = query.eq('parcel_id', filters.parcel_id);
    }
    if (filters?.start_date) {
      query = query.gte('date', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('date', filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async addAnalytics(data: Omit<FarmAnalytics, 'id' | 'created_at' | 'updated_at'>): Promise<FarmAnalytics> {
    const { data: result, error } = await supabase
      .from('farm_analytics')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getMonthlyStats(userId: string, year: number, month: number): Promise<MonthlyStats> {
    const { data, error } = await supabase
      .rpc('calculate_monthly_stats', {
        p_user_id: userId,
        p_year: year,
        p_month: month
      });

    if (error) throw error;
    return data;
  }
}
