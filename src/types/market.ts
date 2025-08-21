
// Market-related types
export interface Market {
  id: string;
  name: string;
  county: string;
  location: {
    county: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  producePrices: {
    id: string;
    produceName: string;
    price: number;
    unit: string;
    date?: string;
    produceId?: string; // Added to support legacy code
  }[];
  demand?: string;
  operatingHours?: string;
}

export interface MarketPriceRecord {
  id: string;
  market_id: string;
  market_name: string;
  county: string;
  commodity_name: string;
  price: number;
  unit: string;
  date_recorded: string;
  source: string;
  confidence_score: number;
  verified: boolean;
}

export interface MarketForecastRecord {
  id: string;
  commodity_name: string;
  county: string;
  current_price: number;
  forecast_price: number;
  confidence_level: number;
  period: string;
  factors?: any;
  created_at: string;
  valid_until: string;
}

export interface MarketSentimentRecord {
  id: string;
  commodity_name: string;
  county: string;
  sentiment_score: number;
  report_count: number;
  tags: string[];
  issues: string[];
  created_at: string;
  updated_at: string;
}

export interface MarketLinkage {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  participants: number;
  tags: string[];
  name?: string;
  providerName?: string;
  crops: string[];
  markets: string[];
  type?: string;
  requirements?: string[];
  benefits?: string[];
  contactInfo?: string;
}

export interface Forecast {
  id: string;
  produceName: string;
  period: string;
  expectedProduction: number;
  expectedDemand: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  county?: string;
  unit?: string;
  produceId?: string; // Added to support legacy code
}
