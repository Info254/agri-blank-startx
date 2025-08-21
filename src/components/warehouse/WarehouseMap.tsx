
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { fetchWarehouses } from '@/services/kilimoAPI';
import { Warehouse } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import WarehousePin from './WarehousePin';
import WarehouseDetails from './WarehouseDetails';
import AddWarehouseForm from './AddWarehouseForm';

const WarehouseMap: React.FC = () => {
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isAddingWarehouse, setIsAddingWarehouse] = useState(false);

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
  };

  const handleWarehouseClick = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  const handleAddWarehouse = () => {
    setIsAddingWarehouse(true);
  };

  const handleCloseAddWarehouseDialog = () => {
    setIsAddingWarehouse(false);
  };

  const handleSubmitWarehouse = () => {
    setIsAddingWarehouse(false);
  };

  // Get coordinates for the warehouse
  const getCoordinates = (warehouse: Warehouse) => {
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
                <WarehousePin
                  key={warehouse.id}
                  warehouse={warehouse}
                  onClick={handleWarehouseClick}
                  style={{
                    left: `${((coords.lng - 34) / 8) * 100}%`,
                    top: `${((coords.lat + 1) / 5) * 100}%`,
                  }}
                />
              );
            })}
            
            {/* Simple county boundaries (would be replaced by actual map in real implementation) */}
            <div className="absolute inset-0 border-2 border-dashed border-gray-300 m-4 rounded-md pointer-events-none"></div>
          </div>
        )}

        {/* Selected warehouse details */}
        {selectedWarehouse && (
          <WarehouseDetails 
            warehouse={selectedWarehouse} 
            onClose={handleCloseWarehouseDetails} 
          />
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
          
          <AddWarehouseForm
            onSubmit={handleSubmitWarehouse}
            onCancel={handleCloseAddWarehouseDialog}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WarehouseMap;
