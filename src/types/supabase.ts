// Base types for database tables
type ContractFarmingBase = {
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

type ContractDocumentBase = {
  id: string;
  opportunity_id: string;
  name: string;
  url: string;
  file_type: string | null;
  created_at: string;
};

type ContractReviewBase = {
  id: string;
  opportunity_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

type ProfileBase = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

// Extended types with relationships
export type ContractFarmingWithRelations = ContractFarmingBase & {
  documents: ContractDocumentBase[];
  reviews: (ContractReviewBase & {
    user: Pick<ProfileBase, 'id' | 'full_name' | 'avatar_url'>;
  })[];
  average_rating: number | null;
  review_count: number;
};

// Type for the Supabase query response
export type ContractFarmingQueryResult = ContractFarmingBase & {
  documents: ContractDocumentBase[];
  reviews: (ContractReviewBase & {
    user: Pick<ProfileBase, 'id' | 'full_name' | 'avatar_url'>;
  })[];
};
