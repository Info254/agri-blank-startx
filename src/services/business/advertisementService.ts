
import { supabase } from '@/integrations/supabase/client';

export interface BusinessAdvertisement {
  id?: string;
  user_id?: string;
  business_name: string;
  business_description: string;
  business_category: string;
  contact_email: string;
  contact_phone?: string;
  location: string;
  website_url?: string;
  image_url?: string;
  ad_content: string;
  target_audience: string[];
  payment_status?: 'pending' | 'paid' | 'expired';
  payment_id?: string;
  amount_paid?: number;
  expires_at?: string;
  is_active?: boolean;
  views_count?: number;
  clicks_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentTransaction {
  id?: string;
  user_id?: string;
  advertisement_id?: string;
  payment_provider: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_details?: any;
  created_at?: string;
  updated_at?: string;
}

export interface ApiAccessStatus {
  hasAccess: boolean;
  subscriptionType: 'free' | 'developer' | 'enterprise' | null;
  requestsRemaining: number;
  expiresAt?: string;
}

export class AdvertisementService {
  // Create a new advertisement
  static async createAdvertisement(ad: BusinessAdvertisement): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('business_advertisements')
        .insert({
          user_id: user.id,
          business_name: ad.business_name,
          business_description: ad.business_description,
          business_category: ad.business_category,
          contact_email: ad.contact_email,
          contact_phone: ad.contact_phone,
          location: ad.location,
          website_url: ad.website_url,
          image_url: ad.image_url,
          ad_content: ad.ad_content,
          target_audience: ad.target_audience
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating advertisement:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error in createAdvertisement:', error);
      return { success: false, error: 'Failed to create advertisement' };
    }
  }

  // Get all active advertisements
  static async getActiveAdvertisements(): Promise<BusinessAdvertisement[]> {
    try {
      const { data, error } = await supabase
        .from('business_advertisements')
        .select('*')
        .eq('is_active', true)
        .eq('payment_status', 'paid')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching advertisements:', error);
        return [];
      }

      // Type cast the data to our interface
      return (data || []).map(ad => ({
        ...ad,
        payment_status: ad.payment_status as 'pending' | 'paid' | 'expired'
      }));
    } catch (error) {
      console.error('Error in getActiveAdvertisements:', error);
      return [];
    }
  }

  // Get user's advertisements
  static async getUserAdvertisements(): Promise<BusinessAdvertisement[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_advertisements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user advertisements:', error);
        return [];
      }

