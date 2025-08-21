import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';

interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
  icon?: string;
  badge?: number;
  sound?: string;
  tag?: string;
  actions?: NotificationAction[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface SubscriptionData {
  userId: string;
  deviceToken: string;
  platform: 'web' | 'android' | 'ios';
  topics: string[];
}

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;
  private deviceToken: string | null = null;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      if (Capacitor.isNativePlatform()) {
        await this.initializeNativeNotifications();
      } else {
        await this.initializeWebNotifications();
      }

      this.isInitialized = true;
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error;
    }
  }

  private async initializeNativeNotifications(): Promise<void> {
    // Request permission
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      // Register for push notifications
      await PushNotifications.register();

      // Listen for registration
      PushNotifications.addListener('registration', (token: Token) => {
        this.deviceToken = token.value;
        this.saveDeviceToken(token.value);
        console.log('Push registration success, token: ' + token.value);
      });

      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      // Listen for push notifications
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        this.handleNotificationReceived(notification);
      });

      // Listen for notification actions
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        this.handleNotificationAction(notification);
      });
    }
  }

  private async initializeWebNotifications(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications not supported in this browser');
    }

    // Register service worker
    this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
    
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Subscribe to push notifications
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY || '')
      });

      this.deviceToken = JSON.stringify(subscription);
      await this.saveDeviceToken(this.deviceToken);
      
      console.log('Web push subscription successful');
    }
  }

  private async saveDeviceToken(token: string): Promise<void> {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const subscriptionData: SubscriptionData = {
        userId,
        deviceToken: token,
        platform: Capacitor.isNativePlatform() ? 
          (Capacitor.getPlatform() as 'android' | 'ios') : 'web',
        topics: ['general', 'market_updates', 'price_alerts']
      };

      const { error } = await (await import('@/lib/supabaseClient')).supabase
        .from('notification_subscriptions')
        .upsert([subscriptionData], { onConflict: 'user_id,platform' });

      if (error) {
        console.error('Failed to save device token:', error);
      }
    } catch (error) {
      console.error('Error saving device token:', error);
    }
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor local notifications
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        
        await LocalNotifications.schedule({
          notifications: [{
            title: payload.title,
            body: payload.body,
            id: Date.now(),
            extra: payload.data,
            iconColor: '#4F46E5'
          }]
        });
      } else {
        // Use Web Notifications API
        if (this.serviceWorkerRegistration && Notification.permission === 'granted') {
          await this.serviceWorkerRegistration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon || '/favicon.ico',
            badge: payload.badge,
            tag: payload.tag,
            data: payload.data,
            actions: payload.actions?.map(action => ({
              action: action.action,
              title: action.title,
              icon: action.icon
            }))
          });
        }
      }
    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  async sendPushNotification(userId: string, payload: NotificationPayload): Promise<void> {
    try {
      // In a real implementation, this would call your backend API
      // which would then send the notification via FCM/APNS
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          userId,
          notification: payload
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send push notification');
      }

      console.log('Push notification sent successfully');
    } catch (error) {
      console.error('Failed to send push notification:', error);
      // Fallback to local notification
      await this.sendLocalNotification(payload);
    }
  }

  async subscribeToTopic(topic: string): Promise<void> {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId || !this.deviceToken) return;

      const { error } = await (await import('@/lib/supabaseClient')).supabase
        .from('notification_subscriptions')
        .update({
          topics: (await this.getUserTopics()).concat(topic)
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to subscribe to topic:', error);
      }
    } catch (error) {
      console.error('Topic subscription error:', error);
    }
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const currentTopics = await this.getUserTopics();
      const updatedTopics = currentTopics.filter(t => t !== topic);

      const { error } = await (await import('@/lib/supabaseClient')).supabase
        .from('notification_subscriptions')
        .update({ topics: updatedTopics })
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to unsubscribe from topic:', error);
      }
    } catch (error) {
      console.error('Topic unsubscription error:', error);
    }
  }

  private async getUserTopics(): Promise<string[]> {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return [];

      const { data, error } = await (await import('@/lib/supabaseClient')).supabase
        .from('notification_subscriptions')
        .select('topics')
        .eq('user_id', userId)
        .single();

      if (error || !data) return [];
      return data.topics || [];
    } catch (error) {
      console.error('Failed to get user topics:', error);
      return [];
    }
  }

  private handleNotificationReceived(notification: PushNotificationSchema): void {
    console.log('Push notification received: ', notification);
    
    // Handle notification based on type
    if (notification.data?.type === 'price_alert') {
      this.handlePriceAlert(notification.data);
    } else if (notification.data?.type === 'market_update') {
      this.handleMarketUpdate(notification.data);
    } else if (notification.data?.type === 'order_status') {
      this.handleOrderStatus(notification.data);
    }
  }

  private handleNotificationAction(notification: ActionPerformed): void {
    console.log('Push notification action performed: ', notification);
    
    const action = notification.actionId;
    const data = notification.notification.data;

    switch (action) {
      case 'view_market':
        window.location.href = `/markets/${data.marketId}`;
        break;
      case 'view_order':
        window.location.href = `/orders/${data.orderId}`;
        break;
      case 'accept_bid':
        this.handleBidAcceptance(data.bidId);
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  }

  private handlePriceAlert(data: any): void {
    // Handle price alert logic
    console.log('Price alert received:', data);
  }

  private handleMarketUpdate(data: any): void {
    // Handle market update logic
    console.log('Market update received:', data);
  }

  private handleOrderStatus(data: any): void {
    // Handle order status logic
    console.log('Order status update received:', data);
  }

  private async handleBidAcceptance(bidId: string): Promise<void> {
    try {
      // Handle bid acceptance logic
      console.log('Processing bid acceptance:', bidId);
    } catch (error) {
      console.error('Failed to handle bid acceptance:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Notification templates for common scenarios
  async notifyPriceAlert(commodity: string, currentPrice: number, targetPrice: number): Promise<void> {
    const payload: NotificationPayload = {
      title: 'Price Alert',
      body: `${commodity} price is now KES ${currentPrice}, reaching your target of KES ${targetPrice}`,
      data: { type: 'price_alert', commodity, currentPrice, targetPrice },
      actions: [
        { action: 'view_market', title: 'View Market' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    await this.sendLocalNotification(payload);
  }

  async notifyOrderUpdate(orderId: string, status: string): Promise<void> {
    const payload: NotificationPayload = {
      title: 'Order Update',
      body: `Your order #${orderId} status has been updated to: ${status}`,
      data: { type: 'order_status', orderId, status },
      actions: [
        { action: 'view_order', title: 'View Order' }
      ]
    };

    await this.sendLocalNotification(payload);
  }

  async notifyNewBid(productId: string, bidAmount: number): Promise<void> {
    const payload: NotificationPayload = {
      title: 'New Bid Received',
      body: `You received a new bid of KES ${bidAmount} for your product`,
      data: { type: 'new_bid', productId, bidAmount },
      actions: [
        { action: 'accept_bid', title: 'Accept' },
        { action: 'view_product', title: 'View Product' }
      ]
    };

    await this.sendLocalNotification(payload);
  }
}
