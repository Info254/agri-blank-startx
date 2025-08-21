// Re-export all types from their respective files
export * from './market';
export * from './logistics';
export * from './service-providers';
export * from './farmer';
export * from './search';
export * from './community';
export * from './stats';

export interface KilimoStats {
  id: string;
  name: string;
  category: string;
  county: string;
  value: string; // Changed from number to string to handle formatted values like "2.1 million bags"
  unit: string;
  source?: string; // Added optional source property
  verified?: boolean; // Added optional verified property
}
