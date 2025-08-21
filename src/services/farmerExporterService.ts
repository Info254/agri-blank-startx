
import { supabase } from "@/integrations/supabase/client";

export interface FarmerExporterCollaboration {
  id: string;
  farmer_id: string;
  exporter_id?: string;
  farmer_name: string;
  farmer_phone: string;
  farmer_email?: string;
  farmer_location: string;
  farmer_county: string;
  farmer_coordinates?: { lat: number; lng: number } | null;
  farm_size_acres?: number;
  commodity_name: string;
  commodity_variety?: string;
  estimated_quantity: number;
  unit: string;
  quality_grade?: string;
  harvest_date?: string;
  availability_period?: string;
  farmer_experience_years?: number;
  has_export_documentation: boolean;
  documentation_needs?: string[];
  farmer_profile_description?: string;
  collaboration_type: string;
  target_markets?: string[];
  pricing_expectations?: string;
  special_requirements?: string[];
  farmer_certifications?: string[];
  collaboration_status: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  is_active: boolean;
  notes?: string;
}

export interface ExporterProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_registration_number?: string;
  business_license_number?: string;
  export_license_number?: string;
  company_description?: string;
  contact_person_name: string;
  contact_phone: string;
  contact_email: string;
  office_location: string;
  office_county: string;
  office_coordinates?: { lat: number; lng: number } | null;
  website_url?: string;
  years_in_business?: number;
  export_markets: string[];
  commodities_handled: string[];
  services_offered: string[];
  minimum_quantity_tons?: number;
  maximum_quantity_tons?: number;
  certifications?: string[];
  documentation_services: boolean;
  logistics_services: boolean;
  quality_assurance_services: boolean;
  financing_services: boolean;
  rating: number;
  total_collaborations: number;
  successful_exports: number;
  is_verified: boolean;
  verification_documents?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const createFarmerCollaboration = async (collaboration: Omit<FarmerExporterCollaboration, 'id' | 'created_at' | 'updated_at' | 'farmer_id'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('farmer_exporter_collaborations')
      .insert({
        farmer_id: user.id,
        ...collaboration
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating farmer collaboration:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating farmer collaboration:', error);
    throw error;
  }
};

export const getFarmerCollaborations = async (): Promise<FarmerExporterCollaboration[]> => {
  try {
    const { data, error } = await supabase
      .from('farmer_exporter_collaborations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching farmer collaborations:', error);
      return [];
    }

    // Transform the data to match our interface, handling JSONB coordinates
    const transformedData: FarmerExporterCollaboration[] = (data || []).map(item => ({
      ...item,
      farmer_coordinates: item.farmer_coordinates as { lat: number; lng: number } | null,
    }));

    return transformedData;
  } catch (error) {
    console.error('Error fetching farmer collaborations:', error);
    return [];
  }
};

export const createExporterProfile = async (profile: Omit<ExporterProfile, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'rating' | 'total_collaborations' | 'successful_exports' | 'is_verified'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('exporter_profiles')
      .insert({
        user_id: user.id,
        ...profile
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating exporter profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating exporter profile:', error);
    throw error;
  }
};

export const getExporterProfiles = async (): Promise<ExporterProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('exporter_profiles')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching exporter profiles:', error);
      return [];
    }

    // Transform the data to match our interface, handling JSONB coordinates
    const transformedData: ExporterProfile[] = (data || []).map(item => ({
      ...item,
      office_coordinates: item.office_coordinates as { lat: number; lng: number } | null,
    }));

    return transformedData;
  } catch (error) {
    console.error('Error fetching exporter profiles:', error);
    return [];
  }
};

export const updateCollaborationStatus = async (collaborationId: string, status: string, exporterId?: string) => {
  try {
    const updates: any = { collaboration_status: status };
    if (exporterId) {
      updates.exporter_id = exporterId;
    }

    const { data, error } = await supabase
      .from('farmer_exporter_collaborations')
      .update(updates)
      .eq('id', collaborationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating collaboration status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating collaboration status:', error);
    throw error;
  }
};
