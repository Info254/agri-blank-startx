
import React, { CSSProperties } from 'react';
import { Warehouse } from '@/types';

interface WarehousePinProps {
  warehouse: Warehouse;
  onClick: (warehouse: Warehouse) => void;
  style?: CSSProperties;
}

const WarehousePin: React.FC<WarehousePinProps> = ({ warehouse, onClick, style }) => {
  // Get pin color based on warehouse type
  const getPinColor = (warehouse: Warehouse) => {
    if (warehouse.hasRefrigeration) return 'bg-blue-500';
    if (warehouse.hasCertifications) return 'bg-green-500';
    return 'bg-red-500';
  };

  return (
    <div
      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
      onClick={() => onClick(warehouse)}
      style={style}
    >
      <div className={`w-3 h-3 rounded-full ${getPinColor(warehouse)} ring-4 ring-white ring-opacity-60`}></div>
      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-md text-sm whitespace-nowrap mb-2 transition-opacity">
        {warehouse.name}
      </div>
    </div>
  );
};

export default WarehousePin;
