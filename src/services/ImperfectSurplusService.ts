// ImperfectSurplusService: Handles CRUD for imperfect surplus produce
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function createImperfectSurplusProduce(produce) {
  return supabase.from('imperfect_surplus_produce').insert(produce).select();
}
export async function getImperfectSurplusProduce(filter = {}) {
  return supabase.from('imperfect_surplus_produce').select('*').match(filter);
}
export async function updateImperfectSurplusProduce(id, updates) {
  return supabase.from('imperfect_surplus_produce').update(updates).eq('id', id).select();
}
export async function deleteImperfectSurplusProduce(id) {
  return supabase.from('imperfect_surplus_produce').delete().eq('id', id);
}
