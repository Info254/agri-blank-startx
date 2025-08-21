import { Database as GeneratedDatabase } from '@/lib/supabase/database.types';

// Define the database schema types
export type Database = {
  public: {
    Tables: {
      contract_farming: {
        Row: {
          id: string;
          title: string;
          description: string;
          company_name: string;
          location: string;
          crop_type: string;
          contract_duration: string;
          price_per_unit: number | null;
          minimum_quantity: number | null;
          maximum_quantity: number | null;
          unit: string | null;
          requirements: string;
          benefits: string;
          contact_person: string;
          contact_email: string;
          contact_phone: string;
          status: 'active' | 'inactive' | 'completed' | 'cancelled';
          created_by: string;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['contract_farming']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contract_farming']['Row']>;
      };
      contract_documents: {
        Row: {
          id: string;
          opportunity_id: string;
          name: string;
          url: string;
          file_type: string | null;
          created_at: string;
        };
      };
      contract_reviews: {
        Row: {
          id: string;
          opportunity_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          user?: {
            id: string;
            full_name: string | null;
            avatar_url: string | null;
          };
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

// Export types for the tables
export type ContractFarmingRow = Database['public']['Tables']['contract_farming']['Row'];
export type ContractDocumentRow = Database['public']['Tables']['contract_documents']['Row'];
export type ContractReviewRow = Database['public']['Tables']['contract_reviews']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Extended types for the application
export interface ContractFarming extends ContractFarmingRow {
  documents: ContractDocumentRow[];
  reviews: (ContractReviewRow & { user?: ProfileRow })[];
  average_rating: number | null;
  review_count: number;
}

// Type for the Supabase client with our schema
export type SupabaseClient = {
  from: <T extends keyof Database['public']['Tables']>(
    table: T
  ) => {
    select: <K extends keyof Database['public']['Tables'][T]['Row']>(
      columns?: K | K[] | string
    ) => {
      eq: <C extends keyof Database['public']['Tables'][T]['Row']>(
        column: C,
        value: Database['public']['Tables'][T]['Row'][C]
      ) => Promise<{
        data: Database['public']['Tables'][T]['Row'][] | null;
        error: any;
      }>;
      in: <C extends keyof Database['public']['Tables'][T]['Row']>(
        column: C,
        values: Database['public']['Tables'][T]['Row'][C][]
      ) => Promise<{
        data: Database['public']['Tables'][T]['Row'][] | null;
        error: any;
      }>;
      order: <C extends keyof Database['public']['Tables'][T]['Row']>(
        column: C,
        options?: { ascending?: boolean }
      ) => Promise<{
        data: Database['public']['Tables'][T]['Row'][] | null;
        error: any;
      }>;
    };
  };
};
