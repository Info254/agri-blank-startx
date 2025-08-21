
import { Warehouse } from '@/types';
import { Transporter } from '../types';

export const getWarehouseRecommendations = (crop: string, warehouses: Warehouse[]): string => {
  try {
    if (warehouses.length === 0) {
      return `Currently, I don't have information on warehouses that can store ${crop}. As more warehouses join our network, I'll be able to provide recommendations. Would you like to explore other services instead?`;
    }
    
    const relevantWarehouses = warehouses.filter(warehouse => 
      warehouse.goodsTypes.some(type => type.toLowerCase().includes(crop.toLowerCase()))
    );
    
    if (relevantWarehouses.length === 0) {
      return `I don't have specific warehouse data for ${crop} at the moment. Would you like me to help you find storage options for another crop?`;
    }
    
    const warehousesList = relevantWarehouses.slice(0, 3).map(warehouse => {
      // Handle county field safely, checking if it exists either directly or in location object
      const countyFromWarehouse = warehouse.county || '';
      const countyFromLocation = warehouse.location && typeof warehouse.location !== 'string' ? 
        warehouse.location.county || '' : '';
      const county = countyFromWarehouse || countyFromLocation || 'Unknown location';
      
      // For displaying location, prioritize county from either source
      const location = typeof warehouse.location === 'string' ? warehouse.location : 
        (warehouse.location ? warehouse.location.county : 'Unknown location');
      
      return `${warehouse.name} in ${location} (${county}): Capacity ${warehouse.capacity} ${warehouse.capacityUnit}, ${warehouse.hasRefrigeration ? 'has refrigeration' : 'no refrigeration'}`;
    }).join('\n- ');
    
    return `Here are some warehouses that can store ${crop}:\n- ${warehousesList}\n\nThese warehouses follow ethical storage practices, minimizing food waste through proper storage conditions. Would you like me to suggest a complete supply chain solution including transportation to these facilities and connecting with potential buyers?`;
  } catch (error) {
    console.error("Error in getWarehouseRecommendations:", error);
    return "I apologize, but I encountered an error while searching for warehouses. Would you like to try searching for another service?";
  }
};

export const getTransporterRecommendations = (location: string, transporters: Transporter[]): string => {
  try {
    if (transporters.length === 0) {
      return `Currently, I don't have information on transport providers serving ${location}. As more transporters join our network, I'll be able to provide recommendations. Is there another location you'd like to check?`;
    }
    
    const relevantTransporters = transporters.filter(transporter => 
      transporter.counties.some((county: string) => county.toLowerCase().includes(location.toLowerCase()))
    );
    
    if (relevantTransporters.length === 0) {
      return `I don't have specific transporter data for ${location} at the moment. Would you like to check availability in a neighboring county?`;
    }
    
    const transportersList = relevantTransporters.slice(0, 3).map(transporter => 
      `${transporter.name}: ${transporter.contactInfo}, Capacity: ${transporter.loadCapacity}kg, ${transporter.hasRefrigeration ? 'has refrigeration' : 'no refrigeration'}, Carbon footprint: ${transporter.hasRefrigeration ? 'Medium' : 'Low'}`
    ).join('\n- ');
    
    return `Here are some transporters serving ${location}:\n- ${transportersList}\n\nThese transporters follow ethical practices including fair labor policies and optimized routes to reduce emissions. Would you like me to suggest a complete supply chain solution that connects you with both transporters and buyers?`;
  } catch (error) {
    console.error("Error in getTransporterRecommendations:", error);
    return "I apologize, but I encountered an error while searching for transporters. Would you like information about a different service?";
  }
};
