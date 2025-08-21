
// Search-related types
export type Category = 'all' | 'solutions' | 'issues' | 'reports' | 'tender' | 'awarded-tender' | 'agriculture';

export interface DataItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  subcategory?: string;
  date: string;
  location?: string;
  tags: string[];
  imageUrl?: string;
  source?: string;
  deadline?: string;
  contact?: string;
  content?: string;
  url?: string;
}

export interface SearchFilters {
  query?: string;
  category?: Category;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export const SOLUTION_CATEGORIES = ['farming', 'marketing', 'processing', 'financing', 'technology'];

// Define the AwardedTender type
export interface AwardedTender {
  tenderno: string;
  tendersubject: string;
  finyrq: string;
  supplier: string;
  supplierscore: number;
  supplierbid: number;
  contactaddress: string;
  contactname: string;
  contacttel: string;
  contactemail: string;
  awarddate: string;
  awardedamount: number;
  currency: string;
  procuringentity: string;
  procuringentitycounty: string;
  procurementmethod: string;
}
