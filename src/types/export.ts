// Export Opportunities System Types

export interface ExportOpportunity {
  id: string;
  exporter_id: string;
  title: string;
  commodity: string;
  destination_country: string;
  destination_city?: string;
  volume_required: number;
  unit: string;
  price_per_unit?: number;
  currency: string;
  quality_requirements?: string[];
  certification_requirements?: string[];
  shipping_terms?: string;
  payment_terms?: string;
  deadline?: string;
  description?: string;
  status: 'active' | 'closed' | 'suspended';
  verification_status: 'pending' | 'verified' | 'rejected';
  farmer_verifier_1?: string;
  farmer_verifier_2?: string;
  verification_date_1?: string;
  verification_date_2?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  exporter_profile?: ExporterProfile;
}

export interface ExportApplication {
  id: string;
  opportunity_id: string;
  farmer_id: string;
  proposed_volume: number;
  proposed_price?: number;
  delivery_timeline?: string;
  quality_certifications?: string[];
  sample_images?: string[];
  cover_letter?: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
  exporter_notes?: string;
  created_at: string;
  updated_at: string;
  opportunity?: ExportOpportunity;
  workflow_stages?: ExportWorkflowStatus[];
  documents?: ExportDocumentLink[];
}

export interface ExportDocumentLink {
  id: string;
  application_id: string;
  document_type: string;
  document_name: string;
  external_url: string;
  uploaded_by: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_by?: string;
  verification_notes?: string;
  created_at: string;
  expires_at?: string;
}

export interface ExportWorkflowStatus {
  id: string;
  application_id: string;
  stage: 'inquiry' | 'negotiation' | 'contract' | 'documentation' | 'shipping' | 'payment' | 'completed';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  notes?: string;
  updated_by?: string;
}

export interface ExportVerification {
  id: string;
  opportunity_id: string;
  verifier_id: string;
  verification_type: 'exporter_profile' | 'opportunity_details' | 'business_legitimacy';
  status: 'approved' | 'rejected' | 'needs_info';
  comments?: string;
  evidence_links?: string[];
  created_at: string;
}

export interface ExporterProfile {
  id: string;
  user_id: string;
  company_name: string;
  business_registration_number?: string;
  export_license_number?: string;
  tax_id?: string;
  business_address: string;
  contact_person: string;
  phone_number: string;
  email: string;
  website_url?: string;
  years_in_business?: number;
  export_markets?: string[];
  commodities_handled?: string[];
  annual_export_volume?: number;
  certifications?: string[];
  verification_badge: 'unverified' | 'basic' | 'verified' | 'premium';
  farmer_verifications_count: number;
  successful_exports_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface ExportFilters {
  commodity?: string;
  destination_country?: string;
  min_volume?: number;
  max_volume?: number;
  min_price?: number;
  max_price?: number;
  certification_requirements?: string[];
  shipping_terms?: string;
  deadline_from?: string;
  deadline_to?: string;
  verification_status?: 'verified' | 'pending';
}

export interface ExportOpportunityFormData {
  title: string;
  commodity: string;
  destination_country: string;
  destination_city?: string;
  volume_required: number;
  unit: string;
  price_per_unit?: number;
  currency: string;
  quality_requirements?: string[];
  certification_requirements?: string[];
  shipping_terms?: string;
  payment_terms?: string;
  deadline?: string;
  description?: string;
  expires_at?: string;
}

export interface ExportApplicationFormData {
  proposed_volume: number;
  proposed_price?: number;
  delivery_timeline?: string;
  quality_certifications?: string[];
  sample_images?: string[];
  cover_letter?: string;
}

// Constants
export const EXPORT_COMMODITIES = [
  'Coffee',
  'Tea',
  'Avocados',
  'French Beans',
  'Snow Peas',
  'Macadamia Nuts',
  'Cashew Nuts',
  'Mangoes',
  'Pineapples',
  'Flowers',
  'Herbs',
  'Spices',
  'Coconut',
  'Sisal',
  'Cotton',
  'Pyrethrum',
  'Other'
] as const;

export const EXPORT_COUNTRIES = [
  'Netherlands',
  'Germany',
  'United Kingdom',
  'France',
  'Belgium',
  'United States',
  'Japan',
  'China',
  'India',
  'UAE',
  'Saudi Arabia',
  'Egypt',
  'South Africa',
  'Other'
] as const;

export const SHIPPING_TERMS = [
  'FOB (Free on Board)',
  'CIF (Cost, Insurance, Freight)',
  'CFR (Cost and Freight)',
  'EXW (Ex Works)',
  'FCA (Free Carrier)',
  'CPT (Carriage Paid To)',
  'CIP (Carriage and Insurance Paid)',
  'DAP (Delivered at Place)',
  'DPU (Delivered at Place Unloaded)',
  'DDP (Delivered Duty Paid)'
] as const;

export const QUALITY_REQUIREMENTS = [
  'Organic Certified',
  'Fair Trade Certified',
  'GlobalGAP Certified',
  'HACCP Compliant',
  'ISO 22000',
  'Rainforest Alliance',
  'UTZ Certified',
  'BRC Certified',
  'IFS Certified',
  'Pesticide Residue Free',
  'Non-GMO',
  'Kosher Certified',
  'Halal Certified'
] as const;

export const DOCUMENT_TYPES = [
  'Export License',
  'Phytosanitary Certificate',
  'Certificate of Origin',
  'Quality Certificate',
  'Organic Certificate',
  'Fair Trade Certificate',
  'Invoice',
  'Packing List',
  'Bill of Lading',
  'Insurance Certificate',
  'Inspection Report',
  'Other'
] as const;
