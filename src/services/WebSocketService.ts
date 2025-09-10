// @ts-nocheck
import { secureStorage } from '@/utils/SecureStorage';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

interface WebSocketMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
}

export class WebSocketService extends EventEmitter {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000; // Start with 1 second
  private maxReconnectInterval = 30000; // Max 30 seconds
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private isConnected = false;
  private connectionUrl: string;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    super();
    this.connectionUrl = this.getWebSocketUrl();
    this.setupEventListeners();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_WS_URL || window.location.host;
    return `${protocol}//${host}/ws`;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async setupEventListeners(): Promise<void> {
    // Handle app state changes
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = (): void => {
    if (!this.isConnected) {
      this.connect();
    }
  };

  private handleOffline = (): void => {
    this.disconnect();
  };

  private handleAppStateChange = (nextAppState: string): void => {
    if (nextAppState === 'active' && !this.isConnected) {
      this.connect();
    } else if (nextAppState === 'background' && this.isConnected) {
      this.disconnect();
    }
  };

  public async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        if (this.isConnected && this.socket) {
          resolve();
          return;
        }

        const token = await this.getAuthToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        // Close existing connection if any
        if (this.socket) {
          this.socket.close();
        }

        // Create new WebSocket connection with auth token
        this.socket = new WebSocket(`${this.connectionUrl}?token=${encodeURIComponent(token)}`);

        this.socket.onopen = () => {
          this.handleOpen();
          resolve();
        };

        this.socket.onmessage = (event) => this.handleMessage(event);
        this.socket.onerror = (error) => {
          this.handleError(error);
          reject(error);
        };
        this.socket.onclose = (event) => this.handleClose(event);
      } catch (error) {
        console.error('WebSocket connection error:', error);
        reject(error);
        this.connectionPromise = null;
        this.scheduleReconnect();
      }
    });

    return this.connectionPromise;
  }

  private handleOpen(): void {
    console.log('WebSocket connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.emit('connected');
    this.flushMessageQueue();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Handle response to a specific request
      if (message.id && this.pendingRequests.has(message.id)) {
        const { resolve, timeout } = this.pendingRequests.get(message.id)!;
        clearTimeout(timeout);
        this.pendingRequests.delete(message.id);
        resolve(message.payload);
        return;
      }
      
      // Emit message to listeners
      this.emit(message.type, message.payload);
      this.emit('*', message);
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.emit('error', error);
  }

  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket disconnected: ${event.code} ${event.reason}`);
    this.isConnected = false;
    this.socket = null;
    this.connectionPromise = null;
    this.emit('disconnected', { code: event.code, reason: event.reason });

    // Only attempt to reconnect if the close was not initiated by the client
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect_failed');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectInterval
    );

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect().catch(console.error);
      }
    }, delay);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  private sendMessage(message: WebSocketMessage): void {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
      if (!this.connectionPromise) {
        this.connect().catch(console.error);
      }
    }
  }

  public async send<T = any>(
    type: string,
    payload: any = {},
    options: { timeout?: number } = {}
  ): Promise<T> {
    const id = uuidv4();
    const message: WebSocketMessage = {
      id,
      type,
      payload,
      timestamp: Date.now(),
    };

    return new Promise((resolve, reject) => {
      // Set up timeout
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request ${type} timed out after ${options.timeout || 30000}ms`));
      }, options.timeout || 30000);

      // Store the request
      this.pendingRequests.set(id, {
        resolve: (data: T) => resolve(data),
        reject: (error: Error) => reject(error),
        timeout,
      });

      // Send the message
      this.sendMessage(message);
    });
  }

  public subscribe(
    event: string,
    callback: (payload: any) => void
  ): () => void {
    this.on(event, callback);
    return () => this.off(event, callback);
  }

  public disconnect(code: number = 1000, reason: string = 'Client disconnected'): void {
    if (this.socket) {
      this.socket.close(code, reason);
    }
    this.isConnected = false;
    this.socket = null;
    this.connectionPromise = null;
    
    // Clear pending requests
    this.pendingRequests.forEach(({ reject, timeout }) => {
      clearTimeout(timeout);
      reject(new Error('WebSocket connection closed'));
    });
    this.pendingRequests.clear();
    
    this.emit('disconnected', { code, reason });
  }

  public getConnectionState(): string {
    if (!this.socket) return 'disconnected';
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

export const webSocketService = WebSocketService.getInstance();
export default webSocketService;
