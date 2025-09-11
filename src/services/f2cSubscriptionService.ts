// @ts-nocheck
import { supabase } from '../integrations/supabase/client';

export async function subscribeBox(box: any) {
  return await supabase.from('subscription_boxes' as any).insert(box);
}

export async function getSubscriptionBoxes(consumer_id: any) {
  return await supabase.from('subscription_boxes' as any).select('*').eq('consumer_id', consumer_id);
}

export async function updateSubscriptionBox(box_id: any, updates: any) {
  return await supabase.from('subscription_boxes' as any).update(updates).eq('id', box_id);
}

export async function getBoxDeliveries(box_id: any) {
  return await supabase.from('subscription_box_deliveries' as any).select('*').eq('box_id', box_id);
}

export async function markBoxDeliveryDelivered(delivery_id: any) {
  return await supabase.from('subscription_box_deliveries' as any).update({ status: 'delivered' }).eq('id', delivery_id);
}