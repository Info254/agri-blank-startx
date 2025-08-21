
import { ServiceProvider, ServiceProviderType } from '@/types';
import { simulateDelay } from '../apiUtils';
import { serviceProviders } from '../mockData/serviceProviders';

export const fetchServiceProviders = async (type?: ServiceProviderType): Promise<ServiceProvider[]> => {
  await simulateDelay(800);
  
  if (type) {
    return serviceProviders.filter(provider => provider.businessType === type);
  }
  
  return serviceProviders;
};

export const getServiceProviderById = async (id: string): Promise<ServiceProvider | null> => {
  await simulateDelay(500);
  
  const provider = serviceProviders.find(p => p.id === id);
  
  return provider || null;
};

export const registerServiceProvider = async (providerData: Omit<ServiceProvider, 'id' | 'rating' | 'reviewCount' | 'verified' | 'createdAt' | 'updatedAt'>): Promise<ServiceProvider> => {
  await simulateDelay(1000);
  
  const newProvider: ServiceProvider = {
    ...providerData,
    id: `sp${serviceProviders.length + 1}`,
    rating: 0,
    reviewCount: 0,
    verified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newProvider;
};
