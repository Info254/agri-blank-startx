import { supabase } from '../integrations/supabase/client';

export async function createInputGroupOrder(order) {
  return await supabase.from('input_group_orders').insert(order);
}

export async function joinInputGroupOrder(order_id, farmer_id, quantity) {
  // This assumes a join table or updates the order quantity
  return await supabase.from('input_group_orders').update({ quantity }).eq('id', order_id);
}

export async function getInputGroupOrders() {
  return await supabase.from('input_group_orders').select('*');
}

export async function updateInputGroupOrderStatus(order_id, status) {
  return await supabase.from('input_group_orders').update({ status }).eq('id', order_id);
}
