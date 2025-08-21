
// Logistics-related types
export interface Warehouse {
  id: string;
  name: string;
  location: {
    county: string;
    specificLocation?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  county?: string; // For backwards compatibility
  latitude?: number; // For direct access
  longitude?: number; // For direct access
  capacity: number;
  capacityUnit?: string;
  hasRefrigeration: boolean;
  hasCertifications?: boolean;
  certificationTypes?: string[];
  goodsTypes: string[];
  rates: string;
  contact?: string;
  contactInfo?: string;
}

export interface TransportProvider {
  id: string;
  name: string;
  serviceType: string;
  counties: string[];
  contactInfo: string;
  capacity: string;
  loadCapacity: number;
  rates: string;
  hasRefrigeration: boolean;
  vehicleType: string;
  availableTimes?: string[];
  latitude?: number;
  longitude?: number;
}

export interface LogisticsProvider {
  id: string;
  name: string;
  serviceType: string;
  counties: string[];
  contactInfo: string;
  capacity: string;
  rates: string;
  hasRefrigeration: boolean;
}

export interface TransportRequest {
  id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'confirmed';
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  capacity: string;
  transporterName?: string;
  price?: number;
  // Support additional fields for backward compatibility
  farmerId?: string;
  farmerName?: string;
  origin?: string;
  destination?: string;
  produceType?: string;
  quantity?: number;
  unit?: string;
  requiredDate?: string;
  hasSpecialRequirements?: boolean;
  created?: string;
}

export interface WarehouseBooking {
  id: string;
  county: string;
  space: string;
  price: number;
  status?: string;
  // Support additional fields for backward compatibility
  userId?: string;
  userName?: string;
  warehouseId?: string;
  warehouseName?: string;
  produceType?: string;
  quantity?: number;
  unit?: string;
  startDate?: string;
  endDate?: string;
  requiresRefrigeration?: boolean;
  created?: string;
}
