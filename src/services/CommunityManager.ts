// @ts-nocheck
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';

export interface UserReputation {
  userId: string;
  reputationScore: number;
  trustLevel: 'new' | 'basic' | 'trusted' | 'expert';
  totalTransactions: number;
  successfulTransactions: number;
  reviewsReceived: number;
  averageRating: number;
  badges: string[];
  verificationStatus: 'unverified' | 'pending' | 'verified';
}

export interface CommunityActivity {
  id: string;
  userId: string;
  activityType: 'transaction' | 'review' | 'comment' | 'report' | 'verification';
  targetId: string;
  timestamp: string;
  details: any;
  impact: number;
}

export class CommunityManager {
  private supabase;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  async getUserReputation(userId: string): Promise<UserReputation> {
    const { data, error } = await this.supabase.rpc('get_user_reputation', {
      p_user_id: userId
    });

    if (error) throw error;
    return data;
  }

  async updateReputationScore(
    userId: string,
    activity: CommunityActivity
  ): Promise<number> {
    const { data, error } = await this.supabase.rpc('update_user_reputation', {
      p_user_id: userId,
      p_activity_type: activity.activityType,
      p_impact: activity.impact
    });

    if (error) throw error;
    return data;
  }

  async recordActivity(activity: Omit<CommunityActivity, 'id'>): Promise<CommunityActivity> {
    const { data, error } = await this.supabase
      .from('community_activities')
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async moderateContent(
    contentId: string,
    contentType: string,
    action: 'approve' | 'reject' | 'flag',
    reason?: string
  ): Promise<void> {
    const { error } = await this.supabase.rpc('moderate_content', {
      p_content_id: contentId,
      p_content_type: contentType,
      p_action: action,
      p_reason: reason
    });

    if (error) throw error;
  }

  async getUserTrustLevel(userId: string): Promise<string> {
    const { data, error } = await this.supabase.rpc('calculate_trust_level', {
      p_user_id: userId
    });

    if (error) throw error;
    return data;
  }

  async awardBadge(userId: string, badgeType: string): Promise<void> {
    const { error } = await this.supabase.rpc('award_user_badge', {
      p_user_id: userId,
      p_badge_type: badgeType
    });

    if (error) throw error;
  }
}

export function useUserReputation(userId: string) {
  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const communityManager = new CommunityManager(supabase);

  useEffect(() => {
    fetchReputation();

    const subscription = supabase
      .channel('user_reputation')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_activities',
          filter: `user_id=eq.${userId}`
        },
        async () => {
          // Refresh reputation on any activity changes
          await fetchReputation();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, supabase]);

  const fetchReputation = async () => {
    try {
      const data = await communityManager.getUserReputation(userId);
      setReputation(data);
    } catch (error) {
      console.error('Error fetching user reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  return { reputation, loading };
}
