
import React from 'react';
import { Button } from '@/components/ui/button';
import { Warehouse } from '@/types';
import { MapPin, WarehouseIcon, Thermometer, FileCheck } from 'lucide-react';

interface WarehouseDetailsProps {
  warehouse: Warehouse;
  onClose: () => void;
}

const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({ warehouse, onClose }) => {
  // Safely get county from either direct property or nested location
  const getCounty = () => {
    if (warehouse.county) return warehouse.county;
    if (typeof warehouse.location === 'object' && warehouse.location && warehouse.location.county) {
      return warehouse.location.county;
    }
    return 'Location not specified';
  };

  const county = getCounty();

  return (
    <div className="mt-4 border rounded-md p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{warehouse.name}</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{county}</span>
          </p>
          <p className="mt-2">
            <span className="font-medium">Capacity:</span> {warehouse.capacity} {warehouse.capacityUnit}
          </p>
          <p className="mt-2">
            <span className="font-medium">Rates:</span> {warehouse.rates}
          </p>
          <p className="mt-2">
            <span className="font-medium">Contact:</span> {warehouse.contactInfo || warehouse.contact || 'Not available'}
          </p>
        </div>
        
        <div>
          <p className="flex items-start">
            <WarehouseIcon className="h-4 w-4 mr-2 text-gray-500 mt-1" />
            <span>
              <span className="font-medium">Goods Types:</span><br />
              {warehouse.goodsTypes.join(', ')}
            </span>
          </p>
          
          {warehouse.hasRefrigeration && (
            <p className="mt-2 flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
              <span>Refrigeration Available</span>
            </p>
          )}
          
          {warehouse.hasCertifications && (
            <p className="mt-2 flex items-center">
              <FileCheck className="h-4 w-4 mr-2 text-green-500" />
              <span>
                Certifications: {warehouse.certificationTypes?.join(', ') || 'Not specified'}
              </span>
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button>Contact Warehouse</Button>
      </div>
    </div>
  );
};

export default WarehouseDetails;
