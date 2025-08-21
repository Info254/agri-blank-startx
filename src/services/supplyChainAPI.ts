import { Market, Forecast, Warehouse, TransportProvider, LogisticsProvider } from '@/types';
import { simulateDelay } from './apiUtils';
import { v4 as uuid } from 'uuid';

// Mock markets data
const markets: Market[] = [
  {
    id: "m1",
    name: "Wakulima Market",
    county: "Nairobi",
    location: {
      county: "Nairobi",
      coordinates: {
        latitude: -1.286389,
        longitude: 36.817223
      }
    },
    producePrices: [
      {
        id: "pp1",
        produceName: "Tomatoes",
        price: 120,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p1"
      },
      {
        id: "pp2",
        produceName: "Potatoes",
        price: 45,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p2"
      },
      {
        id: "pp3",
        produceName: "Onions",
        price: 80,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p3"
      }
    ],
    demand: "High demand for fresh vegetables and fruits",
    operatingHours: "4:00 AM - 6:00 PM"
  },
  {
    id: "m2",
    name: "Kongowea Market",
    county: "Mombasa",
    location: {
      county: "Mombasa",
      coordinates: {
        latitude: -4.043477,
        longitude: 39.668205
      }
    },
    producePrices: [
      {
        id: "pp4",
        produceName: "Tomatoes",
        price: 110,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p1"
      },
      {
        id: "pp5",
        produceName: "Potatoes",
        price: 50,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p2"
      },
      {
        id: "pp6",
        produceName: "Mangoes",
        price: 90,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p4"
      }
    ],
    demand: "High demand for coastal fruits",
    operatingHours: "5:00 AM - 7:00 PM"
  },
  {
    id: "m3",
    name: "Kibuye Market",
    county: "Kisumu",
    location: {
      county: "Kisumu",
      coordinates: {
        latitude: -0.091702,
        longitude: 34.767956
      }
    },
    producePrices: [
      {
        id: "pp7",
        produceName: "Tomatoes",
        price: 100,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p1"
      },
      {
        id: "pp8",
        produceName: "Tilapia",
        price: 350,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p5"
      },
      {
        id: "pp9",
        produceName: "Maize",
        price: 40,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p6"
      }
    ],
    demand: "High demand for fish and lake region produce",
    operatingHours: "6:00 AM - 6:00 PM"
  },
  {
    id: "m4",
    name: "Nakuru Municipal Market",
    county: "Nakuru",
    location: {
      county: "Nakuru",
      coordinates: {
        latitude: -0.303099,
        longitude: 36.080025
      }
    },
    producePrices: [
      {
        id: "pp10",
        produceName: "Tomatoes",
        price: 115,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p1"
      },
      {
        id: "pp11",
        produceName: "Potatoes",
        price: 35,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p2"
      },
      {
        id: "pp12",
        produceName: "Carrots",
        price: 60,
        unit: "kg",
        date: "2023-05-01",
        produceId: "p7"
      }
    ],
    demand: "Moderate demand for various vegetables",
    operatingHours: "5:00 AM - 7:00 PM"
  }
];

// Mock forecasts data
const forecasts: Forecast[] = [
  {
    id: "f1",
    produceName: "Tomatoes",
    period: "June 2023",
    expectedProduction: 12500,
    expectedDemand: 13000,
    confidenceLevel: "high",
    county: "Nairobi",
    unit: "tons",
    produceId: "p1"
  },
  {
    id: "f2",
    produceName: "Potatoes",
    period: "June 2023",
    expectedProduction: 20000,
    expectedDemand: 18000,
    confidenceLevel: "medium",
    county: "Nakuru",
    unit: "tons",
    produceId: "p2"
  },
  {
    id: "f3",
    produceName: "Maize",
    period: "June 2023",
    expectedProduction: 35000,
    expectedDemand: 40000,
    confidenceLevel: "low",
    county: "Uasin Gishu",
    unit: "tons",
    produceId: "p6"
  },
  {
    id: "f4",
    produceName: "Coffee",
    period: "June 2023",
    expectedProduction: 8000,
    expectedDemand: 10000,
    confidenceLevel: "high",
    county: "Kiambu",
    unit: "tons",
    produceId: "p8"
  },
  {
    id: "f5",
    produceName: "Tea",
    period: "June 2023",
    expectedProduction: 15000,
    expectedDemand: 16000,
    confidenceLevel: "medium",
    county: "Kericho",
    unit: "tons",
    produceId: "p9"
  }
];

