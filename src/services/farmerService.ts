
import { supabase } from '@/integrations/supabase/client';

export interface FarmTask {
  id: string;
  title: string;
  crop: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'completed';
  description: string;
  user_id: string;
}

export interface WeatherAlert {
  id: string;
  type: 'Cyclone' | 'Rain' | 'Drought';
  region: string;
  severity: 'critical' | 'moderate' | 'low';
  description: string;
  start_date: string;
  end_date: string;
}

export interface FarmStats {
  monthly_revenue: number;
  total_area: number;
  average_yield: number;
  active_alerts: number;
}

export class FarmerService {
  static async getFarmTasks(userId: string): Promise<FarmTask[]> {
    try {
      const { data, error } = await supabase
        .from('farm_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching farm tasks:', error);
        return [];
      }
      return (data || []).map(task => ({
        ...task,
        priority: task.priority as 'High' | 'Medium' | 'Low',
        status: task.status as 'pending' | 'completed'
      }));
    } catch (error) {
      console.error('Error fetching farm tasks:', error);
      return [];
    }
  }

  static async createFarmTask(task: Omit<FarmTask, 'id'>): Promise<FarmTask | null> {
    try {
      const { data, error } = await supabase
        .from('farm_tasks')
        .insert([task])
        .select()
        .single();

      if (error) {
        console.error('Error creating farm task:', error);
        return null;
      }
      return data ? {
        ...data,
        priority: data.priority as 'High' | 'Medium' | 'Low',
        status: data.status as 'pending' | 'completed'
      } : null;
    } catch (error) {
      console.error('Error creating farm task:', error);
      return null;
    }
  }

  static async updateFarmTask(id: string, updates: Partial<FarmTask>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('farm_tasks')
        .update(updates)
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating farm task:', error);
      return false;
    }
  }

  static async deleteFarmTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('farm_tasks')
        .delete()
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error deleting farm task:', error);
      return false;
    }
  }

  static async getFarmStats(userId: string): Promise<FarmStats> {
    try {
      const { data, error } = await supabase
        .from('farm_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        console.log('No farm stats found, returning defaults');
        return {
          monthly_revenue: 0,
          total_area: 0,
          average_yield: 0,
          active_alerts: 0
        };
      }

      return {
        monthly_revenue: data.monthly_revenue || 0,
        total_area: data.total_area || 0,
        average_yield: data.average_yield || 0,
        active_alerts: data.active_alerts || 0
      };
    } catch (error) {
      console.error('Error fetching farm stats:', error);
      return {
        monthly_revenue: 0,
        total_area: 0,
        average_yield: 0,
        active_alerts: 0
      };
    }
  }

  static async getWeatherAlerts(region: string): Promise<WeatherAlert[]> {
    try {
      const { data, error } = await supabase
        .from('weather_alerts')
        .select('*')
        .eq('region', region)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching weather alerts:', error);
        return [];
      }
      return (data || []).map(alert => ({
        ...alert,
        type: alert.type as 'Cyclone' | 'Rain' | 'Drought',
        severity: alert.severity as 'critical' | 'moderate' | 'low'
      }));
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  }
}
