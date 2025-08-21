
import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { KENYA_BOUNDS, KENYA_CENTER, createCustomIcon } from '@/utils/mapUtils.tsx';

// Type for provider with position
interface ProviderWithPosition extends ServiceProvider {
  position: [number, number];
}

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const useMapInstance = useMap;

interface ServiceProvidersMapProps {
  providers: ServiceProvider[];
  selectedType: ServiceProviderType | 'all';
}

const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMapInstance?.();
  
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const ServiceProvidersMapComponent: React.FC<ServiceProvidersMapProps> = ({ 
  providers, 
  selectedType
}) => {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
      import('leaflet.markercluster/dist/MarkerCluster.css'),
      import('leaflet.markercluster/dist/MarkerCluster.Default.css'),
    ]).then(([leafletModule]) => {
      setL(leafletModule.default);
    }).catch(error => {
      console.error("Failed to load map libraries", error);
      toast({
        title: "Map Error",
        description: "Could not load map components. Please try refreshing the page.",
        variant: "destructive",
      });
    });
  }, []);
  const { toast } = useToast();
  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (map) {
      setMapReady(true);
    }
  }, [map]);
  const [bounds, setBounds] = useState<import('leaflet').LatLngBounds | null>(null);

  // Filter providers based on selected type
  const filteredProviders = useMemo(() => {
    return selectedType === 'all' 
      ? providers 
      : providers.filter(provider => provider.businessType === selectedType);
  }, [providers, selectedType]);

  // Create markers for providers with valid coordinates
  const markers = useMemo<ProviderWithPosition[]>(() => {
    return filteredProviders
      .filter((provider): provider is ServiceProvider & { location: { coordinates: { latitude: number; longitude: number } } } => {
        const lat = provider.location?.coordinates?.latitude;
        const lng = provider.location?.coordinates?.longitude;
        return lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng);
      })
      .map(provider => ({
        ...provider,
        position: [provider.location.coordinates.latitude, provider.location.coordinates.longitude] as [number, number]
      }));
  }, [filteredProviders]);

  // Fit map to markers when they change
  useEffect(() => {
    if (map && markers.length > 0 && L) {
      const markerBounds = L.latLngBounds(
        markers.map(marker => marker.position)
      );
      
      // Add some padding
      markerBounds.pad(0.1);
      
      // Only set bounds if they're different to prevent infinite loop
      if (!bounds || !bounds.equals(markerBounds)) {
        setBounds(markerBounds);
        map.fitBounds(markerBounds, { padding: [50, 50] });
      }
    }
  }, [markers, map]);

  // Handle marker click
  const handleMarkerClick = useCallback((provider: ServiceProvider) => {
    toast({
      title: provider.name || 'Service Provider',
      description: provider.description || 'No description available',
    });
  }, [toast]);

  if (!L) {
    return (
      <div className="flex items-center justify-center h-[500px] w-full bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading Map Library...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg relative overflow-hidden border">
      <MapContainer
        center={KENYA_CENTER}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        minZoom={6}
        maxBounds={KENYA_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        ref={setMap}
      >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapController center={KENYA_CENTER} zoom={6} />
          
          {/* Render markers */}
          {markers.map((provider, index) => {
            const icon = createCustomIcon(provider.businessType);
            
            return (
              <Marker
                key={`${provider.id}-${index}`}
                position={provider.position}
                icon={icon}
                eventHandlers={{
                  click: () => handleMarkerClick(provider),
                }}
              >
                <Popup>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{provider.name}</h4>
                    <p className="text-sm text-gray-600">{provider.business_name}</p>
                    <p className="text-xs text-gray-500">
                      {provider.location.specificLocation || provider.location.county}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span className="mr-1">📍</span>
                      {provider.location.county}
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      {provider.services?.slice(0, 3).map((service, i) => (
                        <span 
                          key={i} 
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mr-1 mb-1"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => {
                        // Handle view details
                        toast({
                          title: `Viewing ${provider.name}`,
                          description: 'Provider details would open in a side panel.',
                        });
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      
      {!mapReady && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      
      {filteredProviders.length > 0 && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md z-[1000]">
          <p className="font-medium text-sm">
            Showing {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
            {selectedType !== 'all' ? ` of type ${selectedType.replace(/-/g, ' ')}` : ''}
          </p>
        </div>
      )}
      
      {filteredProviders.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-4">
            <h3 className="text-lg font-medium mb-2">No Providers Found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedType !== 'all' 
                ? `No ${selectedType.replace(/-/g, ' ')} providers found in this area.`
                : 'No service providers found in this area.'}
            </p>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => window.location.href = "/service-provider-registration"}
            >
              Register as Provider
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const LazyMap = lazy(() => Promise.resolve({ default: ServiceProvidersMapComponent }));

const ServiceProvidersMap: React.FC<ServiceProvidersMapProps> = (props) => (
  <Suspense fallback={
    <div className="flex items-center justify-center h-[500px] w-full bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading Map...</p>
    </div>
  }>
    <LazyMap {...props} />
  </Suspense>
);

export default ServiceProvidersMap;
