// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Notification } from '@/types/database';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('User not authenticated');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        
        const notificationData = data || [];
        setNotifications(notificationData);
        setUnreadCount(notificationData.filter(n => !n.is_read).length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for notifications
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setNotifications(prev => prev.map(n => n.id === id ? data : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .insert({ ...notification, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
      throw err;
    }
  };

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    refetch: () => {
      setIsLoading(true);
      const fetchNotifications = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error: fetchError } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (fetchError) throw fetchError;
          
          const notificationData = data || [];
          setNotifications(notificationData);
          setUnreadCount(notificationData.filter(n => !n.is_read).length);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
        } finally {
          setIsLoading(false);
        }
      };
      fetchNotifications();
    }
  };
};