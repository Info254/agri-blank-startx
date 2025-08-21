
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Database, Zap, Users, TrendingUp } from 'lucide-react';
import HealthDashboard from './HealthDashboard';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';
import { usePerformance } from '@/hooks/usePerformance';
import { logger } from '@/services/production/monitoring';

const SystemStatus: React.FC = () => {
  const { status: dbStatus } = useSupabaseConnection();
  const { metrics, isOptimized } = usePerformance();
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTrades: 0,
    systemUptime: 0
  });

  useEffect(() => {
    // Mock system statistics - in production, these would come from your backend
    setSystemStats({
      totalUsers: 1250,
      activeUsers: 89,
      totalTrades: 3420,
      systemUptime: Date.now() - new Date('2025-01-01').getTime()
    });
  }, []);

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const getStatusBadge = (isGood: boolean) => {
    return (
      <Badge variant={isGood ? "default" : "destructive"}>
        {isGood ? "Good" : "Issues"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Status Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Database</span>
              </div>
              {getStatusBadge(dbStatus.isHealthy)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Latency: {dbStatus.latency}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Performance</span>
              </div>
              {getStatusBadge(isOptimized)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Memory: {metrics.memoryUsage.toFixed(1)}MB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className="font-medium">Users</span>
              </div>
              <span className="font-bold">{systemStats.activeUsers}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Total: {systemStats.totalUsers.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Uptime</span>
              </div>
              <span className="font-bold">{formatUptime(systemStats.systemUptime)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Trades: {systemStats.totalTrades.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status Tabs */}
      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Health Check</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <HealthDashboard />
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Load Times</h4>
                  <p className="text-sm">Page Load: {metrics.loadTime}ms</p>
                  <p className="text-sm">Render Time: {metrics.renderTime}ms</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Network</h4>
                  <p className="text-sm">Latency: {metrics.networkLatency}ms</p>
                  <p className="text-sm">Status: {isOptimized ? 'Optimized' : 'Needs Attention'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logger.getRecentLogs(20).map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <Badge 
                      variant={
                        log.level === 'ERROR' ? 'destructive' :
                        log.level === 'WARN' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {log.level}
                    </Badge>
                    <div className="flex-1">
                      <p>{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics and monitoring coming soon.
                This will include user behavior, API usage, and performance trends.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemStatus;
