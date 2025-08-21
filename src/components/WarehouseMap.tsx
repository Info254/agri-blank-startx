
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Plus, Warehouse as WarehouseIcon, Thermometer, FileCheck, Clock } from 'lucide-react';
import { fetchWarehouses } from '@/services/kilimoAPI';
import { Warehouse as WarehouseType } from '@/types';
import { useToast } from '@/hooks/use-toast';

// In a real app, this would use a mapping library like Mapbox or Google Maps
// This is a simplified visual representation

const WarehouseMap: React.FC = () => {
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | null>(null);
  const [isAddingWarehouse, setIsAddingWarehouse] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 }); // Nairobi as default
  const [mapZoom, setMapZoom] = useState(6);

  // Form state for adding a warehouse
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [warehouseCounty, setWarehouseCounty] = useState('');
  const [warehouseCapacity, setWarehouseCapacity] = useState('');
  const [warehouseGoods, setWarehouseGoods] = useState('');
  const [warehouseHasRefrigeration, setWarehouseHasRefrigeration] = useState(false);

  useEffect(() => {
    const loadWarehouses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWarehouses();
        setWarehouses(data);
      } catch (error) {
        console.error('Error loading warehouses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load warehouse data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWarehouses();
  }, [toast]);

  const handleCloseWarehouseDetails = () => {
    setSelectedWarehouse(null);
    setIsAddingWarehouse(false);
  };

  const handleWarehouseClick = (warehouse: WarehouseType) => {
    setSelectedWarehouse(warehouse);
  };

  const handleAddWarehouse = () => {
    setIsAddingWarehouse(true);
    setSelectedWarehouse(null);
  };

  const handleSubmitWarehouse = () => {
    if (!warehouseName || !warehouseLocation || !warehouseCounty || !warehouseCapacity) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Warehouse Added',
      description: `${warehouseName} has been submitted for approval`,
    });

    // Reset form
    setWarehouseName('');
    setWarehouseLocation('');
    setWarehouseCounty('');
    setWarehouseCapacity('');
    setWarehouseGoods('');
    setWarehouseHasRefrigeration(false);
    setIsAddingWarehouse(false);
  };

  // Get pin color based on warehouse type
  const getPinColor = (warehouse: WarehouseType) => {
    if (warehouse.hasRefrigeration) return 'bg-blue-500';
    if (warehouse.hasCertifications) return 'bg-green-500';
    return 'bg-red-500';
  };

  // Get coordinates for the warehouse
  const getCoordinates = (warehouse: WarehouseType) => {
    // First try direct properties
    if (typeof warehouse.latitude === 'number' && typeof warehouse.longitude === 'number') {
      return { lat: warehouse.latitude, lng: warehouse.longitude };
    }
    
    // Then try nested location object
    if (warehouse.location && warehouse.location.coordinates) {
      return {
        lat: warehouse.location.coordinates.latitude,
        lng: warehouse.location.coordinates.longitude
      };
    }
    
    // Default values based on Kenya regions
    return { 
      lat: -1.2921 + (Math.random() * 2 - 1),
      lng: 36.8219 + (Math.random() * 2 - 1)
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Warehouse Locations</CardTitle>
            <CardDescription>Find storage facilities across Kenya</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddWarehouse}>
            <Plus className="mr-2 h-4 w-4" /> Add Warehouse
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="relative border rounded-md h-[400px] bg-gray-100 overflow-hidden">
            {/* Map background */}
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover opacity-20"></div>
            
            {/* Map pins */}
            {warehouses.map((warehouse) => {
              const coords = getCoordinates(warehouse);
              return (
                <div
                  key={warehouse.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${((coords.lng - 34) / 8) * 100}%`,
                    top: `${((coords.lat + 1) / 5) * 100}%`,
                  }}
                  onClick={() => handleWarehouseClick(warehouse)}
                >
                  <div className={`w-3 h-3 rounded-full ${getPinColor(warehouse)} ring-4 ring-white ring-opacity-60`}></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-md text-sm whitespace-nowrap mb-2 transition-opacity">
                    {warehouse.name}
                  </div>
                </div>
              );
            })}
            
            {/* Simple county boundaries (would be replaced by actual map in real implementation) */}
            <div className="absolute inset-0 border-2 border-dashed border-gray-300 m-4 rounded-md pointer-events-none"></div>
          </div>
        )}

        {/* Selected warehouse details */}
        {selectedWarehouse && (
          <div className="mt-4 border rounded-md p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{selectedWarehouse.name}</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseWarehouseDetails}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedWarehouse.location && typeof selectedWarehouse.location !== 'string' ? selectedWarehouse.location.county : 'Location not specified'}</span>
                </p>
                <p className="mt-2">
                  <span className="font-medium">Capacity:</span> {selectedWarehouse.capacity} {selectedWarehouse.capacityUnit}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Rates:</span> {selectedWarehouse.rates}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Contact:</span> {selectedWarehouse.contactInfo || 'Not available'}
                </p>
              </div>
              
              <div>
                <p className="flex items-start">
                  <WarehouseIcon className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                  <span>
                    <span className="font-medium">Goods Types:</span><br />
                    {selectedWarehouse.goodsTypes.join(', ')}
                  </span>
                </p>
                
                {selectedWarehouse.hasRefrigeration && (
                  <p className="mt-2 flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Refrigeration Available</span>
                  </p>
                )}
                
                {selectedWarehouse.hasCertifications && (
                  <p className="mt-2 flex items-center">
                    <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                    <span>
                      Certifications: {selectedWarehouse.certificationTypes?.join(', ') || 'Not specified'}
                    </span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button>Contact Warehouse</Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Add warehouse dialog */}
      <Dialog open={isAddingWarehouse} onOpenChange={(open) => !open && setIsAddingWarehouse(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Warehouse</DialogTitle>
            <DialogDescription>
              Submit your warehouse to be listed on our platform. It will be reviewed by our team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Warehouse Name</Label>
              <Input
                id="name"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                placeholder="e.g. Nakuru Cold Storage"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  placeholder="e.g. Industrial Area, Nakuru"
                />
              </div>
              
              <div>
                <Label htmlFor="county">County</Label>
                <Select value={warehouseCounty} onValueChange={setWarehouseCounty}>
                  <SelectTrigger id="county">
                    <SelectValue placeholder="Select County" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nairobi">Nairobi</SelectItem>
                    <SelectItem value="Nakuru">Nakuru</SelectItem>
                    <SelectItem value="Mombasa">Mombasa</SelectItem>
                    <SelectItem value="Kisumu">Kisumu</SelectItem>
                    <SelectItem value="Uasin Gishu">Uasin Gishu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="capacity">Storage Capacity</Label>
              <div className="flex space-x-2">
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={warehouseCapacity}
                  onChange={(e) => setWarehouseCapacity(e.target.value)}
                  placeholder="e.g. 5000"
                  className="flex-1"
                />
                <Select defaultValue="tons">
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="sq-m">Square Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="goods">Goods Types</Label>
              <Textarea
                id="goods"
                value={warehouseGoods}
                onChange={(e) => setWarehouseGoods(e.target.value)}
                placeholder="e.g. Cereals, Fruits, Vegetables (comma separated)"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="refrigeration" 
                checked={warehouseHasRefrigeration}
                onCheckedChange={(checked) => setWarehouseHasRefrigeration(checked === true)}
              />
              <Label htmlFor="refrigeration">Has Refrigeration</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseWarehouseDetails}>Cancel</Button>
            <Button onClick={handleSubmitWarehouse}>Submit Warehouse</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WarehouseMap;
