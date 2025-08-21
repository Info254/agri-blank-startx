import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// Events
export async function createEvent(event: any) {
  return supabase.from('network_events').insert([event]);
}
export async function getEvent(id: string) {
  return supabase.from('network_events').select('*').eq('id', id).single();
}
export async function updateEvent(id: string, updates: any) {
  return supabase.from('network_events').update(updates).eq('id', id);
}
export async function listEvents(type?: string) {
  const query = supabase.from('network_events').select('*');
  return type ? query.eq('type', type) : query;
}

// Partnerships
export async function createPartnership(partnership: any) {
  return supabase.from('partnerships').insert([partnership]);
}
export async function updatePartnership(id: string, updates: any) {
  return supabase.from('partnerships').update(updates).eq('id', id);
}
export async function listPartnerships(org_id?: string) {
  const query = supabase.from('partnerships').select('*');
  return org_id ? query.or(`org1_id.eq.${org_id},org2_id.eq.${org_id}`) : query;
}

// Business Matches
export async function createMatch(match: any) {
  return supabase.from('business_matches').insert([match]);
}
export async function updateMatch(id: string, updates: any) {
  return supabase.from('business_matches').update(updates).eq('id', id);
}
export async function listMatches(business_id?: string) {
  const query = supabase.from('business_matches').select('*');
  return business_id ? query.or(`business1_id.eq.${business_id},business2_id.eq.${business_id}`) : query;
}

// Mentorships
export async function createMentorship(mentorship: any) {
  return supabase.from('mentorships').insert([mentorship]);
}
export async function updateMentorship(id: string, updates: any) {
  return supabase.from('mentorships').update(updates).eq('id', id);
}
export async function listMentorships(user_id?: string) {
  const query = supabase.from('mentorships').select('*');
  return user_id ? query.or(`mentor_id.eq.${user_id},mentee_id.eq.${user_id}`) : query;
}

// Research Requests
export async function createRequest(request: any) {
  return supabase.from('research_requests').insert([request]);
}
export async function updateRequest(id: string, updates: any) {
  return supabase.from('research_requests').update(updates).eq('id', id);
}
export async function listRequests(requester_id?: string) {
  const query = supabase.from('research_requests').select('*');
  return requester_id ? query.eq('requester_id', requester_id) : query;
}
