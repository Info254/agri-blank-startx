
// Farmer-related types
export interface Farmer {
  id: string;
  name: string;
  county: string;
  contacts: string;
  products: string[];
  farmSize: string;
  certifications?: string[];
  groups?: string[];
}

export interface FarmerGroup {
  id: string;
  name: string;
  region: string;
  cropFocus: string[];
  memberCount: number;
  description: string;
  contactPerson: string;
  contactInfo: string;
  established: string;
  isCooperative: boolean;
}

export interface Produce {
  id: string;
  name: string;
  category: string;
  county: string;
  quantity: number;
  unit: string;
  qualityGrade: string;
  availableFrom: string;
  farmer: string;
  farmerId: string;
}