// Mock warehouses data
const warehouses: Warehouse[] = [
  {
    id: "w1",
    name: "Nairobi Cold Storage",
    location: {
      county: "Nairobi",
      specificLocation: "Industrial Area",
      coordinates: {
        latitude: -1.3031934,
        longitude: 36.8719419
      }
    },
    capacity: 5000,
    capacityUnit: "tons",
    hasRefrigeration: true,
    hasCertifications: true,
    certificationTypes: ["HACCP", "ISO 22000"],
    goodsTypes: ["Vegetables", "Fruits", "Dairy"],
    rates: "KES 100 per cubic meter per day",
    contact: "John Doe",
    contactInfo: "john@nairobi-storage.co.ke | +254 712 345 678"
  },
  {
    id: "w2",
    name: "Mombasa Port Warehouse",
    location: {
      county: "Mombasa",
      specificLocation: "Port Area",
      coordinates: {
        latitude: -4.0434103,
        longitude: 39.6682066
      }
    },
    capacity: 10000,
    capacityUnit: "tons",
    hasRefrigeration: true,
    hasCertifications: true,
    certificationTypes: ["ISO 9001", "FDA Approved"],
    goodsTypes: ["Grains", "Pulses", "Export Goods"],
    rates: "KES 80 per cubic meter per day",
    contact: "Alice Wambui",
    contactInfo: "alice@mombasa-port.co.ke | +254 723 456 789"
  },
  {
    id: "w3",
    name: "Eldoret Grain Storage",
    location: {
      county: "Uasin Gishu",
      specificLocation: "Outskirts",
      coordinates: {
        latitude: 0.5142774,
        longitude: 35.2697795
      }
    },
    capacity: 8000,
    capacityUnit: "tons",
    hasRefrigeration: false,
    hasCertifications: true,
    certificationTypes: ["KEBS Certified"],
    goodsTypes: ["Maize", "Wheat", "Barley"],
    rates: "KES 50 per cubic meter per day",
    contact: "Robert Kipkorir",
    contactInfo: "robert@eldoret-grain.co.ke | +254 734 567 890"
  },
  {
    id: "w4",
    name: "Nakuru Fresh Produce Storage",
    location: {
      county: "Nakuru",
      specificLocation: "Industrial Area",
      coordinates: {
        latitude: -0.3016667,
        longitude: 36.0800001
      }
    },
    capacity: 3000,
    capacityUnit: "tons",
    hasRefrigeration: true,
    hasCertifications: true,
    certificationTypes: ["GlobalG.A.P.", "HACCP"],
    goodsTypes: ["Vegetables", "Fruits", "Flowers"],
    rates: "KES 120 per cubic meter per day",
    contact: "Mary Njeri",
    contactInfo: "mary@nakuru-fresh.co.ke | +254 745 678 901"
  }
];

