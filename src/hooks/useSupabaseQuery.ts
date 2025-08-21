import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

// Generic Supabase query hook
export function useSupabaseQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    gcTime: options?.cacheTime || 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled,
  });
}

// Generic Supabase mutation hook
export function useSupabaseMutation<T, V = unknown>(
  mutationFn: (variables: V) => Promise<T>,
  options?: {
    onSuccess?: (data: T, variables: V) => void;
    onError?: (error: Error, variables: V) => void;
    invalidateQueries?: string[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}

// Profiles
export function useProfile(userId?: string) {
  return useSupabaseQuery(
    ['profile', userId],
    async () => {
      if (!userId) throw new Error('User ID is required');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

export function useUpdateProfile() {
  return useSupabaseMutation(
    async ({ id, updates }: { id: string; updates: Database['public']['Tables']['profiles']['Update'] }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['profile', 'profiles'] }
  );
}

// Farm Tasks
export function useFarmTasks(userId?: string) {
  return useSupabaseQuery(
    ['farm-tasks', userId],
    async () => {
      if (!userId) throw new Error('User ID is required');
      const { data, error } = await supabase
        .from('farm_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

export function useCreateFarmTask() {
  return useSupabaseMutation(
    async (task: Database['public']['Tables']['farm_tasks']['Insert']) => {
      const { data, error } = await supabase
        .from('farm_tasks')
        .insert(task)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['farm-tasks'] }
  );
}

export function useUpdateFarmTask() {
  return useSupabaseMutation(
    async ({ id, updates }: { id: string; updates: Database['public']['Tables']['farm_tasks']['Update'] }) => {
      const { data, error } = await supabase
        .from('farm_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['farm-tasks'] }
  );
}

export function useDeleteFarmTask() {
  return useSupabaseMutation(
    async (id: string) => {
      const { error } = await supabase
        .from('farm_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id };
    },
    { invalidateQueries: ['farm-tasks'] }
  );
}

// Farm Statistics
export function useFarmStatistics(userId?: string) {
  return useSupabaseQuery(
    ['farm-statistics', userId],
    async () => {
      if (!userId) throw new Error('User ID is required');
      const { data, error } = await supabase
        .from('farm_statistics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data[0] || null;
    },
    { enabled: !!userId }
  );
}

export function useUpdateFarmStatistics() {
  return useSupabaseMutation(
    async ({ userId, statistics }: { 
      userId: string; 
      statistics: Database['public']['Tables']['farm_statistics']['Insert'] 
    }) => {
      const { data, error } = await supabase
        .from('farm_statistics')
        .upsert({ ...statistics, user_id: userId })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['farm-statistics'] }
  );
}

// Inventory Items
export function useInventoryItems(userId?: string) {
  return useSupabaseQuery(
    ['inventory-items', userId],
    async () => {
      if (!userId) throw new Error('User ID is required');
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

export function useCreateInventoryItem() {
  return useSupabaseMutation(
    async (item: Database['public']['Tables']['inventory_items']['Insert']) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['inventory-items'] }
  );
}

export function useUpdateInventoryItem() {
  return useSupabaseMutation(
    async ({ id, updates }: { 
      id: string; 
      updates: Database['public']['Tables']['inventory_items']['Update'] 
    }) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['inventory-items'] }
  );
}

export function useDeleteInventoryItem() {
  return useSupabaseMutation(
    async (id: string) => {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id };
    },
    { invalidateQueries: ['inventory-items'] }
  );
}

// Weather Alerts
export function useWeatherAlerts() {
  return useSupabaseQuery(
    ['weather-alerts'],
    async () => {
      const { data, error } = await supabase
        .from('weather_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  );
}

// Notifications
export function useNotifications(userId?: string) {
  return useSupabaseQuery(
    ['notifications', userId],
    async () => {
      if (!userId) throw new Error('User ID is required');
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

export function useMarkNotificationRead() {
  return useSupabaseMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['notifications'] }
  );
}

// Community Posts
export function useCommunityPosts(options?: { category?: string; limit?: number }) {
  return useSupabaseQuery(
    ['community-posts', options?.category, options?.limit],
    async () => {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (options?.category) {
        query = query.eq('category', options.category);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  );
}

export function useCreateCommunityPost() {
  return useSupabaseMutation(
    async (post: Database['public']['Tables']['community_posts']['Insert']) => {
      const { data, error } = await supabase
        .from('community_posts')
        .insert(post)
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['community-posts'] }
  );
}

// Export Opportunities
export function useExportOpportunities() {
  return useSupabaseQuery(
    ['export-opportunities'],
    async () => {
      const { data, error } = await supabase
        .from('export_opportunities')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  );
}

export function useCreateExportOpportunity() {
  return useSupabaseMutation(
    async (opportunity: Database['public']['Tables']['export_opportunities']['Insert']) => {
      const { data, error } = await supabase
        .from('export_opportunities')
        .insert(opportunity)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['export-opportunities'] }
  );
}

// Delivery Requests
export function useDeliveryRequests(userId?: string) {
  return useSupabaseQuery(
    ['delivery-requests', userId],
    async () => {
      if (!userId) throw new Error('User ID is required');
      const { data, error } = await supabase
        .from('delivery_requests')
        .select('*')
        .eq('requester_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
}

export function useCreateDeliveryRequest() {
  return useSupabaseMutation(
    async (request: Database['public']['Tables']['delivery_requests']['Insert']) => {
      const { data, error } = await supabase
        .from('delivery_requests')
        .insert(request)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['delivery-requests'] }
  );
}

// Warehouses
export function useWarehouses() {
  return useSupabaseQuery(
    ['warehouses'],
    async () => {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('availability_status', 'available')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  );
}

// Bulk Orders
export function useBulkOrders() {
  return useSupabaseQuery(
    ['bulk-orders'],
    async () => {
      const { data, error } = await supabase
        .from('bulk_orders')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  );
}

export function useCreateBulkOrder() {
  return useSupabaseMutation(
    async (order: Database['public']['Tables']['bulk_orders']['Insert']) => {
      const { data, error } = await supabase
        .from('bulk_orders')
        .insert(order)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    { invalidateQueries: ['bulk-orders'] }
  );
}

// Contract Farming
export function useContractOpportunities() {
  return useSupabaseQuery(
    ['contract-opportunities'],
    async () => {
      const { data, error } = await supabase
        .from('contract_farming')
        .select(`
          *,
          documents:contract_documents(*),
          reviews:contract_reviews(
            *,
            user:profiles(id, full_name, avatar_url)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  );
}