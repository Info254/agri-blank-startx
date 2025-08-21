import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function createBatch(batch: any) {
  return supabase.from('batch_tracking').insert([batch]);
}
export async function getBatch(batch_id: string) {
  return supabase.from('batch_tracking').select('*').eq('batch_id', batch_id).single();
}
export async function updateBatch(batch_id: string, updates: any) {
  return supabase.from('batch_tracking').update(updates).eq('batch_id', batch_id);
}
export async function listBatches(farmer_id?: string) {
  const query = supabase.from('batch_tracking').select('*');
  return farmer_id ? query.eq('farmer_id', farmer_id) : query;
}
export async function addEventToBatch(batch_id: string, event: any) {
  const { data } = await getBatch(batch_id);
  const events = data?.events || [];
  return updateBatch(batch_id, { events: [...events, event] });
}
export async function getBatchJourney(batch_id: string) {
  const { data } = await getBatch(batch_id);
  return data?.events || [];
}
