
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcpTime?: number;
  loadTime?: number;
  interactionTimes: Record<string, number[]>;
}

export function usePerformance(componentName: string) {
  const metricsRef = useRef<PerformanceMetrics>({
    interactionTimes: {}
  });
  
  // Track component mount time
  useEffect(() => {
    if (window.performance) {
      // Record First Contentful Paint if available
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        metricsRef.current.fcpTime = fcpEntry.startTime;
        console.log(`[Performance] ${componentName} FCP: ${fcpEntry.startTime.toFixed(2)}ms`);
      }
      
      // Record page load time
      const loadTime = performance.now();
      metricsRef.current.loadTime = loadTime;
      console.log(`[Performance] ${componentName} Load: ${loadTime.toFixed(2)}ms`);
    }
  }, [componentName]);

  // Function to measure interaction times
  const measureInteraction = (interactionName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!metricsRef.current.interactionTimes[interactionName]) {
        metricsRef.current.interactionTimes[interactionName] = [];
      }
      
      metricsRef.current.interactionTimes[interactionName].push(duration);
      
      console.log(`[Performance] ${componentName} - ${interactionName}: ${duration.toFixed(2)}ms`);
    };
  };

  return { measureInteraction };
}
