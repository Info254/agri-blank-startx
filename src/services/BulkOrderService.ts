// BulkOrderService: Handles CRUD, matching, and negotiation for bulk orders and processing matches
import { supabase } from '@/integrations/supabase/client';

export async function createBulkOrder(order) {
  return supabase.from('bulk_orders').insert(order).select();
}

export async function getBulkOrders(filter = {}) {
  return supabase.from('bulk_orders').select('*').match(filter);
}

export async function updateBulkOrder(id, updates) {
  return supabase.from('bulk_orders').update(updates).eq('id', id).select();
}

export async function deleteBulkOrder(id) {
  return supabase.from('bulk_orders').delete().eq('id', id);
}

export async function createProcessingMatch(match) {
  return supabase.from('processing_matches').insert(match).select();
}

export async function getProcessingMatches(filter = {}) {
  return supabase.from('processing_matches').select('*').match(filter);
}

export async function updateProcessingMatch(id, updates) {
  return supabase.from('processing_matches').update(updates).eq('id', id).select();
}

export async function addNegotiationLog(matchId, logEntry) {
  // Append to negotiation_log JSONB array
  const { data, error } = await supabase
    .from('processing_matches')
    .select('negotiation_log')
    .eq('id', matchId)
    .single();
  if (error) return { error };
  const existingLog = data?.negotiation_log;
  const negotiation_log = Array.isArray(existingLog) ? existingLog : [];
  negotiation_log.push(logEntry);
  return supabase.from('processing_matches').update({ negotiation_log }).eq('id', matchId).select();
}

export async function updateMatchStatus(matchId, status) {
  return supabase.from('processing_matches').update({ status }).eq('id', matchId).select();
}

// Add notification logic as needed (e.g., via Supabase functions or external service)
