
import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
}

interface PerformanceConfig {
  enableMonitoring: boolean;
  sampleRate: number;
  reportingInterval: number;
}

export const usePerformance = (config: PerformanceConfig = {
  enableMonitoring: true,
  sampleRate: 0.1,
  reportingInterval: 30000
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0
  });
  
  const [isOptimized, setIsOptimized] = useState(false);

  const measurePerformance = useCallback(() => {
    if (!config.enableMonitoring || Math.random() > config.sampleRate) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const memory = (performance as any).memory;
    
    const newMetrics: PerformanceMetrics = {
      loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      renderTime: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0, // MB
      networkLatency: navigation ? navigation.responseEnd - navigation.requestStart : 0
    };

    setMetrics(newMetrics);
    
    // Determine if performance is optimized
    setIsOptimized(
      newMetrics.loadTime < 3000 && 
      newMetrics.renderTime < 1000 && 
      newMetrics.memoryUsage < 100 &&
      newMetrics.networkLatency < 2000
    );
  }, [config]);

  const reportMetrics = useCallback(() => {
    if (!config.enableMonitoring) return;
    
    // In production, this would send metrics to monitoring service
    console.log('Performance Metrics:', metrics);
  }, [metrics, config.enableMonitoring]);

  useEffect(() => {
    measurePerformance();
    
    const interval = setInterval(reportMetrics, config.reportingInterval);
    
    return () => clearInterval(interval);
  }, [measurePerformance, reportMetrics, config.reportingInterval]);

  const optimizePerformance = useCallback(() => {
    // Clear unnecessary caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old') || name.includes('v1')) {
            caches.delete(name);
          }
        });
      });
    }

    // Trigger garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }

    // Re-measure after optimization
    setTimeout(measurePerformance, 1000);
  }, [measurePerformance]);

  return {
    metrics,
    isOptimized,
    optimizePerformance,
    measurePerformance
  };
};
