
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { healthCheckService, SystemHealth } from '@/services/production/healthCheck';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const HealthDashboard: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const performHealthCheck = async () => {
    setIsLoading(true);
    try {
      const result = await healthCheckService.performHealthCheck();
      setHealth(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performHealthCheck();
    
    // Set up periodic health checks
    const interval = setInterval(performHealthCheck, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  if (isLoading && !health) {
    return (
      <Card>
        <CardContent className="p-6">
          <LoadingSpinner text="Performing health check..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>System Health Dashboard</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={performHealthCheck}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {health && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(health.overall)}
                  <span className="font-medium">Overall Status</span>
                </div>
                <Badge className={getStatusColor(health.overall)}>
                  {health.overall.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-mono text-lg">{health.version}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="font-mono text-lg">{formatUptime(health.uptime)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-mono text-lg">
                    {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {health.services.map((service) => (
            <Card key={service.service}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base capitalize">
                    {service.service.replace('_', ' ')}
                  </CardTitle>
                  {getStatusIcon(service.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(service.status)} variant="outline">
                      {service.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Response Time:</span>
                    <span className="text-sm font-mono">{service.responseTime}ms</span>
                  </div>
                  {service.details && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Details:</p>
                      <p className="text-xs font-mono bg-muted p-1 rounded">
                        {service.details}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;
