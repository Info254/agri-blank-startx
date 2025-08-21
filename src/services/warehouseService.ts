
import { supabase } from '@/integrations/supabase/client';

export interface WarehouseFormData {
  name: string;
  location: string;
  county: string;
  latitude?: number;
  longitude?: number;
  capacityTons: number;
  hasRefrigeration: boolean;
  hasSecurity: boolean;
  certifications: string[];
  storageTypes: string[];
  dailyRatePerTon: number;
  contactInfo: string;
  operatingHours?: string;
}

export interface WarehouseBookingData {
  warehouseId: string;
  startDate: string;
  endDate: string;
  quantityTons: number;
  produceType: string;
  specialRequirements: string[];
  contactPhone: string;
  notes?: string;
}

export const createWarehouse = async (data: WarehouseFormData) => {
  const { data: result, error } = await supabase
    .from('warehouses')
    .insert({
      owner_id: (await supabase.auth.getUser()).data.user?.id,
      name: data.name,
      location: data.location,
      county: data.county,
      latitude: data.latitude,
      longitude: data.longitude,
      capacity_tons: data.capacityTons,
      has_refrigeration: data.hasRefrigeration,
      has_security: data.hasSecurity,
      certifications: data.certifications,
      storage_types: data.storageTypes,
      daily_rate_per_ton: data.dailyRatePerTon,
      contact_info: data.contactInfo,
      operating_hours: data.operatingHours,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getWarehouses = async (filters?: { 
  county?: string; 
  hasRefrigeration?: boolean;
  minCapacity?: number;
}) => {
  let query = supabase
    .from('warehouses')
    .select('*')
    .eq('is_active', true)
    .eq('availability_status', 'available');

  if (filters?.county) {
    query = query.eq('county', filters.county);
  }

  if (filters?.hasRefrigeration !== undefined) {
    query = query.eq('has_refrigeration', filters.hasRefrigeration);
  }

  if (filters?.minCapacity) {
    query = query.gte('capacity_tons', filters.minCapacity);
  }

  const { data, error } = await query.order('daily_rate_per_ton', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createWarehouseBooking = async (data: WarehouseBookingData) => {
  // Calculate total cost
  const { data: warehouse } = await supabase
    .from('warehouses')
    .select('daily_rate_per_ton')
    .eq('id', data.warehouseId)
    .single();

  if (!warehouse) throw new Error('Warehouse not found');

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalCost = days * data.quantityTons * warehouse.daily_rate_per_ton;

  const { data: result, error } = await supabase
    .from('warehouse_bookings')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      warehouse_id: data.warehouseId,
      start_date: data.startDate,
      end_date: data.endDate,
      quantity_tons: data.quantityTons,
      produce_type: data.produceType,
      special_requirements: data.specialRequirements,
      total_cost: totalCost,
      contact_phone: data.contactPhone,
      notes: data.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getUserWarehouseBookings = async () => {
  const { data, error } = await supabase
    .from('warehouse_bookings')
    .select(`
      *,
      warehouses:warehouse_id (
        name,
        location,
        county
      )
    `)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
