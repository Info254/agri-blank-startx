
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type NotificationType =
  | 'bulk_order_new'
  | 'push'
  | 'bulk_order_status'
  | 'match_new'
  | 'match_status'
  | 'negotiation_update'
  | 'rescue_listing_new'
  | 'rescue_match_new'
  | 'rescue_status'
  | 'input_pricing_new'
  | 'input_pricing_verified'
  | 'review_new'
  | 'review_verified'
  | 'surplus_new'
  | 'surplus_status'
  | 'recipe_new'
  | 'resource_new'
  | 'workshop_new'
  | 'workshop_update'
  | 'rsvp_new'
  | 'success'
  | 'donation_new';

export interface InAppNotification {
  type: NotificationType;
  title: string;
  description: string;
}

export function notify({ type, title, description }: InAppNotification) {
  const { toast } = useToast();
  // Check user preferences for notification type
  const variant = type.includes('error') ? 'destructive' 
    : type.includes('success') ? 'success'
    : undefined;
  
  toast({ 
    title, 
    description,
    variant 
  });
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  action_url: string | null;
  related_id: string | null;
}

export class NotificationService {
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      return (data || []).map(notification => ({
        ...notification,
        type: notification.type as 'info' | 'warning' | 'error' | 'success',
        is_read: notification.is_read ?? false // Handle null case
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      return !error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([notification]);

      return !error;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}
