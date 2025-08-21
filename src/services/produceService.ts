
import { supabase } from '@/integrations/supabase/client';

export interface ProduceFormData {
  productName: string;
  variety?: string;
  quantity: number;
  unit: string;
  harvestDate?: string;
  expiryDate?: string;
  pricePerUnit?: number;
  location: string;
  storageConditions?: string;
  organicCertified: boolean;
  qualityGrade: string;
  availableForSale: boolean;
  description?: string;
  images: string[];
}

export const createProduceListing = async (data: ProduceFormData) => {
  const { data: result, error } = await supabase
    .from('produce_inventory')
    .insert({
      farmer_id: (await supabase.auth.getUser()).data.user?.id,
      product_name: data.productName,
      variety: data.variety,
      quantity: data.quantity,
      unit: data.unit,
      harvest_date: data.harvestDate,
      expiry_date: data.expiryDate,
      price_per_unit: data.pricePerUnit,
      location: data.location,
      storage_conditions: data.storageConditions,
      organic_certified: data.organicCertified,
      quality_grade: data.qualityGrade,
      available_for_sale: data.availableForSale,
      description: data.description,
      images: data.images,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getProduceListings = async (filters?: {
  productName?: string;
  location?: string;
  organicOnly?: boolean;
  availableOnly?: boolean;
}) => {
  let query = supabase
    .from('produce_inventory')
    .select(`
      *,
      profiles:farmer_id (
        full_name,
        contact_number,
        county
      )
    `);

  if (filters?.productName) {
    query = query.ilike('product_name', `%${filters.productName}%`);
  }

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  if (filters?.organicOnly) {
    query = query.eq('organic_certified', true);
  }

  if (filters?.availableOnly !== false) {
    query = query.eq('available_for_sale', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateProduceListing = async (id: string, updates: Partial<ProduceFormData>) => {
  const { data, error } = await supabase
    .from('produce_inventory')
    .update({
      product_name: updates.productName,
      variety: updates.variety,
      quantity: updates.quantity,
      unit: updates.unit,
      harvest_date: updates.harvestDate,
      expiry_date: updates.expiryDate,
      price_per_unit: updates.pricePerUnit,
      location: updates.location,
      storage_conditions: updates.storageConditions,
      organic_certified: updates.organicCertified,
      quality_grade: updates.qualityGrade,
      available_for_sale: updates.availableForSale,
      description: updates.description,
      images: updates.images,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserProduceListings = async () => {
  const { data, error } = await supabase
    .from('produce_inventory')
    .select('*')
    .eq('farmer_id', (await supabase.auth.getUser()).data.user?.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
