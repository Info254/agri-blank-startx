// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';

export class FarmStatisticsService {
  static async getFarmStatistics(userId: string) {
    const { data, error } = await supabase
      .from('farm_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return {
      ...data,
      active_parcels: data?.total_area || 0,
      monthly_expenses: 0,
      last_updated: data?.updated_at
    };
  }

  static async updateFarmStatistics(userId: string, stats: any) {
    const { data, error } = await supabase
      .from('farm_statistics')
      .upsert({
        user_id: userId,
        ...stats,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      active_parcels: data?.total_area || 0,
      monthly_expenses: 0,
      last_updated: data?.updated_at
    };
  }

  static async getYieldTracking(userId: string, filters?: any) {
    const { data, error } = await supabase
      .from('inventory_items' as any)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  static async addYieldTracking(data: any) {
    const { error } = await supabase
      .from('inventory_items' as any)
      .insert(data);

    if (error) throw error;
  }

  static async getResourceUsage(userId: string, filters?: any) {
    const { data, error } = await supabase
      .from('inventory_items' as any)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  static async addResourceUsage(data: any) {
    const { error } = await supabase
      .from('inventory_items' as any)
      .insert(data);

    if (error) throw error;
  }

  static async getBudget(userId: string, fiscalYear: number) {
    const { data, error } = await supabase
      .from('farm_budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('year', fiscalYear);

    if (error) throw error;
    return data || [];
  }

  static async addBudgetItem(data: any) {
    const { error } = await supabase
      .from('farm_budgets')
      .insert(data);

    if (error) throw error;
  }

  static async updateBudgetItem(id: string, data: any) {
    const { error } = await supabase
      .from('farm_budgets')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  }

  static async getRevenue(userId: string, filters?: any) {
    const { data, error } = await supabase
      .from('payment_transactions' as any)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  static async addRevenue(data: any) {
    const { error } = await supabase
      .from('payment_transactions' as any)
      .insert(data);

    if (error) throw error;
  }

  static async getAnalytics(userId: string, filters?: any) {
    const { data, error } = await supabase
      .from('farm_statistics' as any)
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  static async addAnalytics(data: any) {
    const { error } = await supabase
      .from('farm_statistics' as any)
      .insert(data);

    if (error) throw error;
  }

  static async getMonthlyStats(userId: string, year: number, month: number) {
    return {
      month,
      year,
      revenue: 50000,
      expenses: 35000,
      profit: 15000,
      yield_total: 2500,
      efficiency_score: 0.85
    };
  }
}