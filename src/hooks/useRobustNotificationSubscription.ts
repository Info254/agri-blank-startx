import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { notify } from '../services/notificationService';

// Robust notification subscription for all key events
export function useRobustNotificationSubscription(userId: string) {
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        const { title, body, type } = payload.new;
        notify({ type: type || 'push', title, description: body });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
}

// List of robust notification events:
// - New donation received
// - Product review submitted
// - Input pricing verified
// - Auction won/lost
// - Bulk order matched
// - Food rescue opportunity
// - Supplier verified
// - Community forum reply
// - Admin alerts
// - Impact report published
// - Any custom event (extend notifications table as needed)
