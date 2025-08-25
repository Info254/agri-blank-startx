import React from 'react';
import { Card } from '@/components/ui/card';
import { useFarmStatistics } from '@/hooks/useFarmStatistics';
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
    statistics,
    isLoading
  } = useFarmStatistics();

  // Real stats from database or defaults if none exist
  const stats = {
    currentYield: { value: statistics?.average_yield || 0, trend: 12 },
    resourceEfficiency: { value: 92, trend: -3 },
    budgetVariance: { value: 7, trend: 5 },
    monthlyRevenue: { value: statistics?.monthly_revenue || 0, trend: 0 }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Farm Statistics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Yield"
          value={`${stats.currentYield?.value || 0} tons`}
          trend={stats.currentYield?.trend}
          loading={isLoading}
        />
        <StatCard
          title="Monthly Revenue"
          value={`KES ${stats.monthlyRevenue?.value?.toLocaleString() || 0}`}
          trend={stats.monthlyRevenue?.trend}
          loading={isLoading}
        />
        <StatCard
          title="Total Area"
          value={`${statistics?.total_area || 0} acres`}
          trend={0}
          loading={isLoading}
        />
        <StatCard
          title="Active Alerts"
          value={statistics?.active_alerts || 0}
          trend={0}
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
