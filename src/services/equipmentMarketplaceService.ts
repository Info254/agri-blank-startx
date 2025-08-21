// Equipment Marketplace Service Layer
import { supabase } from '../integrations/supabase/client';

export const getEquipmentListings = async () => {
  return supabase.from('equipment').select('*').eq('is_active', true);
};

export const createEquipmentListing = async (data: any) => {
  return supabase.from('equipment').insert([data]);
};

export const updateEquipmentListing = async (id: string, data: any) => {
  return supabase.from('equipment').update(data).eq('id', id);
};

export const likeEquipment = async (equipment_id: string, user_id: string) => {
  return supabase.from('equipment_likes').insert([{ equipment_id, user_id }]);
};

export const bookmarkEquipment = async (equipment_id: string, user_id: string) => {
  return supabase.from('equipment_bookmarks').insert([{ equipment_id, user_id }]);
};

export const rateEquipment = async (equipment_id: string, user_id: string, rating: number, comment: string) => {
  return supabase.from('equipment_ratings').insert([{ equipment_id, user_id, rating, comment }]);
};

export const flagEquipment = async (equipment_id: string, user_id: string, reason: string) => {
  return supabase.from('equipment_flags').insert([{ equipment_id, user_id, reason }]);
};

export const recommendBanEquipment = async (equipment_id: string, user_id: string, reason: string) => {
  return supabase.from('equipment_ban_recommendations').insert([{ equipment_id, user_id, reason }]);
};
