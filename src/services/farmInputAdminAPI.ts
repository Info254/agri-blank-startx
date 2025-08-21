// Advanced backend logic for admin actions (example: approve/reject suppliers, products, orders)
import { supabase } from '../integrations/supabase/client';

export const approveSupplier = async (supplierId: string) => {
  return supabase.from('farm_input_suppliers').update({ is_active: true }).eq('id', supplierId);
};

export const rejectSupplier = async (supplierId: string) => {
  return supabase.from('farm_input_suppliers').update({ is_active: false }).eq('id', supplierId);
};

export const approveProduct = async (productId: string) => {
  return supabase.from('farm_input_products').update({ is_active: true }).eq('id', productId);
};

export const rejectProduct = async (productId: string) => {
  return supabase.from('farm_input_products').update({ is_active: false }).eq('id', productId);
};

export const setOrderStatus = async (orderId: string, order_status: string) => {
  return supabase.from('farm_input_orders').update({ order_status }).eq('id', orderId);
};
