export interface CityMarket {
  id: string;
  market_name: string;
  market_type: 'wholesale' | 'retail' | 'specialized' | 'mixed';
  city: string;
  county: string;
  physical_address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operating_hours: string;
  operating_days: string[];
  market_fee_structure?: {
    daily_fee?: number;
    monthly_fee?: number;
    commission_percent?: number;
  };
  facilities?: string[];
  commodities_traded: string[];
  average_daily_traders: number;
  average_daily_buyers: number;
  established_year?: number;
  market_authority?: string;
  contact_phone?: string;
  contact_email?: string;
  website_url?: string;
  social_media?: {
    facebook?: string;
    twitter?: string;
    whatsapp_group?: string;
  };
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CityMarketFormData extends Omit<CityMarket, 'id' | 'created_at' | 'updated_at' | 'coordinates'> {
  coordinates: string; // For form input as "lat,lng"
}

export interface CityMarketFilters {
  searchTerm?: string;
  county?: string;
  marketType?: string;
  commodity?: string;
  hasFacilities?: string[];
  isVerified?: boolean;
  isActive?: boolean;
}
