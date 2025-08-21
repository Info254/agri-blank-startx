export type ServiceProviderType = 
  | "storage"
  | "transport" 
  | "quality-control"
  | "training"
  | "input-supplier"
  | "inspector"
  | "market-linkage"
  | "insurance-provider"
  | "soil-testing-provider"
  | "drone-satellite-imagery-provider"
  | "iot-sensor-data-provider"
  | "export-transporters"
  | "shippers";

export interface ServiceProvider {
  id: string;
  name: string;
  business_name: string;
  description: string;
  businessType: ServiceProviderType;
  provider_category: string;
  services: string[];
  tags: string[];
  location: {
    county: string;
    specificLocation: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  rating: number;
  reviewCount: number;
  verified: boolean;
  licenses?: string[];
  insurance_details?: string;
  certifications?: string[];
  experience?: string;
  pricing?: {
    model: string;
    rates: Record<string, number>;
  };
  availability?: {
    days: string[];
    hours: string;
  };
  capacity?: {
    max_load?: number;
    storage_capacity?: number;
    equipment?: string[];
  };
}