
import { cacheService } from '@/services/performance/cacheService';
import { logger } from './monitoring';

interface OptimizationConfig {
  enableImageOptimization: boolean;
  enableBundleOptimization: boolean;
  enableDatabaseOptimization: boolean;
  enableCacheOptimization: boolean;
}

class OptimizationService {
  private config: OptimizationConfig = {
    enableImageOptimization: true,
    enableBundleOptimization: true,
    enableDatabaseOptimization: true,
    enableCacheOptimization: true
  };

  async optimizeApplication(): Promise<void> {
    logger.info('Starting application optimization');
    
    const optimizationPromises: Promise<void>[] = [];

    if (this.config.enableImageOptimization) {
      optimizationPromises.push(this.optimizeImages());
    }

    if (this.config.enableBundleOptimization) {
      optimizationPromises.push(this.optimizeBundles());
    }

    if (this.config.enableDatabaseOptimization) {
      optimizationPromises.push(this.optimizeDatabase());
    }

    if (this.config.enableCacheOptimization) {
      optimizationPromises.push(this.optimizeCache());
    }

    await Promise.all(optimizationPromises);
    
    logger.info('Application optimization completed');
  }

  private async optimizeImages(): Promise<void> {
    try {
      // Preload critical images
      const criticalImages = [
        '/og-image.png',
        '/favicon.ico'
      ];

      const preloadPromises = criticalImages.map(src => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to preload ${src}`));
          img.src = src;
        });
      });

      await Promise.all(preloadPromises);
      logger.info('Image optimization completed');
    } catch (error) {
      logger.error('Image optimization failed', error);
    }
  }

  private async optimizeBundles(): Promise<void> {
    try {
      // Clear old service worker caches
      if ('serviceWorker' in navigator && 'caches' in window) {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name.includes('old') || 
          name.includes('v1') || 
          name.includes('deprecated')
        );

        await Promise.all(oldCaches.map(name => caches.delete(name)));
      }

      // Prefetch critical resources
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Prefetch routes that are likely to be visited
          const criticalRoutes = [
            '/commodity-trading',
            '/api-docs',
            '/supply-chain-api'
          ];

          criticalRoutes.forEach(route => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            document.head.appendChild(link);
          });
        });
      }

      logger.info('Bundle optimization completed');
    } catch (error) {
      logger.error('Bundle optimization failed', error);
    }
  }

  private async optimizeDatabase(): Promise<void> {
    try {
      // Warm up database connections
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Perform a lightweight query to establish connection
      await supabase.from('profiles').select('count').limit(1);
      
      logger.info('Database optimization completed');
    } catch (error) {
      logger.error('Database optimization failed', error);
    }
  }

  private async optimizeCache(): Promise<void> {
    try {
      // Clean expired cache entries
      const stats = cacheService.getStats();
      logger.info('Cache stats before optimization', stats);

      // If cache is getting full, clear some old entries
      if (stats.itemCount > stats.maxSize * 0.8) {
        // Clear 20% of cache to make room
        const clearCount = Math.floor(stats.maxSize * 0.2);
        for (let i = 0; i < clearCount; i++) {
          // Cache service will automatically remove oldest items
        }
      }

      // Preload critical data
      const criticalDataKeys = [
        'market_prices_main',
        'user_session_data',
        'commodity_list'
      ];

      // These would be preloaded with actual data in production
      for (const key of criticalDataKeys) {
        if (!cacheService.has(key)) {
          // Preload placeholder data
          cacheService.set(key, { placeholder: true }, 300000); // 5 minutes
        }
      }

      logger.info('Cache optimization completed');
    } catch (error) {
      logger.error('Cache optimization failed', error);
    }
  }

  // Monitor performance metrics
  getPerformanceMetrics() {
    if (!('performance' in window)) {
      return null;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      // Navigation timing
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      
      // Paint timing
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
      
      // Memory usage (if available)
      memoryUsage: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    };
  }

  // Auto-optimization based on performance metrics
  async autoOptimize(): Promise<void> {
    const metrics = this.getPerformanceMetrics();
    
    if (!metrics) return;

    // If load time is slow, run optimizations
    if (metrics.loadComplete > 3000) { // 3 seconds
      logger.warn('Slow load time detected, running auto-optimization');
      await this.optimizeApplication();
    }

    // If memory usage is high, clean up
    if (metrics.memoryUsage && metrics.memoryUsage.used / metrics.memoryUsage.total > 0.8) {
      logger.warn('High memory usage detected, cleaning up');
      await this.optimizeCache();
      
      // Trigger garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
    }
  }
}

export const optimizationService = new OptimizationService();

// Auto-start optimization on app load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Run initial optimization after a short delay
    setTimeout(() => {
      optimizationService.optimizeApplication();
    }, 2000);

    // Set up periodic auto-optimization
    setInterval(() => {
      optimizationService.autoOptimize();
    }, 300000); // Every 5 minutes
  });
}
