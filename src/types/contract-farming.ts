// Contract Farming Types
export interface ContractFarmingDocument {
  id: string;
  name: string;
  url: string;
  file_type: string | null;
  created_at: string;
  opportunity_id: string;
}

export interface ContractFarmingReview {
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
}

export interface ContractFarmingOpportunity {
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
  documents: ContractFarmingDocument[];
  reviews: ContractFarmingReview[];
  average_rating: number | null;
  review_count: number;
}

// Type for the component's state
export interface ContractFarmingState {
  opportunities: ContractFarmingOpportunity[];
  filteredOpportunities: ContractFarmingOpportunity[];
  searchTerm: string;
  selectedCrop: string;
  selectedStatus: 'all' | 'active' | 'completed';
  isLoading: boolean;
  error: string | null;
}

// Type for the component's props
export interface ContractFarmingProps {
  // Add any props if needed
}
