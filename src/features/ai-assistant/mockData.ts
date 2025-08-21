
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from './types';

// Mock transporters data
export const mockTransporters: Transporter[] = [
  {
    id: "t1",
    name: "Fast Track Logistics",
    counties: ["Nairobi", "Kiambu", "Machakos"],
    contactInfo: "fasttrack@example.com | +254 712 345 678",
    hasRefrigeration: true,
    vehicleType: "Refrigerated Truck",
    loadCapacity: 5000,
    rates: "KES 25 per km",
    serviceType: "Same-day delivery",
    capacity: "5 tons",
    availableTimes: ["Monday-Friday: 8am-5pm", "Saturday: 8am-12pm"]
  },
  {
    id: "t2",
    name: "Sunrise Transporters",
    counties: ["Nakuru", "Nairobi", "Naivasha"],
    contactInfo: "sunrise@example.com | +254 723 456 789",
    hasRefrigeration: false,
    vehicleType: "Flatbed Truck",
    loadCapacity: 8000,
    rates: "KES 20 per km",
    serviceType: "Standard delivery",
    capacity: "8 tons",
    availableTimes: ["Monday-Saturday: 7am-6pm"]
  },
  {
    id: "t3",
    name: "Cool Chain Logistics",
    counties: ["Mombasa", "Kilifi", "Kwale"],
    contactInfo: "coolchain@example.com | +254 734 567 890",
    hasRefrigeration: true,
    vehicleType: "Refrigerated Van",
    loadCapacity: 2000,
    rates: "KES 30 per km",
    serviceType: "Premium refrigerated",
    capacity: "2 tons",
    availableTimes: ["24/7 service"]
  },
  {
    id: "t4",
    name: "Upcountry Movers",
    counties: ["Kisumu", "Siaya", "Homabay", "Migori"],
    contactInfo: "upcountry@example.com | +254 745 678 901",
    hasRefrigeration: false,
    vehicleType: "Open Truck",
    loadCapacity: 10000,
    rates: "KES 18 per km",
    serviceType: "Bulk transport",
    capacity: "10 tons",
    availableTimes: ["Monday-Friday: 6am-6pm"]
  },
  {
    id: "t5",
    name: "Highlands Express",
    counties: ["Nyeri", "Kirinyaga", "Murang'a", "Nyandarua"],
    contactInfo: "highlands@example.com | +254 756 789 012",
    hasRefrigeration: true,
    vehicleType: "Hybrid Truck",
    loadCapacity: 4000,
    rates: "KES 22 per km",
    serviceType: "Mixed cargo",
    capacity: "4 tons",
    availableTimes: ["Monday-Saturday: 8am-8pm"]
  }
];

// Mock markets data
export const mockMarkets: Market[] = [
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
        id: "p1",
        produceName: "Tomatoes",
        price: 80,
        unit: "kg"
      },
      {
        id: "p2",
        produceName: "Potatoes",
        price: 45,
        unit: "kg"
      },
      {
        id: "p3",
        produceName: "Onions",
        price: 60,
        unit: "kg"
      }
    ]
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
        id: "p4",
        produceName: "Mangoes",
        price: 50,
        unit: "kg"
      },
      {
        id: "p5",
        produceName: "Bananas",
        price: 65,
        unit: "bunch"
      },
      {
        id: "p6",
        produceName: "Coconuts",
        price: 30,
        unit: "piece"
      }
    ]
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
        id: "p7",
        produceName: "Fish (Tilapia)",
        price: 250,
        unit: "kg"
      },
      {
        id: "p8",
        produceName: "Maize",
        price: 40,
        unit: "kg"
      },
      {
        id: "p9",
        produceName: "Beans",
        price: 120,
        unit: "kg"
      }
    ]
  }
];

// Mock forecasts data
export const mockForecasts: Forecast[] = [
  {
    id: "f1",
    produceName: "Tomatoes",
    period: "next week",
    expectedProduction: 1200,
    expectedDemand: 1500,
    confidenceLevel: "high",
  },
  {
    id: "f2",
    produceName: "Potatoes",
    period: "next month",
    expectedProduction: 5000,
    expectedDemand: 4800,
    confidenceLevel: "medium",
  },
  {
    id: "f3",
    produceName: "Mangoes",
    period: "next week",
    expectedProduction: 3500,
    expectedDemand: 4000,
    confidenceLevel: "high",
  },
  {
    id: "f4",
    produceName: "Maize",
    period: "next season",
    expectedProduction: 15000,
    expectedDemand: 18000,
    confidenceLevel: "low",
  },
  {
    id: "f5",
    produceName: "Beans",
    period: "next month",
    expectedProduction: 2200,
    expectedDemand: 2000,
    confidenceLevel: "medium",
  }
];

// Mock warehouses data
export const mockWarehouses: Warehouse[] = [
  {
    id: "w1",
    name: "NairoCool Storage",
    location: {
      county: "Nairobi",
      coordinates: {
        latitude: -1.286389,
        longitude: 36.817223
      }
    },
    capacity: 5000,
    hasRefrigeration: true,
    goodsTypes: ["Vegetables", "Fruits", "Dairy", "Meat"],
    rates: "KES 5 per kg per day",
    contact: "info@nairocool.co.ke"
  },
  {
    id: "w2",
    name: "Mombasa Port Storage",
    location: {
      county: "Mombasa",
      coordinates: {
        latitude: -4.043477,
        longitude: 39.668205
      }
    },
    capacity: 8000,
    hasRefrigeration: true,
    goodsTypes: ["Fish", "Seafood", "Fruits", "Export goods"],
    rates: "KES 6 per kg per day",
    contact: "storage@mombasaport.co.ke"
  },
  {
    id: "w3",
    name: "Nakuru Grain Depot",
    location: {
      county: "Nakuru",
      coordinates: {
        latitude: -0.303099,
        longitude: 36.080025
      }
    },
    capacity: 10000,
    hasRefrigeration: false,
    goodsTypes: ["Maize", "Wheat", "Beans", "Rice", "Cereals"],
    rates: "KES 2.5 per kg per month",
    contact: "info@nakurugraindepot.co.ke"
  },
  {
    id: "w4",
    name: "Kisumu Lake Warehouse",
    location: {
      county: "Kisumu",
      coordinates: {
        latitude: -0.091702,
        longitude: 34.767956
      }
    },
    capacity: 6000,
    hasRefrigeration: true,
    goodsTypes: ["Fish", "Rice", "Vegetables", "General goods"],
    rates: "KES 4 per kg per day",
    contact: "storage@kisumuwarehouse.co.ke"
  }
];
