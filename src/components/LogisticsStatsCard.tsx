
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LogisticsStatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const LogisticsStatsCard: React.FC<LogisticsStatsCardProps> = ({ label, value, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default LogisticsStatsCard;
