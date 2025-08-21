export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_action_logs: {
        Row: {
          action_timestamp: string | null
          action_type: string
          id: number
          table_name: string
          user_id: string | null
        }
        Insert: {
          action_timestamp?: string | null
          action_type: string
          id?: number
          table_name: string
          user_id?: string | null
        }
        Update: {
          action_timestamp?: string | null
          action_type?: string
          id?: number
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          created_at: string | null
          id: string
          market_id: string | null
          profile_info: string | null
          role: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_id?: string | null
          profile_info?: string | null
          role: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          market_id?: string | null
          profile_info?: string | null
          role?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      aggregators: {
        Row: {
          aggregator_name: string
          business_type: string
          certifications: string[] | null
          collection_points: string[] | null
          commission_rate_percent: number | null
          commodities_handled: string[]
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates: Json | null
          county: string
          created_at: string
          farmers_network_size: number | null
          has_cold_storage: boolean | null
          has_drying_facilities: boolean | null
          has_packaging_facilities: boolean | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          minimum_quantity_tons: number | null
          payment_terms: string[] | null
          physical_address: string
          pricing_model: string | null
          rating: number | null
          registration_number: string | null
          service_radius_km: number | null
          storage_capacity_tons: number | null
          sub_county: string | null
          total_transactions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aggregator_name: string
          business_type?: string
          certifications?: string[] | null
          collection_points?: string[] | null
          commission_rate_percent?: number | null
          commodities_handled: string[]
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates?: Json | null
          county: string
          created_at?: string
          farmers_network_size?: number | null
          has_cold_storage?: boolean | null
          has_drying_facilities?: boolean | null
          has_packaging_facilities?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_quantity_tons?: number | null
          payment_terms?: string[] | null
          physical_address: string
          pricing_model?: string | null
          rating?: number | null
          registration_number?: string | null
          service_radius_km?: number | null
          storage_capacity_tons?: number | null
          sub_county?: string | null
          total_transactions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aggregator_name?: string
          business_type?: string
          certifications?: string[] | null
          collection_points?: string[] | null
          commission_rate_percent?: number | null
          commodities_handled?: string[]
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          coordinates?: Json | null
          county?: string
          created_at?: string
          farmers_network_size?: number | null
          has_cold_storage?: boolean | null
          has_drying_facilities?: boolean | null
          has_packaging_facilities?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_quantity_tons?: number | null
          payment_terms?: string[] | null
          physical_address?: string
          pricing_model?: string | null
          rating?: number | null
          registration_number?: string | null
          service_radius_km?: number | null
          storage_capacity_tons?: number | null
          sub_county?: string | null
          total_transactions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      animal_health: {
        Row: {
          animal_id: string | null
          health_status: string
          id: string
          notes: string | null
          recorded_at: string | null
        }
        Insert: {
          animal_id?: string | null
          health_status: string
          id?: string
          notes?: string | null
          recorded_at?: string | null
        }
        Update: {
          animal_id?: string | null
          health_status?: string
          id?: string
          notes?: string | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_health_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_records: {
        Row: {
          animal_id: string | null
          created_at: string | null
          description: string | null
          id: string
          record_date: string
          record_type: string
        }
        Insert: {
          animal_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          record_date: string
          record_type: string
        }
        Update: {
          animal_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          record_date?: string
          record_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_sales: {
        Row: {
          animal_id: string | null
          buyer: string | null
          created_at: string | null
          id: string
          notes: string | null
          price: number | null
          sale_date: string
        }
        Insert: {
          animal_id?: string | null
          buyer?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          price?: number | null
          sale_date: string
        }
        Update: {
          animal_id?: string | null
          buyer?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          price?: number | null
          sale_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_sales_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          acquisition_date: string | null
          birth_date: string | null
          breed: string | null
          created_at: string | null
          id: string
          name: string
          species: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          acquisition_date?: string | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string | null
          id?: string
          name: string
          species: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          acquisition_date?: string | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string | null
          id?: string
          name?: string
          species?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_preview: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_preview: string
          last_used_at?: string | null
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_preview?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number | null
          status_code: number
          user_agent: string | null
          user_id: string
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code: number
          user_agent?: string | null
          user_id: string
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code?: number
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      barter_listings: {
        Row: {
          commodity: string
          county: string
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          location: string
          quantity: number
          seeking_commodities: string[]
          status: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commodity: string
          county: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          location: string
          quantity: number
          seeking_commodities: string[]
          status?: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commodity?: string
          county?: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          location?: string
          quantity?: number
          seeking_commodities?: string[]
          status?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      batch_tracking: {
        Row: {
          batch_id: string
          created_at: string | null
          destination: string | null
          events: Json | null
          farmer_id: string | null
          origin: string | null
          product_type: string | null
          quantity: number | null
          status: string | null
        }
        Insert: {
          batch_id?: string
          created_at?: string | null
          destination?: string | null
          events?: Json | null
          farmer_id?: string | null
          origin?: string | null
          product_type?: string | null
          quantity?: number | null
          status?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          destination?: string | null
          events?: Json | null
          farmer_id?: string | null
          origin?: string | null
          product_type?: string | null
          quantity?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_tracking_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_order_bids: {
        Row: {
          created_at: string | null
          farmer_id: string | null
          id: string
          order_id: string | null
          price: number
          quality_offer: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          farmer_id?: string | null
          id?: string
          order_id?: string | null
          price: number
          quality_offer?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          farmer_id?: string | null
          id?: string
          order_id?: string | null
          price?: number
          quality_offer?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_order_bids_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_order_bids_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "bulk_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_orders: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          delivery_date: string | null
          id: string
          produce_type: string
          quality: string | null
          quantity: number
          status: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          produce_type: string
          quality?: string | null
          quantity: number
          status?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          produce_type?: string
          quality?: string | null
          quantity?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      business_advertisements: {
        Row: {
          ad_content: string
          amount_paid: number | null
          business_category: string
          business_description: string
          business_name: string
          clicks_count: number | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          expires_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          payment_id: string | null
          payment_status: string | null
          target_audience: string[] | null
          updated_at: string
          user_id: string | null
          views_count: number | null
          website_url: string | null
        }
        Insert: {
          ad_content: string
          amount_paid?: number | null
          business_category: string
          business_description: string
          business_name: string
          clicks_count?: number | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          payment_id?: string | null
          payment_status?: string | null
          target_audience?: string[] | null
          updated_at?: string
          user_id?: string | null
          views_count?: number | null
          website_url?: string | null
        }
        Update: {
          ad_content?: string
          amount_paid?: number | null
          business_category?: string
          business_description?: string
          business_name?: string
          clicks_count?: number | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          payment_id?: string | null
          payment_status?: string | null
          target_audience?: string[] | null
          updated_at?: string
          user_id?: string | null
          views_count?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      business_matches: {
        Row: {
          business1_id: string | null
          business2_id: string | null
          created_at: string | null
          id: string
          match_type: string | null
          status: string | null
        }
        Insert: {
          business1_id?: string | null
          business2_id?: string | null
          created_at?: string | null
          id?: string
          match_type?: string | null
          status?: string | null
        }
        Update: {
          business1_id?: string | null
          business2_id?: string | null
          created_at?: string | null
          id?: string
          match_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      carbon_forum_posts: {
        Row: {
          content: string | null
          created_at: string | null
          event_date: string | null
          id: string
          org_link: string | null
          success_story: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          event_date?: string | null
          id?: string
          org_link?: string | null
          success_story?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          event_date?: string | null
          id?: string
          org_link?: string | null
          success_story?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      city_market_auctions: {
        Row: {
          auction_end: string
          auction_start: string
          created_at: string | null
          current_bid: number | null
          id: string
          product_id: string
          starting_price: number
          status: string | null
          winner_user_id: string | null
        }
        Insert: {
          auction_end: string
          auction_start: string
          created_at?: string | null
          current_bid?: number | null
          id?: string
          product_id: string
          starting_price: number
          status?: string | null
          winner_user_id?: string | null
        }
        Update: {
          auction_end?: string
          auction_start?: string
          created_at?: string | null
          current_bid?: number | null
          id?: string
          product_id?: string
          starting_price?: number
          status?: string | null
          winner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "city_market_auctions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "city_market_products"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_ban_recommendations: {
        Row: {
          created_at: string | null
          id: string
          market_id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_id: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          market_id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_market_ban_recommendations_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_bids: {
        Row: {
          auction_id: string
          bid_amount: number
          bid_time: string | null
          bidder_user_id: string
          id: string
        }
        Insert: {
          auction_id: string
          bid_amount: number
          bid_time?: string | null
          bidder_user_id: string
          id?: string
        }
        Update: {
          auction_id?: string
          bid_amount?: number
          bid_time?: string | null
          bidder_user_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_market_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "city_market_auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          market_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          market_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          market_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_market_comments_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_donations: {
        Row: {
          agent_id: string | null
          donated_at: string | null
          home_id: string | null
          id: string
          product_id: string | null
          recipient_id: string | null
          recipient_type: string | null
        }
        Insert: {
          agent_id?: string | null
          donated_at?: string | null
          home_id?: string | null
          id?: string
          product_id?: string | null
          recipient_id?: string | null
          recipient_type?: string | null
        }
        Update: {
          agent_id?: string | null
          donated_at?: string | null
          home_id?: string | null
          id?: string
          product_id?: string | null
          recipient_id?: string | null
          recipient_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "city_market_donations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_market_donations_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_market_donations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "city_market_products"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_flags: {
        Row: {
          created_at: string | null
          id: string
          market_id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_id: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          market_id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_market_flags_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_likes: {
        Row: {
          created_at: string | null
          id: string
          market_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          market_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_market_likes_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_products: {
        Row: {
          auction_status: string | null
          category: string | null
          created_at: string | null
          id: string
          market_id: string
          price: number
          product_type: string
          quantity: number
          seller_user_id: string
          status: string | null
        }
        Insert: {
          auction_status?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          market_id: string
          price: number
          product_type: string
          quantity: number
          seller_user_id: string
          status?: string | null
        }
        Update: {
          auction_status?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          market_id?: string
          price?: number
          product_type?: string
          quantity?: number
          seller_user_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "city_market_products_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          market_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          market_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          market_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_market_ratings_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      city_markets: {
        Row: {
          average_daily_buyers: number | null
          average_daily_traders: number | null
          city: string
          commodities_traded: string[]
          contact_email: string | null
          contact_phone: string | null
          coordinates: Json
          county: string
          created_at: string
          established_year: number | null
          facilities: string[] | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          market_authority: string | null
          market_fee_structure: Json | null
          market_name: string
          market_type: string
          operating_days: string[]
          operating_hours: string
          physical_address: string
          social_media: Json | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          average_daily_buyers?: number | null
          average_daily_traders?: number | null
          city: string
          commodities_traded: string[]
          contact_email?: string | null
          contact_phone?: string | null
          coordinates: Json
          county: string
          created_at?: string
          established_year?: number | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          market_authority?: string | null
          market_fee_structure?: Json | null
          market_name: string
          market_type: string
          operating_days: string[]
          operating_hours: string
          physical_address: string
          social_media?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          average_daily_buyers?: number | null
          average_daily_traders?: number | null
          city?: string
          commodities_traded?: string[]
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: Json
          county?: string
          created_at?: string
          established_year?: number | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          market_authority?: string | null
          market_fee_structure?: Json | null
          market_name?: string
          market_type?: string
          operating_days?: string[]
          operating_hours?: string
          physical_address?: string
          social_media?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      collaboration_messages: {
        Row: {
          attachment_urls: string[] | null
          collaboration_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message_content: string
          message_type: string | null
          sender_id: string
          sender_type: string
        }
        Insert: {
          attachment_urls?: string[] | null
          collaboration_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_content: string
          message_type?: string | null
          sender_id: string
          sender_type: string
        }
        Update: {
          attachment_urls?: string[] | null
          collaboration_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_content?: string
          message_type?: string | null
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_messages_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "farmer_exporter_collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_proposals: {
        Row: {
          collaboration_id: string
          created_at: string
          delivery_terms: string | null
          documentation_fee: number | null
          export_timeline: string | null
          exporter_id: string
          exporter_notes: string | null
          farmer_response: string | null
          id: string
          logistics_fee: number | null
          market_destination: string[] | null
          payment_terms: string | null
          proposal_status: string | null
          proposal_type: string
          proposed_price_per_unit: number | null
          proposed_total_value: number | null
          quality_requirements: string[] | null
          service_fees: number | null
          services_included: string[] | null
          terms_and_conditions: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          collaboration_id: string
          created_at?: string
          delivery_terms?: string | null
          documentation_fee?: number | null
          export_timeline?: string | null
          exporter_id: string
          exporter_notes?: string | null
          farmer_response?: string | null
          id?: string
          logistics_fee?: number | null
          market_destination?: string[] | null
          payment_terms?: string | null
          proposal_status?: string | null
          proposal_type: string
          proposed_price_per_unit?: number | null
          proposed_total_value?: number | null
          quality_requirements?: string[] | null
          service_fees?: number | null
          services_included?: string[] | null
          terms_and_conditions?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          collaboration_id?: string
          created_at?: string
          delivery_terms?: string | null
          documentation_fee?: number | null
          export_timeline?: string | null
          exporter_id?: string
          exporter_notes?: string | null
          farmer_response?: string | null
          id?: string
          logistics_fee?: number | null
          market_destination?: string[] | null
          payment_terms?: string | null
          proposal_status?: string | null
          proposal_type?: string
          proposed_price_per_unit?: number | null
          proposed_total_value?: number | null
          quality_requirements?: string[] | null
          service_fees?: number | null
          services_included?: string[] | null
          terms_and_conditions?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_proposals_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "farmer_exporter_collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      community_polls: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean | null
          options: Json
          post_id: string | null
          question: string
          total_votes: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          options: Json
          post_id?: string | null
          question: string
          total_votes?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          post_id?: string | null
          question?: string
          total_votes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          likes_count: number | null
          location: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          location?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          location?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crop_tracking: {
        Row: {
          actual_harvest_date: string | null
          actual_yield: number | null
          created_at: string
          crop_name: string
          estimated_yield: number | null
          expected_harvest_date: string | null
          fertilizer_applied: Json | null
          growth_stage: string | null
          id: string
          irrigation_schedule: Json | null
          notes: string | null
          parcel_id: string | null
          pesticides_applied: Json | null
          planted_area: number
          planting_date: string
          quality_grade: string | null
          seeds_used: number | null
          updated_at: string
          user_id: string
          variety: string | null
        }
        Insert: {
          actual_harvest_date?: string | null
          actual_yield?: number | null
          created_at?: string
          crop_name: string
          estimated_yield?: number | null
          expected_harvest_date?: string | null
          fertilizer_applied?: Json | null
          growth_stage?: string | null
          id?: string
          irrigation_schedule?: Json | null
          notes?: string | null
          parcel_id?: string | null
          pesticides_applied?: Json | null
          planted_area: number
          planting_date: string
          quality_grade?: string | null
          seeds_used?: number | null
          updated_at?: string
          user_id: string
          variety?: string | null
        }
        Update: {
          actual_harvest_date?: string | null
          actual_yield?: number | null
          created_at?: string
          crop_name?: string
          estimated_yield?: number | null
          expected_harvest_date?: string | null
          fertilizer_applied?: Json | null
          growth_stage?: string | null
          id?: string
          irrigation_schedule?: Json | null
          notes?: string | null
          parcel_id?: string | null
          pesticides_applied?: Json | null
          planted_area?: number
          planting_date?: string
          quality_grade?: string | null
          seeds_used?: number | null
          updated_at?: string
          user_id?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_tracking_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "farm_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_yields: {
        Row: {
          actual_yield: number | null
          created_at: string | null
          crop_type: string
          expected_yield: number | null
          id: string
          notes: string | null
          planting_date: string
          updated_at: string | null
          user_id: string | null
          yield_improvement: number | null
        }
        Insert: {
          actual_yield?: number | null
          created_at?: string | null
          crop_type: string
          expected_yield?: number | null
          id?: string
          notes?: string | null
          planting_date: string
          updated_at?: string | null
          user_id?: string | null
          yield_improvement?: number | null
        }
        Update: {
          actual_yield?: number | null
          created_at?: string | null
          crop_type?: string
          expected_yield?: number | null
          id?: string
          notes?: string | null
          planting_date?: string
          updated_at?: string | null
          user_id?: string | null
          yield_improvement?: number | null
        }
        Relationships: []
      }
      data_fetch_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          records_count: number | null
          source: string
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          records_count?: number | null
          source: string
          status: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          records_count?: number | null
          source?: string
          status?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          available_for: string[]
          category: string
          contact_email: string | null
          contact_phone: string | null
          county: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          owner_id: string | null
          price: number | null
          updated_at: string | null
        }
        Insert: {
          available_for: string[]
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          owner_id?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          available_for?: string[]
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          owner_id?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment_ban_recommendations: {
        Row: {
          created_at: string | null
          equipment_id: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          equipment_id: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          equipment_id?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_ban_recommendations_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_bookmarks: {
        Row: {
          created_at: string | null
          equipment_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          equipment_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          equipment_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_bookmarks_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_flags: {
        Row: {
          created_at: string | null
          equipment_id: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          equipment_id: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          equipment_id?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_flags_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_likes: {
        Row: {
          created_at: string | null
          equipment_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          equipment_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          equipment_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_likes_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          equipment_id: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          equipment_id: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          equipment_id?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_ratings_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      export_documentation: {
        Row: {
          created_at: string | null
          document_type: string
          export_opportunity_id: string | null
          file_url: string | null
          id: string
          required: boolean | null
          status: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          export_opportunity_id?: string | null
          file_url?: string | null
          id?: string
          required?: boolean | null
          status?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          export_opportunity_id?: string | null
          file_url?: string | null
          id?: string
          required?: boolean | null
          status?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_documentation_export_opportunity_id_fkey"
            columns: ["export_opportunity_id"]
            isOneToOne: false
            referencedRelation: "export_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      export_opportunities: {
        Row: {
          buyer_name: string
          created_at: string | null
          created_by: string | null
          crop_type: string
          delivery_terms: string | null
          destination_country: string
          id: string
          min_order_quantity: number | null
          payment_terms: string | null
          price_per_ton: number | null
          quantity_tons: number
          required_certifications: string[] | null
          specifications: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_name: string
          created_at?: string | null
          created_by?: string | null
          crop_type: string
          delivery_terms?: string | null
          destination_country: string
          id?: string
          min_order_quantity?: number | null
          payment_terms?: string | null
          price_per_ton?: number | null
          quantity_tons: number
          required_certifications?: string[] | null
          specifications?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_name?: string
          created_at?: string | null
          created_by?: string | null
          crop_type?: string
          delivery_terms?: string | null
          destination_country?: string
          id?: string
          min_order_quantity?: number | null
          payment_terms?: string | null
          price_per_ton?: number | null
          quantity_tons?: number
          required_certifications?: string[] | null
          specifications?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      export_orders: {
        Row: {
          consolidation_id: string | null
          created_at: string | null
          created_by: string | null
          export_opportunity_id: string | null
          id: string
          shipping_date: string | null
          status: string | null
          tracking_link: string | null
          transporter_id: string | null
          updated_at: string | null
        }
        Insert: {
          consolidation_id?: string | null
          created_at?: string | null
          created_by?: string | null
          export_opportunity_id?: string | null
          id?: string
          shipping_date?: string | null
          status?: string | null
          tracking_link?: string | null
          transporter_id?: string | null
          updated_at?: string | null
        }
        Update: {
          consolidation_id?: string | null
          created_at?: string | null
          created_by?: string | null
          export_opportunity_id?: string | null
          id?: string
          shipping_date?: string | null
          status?: string | null
          tracking_link?: string | null
          transporter_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_orders_consolidation_id_fkey"
            columns: ["consolidation_id"]
            isOneToOne: false
            referencedRelation: "farmer_consolidations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "export_orders_export_opportunity_id_fkey"
            columns: ["export_opportunity_id"]
            isOneToOne: false
            referencedRelation: "export_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      exporter_profiles: {
        Row: {
          business_license_number: string | null
          certifications: string[] | null
          commodities_handled: string[]
          company_description: string | null
          company_name: string
          company_registration_number: string | null
          contact_email: string
          contact_person_name: string
          contact_phone: string
          created_at: string
          documentation_services: boolean | null
          export_license_number: string | null
          export_markets: string[]
          financing_services: boolean | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          logistics_services: boolean | null
          maximum_quantity_tons: number | null
          minimum_quantity_tons: number | null
          office_coordinates: Json | null
          office_county: string
          office_location: string
          quality_assurance_services: boolean | null
          rating: number | null
          services_offered: string[]
          successful_exports: number | null
          total_collaborations: number | null
          updated_at: string
          user_id: string
          verification_documents: string[] | null
          website_url: string | null
          years_in_business: number | null
        }
        Insert: {
          business_license_number?: string | null
          certifications?: string[] | null
          commodities_handled: string[]
          company_description?: string | null
          company_name: string
          company_registration_number?: string | null
          contact_email: string
          contact_person_name: string
          contact_phone: string
          created_at?: string
          documentation_services?: boolean | null
          export_license_number?: string | null
          export_markets: string[]
          financing_services?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logistics_services?: boolean | null
          maximum_quantity_tons?: number | null
          minimum_quantity_tons?: number | null
          office_coordinates?: Json | null
          office_county: string
          office_location: string
          quality_assurance_services?: boolean | null
          rating?: number | null
          services_offered: string[]
          successful_exports?: number | null
          total_collaborations?: number | null
          updated_at?: string
          user_id: string
          verification_documents?: string[] | null
          website_url?: string | null
          years_in_business?: number | null
        }
        Update: {
          business_license_number?: string | null
          certifications?: string[] | null
          commodities_handled?: string[]
          company_description?: string | null
          company_name?: string
          company_registration_number?: string | null
          contact_email?: string
          contact_person_name?: string
          contact_phone?: string
          created_at?: string
          documentation_services?: boolean | null
          export_license_number?: string | null
          export_markets?: string[]
          financing_services?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logistics_services?: boolean | null
          maximum_quantity_tons?: number | null
          minimum_quantity_tons?: number | null
          office_coordinates?: Json | null
          office_county?: string
          office_location?: string
          quality_assurance_services?: boolean | null
          rating?: number | null
          services_offered?: string[]
          successful_exports?: number | null
          total_collaborations?: number | null
          updated_at?: string
          user_id?: string
          verification_documents?: string[] | null
          website_url?: string | null
          years_in_business?: number | null
        }
        Relationships: []
      }
      exporter_reviews: {
        Row: {
          collaboration_id: string | null
          communication_rating: number | null
          created_at: string
          documentation_quality_rating: number | null
          export_successful: boolean | null
          exporter_id: string
          farmer_id: string
          id: string
          rating: number
          review_text: string | null
          review_title: string | null
          services_used: string[] | null
          timeline_adherence_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          collaboration_id?: string | null
          communication_rating?: number | null
          created_at?: string
          documentation_quality_rating?: number | null
          export_successful?: boolean | null
          exporter_id: string
          farmer_id: string
          id?: string
          rating: number
          review_text?: string | null
          review_title?: string | null
          services_used?: string[] | null
          timeline_adherence_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          collaboration_id?: string | null
          communication_rating?: number | null
          created_at?: string
          documentation_quality_rating?: number | null
          export_successful?: boolean | null
          exporter_id?: string
          farmer_id?: string
          id?: string
          rating?: number
          review_text?: string | null
          review_title?: string | null
          services_used?: string[] | null
          timeline_adherence_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "exporter_reviews_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "farmer_exporter_collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_budgets: {
        Row: {
          actual_amount: number | null
          category: string
          created_at: string | null
          id: string
          notes: string | null
          planned_amount: number
          subcategory: string | null
          updated_at: string | null
          user_id: string
          year: number
        }
        Insert: {
          actual_amount?: number | null
          category: string
          created_at?: string | null
          id?: string
          notes?: string | null
          planned_amount: number
          subcategory?: string | null
          updated_at?: string | null
          user_id: string
          year: number
        }
        Update: {
          actual_amount?: number | null
          category?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          planned_amount?: number
          subcategory?: string | null
          updated_at?: string | null
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      farm_input_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      farm_input_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "farm_input_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_input_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "farm_input_products"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_orders: {
        Row: {
          actual_delivery_date: string | null
          buyer_email: string | null
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          created_at: string
          delivery_address: string | null
          delivery_coordinates: Json | null
          delivery_county: string | null
          delivery_method: string
          id: string
          order_notes: string | null
          order_number: string
          order_status: string
          payment_method: string | null
          payment_status: string
          requested_delivery_date: string | null
          special_instructions: string | null
          supplier_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          actual_delivery_date?: string | null
          buyer_email?: string | null
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          created_at?: string
          delivery_address?: string | null
          delivery_coordinates?: Json | null
          delivery_county?: string | null
          delivery_method: string
          id?: string
          order_notes?: string | null
          order_number?: string
          order_status?: string
          payment_method?: string | null
          payment_status?: string
          requested_delivery_date?: string | null
          special_instructions?: string | null
          supplier_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          actual_delivery_date?: string | null
          buyer_email?: string | null
          buyer_id?: string
          buyer_name?: string
          buyer_phone?: string
          created_at?: string
          delivery_address?: string | null
          delivery_coordinates?: Json | null
          delivery_county?: string | null
          delivery_method?: string
          id?: string
          order_notes?: string | null
          order_number?: string
          order_status?: string
          payment_method?: string | null
          payment_status?: string
          requested_delivery_date?: string | null
          special_instructions?: string | null
          supplier_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_product_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_product_bookmarks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "farm_input_products"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_product_likes: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_product_likes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "farm_input_products"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_product_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_product_ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "farm_input_products"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_products: {
        Row: {
          batch_number: string | null
          brand_name: string | null
          category_id: string | null
          country_of_origin: string | null
          created_at: string
          expiry_date: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          is_available: boolean | null
          manufacturer: string | null
          minimum_order_quantity: number | null
          organic_certified: boolean | null
          price_per_unit: number
          product_category: string
          product_description: string | null
          product_name: string
          product_subcategory: string | null
          restock_level: number | null
          specifications: Json | null
          stock_quantity: number | null
          supplier_id: string
          unit_of_measure: string
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          brand_name?: string | null
          category_id?: string | null
          country_of_origin?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          manufacturer?: string | null
          minimum_order_quantity?: number | null
          organic_certified?: boolean | null
          price_per_unit: number
          product_category: string
          product_description?: string | null
          product_name: string
          product_subcategory?: string | null
          restock_level?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          supplier_id: string
          unit_of_measure: string
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          brand_name?: string | null
          category_id?: string | null
          country_of_origin?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          manufacturer?: string | null
          minimum_order_quantity?: number | null
          organic_certified?: boolean | null
          price_per_unit?: number
          product_category?: string
          product_description?: string | null
          product_name?: string
          product_subcategory?: string | null
          restock_level?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          supplier_id?: string
          unit_of_measure?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "farm_input_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_input_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_supplier_likes: {
        Row: {
          created_at: string | null
          id: string
          supplier_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          supplier_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          supplier_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_supplier_likes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_supplier_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          supplier_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          supplier_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          supplier_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_supplier_ratings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_suppliers: {
        Row: {
          average_delivery_days: number | null
          business_registration_number: string | null
          certifications: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at: string
          delivery_radius_km: number | null
          delivery_terms: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          minimum_order_value: number | null
          payment_terms: string[] | null
          physical_address: string
          rating: number | null
          specialization: string[]
          sub_county: string | null
          supplier_name: string
          total_orders: number | null
          updated_at: string
          user_id: string
          years_in_business: number | null
        }
        Insert: {
          average_delivery_days?: number | null
          business_registration_number?: string | null
          certifications?: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at?: string
          delivery_radius_km?: number | null
          delivery_terms?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_order_value?: number | null
          payment_terms?: string[] | null
          physical_address: string
          rating?: number | null
          specialization: string[]
          sub_county?: string | null
          supplier_name: string
          total_orders?: number | null
          updated_at?: string
          user_id: string
          years_in_business?: number | null
        }
        Update: {
          average_delivery_days?: number | null
          business_registration_number?: string | null
          certifications?: string[] | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          county?: string
          created_at?: string
          delivery_radius_km?: number | null
          delivery_terms?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_order_value?: number | null
          payment_terms?: string[] | null
          physical_address?: string
          rating?: number | null
          specialization?: string[]
          sub_county?: string | null
          supplier_name?: string
          total_orders?: number | null
          updated_at?: string
          user_id?: string
          years_in_business?: number | null
        }
        Relationships: []
      }
      farm_parcels: {
        Row: {
          coordinates: Json | null
          created_at: string
          current_crop: string | null
          expected_harvest: string | null
          id: string
          irrigation_system: string | null
          is_active: boolean | null
          notes: string | null
          parcel_name: string
          planting_date: string | null
          size_acres: number
          slope_type: string | null
          soil_type: string | null
          updated_at: string
          user_id: string
          water_source: string | null
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          current_crop?: string | null
          expected_harvest?: string | null
          id?: string
          irrigation_system?: string | null
          is_active?: boolean | null
          notes?: string | null
          parcel_name: string
          planting_date?: string | null
          size_acres: number
          slope_type?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id: string
          water_source?: string | null
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          current_crop?: string | null
          expected_harvest?: string | null
          id?: string
          irrigation_system?: string | null
          is_active?: boolean | null
          notes?: string | null
          parcel_name?: string
          planting_date?: string | null
          size_acres?: number
          slope_type?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id?: string
          water_source?: string | null
        }
        Relationships: []
      }
      farm_statistics: {
        Row: {
          active_alerts: number | null
          average_yield: number | null
          created_at: string
          id: string
          monthly_revenue: number | null
          total_area: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_alerts?: number | null
          average_yield?: number | null
          created_at?: string
          id?: string
          monthly_revenue?: number | null
          total_area?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_alerts?: number | null
          average_yield?: number | null
          created_at?: string
          id?: string
          monthly_revenue?: number | null
          total_area?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_tasks: {
        Row: {
          created_at: string
          crop: string
          date: string
          description: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop: string
          date: string
          description?: string | null
          id?: string
          priority: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop?: string
          date?: string
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farmer_consolidations: {
        Row: {
          consolidator_id: string | null
          created_at: string | null
          export_opportunity_id: string | null
          farmer_ids: string[] | null
          id: string
          status: string | null
          total_quantity_tons: number | null
          updated_at: string | null
        }
        Insert: {
          consolidator_id?: string | null
          created_at?: string | null
          export_opportunity_id?: string | null
          farmer_ids?: string[] | null
          id?: string
          status?: string | null
          total_quantity_tons?: number | null
          updated_at?: string | null
        }
        Update: {
          consolidator_id?: string | null
          created_at?: string | null
          export_opportunity_id?: string | null
          farmer_ids?: string[] | null
          id?: string
          status?: string | null
          total_quantity_tons?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farmer_consolidations_export_opportunity_id_fkey"
            columns: ["export_opportunity_id"]
            isOneToOne: false
            referencedRelation: "export_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_contract_members: {
        Row: {
          contract_network_id: string | null
          farmer_id: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
        }
        Insert: {
          contract_network_id?: string | null
          farmer_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
        }
        Update: {
          contract_network_id?: string | null
          farmer_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farmer_contract_members_contract_network_id_fkey"
            columns: ["contract_network_id"]
            isOneToOne: false
            referencedRelation: "farmer_contract_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_contract_networks: {
        Row: {
          bargaining_terms: string | null
          contract_title: string
          created_at: string | null
          description: string | null
          id: string
          input_purchasing_terms: string | null
          lead_farmer_id: string | null
          mentorship_terms: string | null
          updated_at: string | null
        }
        Insert: {
          bargaining_terms?: string | null
          contract_title: string
          created_at?: string | null
          description?: string | null
          id?: string
          input_purchasing_terms?: string | null
          lead_farmer_id?: string | null
          mentorship_terms?: string | null
          updated_at?: string | null
        }
        Update: {
          bargaining_terms?: string | null
          contract_title?: string
          created_at?: string | null
          description?: string | null
          id?: string
          input_purchasing_terms?: string | null
          lead_farmer_id?: string | null
          mentorship_terms?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      farmer_exporter_collaborations: {
        Row: {
          availability_period: string | null
          collaboration_status: string
          collaboration_type: string | null
          commodity_name: string
          commodity_variety: string | null
          created_at: string
          documentation_needs: string[] | null
          estimated_quantity: number
          expires_at: string | null
          exporter_id: string | null
          farm_size_acres: number | null
          farmer_certifications: string[] | null
          farmer_coordinates: Json | null
          farmer_county: string
          farmer_email: string | null
          farmer_experience_years: number | null
          farmer_id: string
          farmer_location: string
          farmer_name: string
          farmer_phone: string
          farmer_profile_description: string | null
          harvest_date: string | null
          has_export_documentation: boolean | null
          id: string
          is_active: boolean | null
          notes: string | null
          pricing_expectations: string | null
          quality_grade: string | null
          special_requirements: string[] | null
          target_markets: string[] | null
          unit: string
          updated_at: string
        }
        Insert: {
          availability_period?: string | null
          collaboration_status?: string
          collaboration_type?: string | null
          commodity_name: string
          commodity_variety?: string | null
          created_at?: string
          documentation_needs?: string[] | null
          estimated_quantity: number
          expires_at?: string | null
          exporter_id?: string | null
          farm_size_acres?: number | null
          farmer_certifications?: string[] | null
          farmer_coordinates?: Json | null
          farmer_county: string
          farmer_email?: string | null
          farmer_experience_years?: number | null
          farmer_id: string
          farmer_location: string
          farmer_name: string
          farmer_phone: string
          farmer_profile_description?: string | null
          harvest_date?: string | null
          has_export_documentation?: boolean | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          pricing_expectations?: string | null
          quality_grade?: string | null
          special_requirements?: string[] | null
          target_markets?: string[] | null
          unit?: string
          updated_at?: string
        }
        Update: {
          availability_period?: string | null
          collaboration_status?: string
          collaboration_type?: string | null
          commodity_name?: string
          commodity_variety?: string | null
          created_at?: string
          documentation_needs?: string[] | null
          estimated_quantity?: number
          expires_at?: string | null
          exporter_id?: string | null
          farm_size_acres?: number | null
          farmer_certifications?: string[] | null
          farmer_coordinates?: Json | null
          farmer_county?: string
          farmer_email?: string | null
          farmer_experience_years?: number | null
          farmer_id?: string
          farmer_location?: string
          farmer_name?: string
          farmer_phone?: string
          farmer_profile_description?: string | null
          harvest_date?: string | null
          has_export_documentation?: boolean | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          pricing_expectations?: string | null
          quality_grade?: string | null
          special_requirements?: string[] | null
          target_markets?: string[] | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      farmer_financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          id: string
          payment_method: string | null
          receipt_url: string | null
          reference_number: string | null
          transaction_date: string | null
          transaction_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          transaction_date?: string | null
          transaction_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          transaction_date?: string | null
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      farmer_inventory: {
        Row: {
          category: string
          created_at: string | null
          expiry_date: string | null
          id: string
          item_name: string
          location: string | null
          notes: string | null
          quantity: number
          status: string | null
          total_value: number | null
          unit: string | null
          unit_price: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          item_name: string
          location?: string | null
          notes?: string | null
          quantity?: number
          status?: string | null
          total_value?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          item_name?: string
          location?: string | null
          notes?: string | null
          quantity?: number
          status?: string | null
          total_value?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feature_requests: {
        Row: {
          admin_comment: string | null
          created_at: string | null
          description: string
          email: string | null
          id: string
          is_public: boolean
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          admin_comment?: string | null
          created_at?: string | null
          description: string
          email?: string | null
          id?: string
          is_public?: boolean
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          admin_comment?: string | null
          created_at?: string | null
          description?: string
          email?: string | null
          id?: string
          is_public?: boolean
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string
          id: string
          payment_method: string | null
          receipt_url: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          transaction_date: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_rescue_listings: {
        Row: {
          created_at: string | null
          farmer_id: string | null
          id: string
          location: string | null
          product: string | null
          quantity: number | null
          status: string | null
          unit: string | null
          urgency: string | null
        }
        Insert: {
          created_at?: string | null
          farmer_id?: string | null
          id?: string
          location?: string | null
          product?: string | null
          quantity?: number | null
          status?: string | null
          unit?: string | null
          urgency?: string | null
        }
        Update: {
          created_at?: string | null
          farmer_id?: string | null
          id?: string
          location?: string | null
          product?: string | null
          quantity?: number | null
          status?: string | null
          unit?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      impact_metrics: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          metric_description: string | null
          metric_name: string
          metric_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          metric_description?: string | null
          metric_name: string
          metric_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          metric_description?: string | null
          metric_name?: string
          metric_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      input_group_orders: {
        Row: {
          created_at: string | null
          delivery_date: string | null
          farmer_id: string | null
          id: string
          input_type: string
          quantity: number
          status: string | null
          supplier_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_date?: string | null
          farmer_id?: string | null
          id?: string
          input_type: string
          quantity: number
          status?: string | null
          supplier_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_date?: string | null
          farmer_id?: string | null
          id?: string
          input_type?: string
          quantity?: number
          status?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "input_group_orders_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "input_group_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      input_prices: {
        Row: {
          created_at: string | null
          id: string
          input_type: string
          price: number
          region: string | null
          reported_by: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_type: string
          price: number
          region?: string | null
          reported_by?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          input_type?: string
          price?: number
          region?: string | null
          reported_by?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "input_prices_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      input_pricing: {
        Row: {
          crowdsource_source: string | null
          date: string | null
          id: string
          price: number | null
          product_id: string | null
          supplier_id: string | null
          verified: boolean | null
        }
        Insert: {
          crowdsource_source?: string | null
          date?: string | null
          id?: string
          price?: number | null
          product_id?: string | null
          supplier_id?: string | null
          verified?: boolean | null
        }
        Update: {
          crowdsource_source?: string | null
          date?: string | null
          id?: string
          price?: number | null
          product_id?: string | null
          supplier_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      input_reviews: {
        Row: {
          date: string | null
          id: string
          rating: number | null
          review_text: string | null
          supplier_id: string | null
          user_id: string | null
        }
        Insert: {
          date?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          supplier_id?: string | null
          user_id?: string | null
        }
        Update: {
          date?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          supplier_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      input_supplier_reviews: {
        Row: {
          created_at: string | null
          id: string
          photo_url: string | null
          rating: number | null
          review: string | null
          supplier_id: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          photo_url?: string | null
          rating?: number | null
          review?: string | null
          supplier_id?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          photo_url?: string | null
          rating?: number | null
          review?: string | null
          supplier_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "input_supplier_reviews_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      input_verifications: {
        Row: {
          date: string | null
          id: string
          status: string | null
          supplier_id: string | null
          user_id: string | null
          verification_type: string | null
        }
        Insert: {
          date?: string | null
          id?: string
          status?: string | null
          supplier_id?: string | null
          user_id?: string | null
          verification_type?: string | null
        }
        Update: {
          date?: string | null
          id?: string
          status?: string | null
          supplier_id?: string | null
          user_id?: string | null
          verification_type?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          id: string
          item_name: string
          minimum_stock: number | null
          purchase_date: string | null
          quantity: number
          status: string | null
          supplier_name: string | null
          total_value: number | null
          unit: string
          unit_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_name: string
          minimum_stock?: number | null
          purchase_date?: string | null
          quantity: number
          status?: string | null
          supplier_name?: string | null
          total_value?: number | null
          unit: string
          unit_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_name?: string
          minimum_stock?: number | null
          purchase_date?: string | null
          quantity?: number
          status?: string | null
          supplier_name?: string | null
          total_value?: number | null
          unit?: string
          unit_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          contract_network_id: string | null
          id: string
          invited_by: string | null
          invited_email: string
          responded_at: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          contract_network_id?: string | null
          id?: string
          invited_by?: string | null
          invited_email: string
          responded_at?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          contract_network_id?: string | null
          id?: string
          invited_by?: string | null
          invited_email?: string
          responded_at?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_contract_network_id_fkey"
            columns: ["contract_network_id"]
            isOneToOne: false
            referencedRelation: "farmer_contract_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      kilimo_statistics: {
        Row: {
          category: string
          county: string
          created_at: string | null
          external_id: string | null
          fetch_date: string | null
          id: string
          metadata: Json | null
          name: string
          source: string | null
          unit: string | null
          updated_at: string | null
          value: string
          verified: boolean | null
        }
        Insert: {
          category: string
          county: string
          created_at?: string | null
          external_id?: string | null
          fetch_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          source?: string | null
          unit?: string | null
          updated_at?: string | null
          value: string
          verified?: boolean | null
        }
        Update: {
          category?: string
          county?: string
          created_at?: string | null
          external_id?: string | null
          fetch_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          source?: string | null
          unit?: string | null
          updated_at?: string | null
          value?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      land_parcels: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          crop_rotation_plan: string[] | null
          current_crop: string | null
          id: string
          irrigation_system: string | null
          is_active: boolean | null
          last_soil_test_date: string | null
          location: string
          notes: string | null
          parcel_name: string
          size_acres: number
          soil_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          crop_rotation_plan?: string[] | null
          current_crop?: string | null
          id?: string
          irrigation_system?: string | null
          is_active?: boolean | null
          last_soil_test_date?: string | null
          location: string
          notes?: string | null
          parcel_name: string
          size_acres: number
          soil_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          crop_rotation_plan?: string[] | null
          current_crop?: string | null
          id?: string
          irrigation_system?: string | null
          is_active?: boolean | null
          last_soil_test_date?: string | null
          location?: string
          notes?: string | null
          parcel_name?: string
          size_acres?: number
          soil_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      market_agents: {
        Row: {
          agent_email: string | null
          agent_name: string
          agent_phone: string
          agent_type: string
          commission_structure: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          languages_spoken: string[] | null
          markets_covered: string[]
          network_size: number | null
          rating: number | null
          services_offered: string[]
          success_rate_percent: number | null
          total_transactions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_email?: string | null
          agent_name: string
          agent_phone: string
          agent_type: string
          commission_structure?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          languages_spoken?: string[] | null
          markets_covered: string[]
          network_size?: number | null
          rating?: number | null
          services_offered: string[]
          success_rate_percent?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_email?: string | null
          agent_name?: string
          agent_phone?: string
          agent_type?: string
          commission_structure?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          languages_spoken?: string[] | null
          markets_covered?: string[]
          network_size?: number | null
          rating?: number | null
          services_offered?: string[]
          success_rate_percent?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      market_demand_supply: {
        Row: {
          additional_notes: string | null
          commodity_name: string
          contact_person: string
          contact_phone: string
          created_at: string
          entry_type: string
          id: string
          is_active: boolean | null
          market_id: string
          participant_id: string | null
          price_range_max: number | null
          price_range_min: number | null
          quality_requirements: string[] | null
          quantity_available: number | null
          quantity_needed: number | null
          unit_of_measure: string
          updated_at: string
          urgency_level: string | null
          valid_until: string
        }
        Insert: {
          additional_notes?: string | null
          commodity_name: string
          contact_person: string
          contact_phone: string
          created_at?: string
          entry_type: string
          id?: string
          is_active?: boolean | null
          market_id: string
          participant_id?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          quality_requirements?: string[] | null
          quantity_available?: number | null
          quantity_needed?: number | null
          unit_of_measure: string
          updated_at?: string
          urgency_level?: string | null
          valid_until: string
        }
        Update: {
          additional_notes?: string | null
          commodity_name?: string
          contact_person?: string
          contact_phone?: string
          created_at?: string
          entry_type?: string
          id?: string
          is_active?: boolean | null
          market_id?: string
          participant_id?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          quality_requirements?: string[] | null
          quantity_available?: number | null
          quantity_needed?: number | null
          unit_of_measure?: string
          updated_at?: string
          urgency_level?: string | null
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_demand_supply_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_demand_supply_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "market_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      market_details: {
        Row: {
          city: string
          contact_email: string | null
          contact_phone: string | null
          county_code: string
          county_name: string
          created_at: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          market_description: string | null
          market_name: string
          market_size: string | null
          market_type: string | null
          operating_days: string[] | null
          primary_goods: string[] | null
          updated_at: string | null
        }
        Insert: {
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          county_code: string
          county_name: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          market_description?: string | null
          market_name: string
          market_size?: string | null
          market_type?: string | null
          operating_days?: string[] | null
          primary_goods?: string[] | null
          updated_at?: string | null
        }
        Update: {
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          county_code?: string
          county_name?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          market_description?: string | null
          market_name?: string
          market_size?: string | null
          market_type?: string | null
          operating_days?: string[] | null
          primary_goods?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      market_forecasts: {
        Row: {
          commodity_name: string
          confidence_level: number
          county: string
          created_at: string
          current_price: number
          factors: Json | null
          forecast_price: number
          id: string
          period: string
          valid_until: string
        }
        Insert: {
          commodity_name: string
          confidence_level?: number
          county: string
          created_at?: string
          current_price: number
          factors?: Json | null
          forecast_price: number
          id?: string
          period?: string
          valid_until?: string
        }
        Update: {
          commodity_name?: string
          confidence_level?: number
          county?: string
          created_at?: string
          current_price?: number
          factors?: Json | null
          forecast_price?: number
          id?: string
          period?: string
          valid_until?: string
        }
        Relationships: []
      }
      market_linkage_applications: {
        Row: {
          application_status: string | null
          applied_at: string
          contact_phone: string
          crops_to_supply: string[]
          estimated_quantity: number | null
          farm_size: number | null
          farmer_name: string
          id: string
          linkage_id: string
          notes: string | null
          reviewed_at: string | null
          reviewer_notes: string | null
          user_id: string
        }
        Insert: {
          application_status?: string | null
          applied_at?: string
          contact_phone: string
          crops_to_supply: string[]
          estimated_quantity?: number | null
          farm_size?: number | null
          farmer_name: string
          id?: string
          linkage_id: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          user_id: string
        }
        Update: {
          application_status?: string | null
          applied_at?: string
          contact_phone?: string
          crops_to_supply?: string[]
          estimated_quantity?: number | null
          farm_size?: number | null
          farmer_name?: string
          id?: string
          linkage_id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_linkage_applications_linkage_id_fkey"
            columns: ["linkage_id"]
            isOneToOne: false
            referencedRelation: "market_linkages"
            referencedColumns: ["id"]
          },
        ]
      }
      market_linkages: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          contact_info: string
          counties: string[]
          created_at: string
          created_by: string | null
          crops_involved: string[]
          description: string
          duration_months: number | null
          id: string
          linkage_type: string
          max_participants: number | null
          minimum_quantity: number | null
          participants_count: number | null
          price_range: string | null
          requirements: string[] | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_info: string
          counties: string[]
          created_at?: string
          created_by?: string | null
          crops_involved: string[]
          description: string
          duration_months?: number | null
          id?: string
          linkage_type: string
          max_participants?: number | null
          minimum_quantity?: number | null
          participants_count?: number | null
          price_range?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_info?: string
          counties?: string[]
          created_at?: string
          created_by?: string | null
          crops_involved?: string[]
          description?: string
          duration_months?: number | null
          id?: string
          linkage_type?: string
          max_participants?: number | null
          minimum_quantity?: number | null
          participants_count?: number | null
          price_range?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_participants: {
        Row: {
          agent_id: string | null
          business_name: string | null
          capacity_description: string | null
          contact_email: string | null
          contact_phone: string
          coordinates: Json | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_active_at: string | null
          location_details: string | null
          market_id: string
          onboarded_at: string
          operating_schedule: string | null
          participant_name: string
          participant_type: string
          payment_methods: string[]
          price_range: string | null
          quality_standards: string[] | null
          rating: number | null
          specialization: string[]
          total_transactions: number | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          business_name?: string | null
          capacity_description?: string | null
          contact_email?: string | null
          contact_phone: string
          coordinates?: Json | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_active_at?: string | null
          location_details?: string | null
          market_id: string
          onboarded_at?: string
          operating_schedule?: string | null
          participant_name: string
          participant_type: string
          payment_methods: string[]
          price_range?: string | null
          quality_standards?: string[] | null
          rating?: number | null
          specialization: string[]
          total_transactions?: number | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          business_name?: string | null
          capacity_description?: string | null
          contact_email?: string | null
          contact_phone?: string
          coordinates?: Json | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_active_at?: string | null
          location_details?: string | null
          market_id?: string
          onboarded_at?: string
          operating_schedule?: string | null
          participant_name?: string
          participant_type?: string
          payment_methods?: string[]
          price_range?: string | null
          quality_standards?: string[] | null
          rating?: number | null
          specialization?: string[]
          total_transactions?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_participants_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "market_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_participants_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      market_prices: {
        Row: {
          commodity_name: string
          confidence_score: number | null
          county: string
          created_at: string | null
          date_recorded: string | null
          id: string
          market_id: string
          market_name: string
          price: number
          source: string | null
          unit: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          commodity_name: string
          confidence_score?: number | null
          county: string
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          market_id: string
          market_name: string
          price: number
          source?: string | null
          unit: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          commodity_name?: string
          confidence_score?: number | null
          county?: string
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          market_id?: string
          market_name?: string
          price?: number
          source?: string | null
          unit?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      market_sentiment: {
        Row: {
          commodity_name: string
          county: string
          created_at: string
          id: string
          issues: string[]
          report_count: number
          sentiment_score: number
          tags: string[]
          updated_at: string
        }
        Insert: {
          commodity_name: string
          county: string
          created_at?: string
          id?: string
          issues?: string[]
          report_count?: number
          sentiment_score: number
          tags?: string[]
          updated_at?: string
        }
        Update: {
          commodity_name?: string
          county?: string
          created_at?: string
          id?: string
          issues?: string[]
          report_count?: number
          sentiment_score?: number
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_ban_recommendations: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string | null
          id: string
          reason: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type?: string | null
          id?: string
          reason: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string | null
          id?: string
          reason?: string
          user_id?: string | null
        }
        Relationships: []
      }
      marketplace_flags: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string | null
          id: string
          reason: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type?: string | null
          id?: string
          reason: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string | null
          id?: string
          reason?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          contract_network_id: string | null
          created_at: string | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          notes: string | null
          outcome: string | null
          session_date: string | null
          topic: string | null
        }
        Insert: {
          contract_network_id?: string | null
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          notes?: string | null
          outcome?: string | null
          session_date?: string | null
          topic?: string | null
        }
        Update: {
          contract_network_id?: string | null
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          notes?: string | null
          outcome?: string | null
          session_date?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_contract_network_id_fkey"
            columns: ["contract_network_id"]
            isOneToOne: false
            referencedRelation: "farmer_contract_networks"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorships: {
        Row: {
          created_at: string | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          status: string | null
          topic: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          status?: string | null
          topic?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          status?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_encrypted: boolean | null
          media_type: string | null
          media_url: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          media_type?: string | null
          media_url?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          media_type?: string | null
          media_url?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      micro_creditors: {
        Row: {
          active_borrowers: number | null
          collateral_requirements: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates: Json | null
          county: string
          created_at: string
          default_rate_percent: number | null
          id: string
          institution_name: string
          institution_type: string
          interest_rate_range: string
          is_active: boolean | null
          is_licensed: boolean | null
          license_number: string | null
          loan_processing_time_days: number | null
          loan_products: Json
          maximum_loan_amount: number
          minimum_loan_amount: number
          physical_address: string
          rating: number | null
          service_counties: string[]
          sub_county: string | null
          target_sectors: string[]
          total_disbursed_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_borrowers?: number | null
          collateral_requirements?: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates?: Json | null
          county: string
          created_at?: string
          default_rate_percent?: number | null
          id?: string
          institution_name: string
          institution_type: string
          interest_rate_range: string
          is_active?: boolean | null
          is_licensed?: boolean | null
          license_number?: string | null
          loan_processing_time_days?: number | null
          loan_products: Json
          maximum_loan_amount: number
          minimum_loan_amount: number
          physical_address: string
          rating?: number | null
          service_counties: string[]
          sub_county?: string | null
          target_sectors: string[]
          total_disbursed_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_borrowers?: number | null
          collateral_requirements?: string[] | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          coordinates?: Json | null
          county?: string
          created_at?: string
          default_rate_percent?: number | null
          id?: string
          institution_name?: string
          institution_type?: string
          interest_rate_range?: string
          is_active?: boolean | null
          is_licensed?: boolean | null
          license_number?: string | null
          loan_processing_time_days?: number | null
          loan_products?: Json
          maximum_loan_amount?: number
          minimum_loan_amount?: number
          physical_address?: string
          rating?: number | null
          service_counties?: string[]
          sub_county?: string | null
          target_sectors?: string[]
          total_disbursed_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      network_events: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          location: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          crop_filter: string[] | null
          enabled: boolean | null
          id: string
          location_filter: string[] | null
          notification_type: string
          price_threshold: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_filter?: string[] | null
          enabled?: boolean | null
          id?: string
          location_filter?: string[] | null
          notification_type: string
          price_threshold?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop_filter?: string[] | null
          enabled?: boolean | null
          id?: string
          location_filter?: string[] | null
          notification_type?: string
          price_threshold?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      p2p_lending_offers: {
        Row: {
          application_deadline: string | null
          borrower_requirements: string[] | null
          collateral_description: string | null
          collateral_required: boolean | null
          counties_served: string[]
          created_at: string
          funding_status: string
          id: string
          interest_rate_percent: number
          is_active: boolean | null
          lender_email: string
          lender_id: string
          lender_name: string
          lender_phone: string
          loan_amount: number
          loan_term_months: number
          minimum_borrower_rating: number | null
          offer_title: string
          purpose_category: string
          risk_level: string
          specific_purpose: string | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          borrower_requirements?: string[] | null
          collateral_description?: string | null
          collateral_required?: boolean | null
          counties_served: string[]
          created_at?: string
          funding_status?: string
          id?: string
          interest_rate_percent: number
          is_active?: boolean | null
          lender_email: string
          lender_id: string
          lender_name: string
          lender_phone: string
          loan_amount: number
          loan_term_months: number
          minimum_borrower_rating?: number | null
          offer_title: string
          purpose_category: string
          risk_level: string
          specific_purpose?: string | null
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          borrower_requirements?: string[] | null
          collateral_description?: string | null
          collateral_required?: boolean | null
          counties_served?: string[]
          created_at?: string
          funding_status?: string
          id?: string
          interest_rate_percent?: number
          is_active?: boolean | null
          lender_email?: string
          lender_id?: string
          lender_name?: string
          lender_phone?: string
          loan_amount?: number
          loan_term_months?: number
          minimum_borrower_rating?: number | null
          offer_title?: string
          purpose_category?: string
          risk_level?: string
          specific_purpose?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partner_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string | null
          id: string
          image_url: string | null
          location: string | null
          partner_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          partner_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          partner_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          company_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          company_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          created_at: string | null
          id: string
          org1_id: string | null
          org2_id: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          org1_id?: string | null
          org2_id?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          org1_id?: string | null
          org2_id?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          advertisement_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          payment_details: Json | null
          payment_provider: string
          status: string | null
          transaction_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_details?: Json | null
          payment_provider: string
          status?: string | null
          transaction_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_details?: Json | null
          payment_provider?: string
          status?: string | null
          transaction_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "business_advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_index: number
          poll_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "community_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          likes_count: number | null
          parent_id: string | null
          post_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          alert_type: string
          commodity_name: string
          county: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          target_price: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          commodity_name: string
          county?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          target_price: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          commodity_name?: string
          county?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          target_price?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      price_comparisons: {
        Row: {
          commodity_name: string
          comparison_date: string | null
          domestic_price: number | null
          export_opportunity_id: string | null
          export_price: number | null
          id: string
          market_id: string | null
        }
        Insert: {
          commodity_name: string
          comparison_date?: string | null
          domestic_price?: number | null
          export_opportunity_id?: string | null
          export_price?: number | null
          id?: string
          market_id?: string | null
        }
        Update: {
          commodity_name?: string
          comparison_date?: string | null
          domestic_price?: number | null
          export_opportunity_id?: string | null
          export_price?: number | null
          id?: string
          market_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_comparisons_export_opportunity_id_fkey"
            columns: ["export_opportunity_id"]
            isOneToOne: false
            referencedRelation: "export_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_comparisons_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_tiers: {
        Row: {
          created_at: string
          currency: string
          features: string[]
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          period: string
          price: number
          requests: number
        }
        Insert: {
          created_at?: string
          currency?: string
          features?: string[]
          id: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          period: string
          price: number
          requests: number
        }
        Update: {
          created_at?: string
          currency?: string
          features?: string[]
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          period?: string
          price?: number
          requests?: number
        }
        Relationships: []
      }
      processing_matches: {
        Row: {
          bulk_order_id: string | null
          created_at: string | null
          farmer_id: string | null
          id: string
          negotiation_log: Json | null
          offer_price: number | null
          status: string | null
        }
        Insert: {
          bulk_order_id?: string | null
          created_at?: string | null
          farmer_id?: string | null
          id?: string
          negotiation_log?: Json | null
          offer_price?: number | null
          status?: string | null
        }
        Update: {
          bulk_order_id?: string | null
          created_at?: string | null
          farmer_id?: string | null
          id?: string
          negotiation_log?: Json | null
          offer_price?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processing_matches_bulk_order_id_fkey"
            columns: ["bulk_order_id"]
            isOneToOne: false
            referencedRelation: "bulk_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      processors: {
        Row: {
          business_type: string
          certifications: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates: Json | null
          county: string
          created_at: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          minimum_quantity_tons: number | null
          payment_terms: string[] | null
          physical_address: string
          pricing_model: string | null
          processed_products: string[]
          processing_capacity_tons_per_day: number
          processing_fee_per_ton: number | null
          processing_methods: string[] | null
          processor_name: string
          quality_standards: string[] | null
          rating: number | null
          raw_materials_needed: string[]
          registration_number: string | null
          service_radius_km: number | null
          sub_county: string | null
          total_orders: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_type?: string
          certifications?: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates?: Json | null
          county: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_quantity_tons?: number | null
          payment_terms?: string[] | null
          physical_address: string
          pricing_model?: string | null
          processed_products: string[]
          processing_capacity_tons_per_day: number
          processing_fee_per_ton?: number | null
          processing_methods?: string[] | null
          processor_name: string
          quality_standards?: string[] | null
          rating?: number | null
          raw_materials_needed: string[]
          registration_number?: string | null
          service_radius_km?: number | null
          sub_county?: string | null
          total_orders?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_type?: string
          certifications?: string[] | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          coordinates?: Json | null
          county?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_quantity_tons?: number | null
          payment_terms?: string[] | null
          physical_address?: string
          pricing_model?: string | null
          processed_products?: string[]
          processing_capacity_tons_per_day?: number
          processing_fee_per_ton?: number | null
          processing_methods?: string[] | null
          processor_name?: string
          quality_standards?: string[] | null
          rating?: number | null
          raw_materials_needed?: string[]
          registration_number?: string | null
          service_radius_km?: number | null
          sub_county?: string | null
          total_orders?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      produce_inventory: {
        Row: {
          available_for_sale: boolean | null
          created_at: string
          description: string | null
          expiry_date: string | null
          farmer_id: string | null
          harvest_date: string | null
          id: string
          images: string[] | null
          location: string
          organic_certified: boolean | null
          price_per_unit: number | null
          product_name: string
          quality_grade: string | null
          quantity: number
          storage_conditions: string | null
          unit: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          available_for_sale?: boolean | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location: string
          organic_certified?: boolean | null
          price_per_unit?: number | null
          product_name: string
          quality_grade?: string | null
          quantity: number
          storage_conditions?: string | null
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          available_for_sale?: boolean | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string
          organic_certified?: boolean | null
          price_per_unit?: number | null
          product_name?: string
          quality_grade?: string | null
          quantity?: number
          storage_conditions?: string | null
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          contact_number: string | null
          county: string | null
          created_at: string
          email: string | null
          experience_years: number | null
          farm_size: number | null
          farm_type: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          role: string | null
          specialization: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          farm_size?: number | null
          farm_type?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          role?: string | null
          specialization?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          farm_size?: number | null
          farm_type?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string | null
          specialization?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      quality_control_discussions: {
        Row: {
          attendees: number | null
          author_name: string
          author_type: string
          county: string
          created_at: string
          date: string
          description: string
          id: string
          is_active: boolean | null
          location: string
          organizer: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: number | null
          author_name: string
          author_type: string
          county: string
          created_at?: string
          date: string
          description: string
          id?: string
          is_active?: boolean | null
          location: string
          organizer: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: number | null
          author_name?: string
          author_type?: string
          county?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_active?: boolean | null
          location?: string
          organizer?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipients: {
        Row: {
          contact: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          recipient_type: string | null
          type: string
        }
        Insert: {
          contact?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          recipient_type?: string | null
          type: string
        }
        Update: {
          contact?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          recipient_type?: string | null
          type?: string
        }
        Relationships: []
      }
      rescue_matches: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string | null
          pickup_time: string | null
          recipient_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          pickup_time?: string | null
          recipient_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          pickup_time?: string | null
          recipient_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rescue_matches_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "food_rescue_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      research_requests: {
        Row: {
          created_at: string | null
          details: string | null
          id: string
          requester_id: string | null
          status: string | null
          topic: string | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          id?: string
          requester_id?: string | null
          status?: string | null
          topic?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          id?: string
          requester_id?: string | null
          status?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      service_provider_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_provider_reviews: {
        Row: {
          created_at: string
          id: string
          provider_id: string
          rating: number
          review_text: string | null
          service_used: string
          user_id: string
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          provider_id: string
          rating: number
          review_text?: string | null
          service_used: string
          user_id: string
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          provider_id?: string
          rating?: number
          review_text?: string | null
          service_used?: string
          user_id?: string
          would_recommend?: boolean | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          availability: Json | null
          business_name: string
          businesstype: string
          capacity: Json | null
          certifications: string[] | null
          contact: Json
          created_at: string | null
          description: string
          experience: string | null
          id: string
          insurance_details: string | null
          licenses: string[] | null
          location: Json
          name: string | null
          pricing: Json | null
          provider_category: string
          rating: number | null
          reviewcount: number | null
          services: string[]
          tags: string[]
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          availability?: Json | null
          business_name: string
          businesstype: string
          capacity?: Json | null
          certifications?: string[] | null
          contact: Json
          created_at?: string | null
          description: string
          experience?: string | null
          id?: string
          insurance_details?: string | null
          licenses?: string[] | null
          location: Json
          name?: string | null
          pricing?: Json | null
          provider_category: string
          rating?: number | null
          reviewcount?: number | null
          services?: string[]
          tags?: string[]
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          availability?: Json | null
          business_name?: string
          businesstype?: string
          capacity?: Json | null
          certifications?: string[] | null
          contact?: Json
          created_at?: string | null
          description?: string
          experience?: string | null
          id?: string
          insurance_details?: string | null
          licenses?: string[] | null
          location?: Json
          name?: string | null
          pricing?: Json | null
          provider_category?: string
          rating?: number | null
          reviewcount?: number | null
          services?: string[]
          tags?: string[]
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      subscription_box_deliveries: {
        Row: {
          box_id: string | null
          created_at: string | null
          delivered: boolean | null
          delivery_date: string | null
          id: string
        }
        Insert: {
          box_id?: string | null
          created_at?: string | null
          delivered?: boolean | null
          delivery_date?: string | null
          id?: string
        }
        Update: {
          box_id?: string | null
          created_at?: string | null
          delivered?: boolean | null
          delivery_date?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_box_deliveries_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "subscription_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_boxes: {
        Row: {
          box_type: string | null
          consumer_id: string | null
          created_at: string | null
          farmer_id: string | null
          frequency: string | null
          id: string
          next_delivery: string | null
          status: string | null
        }
        Insert: {
          box_type?: string | null
          consumer_id?: string | null
          created_at?: string | null
          farmer_id?: string | null
          frequency?: string | null
          id?: string
          next_delivery?: string | null
          status?: string | null
        }
        Update: {
          box_type?: string | null
          consumer_id?: string | null
          created_at?: string | null
          farmer_id?: string | null
          frequency?: string | null
          id?: string
          next_delivery?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_boxes_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          actor_id: string | null
          event_description: string | null
          event_time: string | null
          event_type: string
          export_order_id: string | null
          id: string
        }
        Insert: {
          actor_id?: string | null
          event_description?: string | null
          event_time?: string | null
          event_type: string
          export_order_id?: string | null
          id?: string
        }
        Update: {
          actor_id?: string | null
          event_description?: string | null
          event_time?: string | null
          event_type?: string
          export_order_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_export_order_id_fkey"
            columns: ["export_order_id"]
            isOneToOne: false
            referencedRelation: "export_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_events: {
        Row: {
          event_time: string | null
          export_order_id: string | null
          gps_coordinates: Json | null
          id: string
          location: string | null
          notes: string | null
          shared_with: string[] | null
          status: string | null
        }
        Insert: {
          event_time?: string | null
          export_order_id?: string | null
          gps_coordinates?: Json | null
          id?: string
          location?: string | null
          notes?: string | null
          shared_with?: string[] | null
          status?: string | null
        }
        Update: {
          event_time?: string | null
          export_order_id?: string | null
          gps_coordinates?: Json | null
          id?: string
          location?: string | null
          notes?: string | null
          shared_with?: string[] | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_export_order_id_fkey"
            columns: ["export_order_id"]
            isOneToOne: false
            referencedRelation: "export_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      training_events: {
        Row: {
          certificate_provided: boolean | null
          contact_info: string
          cost: number | null
          county: string
          created_at: string
          current_participants: number | null
          description: string
          end_date: string
          event_type: string
          id: string
          is_active: boolean | null
          is_online: boolean | null
          location: string
          materials_provided: boolean | null
          max_participants: number | null
          meeting_link: string | null
          organizer_id: string | null
          registration_deadline: string | null
          requirements: string[] | null
          start_date: string
          status: string | null
          target_audience: string[] | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          certificate_provided?: boolean | null
          contact_info: string
          cost?: number | null
          county: string
          created_at?: string
          current_participants?: number | null
          description: string
          end_date: string
          event_type: string
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location: string
          materials_provided?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string | null
          registration_deadline?: string | null
          requirements?: string[] | null
          start_date: string
          status?: string | null
          target_audience?: string[] | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          certificate_provided?: boolean | null
          contact_info?: string
          cost?: number | null
          county?: string
          created_at?: string
          current_participants?: number | null
          description?: string
          end_date?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location?: string
          materials_provided?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string | null
          registration_deadline?: string | null
          requirements?: string[] | null
          start_date?: string
          status?: string | null
          target_audience?: string[] | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      training_registrations: {
        Row: {
          attended: boolean | null
          contact_phone: string
          experience_level: string | null
          feedback_comments: string | null
          feedback_rating: number | null
          id: string
          organization: string | null
          participant_name: string
          registered_at: string
          registration_status: string | null
          specific_interests: string | null
          training_id: string
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          contact_phone: string
          experience_level?: string | null
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          organization?: string | null
          participant_name: string
          registered_at?: string
          registration_status?: string | null
          specific_interests?: string | null
          training_id: string
          user_id: string
        }
        Update: {
          attended?: boolean | null
          contact_phone?: string
          experience_level?: string | null
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          organization?: string | null
          participant_name?: string
          registered_at?: string
          registration_status?: string | null
          specific_interests?: string | null
          training_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_registrations_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "training_events"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_requests: {
        Row: {
          actual_price: number | null
          cargo_type: string
          contact_phone: string
          created_at: string
          dropoff_county: string
          dropoff_location: string
          estimated_value: number | null
          flexible_timing: boolean | null
          id: string
          insurance_required: boolean | null
          notes: string | null
          pickup_county: string
          pickup_location: string
          quantity: number
          quoted_price: number | null
          requested_date: string
          requester_id: string | null
          special_requirements: string[] | null
          status: string | null
          transporter_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          actual_price?: number | null
          cargo_type: string
          contact_phone: string
          created_at?: string
          dropoff_county: string
          dropoff_location: string
          estimated_value?: number | null
          flexible_timing?: boolean | null
          id?: string
          insurance_required?: boolean | null
          notes?: string | null
          pickup_county: string
          pickup_location: string
          quantity: number
          quoted_price?: number | null
          requested_date: string
          requester_id?: string | null
          special_requirements?: string[] | null
          status?: string | null
          transporter_id?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          actual_price?: number | null
          cargo_type?: string
          contact_phone?: string
          created_at?: string
          dropoff_county?: string
          dropoff_location?: string
          estimated_value?: number | null
          flexible_timing?: boolean | null
          id?: string
          insurance_required?: boolean | null
          notes?: string | null
          pickup_county?: string
          pickup_location?: string
          quantity?: number
          quoted_price?: number | null
          requested_date?: string
          requester_id?: string | null
          special_requirements?: string[] | null
          status?: string | null
          transporter_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_requests_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "transporters"
            referencedColumns: ["id"]
          },
        ]
      }
      transporter_bookings: {
        Row: {
          booking_date: string | null
          cargo_type: string | null
          created_at: string | null
          created_by: string | null
          distance_km: number | null
          export_order_id: string | null
          id: string
          price: number | null
          status: string | null
          transporter_id: string | null
        }
        Insert: {
          booking_date?: string | null
          cargo_type?: string | null
          created_at?: string | null
          created_by?: string | null
          distance_km?: number | null
          export_order_id?: string | null
          id?: string
          price?: number | null
          status?: string | null
          transporter_id?: string | null
        }
        Update: {
          booking_date?: string | null
          cargo_type?: string | null
          created_at?: string | null
          created_by?: string | null
          distance_km?: number | null
          export_order_id?: string | null
          id?: string
          price?: number | null
          status?: string | null
          transporter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transporter_bookings_export_order_id_fkey"
            columns: ["export_order_id"]
            isOneToOne: false
            referencedRelation: "export_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      transporter_recommendations: {
        Row: {
          created_at: string | null
          handling: number | null
          id: string
          pricing: number | null
          rating: number
          reliability: number | null
          review: string | null
          reviewer_id: string | null
          timeliness: number | null
          transporter_id: string | null
        }
        Insert: {
          created_at?: string | null
          handling?: number | null
          id?: string
          pricing?: number | null
          rating: number
          reliability?: number | null
          review?: string | null
          reviewer_id?: string | null
          timeliness?: number | null
          transporter_id?: string | null
        }
        Update: {
          created_at?: string | null
          handling?: number | null
          id?: string
          pricing?: number | null
          rating?: number
          reliability?: number | null
          review?: string | null
          reviewer_id?: string | null
          timeliness?: number | null
          transporter_id?: string | null
        }
        Relationships: []
      }
      transporters: {
        Row: {
          capacity: string
          contact_info: string
          counties: string[]
          created_at: string
          has_refrigeration: boolean
          id: string
          load_capacity: number
          name: string
          rates: string
          service_type: string
          updated_at: string
          user_id: string
          vehicle_type: string
        }
        Insert: {
          capacity: string
          contact_info: string
          counties: string[]
          created_at?: string
          has_refrigeration?: boolean
          id?: string
          load_capacity: number
          name: string
          rates: string
          service_type: string
          updated_at?: string
          user_id: string
          vehicle_type: string
        }
        Update: {
          capacity?: string
          contact_info?: string
          counties?: string[]
          created_at?: string
          has_refrigeration?: boolean
          id?: string
          load_capacity?: number
          name?: string
          rates?: string
          service_type?: string
          updated_at?: string
          user_id?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          bookmark_type: string
          created_at: string | null
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          bookmark_type: string
          created_at?: string | null
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          bookmark_type?: string
          created_at?: string | null
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          id: string
          market_updates: boolean | null
          preferred_commodities: string[] | null
          preferred_counties: string[] | null
          price_alerts: boolean | null
          training_notifications: boolean | null
          updated_at: string | null
          user_id: string
          weather_alerts: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_updates?: boolean | null
          preferred_commodities?: string[] | null
          preferred_counties?: string[] | null
          price_alerts?: boolean | null
          training_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
          weather_alerts?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          market_updates?: boolean | null
          preferred_commodities?: string[] | null
          preferred_counties?: string[] | null
          price_alerts?: boolean | null
          training_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
          weather_alerts?: boolean | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          notification_type: string
          read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          notification_type: string
          read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          notification_type?: string
          read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      warehouse_bookings: {
        Row: {
          contact_phone: string
          created_at: string
          end_date: string
          id: string
          notes: string | null
          payment_status: string | null
          produce_type: string
          quantity_tons: number
          special_requirements: string[] | null
          start_date: string
          status: string | null
          total_cost: number
          updated_at: string
          user_id: string | null
          warehouse_id: string | null
        }
        Insert: {
          contact_phone: string
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          produce_type: string
          quantity_tons: number
          special_requirements?: string[] | null
          start_date: string
          status?: string | null
          total_cost: number
          updated_at?: string
          user_id?: string | null
          warehouse_id?: string | null
        }
        Update: {
          contact_phone?: string
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          produce_type?: string
          quantity_tons?: number
          special_requirements?: string[] | null
          start_date?: string
          status?: string | null
          total_cost?: number
          updated_at?: string
          user_id?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_bookings_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          availability_status: string | null
          capacity_tons: number
          certifications: string[] | null
          contact_info: string
          county: string
          created_at: string
          daily_rate_per_ton: number
          has_refrigeration: boolean | null
          has_security: boolean | null
          id: string
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          operating_hours: string | null
          owner_id: string | null
          storage_types: string[] | null
          updated_at: string
        }
        Insert: {
          availability_status?: string | null
          capacity_tons: number
          certifications?: string[] | null
          contact_info: string
          county: string
          created_at?: string
          daily_rate_per_ton: number
          has_refrigeration?: boolean | null
          has_security?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          operating_hours?: string | null
          owner_id?: string | null
          storage_types?: string[] | null
          updated_at?: string
        }
        Update: {
          availability_status?: string | null
          capacity_tons?: number
          certifications?: string[] | null
          contact_info?: string
          county?: string
          created_at?: string
          daily_rate_per_ton?: number
          has_refrigeration?: boolean | null
          has_security?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          owner_id?: string | null
          storage_types?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          is_active: boolean | null
          region: string
          severity: string
          start_date: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          is_active?: boolean | null
          region: string
          severity: string
          start_date: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          region?: string
          severity?: string
          start_date?: string
          type?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          county: string
          created_at: string
          date: string
          forecast_data: Json | null
          humidity: number | null
          id: string
          rainfall: number | null
          source: string | null
          temperature_max: number | null
          temperature_min: number | null
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          county: string
          created_at?: string
          date: string
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          rainfall?: number | null
          source?: string | null
          temperature_max?: number | null
          temperature_min?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          county?: string
          created_at?: string
          date?: string
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          rainfall?: number | null
          source?: string | null
          temperature_max?: number | null
          temperature_min?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      app_market_selection: {
        Row: {
          city: string | null
          id: string | null
          market_name: string | null
        }
        Insert: {
          city?: string | null
          id?: string | null
          market_name?: string | null
        }
        Update: {
          city?: string | null
          id?: string | null
          market_name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_platform_yield_improvement: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      check_rate_limit: {
        Args: {
          p_user_id: string
          p_subscription_type: string
          p_time_window?: unknown
        }
        Returns: Json
      }
      update_total_registered_farmers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_has_role: {
        Args: { required_role: string }
        Returns: boolean
      }
      validate_api_key: {
        Args: { p_key_hash: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
