import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { notify } from '../services/notificationService';

// Subscribe to notifications table for real-time push notifications
export function useNotificationSubscription(userId: string) {
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        const { title, body } = payload.new;
        notify({ type: 'push', title, description: body });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
}
