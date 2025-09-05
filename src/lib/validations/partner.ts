// @ts-nocheck
import { z } from 'zod';

// Common schemas
const phoneRegex = /^\+?[0-9\s-()]{10,}$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;


// Service categories enum
export const serviceCategoryEnum = [
  'input_supply',
  'technical_assistance',
  'financial_services',
  'market_access',
  'logistics',
  'processing',
  'training',
  'consulting',
  'other'
] as const;

// Service area schema
export const serviceAreaSchema = z.object({
  region: z.string().min(2, 'Region is required'),
  districts: z.array(z.string()).min(1, 'At least one district is required'),
  isNationwide: z.boolean().default(false)
});

// Address schema
export const addressSchema = z.object({
  street: z.string().min(2, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional()
  }).optional()
});

// Contact person schema
export const contactPersonSchema = z.object({
  name: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  position: z.string().min(2, 'Position is required')
});

// Document schema
export const documentSchema = z.object({
  type: z.enum(['registration', 'license', 'certificate', 'other']),
  name: z.string().min(2, 'Document name is required'),
  fileUrl: z.string().url('Invalid URL'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional()
});

// Main onboarding schema
export const onboardingSchema = z.object({
  // Basic Info
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  businessRegistrationNumber: z.string().min(3, 'Business registration number is required'),
  yearEstablished: z.number().min(1900).max(new Date().getFullYear()),
  companyDescription: z.string().min(20, 'Description must be at least 20 characters'),
  companyLogo: z.string().url('Invalid URL').or(z.literal('')),
  
  // Services
  serviceCategories: z.array(z.enum(serviceCategoryEnum)).min(1, 'Select at least one service category'),
  serviceDescription: z.string().min(20, 'Service description must be at least 20 characters'),
  serviceAreas: z.array(serviceAreaSchema).min(1, 'Specify at least one service area'),
  
  // Location
  address: addressSchema,
  operatingCountries: z.array(z.string()).min(1, 'Select at least one operating country'),
  hasMultipleLocations: z.boolean().default(false),
  additionalLocations: z.array(addressSchema.partial()).optional(),
  
  // Verification
  contactPerson: contactPersonSchema,
  documents: z.array(documentSchema).min(1, 'Upload at least one document'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Base schemas for reuse
export const partnerAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const partnerContactPersonSchema = z.object({
  name: z.string().min(1, 'Contact person name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  position: z.string().optional(),
});

export const partnerDocumentSchema = z.object({
  type: z.string().min(1, 'Document type is required'),
  url: z.string().url('Invalid URL').min(1, 'Document URL is required'),
  name: z.string().min(1, 'Document name is required'),
  uploadedAt: z.date().optional(),
});

export const partnerServiceAreaSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  regions: z.array(z.string()).min(1, 'At least one region is required'),
  cities: z.array(z.string()).optional(),
});

// Partner type enum
export const partnerServiceCategoryEnum = z.enum([
  'logistics',
  'financial',
  'input_supplier',
  'processor',
  'buyer',
  'extension_service',
  'government',
  'other'
]);

// Partner validation schemas
export const partnerTypeSchema = z.nativeEnum(PartnerType);

export const partnerServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  category: partnerServiceCategoryEnum,
  price: z.number().min(0, 'Price cannot be negative').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').default('KES'),
  unit: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Partner name is required'),
  type: partnerTypeSchema,
  description: z.string().optional(),
  logoUrl: z.string().url('Invalid URL').optional(),
  website: z.string().url('Invalid URL').optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: partnerAddressSchema,
  contactPerson: partnerContactPersonSchema.optional(),
  services: z.array(partnerServiceSchema).min(1, 'At least one service is required'),
  serviceAreas: z.array(partnerServiceAreaSchema).min(1, 'At least one service area is required'),
  documents: z.array(partnerDocumentSchema).optional(),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  rating: z.number().min(0).max(5).optional(),
});

// Partner creation/update form schema
export const partnerFormSchema = z.object({
  name: z.string().min(1, 'Partner name is required'),
  type: partnerTypeSchema,
  description: z.string().optional(),
  logo: z.any().optional(), // For file upload
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: partnerAddressSchema,
  contactPerson: partnerContactPersonSchema.optional(),
  services: z.array(partnerServiceSchema).min(1, 'At least one service is required'),
  serviceAreas: z.array(partnerServiceAreaSchema).min(1, 'At least one service area is required'),
  documents: z.array(z.any()).optional(), // For file uploads
});

// Partner search filters schema
export const partnerSearchFiltersSchema = z.object({
  query: z.string().optional(),
  types: z.array(partnerTypeSchema).optional(),
  services: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  minRating: z.number().min(0).max(5).optional(),
  isVerified: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'rating', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Partner event schema
export const partnerEventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Event title is required'),
  description: z.string().min(1, 'Event description is required'),
  startDate: z.string().or(z.date()).transform(val => new Date(val)),
  endDate: z.string().or(z.date()).transform(val => new Date(val)),
  location: z.string().min(1, 'Location is required'),
  imageUrl: z.string().url('Invalid URL').optional(),
  maxAttendees: z.number().int().positive().optional(),
  attendeesCount: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).optional(),
  partnerId: z.string().uuid(),
  isPublished: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Partner event form schema
export const partnerEventFormSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().min(1, 'Event description is required'),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(1, 'Location is required'),
  image: z.any().optional(), // For file upload
  imageUrl: z.string().url('Invalid URL').optional(),
  maxAttendees: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Partner profile values schema
export const partnerProfileValuesSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(1, 'Phone number is required'),
  description: z.string().min(1, 'Description is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  logoUrl: z.string().url('Invalid URL').optional(),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

// Export all schemas
export const partnerSchemas = {
  address: partnerAddressSchema,
  contactPerson: partnerContactPersonSchema,
  document: partnerDocumentSchema,
  serviceArea: partnerServiceAreaSchema,
  serviceCategory: partnerServiceCategoryEnum,
  partnerType: partnerTypeSchema,
  partnerService: partnerServiceSchema,
  partner: partnerSchema,
  partnerForm: partnerFormSchema,
  partnerSearchFilters: partnerSearchFiltersSchema,
  partnerEvent: partnerEventSchema,
  partnerEventForm: partnerEventFormSchema,
  partnerProfileValues: partnerProfileValuesSchema,
};

// Export types
export type Partner = z.infer<typeof partnerSchema>;
export type PartnerFormValues = z.infer<typeof partnerFormSchema>;
export type PartnerSearchFilters = z.infer<typeof partnerSearchFiltersSchema>;
export type PartnerEvent = z.infer<typeof partnerEventSchema>;
export type PartnerEventFormValues = z.infer<typeof partnerEventFormSchema>;
export type PartnerProfileValues = z.infer<typeof partnerProfileValuesSchema>;
