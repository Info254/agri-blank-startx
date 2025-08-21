export interface FarmStatistics {
  id: string;
  user_id: string;
  total_area: number;
  active_parcels: number;
  monthly_revenue: number;
  monthly_expenses: number;
  average_yield: number;
  active_alerts: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface YieldTracking {
  id: string;
  user_id: string;
  parcel_id: string;
  crop_type: string;
  planting_date: string;
  harvest_date: string | null;
  area_planted: number;
  expected_yield: number;
  actual_yield: number | null;
  yield_per_hectare: number;
  yield_difference_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceUsage {
  id: string;
  user_id: string;
  resource_type: string;
  parcel_id: string;
  usage_date: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  total_cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FarmBudget {
  id: string;
  user_id: string;
  fiscal_year: number;
  category: string;
  subcategory?: string;
  planned_amount: number;
  actual_amount: number | null;
  variance_amount: number;
  variance_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueTracking {
  id: string;
  user_id: string;
  date: string;
  source: string;
  subcategory?: string;
  amount: number;
  quantity?: number;
  unit?: string;
  price_per_unit?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FarmAnalytics {
  id: string;
  user_id: string;
  date: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  parcel_id?: string;
  sensor_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyStats {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  yield_achievement_percentage: number;
  resource_utilization_cost: number;
}
