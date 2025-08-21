export interface FarmYield {
  id: string;
  farm_id: string;
  planting_date: string;
  crop_type: string;
  expected_yield: number;
  actual_yield: number | null;
  yield_unit: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceUsage {
  id: string;
  farm_id: string;
  resource_type: string;
  usage_date: string;
  quantity: number;
  unit: string;
  total_cost: number;
  efficiency_score: number | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FarmBudget {
  id: string;
  farm_id: string;
  category: string;
  date: string;
  planned_amount: number;
  actual_amount: number | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WeatherImpact {
  id: string;
  farm_id: string;
  date: string;
  temperature: number;
  rainfall: number;
  soil_moisture: number;
  impact_score: number | null;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface YieldPerformance {
  crop_type: string;
  yield_achievement_rate: number;
  yield_trend: number;
}

export interface ResourceEfficiency {
  resource_type: string;
  efficiency_trend: number;
  cost_per_unit: number;
}

export interface StatisticMetric {
  value: number;
  trend: number;
}

export interface FarmStatistics {
  currentYield: StatisticMetric;
  resourceEfficiency: StatisticMetric;
  budgetVariance: StatisticMetric;
  weatherScore: StatisticMetric;
  yields: FarmYield[];
  resources: ResourceUsage[];
  budget: FarmBudget[];
  analytics: WeatherImpact[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface AdvancedAnalytics {
  mlPredictions?: any[];
  confidenceScores?: number[];
  anomalyDetection?: number[];
  optimizationSuggestions?: string[];
  [key: string]: any;
}

export type YieldData = Pick<FarmYield, 'planting_date' | 'expected_yield' | 'actual_yield'>;
export type ResourceData = Pick<ResourceUsage, 'usage_date' | 'quantity' | 'total_cost'>;
export type BudgetData = {
  category: string;
  planned_amount: number;
  actual_amount: number;
};
export type AnalyticsData = Pick<WeatherImpact, 'date' | 'temperature' | 'rainfall' | 'soil_moisture'>;
