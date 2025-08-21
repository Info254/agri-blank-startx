
import { supabase } from '@/integrations/supabase/client';

export interface TransportRequestData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupCounty: string;
  dropoffCounty: string;
  cargoType: string;
  quantity: number;
  unit: string;
  requestedDate: string;
  flexibleTiming: boolean;
  specialRequirements: string[];
  estimatedValue?: number;
  insuranceRequired: boolean;
  contactPhone: string;
  notes?: string;
}

export const createTransportRequest = async (data: TransportRequestData) => {
  const { data: result, error } = await supabase
    .from('transport_requests')
    .insert({
      requester_id: (await supabase.auth.getUser()).data.user?.id,
      pickup_location: data.pickupLocation,
      dropoff_location: data.dropoffLocation,
      pickup_county: data.pickupCounty,
      dropoff_county: data.dropoffCounty,
      cargo_type: data.cargoType,
      quantity: data.quantity,
      unit: data.unit,
      requested_date: data.requestedDate,
      flexible_timing: data.flexibleTiming,
      special_requirements: data.specialRequirements,
      estimated_value: data.estimatedValue,
      insurance_required: data.insuranceRequired,
      contact_phone: data.contactPhone,
      notes: data.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getTransportRequests = async (filters?: {
  status?: string;
  pickupCounty?: string;
  dropoffCounty?: string;
}) => {
  let query = supabase
    .from('transport_requests')
    .select(`
      *,
      profiles:requester_id (
        full_name,
        contact_number
      )
    `);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.pickupCounty) {
    query = query.eq('pickup_county', filters.pickupCounty);
  }

  if (filters?.dropoffCounty) {
    query = query.eq('dropoff_county', filters.dropoffCounty);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateTransportRequest = async (id: string, updates: {
  status?: string;
  quotedPrice?: number;
  transporterId?: string;
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('transport_requests')
    .update({
      status: updates.status,
      quoted_price: updates.quotedPrice,
      transporter_id: updates.transporterId,
      notes: updates.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserTransportRequests = async () => {
  const { data, error } = await supabase
    .from('transport_requests')
    .select('*')
    .eq('requester_id', (await supabase.auth.getUser()).data.user?.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
