
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface LogisticsStatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactElement<LucideIcon>;
  loading?: boolean;
}

const LogisticsStatsCard: React.FC<LogisticsStatsCardProps> = ({ 
  label, 
  value, 
  icon, 
  loading = false 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <div>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
              ) : (
                value
              )}
            </div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogisticsStatsCard;
