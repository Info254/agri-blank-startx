import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Type-safe table accessors
export const contractFarming = () => supabase.from('contract_farming');
export const contractDocuments = () => supabase.from('contract_documents');
export const contractReviews = () => supabase.from('contract_reviews');

// Type-safe query builder for contract farming with relations
export const getContractFarmingWithRelations = () => {
  return supabase
    .from('contract_farming')
    .select(`
      *,
      documents:contract_documents(*),
      reviews:contract_reviews(
        *,
        user:profiles(id, full_name, avatar_url)
      )
    `)
    .order('created_at', { ascending: false });
};
