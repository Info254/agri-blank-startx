
import React from 'react';
import { Truck, Warehouse, Building, Store, MapPin, Pin } from 'lucide-react';

const MapLegend: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 mb-6">
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Truck className="h-5 w-5 text-blue-500" />
        <span className="text-sm">Transport</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Warehouse className="h-5 w-5 text-green-500" />
        <span className="text-sm">Storage</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Building className="h-5 w-5 text-purple-500" />
        <span className="text-sm">Training</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Store className="h-5 w-5 text-amber-500" />
        <span className="text-sm">Input Supply</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <Pin className="h-5 w-5 text-red-500" />
        <span className="text-sm">Quality Control</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
        <MapPin className="h-5 w-5 text-teal-500" />
        <span className="text-sm">Market Linkage</span>
      </div>
    </div>
  );
};

export default MapLegend;
