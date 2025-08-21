import { supabase } from '../integrations/supabase/client';

export async function subscribeBox(box) {
  return await supabase.from('subscription_boxes').insert(box);
}

export async function getSubscriptionBoxes(consumer_id) {
  return await supabase.from('subscription_boxes').select('*').eq('consumer_id', consumer_id);
}

export async function updateSubscriptionBox(box_id, updates) {
  return await supabase.from('subscription_boxes').update(updates).eq('id', box_id);
}

export async function getBoxDeliveries(box_id) {
  return await supabase.from('subscription_box_deliveries').select('*').eq('box_id', box_id);
}

export async function markBoxDeliveryDelivered(delivery_id) {
  return await supabase.from('subscription_box_deliveries').update({ delivered: true }).eq('id', delivery_id);
}
