// Complete database types based on all migrations

// Auth and User Management
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  contact_number: string | null;
  county: string | null;
  bio: string | null;
  farm_size: number | null;
  farm_type: string | null;
  experience_years: number | null;
  specialization: string[] | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'moderator';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Farm Management
export interface FarmTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  crop: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface FarmStatistics {
  id: string;
  user_id: string;
  monthly_revenue: number;
  total_area: number;
  average_yield: number;
  active_alerts: number;
  created_at: string;
  updated_at: string;
}

// Inventory Management
export interface InventoryItem {
  id: string;
  user_id: string;
  item_name: string;
  category: string;
  quantity: number;
  minimum_stock: number;
  unit_price: number;
  total_value: number;
  unit: string;
  location: string | null;
  supplier: string | null;
  expiry_date: string | null;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'expired';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  transaction_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reason: string | null;
  reference_number: string | null;
  created_by: string;
  created_at: string;
}

// Weather and Alerts
export interface WeatherAlert {
  id: string;
  type: 'Cyclone' | 'Rain' | 'Drought';
  region: string;
  severity: 'critical' | 'moderate' | 'low';
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'low_stock';
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

// Community Features
export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  location: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
}

export interface CommunityPoll {
  id: string;
  post_id: string | null;
  user_id: string;
  question: string;
  options: any; // JSONB
  total_votes: number;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  likes_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
}