// Mock transport providers data
const transportProviders: TransportProvider[] = [
  {
    id: "tp1",
    name: "Fast Track Logistics",
    serviceType: "Full load transport",
    counties: ["Nairobi", "Kiambu", "Machakos", "Kajiado"],
    contactInfo: "info@fasttracklogistics.co.ke | +254 712 345 678",
    capacity: "Up to 200 tons daily",
    loadCapacity: 28,
    rates: "KES 100 per km for full truck",
    hasRefrigeration: true,
    vehicleType: "Refrigerated trucks",
    availableTimes: ["Weekdays", "Weekends"],
    latitude: -1.2921,
    longitude: 36.8219
  },
  {
    id: "tp2",
    name: "Coast Movers",
    serviceType: "Containerized transport",
    counties: ["Mombasa", "Kilifi", "Kwale", "Taita Taveta"],
    contactInfo: "booking@coastmovers.co.ke | +254 723 456 789",
    capacity: "Up to 500 tons weekly",
    loadCapacity: 40,
    rates: "KES 90 per km for container",
    hasRefrigeration: true,
    vehicleType: "Container trucks",
    availableTimes: ["Weekdays"],
    latitude: -4.0435,
    longitude: 39.6682
  },
  {
    id: "tp3",
    name: "Rift Express",
    serviceType: "Less than truckload",
    counties: ["Nakuru", "Nyandarua", "Laikipia", "Baringo"],
    contactInfo: "operations@riftexpress.co.ke | +254 734 567 890",
    capacity: "Up to 20 tons daily",
    loadCapacity: 5,
    rates: "KES 2000 per ton for shared truck",
    hasRefrigeration: false,
    vehicleType: "Open trucks",
    availableTimes: ["Weekdays", "Saturdays"],
    latitude: -0.3030,
    longitude: 36.0800
  },
  {
    id: "tp4",
    name: "Lake Region Transporters",
    serviceType: "Mixed cargo",
    counties: ["Kisumu", "Siaya", "Homa Bay", "Migori"],
    contactInfo: "dispatch@lakeregion.co.ke | +254 745 678 901",
    capacity: "Up to 80 tons daily",
    loadCapacity: 18,
    rates: "KES 80 per km for full truck",
    hasRefrigeration: false,
    vehicleType: "Flatbed trucks",
    availableTimes: ["Weekdays", "Weekends"],
    latitude: -0.0917,
    longitude: 34.7680
  }
];

// API Functions

export const getAllMarkets = async (): Promise<Market[]> => {
  await simulateDelay();
  return markets;
};

export const getMarketById = async (id: string): Promise<Market | null> => {
  await simulateDelay();
  return markets.find(market => market.id === id) || null;
};

export const getMarketsByCounty = async (county: string): Promise<Market[]> => {
  await simulateDelay();
  return markets.filter(market => market.county.toLowerCase() === county.toLowerCase());
};

export const getAllForecasts = async (): Promise<Forecast[]> => {
  await simulateDelay();
  return forecasts;
};

export const getForecastsByCounty = async (county: string): Promise<Forecast[]> => {
  await simulateDelay();
  return forecasts.filter(forecast => forecast.county && forecast.county.toLowerCase() === county.toLowerCase());
};

export const getForecastsByProduce = async (produceName: string): Promise<Forecast[]> => {
  await simulateDelay();
  return forecasts.filter(forecast => 
    forecast.produceName.toLowerCase() === produceName.toLowerCase()
  );
};

export const getAllWarehouses = async (): Promise<Warehouse[]> => {
  await simulateDelay();
  return warehouses;
};

export const getWarehousesByCounty = async (county: string): Promise<Warehouse[]> => {
  await simulateDelay();
  return warehouses.filter(warehouse => warehouse.location.county.toLowerCase() === county.toLowerCase());
};

export const getWarehouseById = async (id: string): Promise<Warehouse | null> => {
  await simulateDelay();
  return warehouses.find(warehouse => warehouse.id === id) || null;
};

export const getAllTransportProviders = async (): Promise<TransportProvider[]> => {
  await simulateDelay();
  return transportProviders;
};

export const getTransportProvidersByCounty = async (county: string): Promise<TransportProvider[]> => {
  await simulateDelay();
  return transportProviders.filter(provider => 
    provider.counties.some(c => c.toLowerCase() === county.toLowerCase())
  );
};

export const getTransportProviderById = async (id: string): Promise<TransportProvider | null> => {
  await simulateDelay();
  return transportProviders.find(provider => provider.id === id) || null;
};

export const bookWarehouse = async (bookingDetails: any): Promise<any> => {
  await simulateDelay();
  return {
    id: uuid(),
    ...bookingDetails,
    status: "pending",
    createdAt: new Date().toISOString()
  };
};

