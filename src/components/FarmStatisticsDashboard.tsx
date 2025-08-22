import React from 'react';
import { Card } from '@/components/ui/card';
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
    isLoading,
    farmStats
  } = useFarmStatistics();

  // Mock data for demonstration
  const mockStats = {
    currentYield: { value: 85, trend: 12 },
    resourceEfficiency: { value: 92, trend: -3 },
    budgetVariance: { value: 7, trend: 5 },
    weatherScore: { value: 8.5, trend: 0 }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Farm Statistics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Yield"
          value={`${mockStats.currentYield?.value || 0} tons`}
          trend={mockStats.currentYield?.trend}
          loading={isLoading}
        />
        <StatCard
          title="Resource Efficiency"
          value={`${mockStats.resourceEfficiency?.value || 0}%`}
          trend={mockStats.resourceEfficiency?.trend}
          loading={isLoading}
        />
        <StatCard
          title="Budget Variance"
          value={`${mockStats.budgetVariance?.value || 0}%`}
          trend={mockStats.budgetVariance?.trend}
          loading={isLoading}
        />
        <StatCard
          title="Weather Impact Score"
          value={mockStats.weatherScore?.value || 0}
          trend={mockStats.weatherScore?.trend}
          loading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Yield Comparison</h3>
            <p className="text-muted-foreground">Chart coming soon...</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Resource Usage</h3>
            <p className="text-muted-foreground">Chart coming soon...</p>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Budget Analysis</h3>
            <p className="text-muted-foreground">Chart coming soon...</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Weather Impact</h3>
            <p className="text-muted-foreground">Chart coming soon...</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmStatisticsDashboard;
