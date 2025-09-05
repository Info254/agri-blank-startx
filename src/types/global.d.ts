// Global type definitions for build stability

// Extend Window interface for any global variables
declare global {
  interface Window {
    // Add any window properties here
  }
}

// Common type for service responses
export interface ServiceResponse<T = any> {
  data?: T;
  error?: string;
  success?: boolean;
}

// Export empty to make this a module
export {};