
/**
 * Enhanced API Handler for AMIS Kenya API
 * This ensures consistent communication with the API with proper error handling and caching
 */

const API_BASE_URL = "https://amis.kilimo.go.ke/en/api";

// Maximum number of retry attempts for failed API calls
const MAX_RETRIES = 2;
// Base delay for exponential backoff in milliseconds
const BASE_RETRY_DELAY = 1000;
// Cache retention time (2 hours)
const CACHE_TTL = 2 * 60 * 60 * 1000;

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  queryParams?: Record<string, string>;
  fallbackReturnValue?: any;
  retries?: number;
  bypassCache?: boolean;
  timeout?: number;
}

// Define a generic type for API responses with results arrays
export interface AmisKeApiResponse<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// In-memory cache store
const apiCache: Record<string, { timestamp: number, data: any }> = {};

export class AmisKeApiHandler {
  static async get<T>(endpoint: string, queryParams?: Record<string, string>, fallbackReturnValue?: any, bypassCache = false): Promise<AmisKeApiResponse<T>> {
    return this.request<AmisKeApiResponse<T>>(endpoint, { 
      method: 'GET', 
      queryParams, 
      fallbackReturnValue,
      bypassCache,
      timeout: 3000 // 3 second timeout for faster response
    });
  }

  static async post<T>(endpoint: string, body: any, fallbackReturnValue?: any): Promise<AmisKeApiResponse<T>> {
    return this.request<AmisKeApiResponse<T>>(endpoint, { method: 'POST', body, fallbackReturnValue });
  }

  static async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { 
      method = 'GET', 
      body, 
      queryParams, 
      fallbackReturnValue = { results: [] } as unknown as T,
      retries = 0,
      bypassCache = false,
      timeout = 5000
    } = options;

    // Add query parameters if they exist
    let url = `${API_BASE_URL}/${endpoint}`;
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Generate cache key
    const cacheKey = `${method}:${url}`;
    
    // Check cache for GET requests when not bypassing cache
    if (method === 'GET' && !bypassCache && apiCache[cacheKey]) {
      const cachedData = apiCache[cacheKey];
      if (Date.now() - cachedData.timestamp < CACHE_TTL) {
        console.log(`Using cached data for ${url}`);
        return cachedData.data;
      } else {
        // Cache expired
        delete apiCache[cacheKey];
      }
    }

    // Set up request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
    };

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    console.log(`Making ${method} request to ${url} (attempt ${retries + 1} of ${MAX_RETRIES + 1})`);
    
    try {
      // Create an AbortController to handle timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      requestOptions.signal = controller.signal;

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      // Check for server errors that might be temporary
      if (response.status >= 500 && response.status < 600) {
        if (retries < MAX_RETRIES) {
          // Calculate exponential backoff delay
          const delay = BASE_RETRY_DELAY * Math.pow(2, retries);
          console.log(`Server error (${response.status}), retrying in ${delay}ms...`);
          
          // Wait for the calculated delay
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Retry the request with incremented retry counter
          return this.request(endpoint, {
            ...options,
            retries: retries + 1
          });
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}): ${errorText}`);
        
        // For GET requests, store fallback in cache to prevent hammering the API
        if (method === 'GET') {
          apiCache[cacheKey] = {
            timestamp: Date.now(),
            data: fallbackReturnValue
          };
        }
        
        return fallbackReturnValue;
      }

      // Parse JSON response
      const data = await response.json() as T;
      
      // Cache successful GET responses
      if (method === 'GET') {
        apiCache[cacheKey] = {
          timestamp: Date.now(),
          data
        };
      }
      
      return data;
    } catch (error) {
      // Network errors, timeout errors, or JSON parsing errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error(`Request timeout for ${endpoint} after ${timeout}ms`);
      } else {
        console.error(`Failed to connect to API (${endpoint}):`, error);
      }
      
      // Retry for network errors (likely connectivity issues)
      if (retries < MAX_RETRIES) {
        const delay = BASE_RETRY_DELAY * Math.pow(2, retries);
        console.log(`Network error, retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.request(endpoint, {
          ...options,
          retries: retries + 1
        });
      }
      
      if (typeof fallbackReturnValue !== 'undefined') {
        console.log(`Maximum retries reached. Using fallback data for ${endpoint}`);
        
        // Cache fallback for GET requests to prevent hammering the API
        if (method === 'GET') {
          apiCache[cacheKey] = {
            timestamp: Date.now(),
            data: fallbackReturnValue
          };
        }
        
        return fallbackReturnValue;
      }
      
      throw error;
    }
  }
  
  // Helper method to check if API is reachable
  static async checkApiHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_BASE_URL}/health-check`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }
  
  // Method to clear the cache
  static clearCache(): void {
    Object.keys(apiCache).forEach(key => delete apiCache[key]);
    console.log('API cache cleared');
  }
}

export default AmisKeApiHandler;
