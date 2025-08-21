/**
 * Service Providers API
 * Handles fetching and managing service provider data
 */

import { ServiceProvider, ServiceProviderType, QualityControlDiscussion, TrainingEvent, MarketLinkage, LogisticsProvider } from '@/types';
import { simulateDelay } from './apiUtils';
import { AmisKeApiHandler } from './amis-ke/api-handler';

// Import the correct exports from mock data files
import { serviceProviders as importedServiceProviders } from './mockData/serviceProviders';
import { discussions } from './mockData/discussions';
import { mockTrainingEvents } from './mockData/trainingEvents';
import { marketLinkages } from './mockData/marketLinkages';

// Mock data for initial development/demo
const mockServiceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Nairobi Cold Chain Solutions",
    businessType: "storage",
    description: "Temperature-controlled warehousing solutions for agricultural produce",
    services: ["Cold storage", "Inventory management", "Quality monitoring"],
    location: {
      county: "Nairobi",
      specificLocation: "Industrial Area",
      coordinates: {
        latitude: -1.286389,
        longitude: 36.817223
      }
    },
    contactInfo: "info@nairobicoldchain.co.ke | +254 712 345 678",
    rates: "KES 5 per kg per day",
    tags: ["cold-storage", "vegetables", "fruits", "dairy"],
    verified: true,
    rating: 4.5,
    reviewCount: 27,
    createdAt: "2023-01-15",
    updatedAt: "2023-06-10"
  },
  {
    id: "2",
    name: "Mombasa Logistics Ltd",
    businessType: "transport",
    description: "Specialized transportation for fresh agricultural produce to major markets",
    services: ["Refrigerated transport", "Last mile delivery", "Cross-border logistics"],
    location: {
      county: "Mombasa",
      specificLocation: "Port Area",
      coordinates: {
        latitude: -4.043477,
        longitude: 39.668205
      }
    },
    contactInfo: "operations@mombasalogistics.co.ke | +254 723 456 789",
    rates: "KES 25 per km per ton",
    tags: ["refrigerated-transport", "export", "port-clearance"],
    verified: true,
    rating: 4.2,
    reviewCount: 38,
    createdAt: "2022-08-20",
    updatedAt: "2023-05-18"
  },
  {
    id: "3",
    name: "Nakuru Quality Control Services",
    businessType: "quality-control",
    description: "Agricultural certification and quality control services",
    services: ["Product testing", "Certification", "Training", "Compliance support"],
    location: {
      county: "Nakuru",
      specificLocation: "Industrial Park",
      coordinates: {
        latitude: -0.303099,
        longitude: 36.080025
      }
    },
    contactInfo: "quality@nakuruqcs.co.ke | +254 734 567 890",
    rates: "KES 5,000 per certification",
    tags: ["testing", "certification", "training", "compliance"],
    verified: true,
    rating: 4.7,
    reviewCount: 42,
    createdAt: "2023-02-12",
    updatedAt: "2023-07-22"
  },
  {
    id: "4",
    name: "Eldoret Grain Storage",
    businessType: "storage",
    description: "Bulk grain and cereal storage facilities with moisture control",
    services: ["Dry storage", "Pest control", "Moisture monitoring"],
    location: {
      county: "Uasin Gishu",
      specificLocation: "Outskirts",
      coordinates: {
        latitude: 0.514277,
        longitude: 35.269779
      }
    },
    contactInfo: "storage@eldoretgrain.co.ke | +254 745 678 901",
    rates: "KES 2 per kg per month",
    tags: ["grain-storage", "cereals", "drying", "pest-control"],
    verified: true,
    rating: 4.3,
    reviewCount: 31,
    createdAt: "2022-11-05",
    updatedAt: "2023-06-30"
  },
  {
    id: "5",
    name: "Kisumu Market Linkage",
    businessType: "market-linkage",
    description: "Connection between farmers and buyers across Western Kenya",
    services: ["Buyer-seller matching", "Contract negotiation", "Price intelligence"],
    location: {
      county: "Kisumu",
      specificLocation: "City Center",
      coordinates: {
        latitude: -0.091702,
        longitude: 34.767956
      }
    },
    contactInfo: "connect@kisumumarketlink.co.ke | +254 756 789 012",
    rates: "5% commission on successful deals",
    tags: ["market-access", "contracts", "price-negotiation"],
    verified: true,
    rating: 4.6,
    reviewCount: 53,
    createdAt: "2023-03-10",
    updatedAt: "2023-07-15"
  }
];