export const requestTransport = async (requestDetails: any): Promise<any> => {
  await simulateDelay();
  return {
    id: uuid(),
    ...requestDetails,
    status: "pending",
    createdAt: new Date().toISOString()
  };
};

// Get all logistics providers (combined functionality for backwards compatibility)
export const getAllLogisticsProviders = async (): Promise<(TransportProvider | Warehouse)[]> => {
  await simulateDelay();
  
  // Combine transport providers and warehouses into one list
  const providers = [
    ...transportProviders.map(provider => ({
      ...provider,
      type: 'transport'
    })) as TransportProvider[],
    ...warehouses.map(warehouse => ({
      id: warehouse.id,
      name: warehouse.name,
      type: 'storage',
      location: {
        county: warehouse.location.county,
        coordinates: warehouse.location.coordinates
      },
      capacity: warehouse.capacity,
      capacityUnit: warehouse.capacityUnit,
      hasRefrigeration: warehouse.hasRefrigeration,
      goodsTypes: warehouse.goodsTypes,
      rates: warehouse.rates,
      contactInfo: warehouse.contactInfo || `${warehouse.contact}`,
    })) as unknown as Warehouse[]
  ];
  
  return providers;
};

export const getMarketPricesForProduce = async (produceName: string): Promise<any[]> => {
  await simulateDelay();
  
  // Extract all prices for the specified produce from all markets
  const prices = markets.flatMap(market => {
    const matchingPrices = market.producePrices.filter(
      price => price.produceName.toLowerCase() === produceName.toLowerCase()
    );
    
    return matchingPrices.map(price => ({
      marketId: market.id,
      marketName: market.name,
      county: market.county,
      price: price.price,
      unit: price.unit,
      date: price.date,
      produceName: price.produceName
    }));
  });
  
  return prices;
};

export const getProduceList = async (): Promise<string[]> => {
  await simulateDelay();
  
  // Extract unique produce names from market prices
  const produceSet = new Set<string>();
  
  markets.forEach(market => {
    market.producePrices.forEach(price => {
      produceSet.add(price.produceName);
    });
  });
  
  return Array.from(produceSet);
};

export const getCountyList = async (): Promise<string[]> => {
  await simulateDelay();
  
  // Extract unique counties from markets
  const countySet = new Set<string>();
  
  markets.forEach(market => {
    countySet.add(market.county);
  });
  
  // Add counties from forecasts that might not have markets
  forecasts.forEach(forecast => {
    if (forecast.county) {
      countySet.add(forecast.county);
    }
  });
  
  return Array.from(countySet);
};

// For demonstration purposes
export const generateSupplyChainAnalysis = async (): Promise<any> => {
  await simulateDelay();
  
  return {
    bottlenecks: [
      { 
        id: "b1",
        issue: "Limited cold chain infrastructure",
        impact: "High post-harvest losses for perishables",
        recommendation: "Invest in mobile cold storage solutions"
      },
      { 
        id: "b2",
        issue: "Poor road conditions to rural farms",
        impact: "Increased transport costs and damage to produce",
        recommendation: "Establish aggregation centers near main roads"
      },
      { 
        id: "b3",
        issue: "Limited market information for farmers",
        impact: "Price disparity and exploitation by middlemen",
        recommendation: "Scale up market price information systems"
      }
    ],
    opportunityAreas: [
      {
        id: "o1",
        opportunity: "Value addition for fruits and vegetables",
        potential: "Reduced wastage and increased income",
        requirements: "Processing equipment and training"
      },
      {
        id: "o2",
        opportunity: "Cooperative transport arrangements",
        potential: "Reduced logistics costs for small-scale farmers",
        requirements: "Coordination platform and trust-building"
      },
      {
        id: "o3",
        opportunity: "Digital marketplace for direct sales",
        potential: "Better prices for producers and consumers",
        requirements: "Mobile app development and logistics partnerships"
      }
    ]
  };
};
