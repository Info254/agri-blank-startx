
import { useState, useCallback } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: ErrorInfo | null;
  errorId: string | null;
}

export const useErrorBoundary = () => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorId: null
  });

  const captureError = useCallback((error: Error, errorInfo?: any) => {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorDetails: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    setErrorState({
      hasError: true,
      error: errorDetails,
      errorId
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary Captured:', errorDetails);
    }

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // This would integrate with services like Sentry, LogRocket, etc.
      console.error('Production Error:', {
        errorId,
        message: error.message,
        url: window.location.href,
        timestamp: errorDetails.timestamp
      });
    }

    return errorId;
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorId: null
    });
  }, []);

  const retryAction = useCallback((action: () => void) => {
    try {
      clearError();
      action();
    } catch (error) {
      captureError(error as Error);
    }
  }, [captureError, clearError]);

  return {
    errorState,
    captureError,
    clearError,
    retryAction
  };
};
