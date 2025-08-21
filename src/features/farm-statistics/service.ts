import { supabase } from '@/lib/supabaseClient';
import { endOfMonth, startOfMonth } from 'date-fns';
import { 
  FarmYield, 
  ResourceUsage, 
  FarmBudget, 
  WeatherImpact,
  YieldPerformance,
  ResourceEfficiency
} from './types';

export class FarmAnalyticsService {
  private static instance: FarmAnalyticsService;

  private constructor() {}

  public static getInstance(): FarmAnalyticsService {
    if (!FarmAnalyticsService.instance) {
      FarmAnalyticsService.instance = new FarmAnalyticsService();
    }
    return FarmAnalyticsService.instance;
  }

  async getYields(farmId: string, startDate?: Date, endDate?: Date): Promise<FarmYield[]> {
    let query = supabase
      .from('farm_yields')
      .select('*')
      .eq('farm_id', farmId)
      .order('planting_date', { ascending: true });

    if (startDate) {
      query = query.gte('planting_date', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('planting_date', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async getResourceUsage(farmId: string, startDate?: Date, endDate?: Date): Promise<ResourceUsage[]> {
    let query = supabase
      .from('resource_usage')
      .select('*')
      .eq('farm_id', farmId)
      .order('usage_date', { ascending: true });

    if (startDate) {
      query = query.gte('usage_date', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('usage_date', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async getBudget(farmId: string, date: Date = new Date()): Promise<FarmBudget[]> {
    const { data, error } = await supabase
      .from('farm_budget')
      .select('*')
      .eq('farm_id', farmId)
      .gte('date', startOfMonth(date).toISOString())
      .lte('date', endOfMonth(date).toISOString())
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getWeatherImpact(farmId: string, startDate?: Date, endDate?: Date): Promise<WeatherImpact[]> {
    let query = supabase
      .from('weather_impact')
      .select('*')
      .eq('farm_id', farmId)
      .order('date', { ascending: true });

    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async getYieldPerformance(farmId: string): Promise<YieldPerformance[]> {
    const { data, error } = await supabase
      .rpc('calculate_yield_performance', { farm_id_param: farmId });

    if (error) throw error;
    return data;
  }

  async getResourceEfficiency(farmId: string): Promise<ResourceEfficiency[]> {
    const { data, error } = await supabase
      .rpc('calculate_resource_efficiency', { farm_id_param: farmId });

    if (error) throw error;
    return data;
  }

  async calculateWeatherImpactScore(
    temperature: number,
    rainfall: number,
    soilMoisture: number
  ): Promise<number> {
    // Normalize values to 0-1 range
    const normalizedTemp = (temperature - 15) / (35 - 15); // Assuming optimal range is 15-35°C
    const normalizedRain = rainfall / 100; // Assuming 100mm is optimal
    const normalizedMoisture = soilMoisture / 100; // Assuming percentage

    // Calculate impact score (0-100)
    const score = (
      (1 - Math.abs(normalizedTemp - 0.5)) * 40 + // Temperature has 40% weight
      (1 - Math.abs(normalizedRain - 0.5)) * 30 + // Rainfall has 30% weight
      (1 - Math.abs(normalizedMoisture - 0.5)) * 30 // Soil moisture has 30% weight
    ) * 100;

    return Math.max(0, Math.min(100, score));
  }

  async updateWeatherImpact(id: string, impactScore: number): Promise<void> {
    const { error } = await supabase
      .from('weather_impact')
      .update({ impact_score: impactScore })
      .eq('id', id);

    if (error) throw error;
  }

  async addYield(data: Omit<FarmYield, 'id' | 'created_at' | 'updated_at'>): Promise<FarmYield> {
    const { data: insertedData, error } = await supabase
      .from('farm_yields')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return insertedData;
  }

  async addResourceUsage(
    data: Omit<ResourceUsage, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ResourceUsage> {
    const { data: insertedData, error } = await supabase
      .from('resource_usage')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return insertedData;
  }

  async addBudgetEntry(
    data: Omit<FarmBudget, 'id' | 'created_at' | 'updated_at'>
  ): Promise<FarmBudget> {
    const { data: insertedData, error } = await supabase
      .from('farm_budget')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return insertedData;
  }

  async addWeatherImpact(
    data: Omit<WeatherImpact, 'id' | 'created_at' | 'updated_at'>
  ): Promise<WeatherImpact> {
    // Calculate impact score before insertion
    const impactScore = await this.calculateWeatherImpactScore(
      data.temperature,
      data.rainfall,
      data.soil_moisture
    );

    const { data: insertedData, error } = await supabase
      .from('weather_impact')
      .insert([{ ...data, impact_score: impactScore }])
      .select()
      .single();

    if (error) throw error;
    return insertedData;
  }
}
