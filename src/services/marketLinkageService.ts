
import { supabase } from '@/integrations/supabase/client';

export interface MarketLinkageFormData {
  title: string;
  description: string;
  linkage_type: 'buyer_seller' | 'contract_farming' | 'cooperative' | 'export_opportunity' | 'processing_partnership';
  crops_involved: string[];
  counties: string[];
  requirements: string[];
  benefits: string[];
  contact_info: string;
  application_deadline?: string;
  start_date?: string;
  duration_months?: number;
  minimum_quantity?: number;
  price_range?: string;
  max_participants?: number;
}

export const createMarketLinkage = async (data: MarketLinkageFormData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: result, error } = await supabase
    .from('market_linkages')
    .insert({
      created_by: user.id,
      title: data.title,
      description: data.description,
      linkage_type: data.linkage_type,
      crops_involved: data.crops_involved,
      counties: data.counties,
      requirements: data.requirements,
      benefits: data.benefits,
      contact_info: data.contact_info,
      application_deadline: data.application_deadline,
      start_date: data.start_date,
      duration_months: data.duration_months,
      minimum_quantity: data.minimum_quantity,
      price_range: data.price_range,
      max_participants: data.max_participants,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getMarketLinkages = async (filters?: {
  linkage_type?: string;
  county?: string;
  crop?: string;
  activeOnly?: boolean;
}) => {
  let query = supabase
    .from('market_linkages')
    .select(`
      *,
      profiles:created_by (
        full_name,
        contact_number
      )
    `);

  if (filters?.linkage_type) {
    query = query.eq('linkage_type', filters.linkage_type);
  }

  if (filters?.county) {
    query = query.contains('counties', [filters.county]);
  }

  if (filters?.crop) {
    query = query.contains('crops_involved', [filters.crop]);
  }

  if (filters?.activeOnly !== false) {
    query = query.eq('status', 'active');
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const applyToMarketLinkage = async (linkageId: string) => {
  const { data: currentLinkage, error: fetchError } = await supabase
    .from('market_linkages')
    .select('participants_count')
    .eq('id', linkageId)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('market_linkages')
    .update({ 
      participants_count: (currentLinkage.participants_count || 0) + 1 
    })
    .eq('id', linkageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
