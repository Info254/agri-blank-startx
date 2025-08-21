
import { supabase } from '@/integrations/supabase/client';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  requests: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

export class PricingService {
  static async getPricingTiers(): Promise<PricingTier[]> {
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching pricing tiers:', error);
        // Updated fallback pricing with your requested limits
        return [
          {
            id: 'free',
            name: 'Free Tier',
            price: 0,
            currency: 'KES',
            period: '/month',
            requests: 30, // Updated to 30 requests
            features: ['Basic API access', 'Community support', 'Standard rate limits', '30 API calls per month'],
            is_popular: false,
            is_active: true
          },
          {
            id: 'developer',
            name: 'Developer',
            price: 2500,
            currency: 'KES',
            period: '/month',
            requests: 10000, // Updated to 10,000 requests
            features: ['Advanced API access', 'Email support', 'Higher rate limits', 'Analytics dashboard', '10,000 API calls per month'],
            is_popular: true,
            is_active: true
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 15000,
            currency: 'KES',
            period: '/month',
            requests: 100000, // 100k requests for enterprise
            features: ['Full API access', 'Priority support', 'Custom rate limits', 'Dedicated account manager', 'Custom integrations', '100,000 API calls per month'],
            is_popular: false,
            is_active: true
          }
        ];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
      return [];
    }
  }

  static async updatePricingTier(tier: PricingTier): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pricing_tiers')
        .update({
          name: tier.name,
          price: tier.price,
          currency: tier.currency,
          period: tier.period,
          requests: tier.requests,
          features: tier.features,
          is_popular: tier.is_popular,
          is_active: tier.is_active
        })
        .eq('id', tier.id);

      return !error;
    } catch (error) {
      console.error('Error updating pricing tier:', error);
      return false;
    }
  }
}
