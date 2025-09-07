// @ts-nocheck
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { secureStorage } from '@/utils/SecureStorage';
import { jwtDecode } from 'jwt-decode';
import SecurityConfig from '../config/SecurityConfig';

interface TokenData {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'https://api.agriconnect.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Platform': 'web', // This should be dynamically set if needed for native
        'X-App-Version': '1.0.0',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const token = await secureStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized responses
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, add to queue
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              this.processQueue(null, newToken);
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            // Redirect to login or handle token refresh failure
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await secureStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<RefreshTokenResponse>(
        `${process.env.REACT_APP_API_URL}/auth/refresh`,
        { refresh_token: refreshToken }
      );

      const { access_token, refresh_token } = response.data;
      
      await secureStorage.setItem('access_token', access_token);
      if (refresh_token) {
        await secureStorage.setItem('refresh_token', refresh_token);
      }

      return access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.clearAuth();
      throw error;
    }
  }

  private processQueue(error: Error | null, token: string | null = null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  public async clearAuth(): Promise<void> {
    await secureStorage.clear();
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  public async upload<T>(
    url: string,
    file: any,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data;
  }

  public async download(
    url: string,
    onDownloadProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<ArrayBuffer> {
    const response = await this.api.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      onDownloadProgress,
    });
    return response.data;
  }

  public setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public removeAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }

  public isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<TokenData>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

export const apiService = ApiService.getInstance();
export default apiService;
