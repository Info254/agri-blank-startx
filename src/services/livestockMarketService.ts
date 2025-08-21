import { supabase } from '../lib/supabaseClient';
import { LivestockForSale, LivestockAuction, LivestockType, HalalCertification } from '../types/livestock';

export const LivestockMarketService = {
  // List all livestock markets
  async listMarkets(filters: {
    type?: LivestockType;
    county?: string;
    hasHalalCertification?: boolean;
    hasVeterinaryServices?: boolean;
  } = {}) {
    let query = supabase.from('livestock_markets').select('*');

    if (filters.type) {
      query = query.contains('livestock_categories', [filters.type]);
    }
    if (filters.county) {
      query = query.eq('county', filters.county);
    }
    if (filters.hasHalalCertification) {
      query = query.eq('halal_certified', true);
    }
    if (filters.hasVeterinaryServices) {
      query = query.eq('has_veterinary_services', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // List animals for sale
  async listAnimalsForSale(filters: {
    marketId?: string;
    type?: LivestockType;
    breed?: string;
    minAge?: number;
    maxAge?: number;
    minWeight?: number;
    maxWeight?: number;
    gender?: 'male' | 'female' | 'castrated_male';
    isHalal?: boolean;
    priceRange?: [number, number];
  }) {
    let query = supabase
      .from('livestock_for_sale')
      .select('*')
      .eq('status', 'available');

    if (filters.marketId) {
      query = query.eq('market_id', filters.marketId);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.breed) {
      query = query.eq('breed', filters.breed);
    }
    if (filters.minAge !== undefined) {
      query = query.gte('age', filters.minAge);
    }
    if (filters.maxAge !== undefined) {
      query = query.lte('age', filters.maxAge);
    }
    if (filters.minWeight !== undefined) {
      query = query.gte('weight', filters.minWeight);
    }
    if (filters.maxWeight !== undefined) {
      query = query.lte('weight', filters.maxWeight);
    }
    if (filters.gender) {
      query = query.eq('gender', filters.gender);
    }
    if (filters.isHalal !== undefined) {
      query = query.eq('is_halal', filters.isHalal);
    }
    if (filters.priceRange) {
      query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get animal details
  async getAnimalDetails(animalId: string) {
    const { data, error } = await supabase
      .from('livestock_for_sale')
      .select('*, seller:profiles(*)')
      .eq('id', animalId)
      .single();

    if (error) throw error;
    return data;
  },

  // List active auctions
  async listActiveAuctions(marketId?: string) {
    let query = supabase
      .from('livestock_auctions')
      .select('*')
      .in('status', ['upcoming', 'live']);

    if (marketId) {
      query = query.eq('market_id', marketId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Place a bid on an auction
  async placeBid(auctionId: string, userId: string, amount: number) {
    const { data, error } = await supabase.rpc('place_livestock_bid', {
      p_auction_id: auctionId,
      p_user_id: userId,
      p_amount: amount,
    });

    if (error) throw error;
    return data;
  },

  // Verify Halal certification
  async verifyHalalCertification(certificateNumber: string) {
    const { data, error } = await supabase
      .from('halal_certifications')
      .select('*')
      .eq('certificate_number', certificateNumber)
      .eq('status', 'active')
      .gt('expiry_date', new Date().toISOString())
      .single();

    if (error) throw error;
    return data;
  },

  // Record animal health check
  async recordHealthCheck(animalId: string, healthData: any) {
    const { data, error } = await supabase
      .from('livestock_health_records')
      .insert({
        animal_id: animalId,
        ...healthData,
        recorded_at: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  },

  // Get animal health history
  async getHealthHistory(animalId: string) {
    const { data, error } = await supabase
      .from('livestock_health_records')
      .select('*')
      .eq('animal_id', animalId)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // List available breeds by type
  async listBreeds(type?: string) {
    let query = supabase.from('livestock_breeds').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get market statistics
  async getMarketStatistics(marketId: string) {
    const { data, error } = await supabase.rpc('get_livestock_market_stats', {
      p_market_id: marketId,
    });

    if (error) throw error;
    return data;
  },

  // Record slaughter information (for Halal compliance)
  async recordSlaughter(animalId: string, slaughterData: {
    method: string;
    certifierId: string;
    certificateNumber: string;
    location: string;
    timestamp: string;
  }) {
    const { data, error } = await supabase
      .from('livestock_slaughter_records')
      .insert({
        animal_id: animalId,
        ...slaughterData,
        recorded_at: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  },

  // Get animal movement history
  async getMovementHistory(animalId: string) {
    const { data, error } = await supabase
      .from('livestock_movements')
      .select('*')
      .eq('animal_id', animalId)
      .order('movement_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Report animal welfare concern
  async reportWelfareConcern(reportData: {
    reporterId: string;
    animalId: string;
    concernType: string;
    description: string;
    evidenceUrls?: string[];
  }) {
    const { data, error } = await supabase
      .from('animal_welfare_reports')
      .insert({
        ...reportData,
        status: 'reported',
        reported_at: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  },
};
