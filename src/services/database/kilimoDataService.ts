
import { supabase } from '@/integrations/supabase/client';

export interface StoredKilimoStats {
  id: string;
  external_id?: string;
  name: string;
  value: string;
  category: string;
  county: string;
  unit?: string;
  source: string;
  verified: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
  fetch_date: string;
}

export interface FetchLog {
  id: string;
  source: string;
  status: string;
  records_count: number;
  error_message?: string;
  execution_time_ms?: number;
  created_at: string;
}

export class KilimoDataService {
  // Fetch all Kilimo statistics from database
  static async getAllStats(filters?: {
    category?: string;
    county?: string;
    fetch_date?: string;
  }): Promise<StoredKilimoStats[]> {
    try {
      let query = supabase
        .from('kilimo_statistics')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.county) {
        query = query.eq('county', filters.county);
      }
      if (filters?.fetch_date) {
        query = query.eq('fetch_date', filters.fetch_date);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching Kilimo stats:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllStats:', error);
      return [];
    }
  }

  // Get latest statistics
  static async getLatestStats(limit = 50): Promise<StoredKilimoStats[]> {
    try {
      const { data, error } = await supabase
        .from('kilimo_statistics')
        .select('*')
        .order('fetch_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching latest stats:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLatestStats:', error);
      return [];
    }
  }

  // Get fetch logs
  static async getFetchLogs(limit = 20): Promise<FetchLog[]> {
    try {
      const { data, error } = await supabase
        .from('data_fetch_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFetchLogs:', error);
      return [];
    }
  }

  // Trigger manual data fetch
  static async triggerManualFetch(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await supabase.functions.invoke('fetch-kilimo-data', {
        body: { manual: true }
      });

      if (response.error) {
        console.error('Error invoking function:', response.error);
        return {
          success: false,
          message: response.error.message || 'Failed to trigger manual fetch'
        };
      }

      return response.data || { success: true, message: 'Data fetch triggered successfully' };
    } catch (error) {
      console.error('Error triggering manual fetch:', error);
      return {
        success: false,
        message: 'Failed to trigger manual fetch'
      };
    }
  }

  // Get analytics data
  static async getAnalytics(): Promise<{
    totalRecords: number;
    categoriesCount: number;
    countiesCount: number;
    lastUpdateDate: string;
    recentActivity: FetchLog[];
  }> {
    try {
      const [stats, logs] = await Promise.all([
        this.getAllStats(),
        this.getFetchLogs(5)
      ]);

      const categories = new Set(stats.map(s => s.category));
      const counties = new Set(stats.map(s => s.county));
      const lastUpdate = stats.length > 0 ? stats[0].fetch_date : 'Never';

      return {
        totalRecords: stats.length,
        categoriesCount: categories.size,
        countiesCount: counties.size,
        lastUpdateDate: lastUpdate,
        recentActivity: logs
      };
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      return {
        totalRecords: 0,
        categoriesCount: 0,
        countiesCount: 0,
        lastUpdateDate: 'Never',
        recentActivity: []
      };
    }
  }
}
