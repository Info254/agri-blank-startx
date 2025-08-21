import React from 'react';
import { Grid } from '@/components/ui/grid';
import { Card } from '@/components/ui/card';
import { YieldComparisonChart, ResourceUsageChart, BudgetAnalysisChart, WeatherImpactChart } 
  from '@/components/charts/AdvancedChart';
import { useFarmStatistics } from '@/features/farm-statistics/context';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, loading }) => {
  if (loading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-4 w-[100px] mb-2" />
        <Skeleton className="h-8 w-[150px]" />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend !== undefined && (
          <span
            className={`ml-2 text-sm font-medium ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </Card>
  );
};

const FarmStatisticsDashboard: React.FC = () => {
  const { 
    loading,
    currentYield,
    resourceEfficiency,
    budgetVariance,
    weatherScore
  } = useFarmStatistics();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Farm Statistics Dashboard</h1>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Yield"
          value={`${currentYield?.value || 0} tons`}
          trend={currentYield?.trend}
          loading={loading}
        />
        <StatCard
          title="Resource Efficiency"
          value={`${resourceEfficiency?.value || 0}%`}
          trend={resourceEfficiency?.trend}
          loading={loading}
        />
        <StatCard
          title="Budget Variance"
          value={`${budgetVariance?.value || 0}%`}
          trend={budgetVariance?.trend}
          loading={loading}
        />
        <StatCard
          title="Weather Impact Score"
          value={weatherScore?.value || 0}
          trend={weatherScore?.trend}
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <YieldComparisonChart />
          <ResourceUsageChart />
        </div>
        <div className="space-y-6">
          <BudgetAnalysisChart />
          <WeatherImpactChart />
        </div>
      </div>
    </div>
  );
};

export default FarmStatisticsDashboard;
