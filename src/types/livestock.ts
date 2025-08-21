import { Market } from './market';

export type LivestockType = 'cattle' | 'poultry' | 'sheep_goats' | 'pigs' | 'fish' | 'other';
export type AnimalGender = 'male' | 'female' | 'castrated_male';
export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type SlaughterMethod = 'halal' | 'jhatka' | 'secular' | 'other';

export interface LivestockBreed {
  id: string;
  name: string;
  type: LivestockType;
  purpose: ('dairy' | 'meat' | 'wool' | 'dual_purpose')[];
  origin?: string;
  characteristics?: string[];
}

export interface LivestockHealthRecord {
  id: string;
  animalId: string;
  date: string;
  healthStatus: HealthStatus;
  weight?: number; // in kg
  temperature?: number; // in Celsius
  vaccinations: {
    name: string;
    date: string;
    nextDueDate: string;
    verifiedBy?: string;
  }[];
  treatments: {
    name: string;
    date: string;
    dosage: string;
    withdrawalPeriod?: number; // in days
  }[];
  notes?: string;
  veterinarian?: string;
}

export interface LivestockBreedingRecord {
  id: string;
  animalId: string;
  type: 'mating' | 'calving' | 'hatching' | 'weaning';
  date: string;
  parentIds?: string[]; // For tracking lineage
  notes?: string;
  offspringCount?: number;
  success: boolean;
}

export interface LivestockFeedRecord {
  id: string;
  animalId: string;
  date: string;
  feedType: string;
  amount: number; // in kg
  cost?: number;
  supplier?: string;
  notes?: string;
}

export interface LivestockMarket extends Market {
  livestockCategories: LivestockType[];
  hasQuarantineFacilities: boolean;
  hasVeterinaryServices: boolean;
  hasSlaughterFacilities: boolean;
  slaughterMethods: SlaughterMethod[];
  halalCertified: boolean;
  halalCertificationBody?: string;
  certificationExpiryDate?: string;
  animalWelfareStandards: string[]; // e.g., 'free_range', 'organic', 'grass_fed'
  auctionDays: string[];
  specialHandlingRequirements?: string[];
  
  // Additional market-specific requirements
  requiresHealthCertification: boolean;
  requiresMovementPermit: boolean;
  maximumTransportHours?: number; // For animal welfare
  
  // Market timing for different livestock
  marketHours: {
    [key in LivestockType]?: {
      startTime: string;
      endTime: string;
      specialNotes?: string;
    };
  };
}

export interface LivestockForSale {
  id: string;
  marketId: string;
  sellerId: string;
  type: LivestockType;
  breed: string;
  gender: AnimalGender;
  age: number; // in months
  weight: number; // in kg
  healthStatus: HealthStatus;
  price: number;
  pricePerKg?: number;
  quantity: number;
  description?: string;
  images: string[];
  
  // Halal specific
  isHalal: boolean;
  halalCertificateNumber?: string;
  halalCertificationBody?: string;
  
  // Health and breeding
  vaccinationRecords: Array<{
    name: string;
    date: string;
  }>;
  breedingHistory?: string;
  
  // Additional attributes
  color?: string;
  specialFeatures?: string[];
  tags?: string[]; // For additional categorization
  
  // Transport and handling
  transportRequirements?: string[];
  specialHandlingInstructions?: string;
  
  // Audit trail
  createdAt: string;
  updatedAt: string;
  verifiedBy?: string;
}

export interface LivestockAuction extends LivestockForSale {
  auctionStartTime: string;
  auctionEndTime: string;
  startingBid: number;
  currentBid?: number;
  minimumIncrement: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  winnerId?: string;
  finalPrice?: number;
  bids: Array<{
    id: string;
    bidderId: string;
    amount: number;
    timestamp: string;
    status: 'leading' | 'outbid' | 'won' | 'lost';
  }>;
}

export interface HalalCertification {
  id: string;
  certificationBody: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  scope: string[]; // Types of animals/products covered
  certifierContact: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
}

export interface AnimalWelfareChecklist {
  id: string;
  name: string;
  description: string;
  requirements: Array<{
    id: string;
    description: string;
    isRequired: boolean;
    verificationMethod: string;
  }>;
  applicableTo: LivestockType[];
  certificationBodies: string[];
}
