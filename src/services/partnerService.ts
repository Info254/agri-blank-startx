// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { Partner, PartnerEvent } from '@/types/partner';
import { ServiceResponse } from '@/types/service';
import { adaptEventFromApi, adaptPartnerFromDb, adaptPartnerToDb } from '@/utils/adapters';

// Basic Partner CRUD
export async function createPartner(partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<Partner>> {
  const dbData = adaptPartnerToDb(partner);
  const response = await supabase
    .from('partners')
    .insert([dbData])
    .select()
    .single();
    
  if (response.error) {
    return { data: null, error: response.error };
  }
  if (!response.data) {
    return { data: null, error: new Error('Failed to create partner') };
  }
  
  return { 
    data: adaptPartnerFromDb(response.data), 
    error: null 
  };
}

export async function getPartner(id: string): Promise<ServiceResponse<Partner>> {
  const response = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single();
    
  return { 
    data: response.data ? adaptPartnerFromDb(response.data) : null, 
    error: response.error 
  };
}

export async function getMyPartner(): Promise<ServiceResponse<Partner>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) throw new Error('No authenticated user');
  
  const response = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  return { 
    data: response.data ? adaptPartnerFromDb(response.data) : null, 
    error: response.error 
  };
}

export async function updatePartner(id: string, updates: Partial<Partner>): Promise<ServiceResponse<Partner>> {
  const dbUpdates = adaptPartnerToDb(updates);
  const response = await supabase
    .from('partners')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
    
  return { 
    data: response.data ? adaptPartnerFromDb(response.data) : null, 
    error: response.error 
  };
}

// Partner Events
export async function createPartnerEvent(event: any): Promise<ServiceResponse<PartnerEvent>> {
  const response = await supabase.from('partner_events').insert([event]).select().single();
  return { data: adaptEventFromApi(response.data), error: response.error };
}

export async function getPartnerEvents(partnerId?: string): Promise<ServiceResponse<PartnerEvent[]>> {
  const response = await (partnerId 
    ? supabase.from('partner_events').select('*').eq('partner_id', partnerId)
    : supabase.from('partner_events').select('*')
  );
  return { data: (response.data || []).map(adaptEventFromApi), error: response.error };
}

export async function updatePartnerEvent(id: string, updates: any): Promise<ServiceResponse<PartnerEvent>> {
  const response = await supabase.from('partner_events').update(updates).eq('id', id).select().single();
  return { data: adaptEventFromApi(response.data), error: response.error };
}
