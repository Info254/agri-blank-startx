export type PartnerType = 'logistics' | 'financial' | 'input_supplier' | 'processor' | 'buyer' | 'extension_service' | 'government' | 'other';

export interface Partner {
  id: string;
  user_id: string;
  name: string;                // maps to company_name in DB
  email: string;               // maps to contact_email in DB
  phone: string;               // maps to contact_phone in DB
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;         // maps to postal_code in DB
  website?: string;
  logoUrl?: string;           // maps to logo_url in DB
  description?: string;
  services: string[];
  createdAt: string;          // maps to created_at in DB
  updatedAt: string;          // maps to updated_at in DB
  isVerified: boolean;        // maps to is_verified in DB
  rating?: number;
  reviewCount?: number;       // maps to review_count in DB
}

export interface PartnerEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  maxAttendees?: number;
  attendeesCount?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  partnerId: string;
}

export interface PartnerStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalPartners: number;
  activePartners: number;
  averageRating: number;
}

export type DashboardTab = 'overview' | 'events' | 'partners' | 'profile' | 'settings';

export interface PartnerProfileValues {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  website?: string;
  logoUrl?: string;
  services: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PartnerEventFormValues {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  maxAttendees?: number;
  tags?: string[];
}

export interface PartnershipRequest {
  id: string;
  partner_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  terms_accepted: boolean;
}

export interface PartnerService {
  id: string;
  partner_id: string;
  name: string;
  description: string;
  service_type: string;
  pricing_model: 'fixed' | 'percentage' | 'subscription' | 'custom';
  pricing_details: Record<string, any>;
  coverage_areas?: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerReview {
  id: string;
  partner_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  response?: string;
  response_date?: string;
}
