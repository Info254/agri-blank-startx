
interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
}

interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  userId?: string;
  sessionId: string;
}

class MonitoringService {
  private sessionId: string;
  private isProduction: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    this.sessionId = crypto.randomUUID();
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private createLogEntry(level: keyof LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context,
      sessionId: this.sessionId
    };
  }

  debug(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('DEBUG', message, context);
    
    if (!this.isProduction) {
      console.debug(`[${entry.timestamp.toISOString()}] DEBUG: ${message}`, context);
    }
    
    this.addToBuffer(entry);
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('INFO', message, context);
    
    console.info(`[${entry.timestamp.toISOString()}] INFO: ${message}`, context);
    this.addToBuffer(entry);
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('WARN', message, context);
    
    console.warn(`[${entry.timestamp.toISOString()}] WARN: ${message}`, context);
    this.addToBuffer(entry);
    
    if (this.isProduction) {
      this.sendToExternalService(entry);
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const errorContext = {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    };

    const entry = this.createLogEntry('ERROR', message, errorContext);
    
    console.error(`[${entry.timestamp.toISOString()}] ERROR: ${message}`, error, context);
    this.addToBuffer(entry);
    
    if (this.isProduction) {
      this.sendToExternalService(entry);
    }
  }

  private addToBuffer(entry: LogEntry) {
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    try {
      // In production, send to monitoring service like DataDog, LogRocket, etc.
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Silently fail - don't want logging to break the app
      console.error('Failed to send log to external service:', error);
    }
  }

  // Performance tracking
  startTimer(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  // User action tracking
  trackUserAction(action: string, properties?: Record<string, any>) {
    this.info(`User Action: ${action}`, {
      action,
      properties,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  // API call tracking
  trackApiCall(method: string, url: string, status: number, duration: number) {
    const level = status >= 400 ? 'ERROR' : status >= 300 ? 'WARN' : 'INFO';
    
    this[level.toLowerCase() as keyof LogLevel](`API Call: ${method} ${url}`, {
      method,
      url,
      status,
      duration: `${duration}ms`
    });
  }

  // Get recent logs for debugging
  getRecentLogs(limit = 50): LogEntry[] {
    return this.logs.slice(-limit);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }
}

export const logger = new MonitoringService();

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const trackPageLoad = () => {
    const timer = logger.startTimer('Page Load');
    
    window.addEventListener('load', () => {
      timer();
    }, { once: true });
  };

  const trackComponentRender = (componentName: string) => {
    const timer = logger.startTimer(`Component Render: ${componentName}`);
    return timer;
  };

  return {
    trackPageLoad,
    trackComponentRender
  };
};
