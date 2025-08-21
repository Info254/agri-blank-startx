import { supabase } from '../lib/supabaseClient';
import { Database } from '../integrations/supabase/types';
// If you get type errors for input_pricing, input_reviews, or input_verifications, regenerate Supabase types.

export async function reportInputPrice(price) {
  return await supabase.from('input_prices' as any).insert(price);


// Deprecated: input_type is not in schema. Remove this function or refactor if needed.
// export async function getInputPrices(input_type, region) {
//   let query = supabase.from('input_prices' as any).select('*');
//   if (input_type) query = query.eq('input_type', input_type);
//   if (region) query = query.eq('region', region);
//   return await query;
// }
}

export async function verifyInputPrice(price_id) {
  return await supabase.from('input_prices').update({ verified: true }).eq('id', price_id);
}

export async function reviewSupplier(review) {
  return await supabase.from('input_supplier_reviews').insert(review);
}

export async function getSupplierReviews(supplier_id) {
  return await supabase.from('input_supplier_reviews').select('*').eq('supplier_id', supplier_id);
}

export async function verifySupplierReview(review_id) {
  return await supabase.from('input_supplier_reviews').update({ verified: true }).eq('id', review_id);
}

// New tables for feature 15
// Input Pricing
// input_pricing: id, product_id, supplier_id, price, date, verified, crowdsource_source
export async function createInputPricing(pricing: {
  product_id: string;
  supplier_id: string;
  price: number;
  date?: string;
  verified?: boolean;
  crowdsource_source?: string;
}) {
  return supabase.from('input_pricing').insert(pricing).select();
}
export async function getInputPricing(filter: Partial<{
  product_id: string;
  supplier_id: string;
  price: number;
  date?: string;
  verified?: boolean;
  crowdsource_source?: string;
}> = {}) {
  return await supabase.from('input_pricing').select('*').match(filter);
}
export async function updateInputPricing(id: string, updates: Partial<{
  product_id: string;
  supplier_id: string;
  price: number;
  date?: string;
  verified?: boolean;
  crowdsource_source?: string;
}>) {
  return supabase.from('input_pricing').update(updates).eq('id', id).select();
}
export async function deleteInputPricing(id: string) {
  return supabase.from('input_pricing').delete().eq('id', id);
}

// Input Reviews
// input_reviews: id, supplier_id, user_id, rating, review_text, date
export async function createInputReview(review) {
  return supabase.from('input_reviews').insert(review).select();
}
export async function getInputReviews(filter = {}) {
  return supabase.from('input_reviews').select('*').match(filter);
}
export async function updateInputReview(id, updates) {
  return supabase.from('input_reviews').update(updates).eq('id', id).select();
}
export async function deleteInputReview(id) {
  return supabase.from('input_reviews').delete().eq('id', id);
}

// Input Verifications
// input_verifications: id, supplier_id, user_id, verification_type, status, date
export async function createInputVerification(verification) {
  return supabase.from('input_verifications').insert(verification).select();
}
export async function getInputVerifications(filter = {}) {
  return supabase.from('input_verifications').select('*').match(filter);
}
export async function updateInputVerification(id, updates) {
  return supabase.from('input_verifications').update(updates).eq('id', id).select();
}
export async function deleteInputVerification(id) {
  return supabase.from('input_verifications').delete().eq('id', id);
}
