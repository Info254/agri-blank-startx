
import { supabase } from '@/integrations/supabase/client';
import { ServiceProvider } from '@/types';

export interface ServiceProviderFormData {
  businessName: string;
  serviceType: string;
  description: string;
  location: string;
  contactPhone?: string;
  contactEmail: string;
  websiteUrl?: string;
  countiesServed: string[];
  servicesOffered: string[];
  certifications: string[];
  experienceYears: number;
  hourlyRate?: number;
}

export const createServiceProvider = async (data: ServiceProviderFormData) => {
  const { data: result, error } = await supabase
    .from('service_providers')
    .insert({
      business_name: data.businessName,
      businesstype: data.serviceType,
      provider_category: data.serviceType, // Required field
      description: data.description,
      location: data.location,
      contact: {
        phone: data.contactPhone,
        email: data.contactEmail,
        website: data.websiteUrl
      },
      certifications: data.certifications,
      experience: data.experienceYears?.toString(),
      pricing: data.hourlyRate?.toString(),
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getServiceProviders = async (filters?: { 
  serviceType?: string; 
  county?: string; 
  searchTerm?: string; 
}) => {
  let query = supabase
    .from('service_providers')
    .select('*')
    .eq('verified', true);

  if (filters?.serviceType) {
    query = query.eq('businesstype', filters.serviceType);
  }

  if (filters?.county) {
    query = query.ilike('location', `%${filters.county}%`);
  }

  if (filters?.searchTerm) {
    query = query.or(`business_name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateServiceProvider = async (id: string, updates: Partial<ServiceProviderFormData>) => {
  const { data, error } = await supabase
    .from('service_providers')
    .update({
      business_name: updates.businessName,
      businesstype: updates.serviceType,
      provider_category: updates.serviceType,
      description: updates.description,
      location: updates.location,
      contact: {
        phone: updates.contactPhone,
        email: updates.contactEmail,
        website: updates.websiteUrl
      },
      certifications: updates.certifications,
      experience: updates.experienceYears?.toString(),
      pricing: updates.hourlyRate?.toString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
