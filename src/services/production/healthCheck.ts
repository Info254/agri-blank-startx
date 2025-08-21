
import { supabase } from '@/integrations/supabase/client';
import { APP_CONFIG } from '@/config/app';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  details?: string;
  timestamp: Date;
}

export interface SystemHealth {
  overall: 'healthy' | 'unhealthy' | 'degraded';
  services: HealthCheckResult[];
  uptime: number;
  version: string;
}

class HealthCheckService {
  private startTime = Date.now();

  async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          service: 'database',
          status: 'unhealthy',
          responseTime,
          details: error.message,
          timestamp: new Date()
        };
      }

      return {
        service: 'database',
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  async checkExternalAPI(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(APP_CONFIG.services.amis.baseUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(APP_CONFIG.services.amis.timeout)
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'external_api',
        status: response.ok ? (responseTime > 2000 ? 'degraded' : 'healthy') : 'unhealthy',
        responseTime,
        details: response.ok ? undefined : `HTTP ${response.status}`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'external_api',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: error instanceof Error ? error.message : 'Connection failed',
        timestamp: new Date()
      };
    }
  }

  async checkMemoryUsage(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const memory = (performance as any).memory;
      
      if (!memory) {
        return {
          service: 'memory',
          status: 'healthy',
          responseTime: Date.now() - startTime,
          details: 'Memory API not available',
          timestamp: new Date()
        };
      }

      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const totalMB = memory.totalJSHeapSize / 1024 / 1024;
      const usage = (usedMB / totalMB) * 100;

      let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
      if (usage > 90) status = 'unhealthy';
      else if (usage > 75) status = 'degraded';

      return {
        service: 'memory',
        status,
        responseTime: Date.now() - startTime,
        details: `${usedMB.toFixed(1)}MB / ${totalMB.toFixed(1)}MB (${usage.toFixed(1)}%)`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'memory',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: error instanceof Error ? error.message : 'Memory check failed',
        timestamp: new Date()
      };
    }
  }

  async performHealthCheck(): Promise<SystemHealth> {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkExternalAPI(),
      this.checkMemoryUsage()
    ]);

    const healthyCount = checks.filter(check => check.status === 'healthy').length;
    const unhealthyCount = checks.filter(check => check.status === 'unhealthy').length;

    let overall: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (unhealthyCount > 0) {
      overall = 'unhealthy';
    } else if (healthyCount < checks.length) {
      overall = 'degraded';
    }

    return {
      overall,
      services: checks,
      uptime: Date.now() - this.startTime,
      version: APP_CONFIG.version
    };
  }
}

export const healthCheckService = new HealthCheckService();
