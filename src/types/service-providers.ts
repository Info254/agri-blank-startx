
// Service Provider related types
export type ServiceProviderType = 'storage' | 'transport' | 'quality-control' | 'market-linkage' | 'training' | 'input-supplier' | 'inspector' | 'insurance-provider' | 'soil-testing-provider' | 'drone-satellite-imagery-provider' | 'iot-sensor-data-provider' | 'export-transporters' | 'shippers';

export interface ServiceProvider {
  id: string;
  name: string;
  business_name?: string;
  businessType: ServiceProviderType;
  provider_category?: string;
  description: string;
  services: string[];
  location: {
    county: string;
    specificLocation: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contactInfo: string;
  rates: string;
  tags: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  website?: string;
  capacity?: string;
  licenses?: string[];
  insurance_details?: string;
}

export interface QualityControlDiscussion {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  attendees: number;
  tags: string[];
  content?: string;
  authorName?: string;
  authorType?: string;
  commentCount?: number;
  viewCount?: number;
  createdAt?: string;
  authorId?: string; // Added to support legacy code
}

export interface TrainingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  trainer: string;
  capacity: number;
  attendees: number;
  tags: string[];
  providerName?: string;
  providerId?: string;
  topics?: string[];
  registeredCount?: number;
  cost?: number;
}
