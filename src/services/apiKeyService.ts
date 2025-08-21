
import { supabase } from '@/integrations/supabase/client';

export interface ApiKey {
  id: string;
  name: string;
  key_preview: string;
  is_active: boolean;
  last_used_at?: string;
  created_at: string;
  expires_at?: string;
}

export interface CreateApiKeyResponse {
  message: string;
  api_key: string;
  key_info: {
    id: string;
    name: string;
    preview: string;
    created_at: string;
  };
}

export class ApiKeyService {
  static async getUserApiKeys(): Promise<ApiKey[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('api-keys-management', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (response.error) {
        throw new Error('Failed to fetch API keys');
      }

      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return [];
    }
  }

  static async createApiKey(name: string): Promise<CreateApiKeyResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('api-keys-management', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: { name }
      });

      if (response.error) {
        throw new Error('Failed to create API key');
      }

      return response.data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  }

  static async deleteApiKey(keyId: string): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('api-keys-management', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: { id: keyId }
      });

      if (response.error) {
        throw new Error('Failed to delete API key');
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw error;
    }
  }
}
