
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionStatus {
  isConnected: boolean;
  isHealthy: boolean;
  latency: number;
  lastChecked: Date;
  retryCount: number;
}

export const useSupabaseConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isHealthy: false,
    latency: 0,
    lastChecked: new Date(),
    retryCount: 0
  });

  const checkConnection = useCallback(async () => {
    const startTime = Date.now();
    
    try {
      // Test connection with a simple query
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const latency = Date.now() - startTime;
      
      if (error) {
        throw error;
      }

      setStatus(prev => ({
        ...prev,
        isConnected: true,
        isHealthy: latency < 1000, // Consider healthy if response time < 1s
        latency,
        lastChecked: new Date(),
        retryCount: 0
      }));

      return true;
    } catch (error) {
      console.error('Supabase connection check failed:', error);
      
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        isHealthy: false,
        latency: Date.now() - startTime,
        lastChecked: new Date(),
        retryCount: prev.retryCount + 1
      }));

      return false;
    }
  }, []);

  const reconnect = useCallback(async (maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      const connected = await checkConnection();
      if (connected) return true;
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
  }, [checkConnection]);

  useEffect(() => {
    // Initial connection check
    checkConnection();
    
    // Set up periodic health checks
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    status,
    checkConnection,
    reconnect
  };
};