// Market and Trading
export interface CityMarketProduct {
  id: string;
  market_id: string;
  seller_user_id: string;
  product_name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  quality_grade: string | null;
  description: string | null;
  image_url: string | null;
  status: 'available' | 'sold' | 'reserved';
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface BulkOrder {
  id: string;
  buyer_id: string;
  product_type: string;
  quantity: number;
  unit: string;
  max_price: number;
  delivery_location: string;
  delivery_date: string;
  requirements: string | null;
  status: 'open' | 'partial' | 'fulfilled' | 'cancelled';
  rating: number | null;
  created_at: string;
  updated_at: string;
}

// Logistics
export interface LogisticsProvider {
  id: string;
  user_id: string;
  company_name: string;
  service_type: string[];
  coverage_areas: string[];
  vehicle_types: string[];
  capacity_tons: number;
  rates: any; // JSONB
  contact_info: string;
  rating: number | null;
  total_deliveries: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryRequest {
  id: string;
  requester_id: string;
  provider_id: string | null;
  pickup_location: string;
  pickup_county: string;
  delivery_location: string;
  delivery_county: string;
  cargo_type: string;
  cargo_weight_tons: number;
  pickup_date: string;
  delivery_date: string | null;
  special_requirements: string[];
  estimated_cost: number | null;
  actual_cost: number | null;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_number: string | null;
  notes: string | null;
  requester_rating: number | null;
  provider_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: string;
  user_id: string;
  name: string;
  location: string;
  county: string;
  capacity: number;
  capacity_unit: string;
  rates: string;
  goods_types: string[];
  has_refrigeration: boolean;
  has_certifications: boolean;
  certification_types: string[] | null;
  contact_info: string;
  availability_status: 'available' | 'full' | 'maintenance';
  created_at: string;
  updated_at: string;
}

// Export Markets
export interface ExportOpportunity {
  id: string;
  created_by: string | null;
  title: string;
  description: string;
  destination_country: string;
  product_requirements: string;
  quantity_needed: number;
  unit: string;
  price_range: string;
  contact_info: string;
  deadline: string;
  status: 'open' | 'closed' | 'in_progress';
  created_at: string;
  updated_at: string;
}

export interface ExportDocumentation {
  id: string;
  opportunity_id: string;
  uploaded_by: string;
  document_type: string;
  file_name: string;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  created_at: string;
}

export interface FarmerConsolidation {
  id: string;
  consolidator_id: string;
  product_type: string;
  target_quantity: number;
  unit: string;
  collection_location: string;
  collection_date: string;
  price_per_unit: number;
  requirements: string | null;
  status: 'open' | 'collecting' | 'completed' | 'cancelled';
  current_quantity: number;
  participating_farmers: number;
  created_at: string;
  updated_at: string;
}

// RBAC System
export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

export interface UserRole {
  user_id: string;
  role_id: number;
}

// API Management
export interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  key_preview: string;
  name: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface ApiUsage {
  id: string;
  user_id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number | null;
  request_size_bytes: number;
  response_size_bytes: number;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  requests: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

// Contract Farming (from existing types)
export interface ContractFarming {
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
}

export interface ContractDocument {
  id: string;
  opportunity_id: string;
  name: string;
  url: string;
  file_type: string | null;
  created_at: string;
}

export interface ContractReview {
  id: string;
  opportunity_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
}

// Extended types with relationships
export interface ContractFarmingWithRelations extends ContractFarming {
  documents: ContractDocument[];
  reviews: ContractReview[];
  average_rating: number | null;
  review_count: number;
}

export interface CommunityPostWithRelations extends CommunityPost {
  comments: PostComment[];
  polls: CommunityPoll[];
}

// Database schema types for Supabase operations
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      farm_tasks: {
        Row: FarmTask;
        Insert: Omit<FarmTask, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FarmTask, 'id' | 'created_at' | 'updated_at'>>;
      };
      farm_statistics: {
        Row: FarmStatistics;
        Insert: Omit<FarmStatistics, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FarmStatistics, 'id' | 'created_at' | 'updated_at'>>;
      };
      inventory_items: {
        Row: InventoryItem;
        Insert: Omit<InventoryItem, 'id' | 'total_value' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<InventoryItem, 'id' | 'total_value' | 'created_at' | 'updated_at'>>;
      };
      inventory_transactions: {
        Row: InventoryTransaction;
        Insert: Omit<InventoryTransaction, 'id' | 'created_at'>;
        Update: Partial<Omit<InventoryTransaction, 'id' | 'created_at'>>;
      };
      weather_alerts: {
        Row: WeatherAlert;
        Insert: Omit<WeatherAlert, 'id' | 'created_at'>;
        Update: Partial<Omit<WeatherAlert, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      community_posts: {
        Row: CommunityPost;
        Insert: Omit<CommunityPost, 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CommunityPost, 'id' | 'created_at' | 'updated_at'>>;
      };
      community_polls: {
        Row: CommunityPoll;
        Insert: Omit<CommunityPoll, 'id' | 'total_votes' | 'created_at'>;
        Update: Partial<Omit<CommunityPoll, 'id' | 'created_at'>>;
      };
      poll_votes: {
        Row: PollVote;
        Insert: Omit<PollVote, 'id' | 'created_at'>;
        Update: Partial<Omit<PollVote, 'id' | 'created_at'>>;
      };
      post_comments: {
        Row: PostComment;
        Insert: Omit<PostComment, 'id' | 'likes_count' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PostComment, 'id' | 'created_at' | 'updated_at'>>;
      };
      city_market_products: {
        Row: CityMarketProduct;
        Insert: Omit<CityMarketProduct, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CityMarketProduct, 'id' | 'created_at' | 'updated_at'>>;
      };
      bulk_orders: {
        Row: BulkOrder;
        Insert: Omit<BulkOrder, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BulkOrder, 'id' | 'created_at' | 'updated_at'>>;
      };
      logistics_providers: {
        Row: LogisticsProvider;
        Insert: Omit<LogisticsProvider, 'id' | 'rating' | 'total_deliveries' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<LogisticsProvider, 'id' | 'created_at' | 'updated_at'>>;
      };
      delivery_requests: {
        Row: DeliveryRequest;
        Insert: Omit<DeliveryRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DeliveryRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
      warehouses: {
        Row: Warehouse;
        Insert: Omit<Warehouse, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Warehouse, 'id' | 'created_at' | 'updated_at'>>;
      };
      export_opportunities: {
        Row: ExportOpportunity;
        Insert: Omit<ExportOpportunity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ExportOpportunity, 'id' | 'created_at' | 'updated_at'>>;
      };
      export_documentation: {
        Row: ExportDocumentation;
        Insert: Omit<ExportDocumentation, 'id' | 'created_at'>;
        Update: Partial<Omit<ExportDocumentation, 'id' | 'created_at'>>;
      };
      farmer_consolidations: {
        Row: FarmerConsolidation;
        Insert: Omit<FarmerConsolidation, 'id' | 'current_quantity' | 'participating_farmers' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FarmerConsolidation, 'id' | 'created_at' | 'updated_at'>>;
      };
      roles: {
        Row: Role;
        Insert: Omit<Role, 'id'>;
        Update: Partial<Omit<Role, 'id'>>;
      };
      permissions: {
        Row: Permission;
        Insert: Omit<Permission, 'id'>;
        Update: Partial<Omit<Permission, 'id'>>;
      };
      role_permissions: {
        Row: RolePermission;
        Insert: RolePermission;
        Update: Partial<RolePermission>;
      };
      user_roles: {
        Row: UserRole;
        Insert: UserRole;
        Update: Partial<UserRole>;
      };
      api_keys: {
        Row: ApiKey;
        Insert: Omit<ApiKey, 'id' | 'created_at'>;
        Update: Partial<Omit<ApiKey, 'id' | 'created_at'>>;
      };
      api_usage: {
        Row: ApiUsage;
        Insert: Omit<ApiUsage, 'id' | 'created_at'>;
        Update: Partial<Omit<ApiUsage, 'id' | 'created_at'>>;
      };
      pricing_tiers: {
        Row: PricingTier;
        Insert: Omit<PricingTier, 'created_at'>;
        Update: Partial<Omit<PricingTier, 'created_at'>>;
      };
      contract_farming: {
        Row: ContractFarming;
        Insert: Omit<ContractFarming, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContractFarming, 'id' | 'created_at' | 'updated_at'>>;
      };
      contract_documents: {
        Row: ContractDocument;
        Insert: Omit<ContractDocument, 'id' | 'created_at'>;
        Update: Partial<Omit<ContractDocument, 'id' | 'created_at'>>;
      };
      contract_reviews: {
        Row: ContractReview;
        Insert: Omit<ContractReview, 'id' | 'created_at'>;
        Update: Partial<Omit<ContractReview, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_rate_limit: {
        Args: {
          p_user_id: string;
          p_subscription_type: string;
          p_time_window?: string;
        };
        Returns: any;
      };
      validate_api_key: {
        Args: { p_key_hash: string };
        Returns: any;
      };
      update_inventory_quantity: {
        Args: {
          p_item_id: string;
          p_quantity_change: number;
        };
        Returns: void;
      };
      transfer_inventory: {
        Args: {
          p_from_item_id: string;
          p_to_item_id: string;
          p_quantity: number;
          p_reason: string;
        };
        Returns: void;
      };
      get_market_metrics: {
        Args: { p_market_id: string };
        Returns: any;
      };
      calculate_trust_level: {
        Args: { p_user_id: string };
        Returns: string;
      };
      get_user_permissions: {
        Args: { p_user_id: string };
        Returns: any;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}