      // Type cast the data to our interface
      return (data || []).map(ad => ({
        ...ad,
        payment_status: ad.payment_status as 'pending' | 'paid' | 'expired'
      }));
    } catch (error) {
      console.error('Error in getUserAdvertisements:', error);
      return [];
    }
  }

  // Update advertisement payment status
  static async updatePaymentStatus(
    advertisementId: string, 
    paymentId: string, 
    status: 'paid' | 'failed'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Set expiration date to 30 days from now for paid ads
      const expiresAt = status === 'paid' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('business_advertisements')
        .update({
          payment_status: status,
          payment_id: paymentId,
          is_active: status === 'paid',
          expires_at: expiresAt,
          amount_paid: status === 'paid' ? 20.00 : null
        })
        .eq('id', advertisementId);

      if (error) {
        console.error('Error updating payment status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      return { success: false, error: 'Failed to update payment status' };
    }
  }

  // Record payment transaction
  static async recordTransaction(transaction: PaymentTransaction): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          advertisement_id: transaction.advertisement_id,
          payment_provider: transaction.payment_provider,
          transaction_id: transaction.transaction_id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          payment_details: transaction.payment_details
        });

      if (error) {
        console.error('Error recording transaction:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in recordTransaction:', error);
      return { success: false, error: 'Failed to record transaction' };
    }
  }

  // Check API access status for user
  static async checkApiAccess(): Promise<ApiAccessStatus> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { hasAccess: false, subscriptionType: null, requestsRemaining: 0 };
      }

      // Check for active paid advertisements (indicates subscription)
      const { data: ads, error } = await supabase
        .from('business_advertisements')
        .select('payment_status, expires_at, amount_paid')
        .eq('user_id', user.id)
        .eq('payment_status', 'paid')
        .gt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error checking API access:', error);
        return { hasAccess: false, subscriptionType: 'free', requestsRemaining: 1000 };
      }

      // Determine subscription type based on payment amount
      let subscriptionType: 'free' | 'developer' | 'enterprise' = 'free';
      let requestsRemaining = 1000; // Free tier
      let expiresAt: string | undefined;

      if (ads && ads.length > 0) {
        const highestPaid = ads.reduce((max, ad) => 
          (ad.amount_paid || 0) > (max.amount_paid || 0) ? ad : max
        );

        if (highestPaid.amount_paid) {
          if (highestPaid.amount_paid >= 15000) {
            subscriptionType = 'enterprise';
            requestsRemaining = 500000;
          } else if (highestPaid.amount_paid >= 2500) {
            subscriptionType = 'developer';
            requestsRemaining = 50000;
          }
          expiresAt = highestPaid.expires_at;
        }
      }

      return {
        hasAccess: true,
        subscriptionType,
        requestsRemaining,
        expiresAt
      };
    } catch (error) {
      console.error('Error in checkApiAccess:', error);
      return { hasAccess: false, subscriptionType: 'free', requestsRemaining: 1000 };
    }
  }

  // Increment view count - simplified version without RPC
  static async incrementViewCount(advertisementId: string): Promise<void> {
    try {
      // Get current view count
      const { data: currentAd } = await supabase
        .from('business_advertisements')
        .select('views_count')
        .eq('id', advertisementId)
        .single();

      if (currentAd) {
        const newCount = (currentAd.views_count || 0) + 1;
        await supabase
          .from('business_advertisements')
          .update({ views_count: newCount })
          .eq('id', advertisementId);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Increment click count - simplified version without RPC
  static async incrementClickCount(advertisementId: string): Promise<void> {
    try {
      // Get current click count
      const { data: currentAd } = await supabase
        .from('business_advertisements')
        .select('clicks_count')
        .eq('id', advertisementId)
        .single();

      if (currentAd) {
        const newCount = (currentAd.clicks_count || 0) + 1;
        await supabase
          .from('business_advertisements')
          .update({ clicks_count: newCount })
          .eq('id', advertisementId);
      }
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  }

  // Get advertisement analytics
  static async getAnalytics(): Promise<{
    totalAds: number;
    activeAds: number;
    totalRevenue: number;
    topCategories: Array<{ category: string; count: number }>;
  }> {
    try {
      // Get total and active ads
      const [totalResult, activeResult] = await Promise.all([
        supabase.from('business_advertisements').select('id', { count: 'exact' }),
        supabase.from('business_advertisements').select('id', { count: 'exact' }).eq('is_active', true)
      ]);

      // Get revenue
      const { data: revenueData } = await supabase
        .from('business_advertisements')
        .select('amount_paid')
        .eq('payment_status', 'paid');

      const totalRevenue = revenueData?.reduce((sum, ad) => sum + (ad.amount_paid || 0), 0) || 0;

      // Get top categories
      const { data: categoryData } = await supabase
        .from('business_advertisements')
        .select('business_category');

      const categoryCounts: { [key: string]: number } = {};
      categoryData?.forEach(ad => {
        categoryCounts[ad.business_category] = (categoryCounts[ad.business_category] || 0) + 1;
      });

      const topCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalAds: totalResult.count || 0,
        activeAds: activeResult.count || 0,
        totalRevenue,
        topCategories
      };
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      return { totalAds: 0, activeAds: 0, totalRevenue: 0, topCategories: [] };
    }
  }

  // Renew advertisement subscription
  static async renewAdvertisement(advertisementId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const newExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from('business_advertisements')
        .update({
          expires_at: newExpiryDate,
          is_active: true,
          payment_status: 'paid'
        })
        .eq('id', advertisementId);

      if (error) {
        console.error('Error renewing advertisement:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in renewAdvertisement:', error);
      return { success: false, error: 'Failed to renew advertisement' };
    }
  }
}
