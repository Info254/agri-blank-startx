// FoodRescueService: Handles CRUD and matching for food rescue listings and rescue matches
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function createFoodRescueListing(listing) {
  return supabase.from('food_rescue_listings').insert(listing).select();
}

export async function getFoodRescueListings(filter = {}) {
  return supabase.from('food_rescue_listings').select('*').match(filter);
}

export async function updateFoodRescueListing(id, updates) {
  return supabase.from('food_rescue_listings').update(updates).eq('id', id).select();
}

export async function deleteFoodRescueListing(id) {
  return supabase.from('food_rescue_listings').delete().eq('id', id);
}

export async function createRescueMatch(match) {
  return supabase.from('rescue_matches').insert(match).select();
}

export async function getRescueMatches(filter = {}) {
  return supabase.from('rescue_matches').select('*').match(filter);
}

export async function updateRescueMatch(id, updates) {
  return supabase.from('rescue_matches').update(updates).eq('id', id).select();
}

export async function updateRescueMatchStatus(matchId, status) {
  return supabase.from('rescue_matches').update({ status }).eq('id', matchId).select();
}

// Add notification logic as needed
