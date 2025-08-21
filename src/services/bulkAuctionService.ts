import { supabase } from '../integrations/supabase/client';

export async function createBulkOrder(order) {
  return await supabase.from('bulk_orders').insert(order);
}

export async function getBulkOrders() {
  return await supabase.from('bulk_orders').select('*');
}

export async function bidBulkOrder(bid) {
  return await supabase.from('bulk_order_bids').insert(bid);
}

export async function getBulkOrderBids(order_id) {
  return await supabase.from('bulk_order_bids').select('*').eq('order_id', order_id);
}

export async function acceptBulkOrderBid(bid_id) {
  return await supabase.from('bulk_order_bids').update({ status: 'accepted' }).eq('id', bid_id);
}
