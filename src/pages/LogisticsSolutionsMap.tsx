
import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { useToast } from '@/hooks/use-toast';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { fetchServiceProviders } from '@/services/serviceProvidersAPI';
import { Loader2 } from 'lucide-react';

// Import new components
const ServiceProvidersMap = lazy(() => import('@/components/logistics/ServiceProvidersMap'));

import MapLegend from '@/components/logistics/MapLegend';
import ProviderFilters from '@/components/logistics/ProviderFilters';
import ProvidersList from '@/components/logistics/ProvidersList';
import RegistrationPrompt from '@/components/logistics/RegistrationPrompt';

const LogisticsSolutionsMap: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceProviderType | 'all'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapReady, setMapReady] = useState(false);
  
  // Memoize filtered providers to prevent unnecessary recalculations
  const filteredProviders = useMemo(() => {
    let result = [...providers];
    
    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter(provider => provider.businessType === selectedType);
    }
    
    // Filter by county
    if (selectedCounty !== 'all') {
      result = result.filter(provider => 
        provider.location?.county?.toLowerCase() === selectedCounty.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(provider => 
        provider.name?.toLowerCase().includes(term) ||
        provider.business_name?.toLowerCase().includes(term) ||
        provider.description?.toLowerCase().includes(term) ||
        provider.services?.some(service => service.toLowerCase().includes(term))
      );
    }
    
    return result;
  }, [providers, selectedType, selectedCounty, searchTerm]);
  
  // Load providers on component mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true);
        const data = await fetchServiceProviders();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load service providers. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProviders();
  }, [toast]);
  
  // Handle map ready state
  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, []);

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedCounty('all');
    setSearchTerm('');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <MainNav />
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Logistics Solutions Map</h1>
          <p className="text-gray-600">
            Explore and connect with logistics service providers across Kenya
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <ProviderFilters
                selectedType={selectedType}
                selectedCounty={selectedCounty}
                searchTerm={searchTerm}
                setSelectedType={setSelectedType}
                setSelectedCounty={setSelectedCounty}
                setSearchTerm={setSearchTerm}
                filteredProvidersCount={filteredProviders.length}
                onResetFilters={resetFilters}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Legend</h2>
              <MapLegend />
            </div>

            <RegistrationPrompt />
          </div>

          {/* Map and Results */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="h-[500px] relative">
                                <Suspense fallback={
                  <div className="flex items-center justify-center h-[500px] w-full bg-gray-50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                }>
                  <ServiceProvidersMap 
                    providers={filteredProviders} 
                    selectedType={selectedType} 
                    onMapReady={handleMapReady}
                  />
                </Suspense>
                {!mapReady && !isLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Loading map...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">
                {filteredProviders.length} Service Provider{filteredProviders.length !== 1 ? 's' : ''} Found
                {selectedType !== 'all' && ` in ${selectedType.replace(/-/g, ' ')}`}
              </h2>
              <ProvidersList 
                providers={filteredProviders} 
                isLoading={isLoading}
                resetFilters={() => {
                  setSelectedType('all');
                  setSelectedCounty('all');
                  setSearchTerm('');
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogisticsSolutionsMap;
