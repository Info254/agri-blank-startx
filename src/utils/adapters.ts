import { Partner, PartnerEvent } from '@/types/partner';

// Type for database schema
interface PartnerDbSchema {
  id?: string;
  user_id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  services: string[];
  created_at?: string;
  updated_at?: string;
  is_verified: boolean;
  rating: number | null;
  review_count: number | null;
}

// Convert from database record to Partner interface
export const adaptPartnerFromDb = (data: any): Partner => {
  if (!data) throw new Error('Cannot adapt null data to Partner');
  
  return {
    id: data.id,
    user_id: data.user_id,
    name: data.company_name || '',
    email: data.contact_email || '',
    phone: data.contact_phone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    country: data.country || '',
    postalCode: data.postal_code || '',
    website: data.website || undefined,
    logoUrl: data.logo_url || undefined,
    description: data.description || '',
    services: Array.isArray(data.services) ? data.services : [],
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    isVerified: Boolean(data.is_verified),
    rating: typeof data.rating === 'number' ? data.rating : undefined,
    reviewCount: typeof data.review_count === 'number' ? data.review_count : undefined
  };
};

// Convert from Partner interface to database record
export const adaptPartnerToDb = (partner: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'> | Partial<Partner>): PartnerDbSchema => {
  return {
    user_id: partner.user_id!,
    company_name: partner.name!,
    contact_email: partner.email!,
    contact_phone: partner.phone || null,
    address: partner.address || null,
    city: partner.city || null,
    state: partner.state || null,
    country: partner.country || null,
    postal_code: partner.postalCode || null,
    website: partner.website || null,
    logo_url: partner.logoUrl || null,
    description: partner.description || null,
    services: partner.services || [],
    is_verified: partner.isVerified ?? false,
    rating: partner.rating || null,
    review_count: partner.reviewCount || null
  };
};

export const adaptEventFromApi = (data: any): PartnerEvent => {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    startDate: data.event_date || new Date().toISOString(),
    endDate: data.event_date || new Date(Date.now() + 3600000).toISOString(),
    location: data.location || '',
    imageUrl: data.image_url,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    partnerId: data.partner_id || '',
    maxAttendees: data.max_attendees,
    attendeesCount: data.attendees_count,
    tags: data.tags || []
  };
};
