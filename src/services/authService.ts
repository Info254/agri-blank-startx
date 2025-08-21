
import { supabase } from '@/integrations/supabase/client';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role?: string;
  county?: string;
  contactNumber?: string;
  farmType?: string;
  farmSize?: number;
  experienceYears?: number;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        role: data.role || 'user',
      }
    }
  });

  if (authError) throw authError;

  // Create profile after successful signup
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: data.fullName,
        email: data.email,
        role: data.role || 'user',
        county: data.county,
        contact_number: data.contactNumber,
        farm_type: data.farmType,
        farm_size: data.farmSize,
        experience_years: data.experienceYears,
      });

    if (profileError) throw profileError;
  }

  return authData;
};

export const signIn = async (data: SignInData) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;
  return authData;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentUserProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (updates: Partial<{
  fullName: string;
  county: string;
  contactNumber: string;
  farmType: string;
  farmSize: number;
  experienceYears: number;
  bio: string;
  specialization: string[];
}>) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.fullName,
      county: updates.county,
      contact_number: updates.contactNumber,
      farm_type: updates.farmType,
      farm_size: updates.farmSize,
      experience_years: updates.experienceYears,
      bio: updates.bio,
      specialization: updates.specialization,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
