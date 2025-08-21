
import { supabase } from "@/integrations/supabase/client";

export interface BarterListing {
  id: string;
  commodity: string;
  quantity: number;
  unit: string;
  description: string;
  imageUrl: string;
  location: string;
  county: string;
  seekingCommodities: string[];
  owner: string;
  ownerRating: number;
  listedDate: string;
  status: string;
  userId: string;
}

export const fetchBarterListings = async (): Promise<BarterListing[]> => {
  try {
    const { data, error } = await supabase
      .from('barter_listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching barter listings:', error);
      return [];
    }

    // Get user profiles separately to avoid relation issues
    const userIds = data?.map(listing => listing.user_id) || [];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds);

    return data?.map(listing => {
      const profile = profiles?.find(p => p.id === listing.user_id);
      return {
        id: listing.id,
        commodity: listing.commodity,
        quantity: Number(listing.quantity),
        unit: listing.unit,
        description: listing.description || '',
        imageUrl: listing.image_urls?.[0] || '/placeholder.svg',
        location: listing.location,
        county: listing.county,
        seekingCommodities: listing.seeking_commodities || [],
        owner: profile?.full_name || 'Anonymous User',
        ownerRating: 4.5, // Default rating, can be improved with reviews
        listedDate: new Date(listing.created_at).toLocaleDateString(),
        status: listing.status,
        userId: listing.user_id
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching barter listings:', error);
    return [];
  }
};

export const createBarterListing = async (listing: Omit<BarterListing, 'id' | 'owner' | 'ownerRating' | 'listedDate' | 'userId'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('barter_listings')
      .insert({
        user_id: user.id,
        commodity: listing.commodity,
        quantity: listing.quantity,
        unit: listing.unit,
        description: listing.description,
        image_urls: listing.imageUrl ? [listing.imageUrl] : [],
        location: listing.location,
        county: listing.county,
        seeking_commodities: listing.seekingCommodities,
        status: listing.status || 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating barter listing:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating barter listing:', error);
    throw error;
  }
};

export const updateBarterListing = async (id: string, updates: Partial<BarterListing>) => {
  try {
    const { data, error } = await supabase
      .from('barter_listings')
      .update({
        commodity: updates.commodity,
        quantity: updates.quantity,
        unit: updates.unit,
        description: updates.description,
        image_urls: updates.imageUrl ? [updates.imageUrl] : undefined,
        location: updates.location,
        county: updates.county,
        seeking_commodities: updates.seekingCommodities,
        status: updates.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating barter listing:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating barter listing:', error);
    throw error;
  }
};

export const deleteBarterListing = async (id: string) => {
  try {
    const { error } = await supabase
      .from('barter_listings')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting barter listing:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting barter listing:', error);
    throw error;
  }
};