// Fetch providers from API with fallback to mock data
export const fetchServiceProviders = async (): Promise<ServiceProvider[]> => {
  try {
    // Try to get real service provider data from the API
    const apiProviders = await AmisKeApiHandler.get<ServiceProvider>('service-providers', {}, importedServiceProviders);
    
    // Check if we received valid data
    if (apiProviders && apiProviders.results && apiProviders.results.length > 0) {
      return apiProviders.results;
    }
    
    console.log('Falling back to mock service provider data');
    return importedServiceProviders;
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return importedServiceProviders;
  }
};

// Filter providers by type, county, etc.
export const filterProviders = (
  providers: ServiceProvider[],
  filters: {
    type?: ServiceProviderType | 'all',
    county?: string,
    service?: string,
    search?: string
  }
): ServiceProvider[] => {
  return providers.filter(provider => {
    // Filter by type
    if (filters.type && filters.type !== 'all' && provider.businessType !== filters.type) {
      return false;
    }
    
    // Filter by county
    if (filters.county && provider.location.county.toLowerCase() !== filters.county.toLowerCase()) {
      return false;
    }
    
    // Filter by service
    if (filters.service && !provider.services.some(s => s.toLowerCase().includes(filters.service!.toLowerCase()))) {
      return false;
    }
    
    // Filter by search text
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        provider.name.toLowerCase().includes(searchTerm) ||
        provider.description.toLowerCase().includes(searchTerm) ||
        provider.services.some(s => s.toLowerCase().includes(searchTerm)) ||
        provider.tags.some(t => t.toLowerCase().includes(searchTerm))
      );
    }
    
    return true;
  });
};

// Get provider by ID
export const getProviderById = async (id: string): Promise<ServiceProvider | null> => {
  const providers = await fetchServiceProviders();
  return providers.find(provider => provider.id === id) || null;
};

// Register a new service provider
export const registerServiceProvider = async (provider: Omit<ServiceProvider, 'id'>): Promise<ServiceProvider> => {
  try {
    // In a real app, this would submit to an API
    console.log('Registering new service provider:', provider);
    
    // Generate mock success response
    return {
      ...provider,
      id: `new-${Date.now()}`
    };
  } catch (error) {
    console.error('Error registering service provider:', error);
    throw error;
  }
};

// Fetch quality control discussions
export const fetchQualityDiscussions = async (): Promise<QualityControlDiscussion[]> => {
  try {
    // Try to get real discussions from the API
    const apiDiscussions = await AmisKeApiHandler.get<QualityControlDiscussion>('quality-discussions', {}, discussions);
    
    // Check if we received valid data
    if (apiDiscussions && apiDiscussions.results && apiDiscussions.results.length > 0) {
      return apiDiscussions.results;
    }
    
    console.log('Falling back to mock quality discussions data');
    return discussions;
  } catch (error) {
    console.error('Error fetching quality discussions:', error);
    return discussions;
  }
};

// Fetch training events
export const fetchTrainingEvents = async (): Promise<TrainingEvent[]> => {
  try {
    // Try to get real events from the API
    const apiEvents = await AmisKeApiHandler.get<TrainingEvent>('training-events', {}, mockTrainingEvents);
    
    // Check if we received valid data
    if (apiEvents && apiEvents.results && apiEvents.results.length > 0) {
      return apiEvents.results;
    }
    
    console.log('Falling back to mock training events data');
    return mockTrainingEvents;
  } catch (error) {
    console.error('Error fetching training events:', error);
    return mockTrainingEvents;
  }
};

// Fetch market linkages
export const fetchMarketLinkages = async (): Promise<MarketLinkage[]> => {
  try {
    // Try to get real linkages from the API
    const apiLinkages = await AmisKeApiHandler.get<MarketLinkage>('market-linkages', {}, marketLinkages);
    
    // Check if we received valid data
    if (apiLinkages && apiLinkages.results && apiLinkages.results.length > 0) {
      return apiLinkages.results;
    }
    
    console.log('Falling back to mock market linkages data');
    return marketLinkages;
  } catch (error) {
    console.error('Error fetching market linkages:', error);
    return marketLinkages;
  }
};
