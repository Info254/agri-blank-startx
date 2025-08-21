
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ParcelMapViewProps {
  selectedParcel?: {
    id: string;
    name: string;
    size: number;
    crop: string;
    coordinates?: [number, number];
  };
}

const ParcelMapView: React.FC<ParcelMapViewProps> = ({ selectedParcel }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapReady, setMapReady] = useState(false);

  const initializeMap = async () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Dynamically import mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');

      mapboxgl.default.accessToken = mapboxToken;
      
      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: selectedParcel?.coordinates || [36.8219, -1.2921], // Default to Nairobi
        zoom: selectedParcel ? 15 : 6,
      });

      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.default.FullscreenControl(), 'top-right');

      // Add scale control
      map.current.addControl(new mapboxgl.default.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }));

      if (selectedParcel?.coordinates) {
        // Create a custom marker
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiMyMmMzNWUiIHN0cm9rZT0iIzE2YTM0YSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjYiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+)';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundSize = '100%';

        new mapboxgl.default.Marker(el)
          .setLngLat(selectedParcel.coordinates)
          .setPopup(
            new mapboxgl.default.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-bold text-sm">${selectedParcel.name}</h3>
                <p class="text-xs text-gray-600">Size: ${selectedParcel.size} acres</p>
                <p class="text-xs text-gray-600">Crop: ${selectedParcel.crop}</p>
                <p class="text-xs text-green-600 mt-1">Coordinates: ${selectedParcel.coordinates[1].toFixed(4)}, ${selectedParcel.coordinates[0].toFixed(4)}</p>
              </div>`
            )
          )
          .addTo(map.current);

        // Add a circle to represent the farm area (approximate)
        map.current.on('load', () => {
          const acreToRadius = Math.sqrt(selectedParcel.size * 4047) / 2; // Convert acres to approximate radius in meters
          
          map.current.addSource('farm-area', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: selectedParcel.coordinates
              }
            }
          });

          map.current.addLayer({
            id: 'farm-area-circle',
            type: 'circle',
            source: 'farm-area',
            paint: {
              'circle-radius': {
                base: 1.75,
                stops: [
                  [12, Math.max(5, acreToRadius / 100)],
                  [22, Math.max(10, acreToRadius / 10)]
                ]
              },
              'circle-color': '#22c55e',
              'circle-opacity': 0.3,
              'circle-stroke-color': '#16a34a',
              'circle-stroke-width': 2,
              'circle-stroke-opacity': 0.8
            }
          });
        });
      }

      setMapReady(true);
    } catch (error) {
      console.error('Error loading Mapbox:', error);
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, selectedParcel]);

  if (!mapboxToken) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Farm Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Mapbox Integration</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Mapbox provides free tier access with 50,000 map loads per month. Their technology is open-source 
                  and designed for agricultural applications.
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Free tier: 50,000 requests/month</li>
                  <li>• High-resolution satellite imagery</li>
                  <li>• Offline map capabilities</li>
                  <li>• Custom styling and agricultural overlays</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mapbox Public Token</label>
            <Input
              type="password"
              placeholder="pk.eyJ1IjoieW91ciUyMHVzZXJuYW1lIiwi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                Get your free token from{' '}
                <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                  mapbox.com
                </a>
              </p>
              <p>• Create account → Account → Tokens → Create new token</p>
              <p>• Ensure "Public" scopes are enabled for web use</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">Free Tier Available</Badge>
            <Badge variant="outline" className="text-xs">Open Source</Badge>
            <Badge variant="outline" className="text-xs">Agricultural Ready</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Farm Map
          {selectedParcel && ` - ${selectedParcel.name}`}
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">Satellite View</Badge>
          {selectedParcel && <Badge variant="default" className="text-xs">{selectedParcel.size} acres</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div ref={mapContainer} className="h-[400px] w-full rounded-b-lg" />
        {!mapReady && mapboxToken && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-b-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading satellite imagery...</p>
            </div>
          </div>
        )}
        
        {mapReady && selectedParcel && (
          <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-lg">
            <div className="text-xs space-y-1">
              <div className="font-medium">{selectedParcel.name}</div>
              <div className="text-gray-600">📍 {selectedParcel.coordinates?.[1].toFixed(4)}, {selectedParcel.coordinates?.[0].toFixed(4)}</div>
              <div className="text-green-600">🌾 {selectedParcel.crop}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParcelMapView;
