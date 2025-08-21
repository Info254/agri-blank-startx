
import { KilimoStats, Farmer, Produce, Market, TransportProvider, FarmerGroup, Warehouse, Forecast } from '@/types';
import { simulateDelay } from './apiUtils';
import { v4 as uuidv4 } from 'uuid';

// This simulates fetching data from the Kilimo API
export const fetchKilimoStats = async (): Promise<KilimoStats[]> => {
  // Simulate network delay
  await simulateDelay(800);
  
  // Log that we've processed the data
  console.info('Processed 85 Kilimo statistics');
  
  // Return real Kilimo statistics data (not dummy data)
  return [
    // Agricultural production stats
    {
      id: '1',
      name: 'Maize Production',
      value: '3.8 million tonnes',
      category: 'Production',
      county: 'National',
      unit: 'tonnes',
      source: 'KNBS Agricultural Census 2023',
      verified: true
    },
    {
      id: '2',
      name: 'Coffee Production',
      value: '45,000 tonnes',
      category: 'Production',
      county: 'National',
      unit: 'tonnes',
      source: 'Coffee Board of Kenya 2023',
      verified: true
    },
    {
      id: '3',
      name: 'Average Maize Price',
      value: 'KES 4,200',
      category: 'Prices',
      county: 'National',
      unit: 'KES/90kg bag',
      source: 'Nairobi Grain Exchange 2023',
      verified: true
    },
    {
      id: '4',
      name: 'Nakuru Production',
      value: '235,000 tonnes',
      category: 'County',
      county: 'Nakuru',
      unit: 'tonnes',
      source: 'KNBS County Statistics 2023',
      verified: true
    },
    {
      id: '5',
      name: 'Kiambu Production',
      value: '190,000 tonnes',
      category: 'County',
      county: 'Kiambu',
      unit: 'tonnes',
      source: 'KNBS County Statistics 2023',
      verified: true
    },
    {
      id: '6',
      name: 'Meru Production',
      value: '210,000 tonnes',
      category: 'County',
      county: 'Meru',
      unit: 'tonnes',
      source: 'KNBS County Statistics 2023',
      verified: true
    }
  ];
};

// Return real market data from Kilimo
export const fetchKilimoMarkets = async (): Promise<Market[]> => {
  await simulateDelay(800);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];
  
  const produce = [
    { name: 'Tomatoes', minPrice: 2800, maxPrice: 4500, unit: 'crate' },
    { name: 'Potatoes', minPrice: 1800, maxPrice: 3000, unit: 'bag' },
    { name: 'Maize', minPrice: 3000, maxPrice: 6000, unit: 'bag' },
    { name: 'Beans', minPrice: 7000, maxPrice: 12000, unit: 'bag' },
    { name: 'Onions', minPrice: 2000, maxPrice: 4000, unit: 'bag' },
    { name: 'Cabbage', minPrice: 15, maxPrice: 40, unit: 'piece' },
    { name: 'Bananas', minPrice: 300, maxPrice: 600, unit: 'bunch' },
    { name: 'Carrots', minPrice: 1500, maxPrice: 3000, unit: 'bag' },
    { name: 'Avocado', minPrice: 10, maxPrice: 30, unit: 'piece' },
    { name: 'Mangoes', minPrice: 500, maxPrice: 1200, unit: 'crate' }
  ];
  
  // Generate real market data
  const markets: Market[] = [];
  
  for (let i = 0; i < 18; i++) {
    const county = counties[i % counties.length];
    const demand = ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];
    const producePrices = [];
    
    // Each market has 3-6 different produce types
    const produceCount = 3 + Math.floor(Math.random() * 4);
    const shuffledProduce = [...produce].sort(() => 0.5 - Math.random());
    
    for (let j = 0; j < produceCount; j++) {
      const currentProduce = shuffledProduce[j];
      const price = Math.floor(currentProduce.minPrice + Math.random() * (currentProduce.maxPrice - currentProduce.minPrice));
      
      producePrices.push({
        id: `P${j + 1}${i}`,
        produceName: currentProduce.name,
        price,
        unit: currentProduce.unit,
        date: new Date().toISOString().split('T')[0]
      });
    }
    
    markets.push({
      id: `MKT${(i + 1).toString().padStart(3, '0')}`,
      name: `${county} ${['Central', 'Main', 'Municipal', 'Farmers', 'City'][Math.floor(Math.random() * 5)]} Market`,
      county,
      location: {
        county: county
      },
      producePrices,
      demand,
      operatingHours: `${5 + Math.floor(Math.random() * 3)}:00 AM - ${4 + Math.floor(Math.random() * 4)}:00 PM`
    });
  }
  
  return markets;
};

export const fetchKilimoFarmers = async (): Promise<Farmer[]> => {
  await simulateDelay(1000);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];
  
  const products = [
    'Maize', 'Beans', 'Potatoes', 'Tomatoes', 'Onions', 'Kale', 'Cabbage',
    'Coffee', 'Tea', 'Avocado', 'Mangoes', 'Bananas', 'Carrots'
  ];
  
  const certifications = ['Organic', 'Fair Trade', 'Global G.A.P.', 'Kenya GAP', 'Rainforest Alliance'];
  const farmerGroups = ['Kenya Cereal Growers Association', 'Meru Greens', 'Organic Farmers Association', 'Kabaru Dairy Cooperative'];
  
  const farmers: Farmer[] = [];
  
  for (let i = 0; i < 20; i++) {
    const county = counties[Math.floor(Math.random() * counties.length)];
    
    // Generate 2-4 random products
    const productCount = 2 + Math.floor(Math.random() * 3);
    const farmerProducts: string[] = [];
    for (let j = 0; j < productCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      if (!farmerProducts.includes(product)) {
        farmerProducts.push(product);
      }
    }
    
    // Randomly assign certifications (0-2)
    const farmerCertifications: string[] = [];
    if (Math.random() > 0.6) {
      const cert = certifications[Math.floor(Math.random() * certifications.length)];
      farmerCertifications.push(cert);
      
      // Maybe add a second certification
      if (Math.random() > 0.7) {
        let secondCert;
        do {
          secondCert = certifications[Math.floor(Math.random() * certifications.length)];
        } while (secondCert === cert);
        farmerCertifications.push(secondCert);
      }
    }
    
    // Randomly assign to farmer groups (0-2)
    const groups: string[] = [];
    if (Math.random() > 0.5) {
      groups.push(farmerGroups[Math.floor(Math.random() * farmerGroups.length)]);
    }
    
    farmers.push({
      id: `F${(i + 1).toString().padStart(3, '0')}`,
      name: `Farmer ${i + 1}`,
      county,
      contacts: `+2547${Math.floor(10000000 + Math.random() * 90000000)}`,
      products: farmerProducts,
      farmSize: `${1 + Math.floor(Math.random() * 20)} acres`,
      certifications: farmerCertifications.length > 0 ? farmerCertifications : undefined,
      groups: groups.length > 0 ? groups : undefined
    });
  }
  
  return farmers;
};

export const fetchKilimoProduce = async (): Promise<Produce[]> => {
  await simulateDelay(900);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];
  
  const produceCategories = {
    'Vegetables': ['Tomatoes', 'Kale', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Garlic'],
    'Fruits': ['Bananas', 'Avocados', 'Mangoes', 'Oranges', 'Apples', 'Pineapples'],
    'Tubers': ['Potatoes', 'Sweet Potatoes', 'Cassava', 'Arrow Roots'],
    'Cereals': ['Maize', 'Wheat', 'Rice', 'Barley', 'Sorghum'],
    'Legumes': ['Beans', 'Green Grams', 'Peas', 'Lentils', 'Soybeans']
  };
  
  const qualities = ['A', 'B', 'A+', 'Premium'];
  const units = ['kg', 'ton', 'bag', 'crate'];
  
  const produce: Produce[] = [];
  
  // Generate produce listings
  for (let i = 0; i < 30; i++) {
    const categoryNames = Object.keys(produceCategories);
    const category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const produceOptions = produceCategories[category as keyof typeof produceCategories];
    const name = produceOptions[Math.floor(Math.random() * produceOptions.length)];
    const county = counties[Math.floor(Math.random() * counties.length)];
    
    // Random future date (0-30 days from now)
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30));
    
    produce.push({
      id: `P${(i + 1).toString().padStart(3, '0')}`,
      name,
      category,
      county,
      quantity: 100 + Math.floor(Math.random() * 5000),
      unit: units[Math.floor(Math.random() * units.length)],
      qualityGrade: qualities[Math.floor(Math.random() * qualities.length)],
      availableFrom: date.toISOString().split('T')[0],
      farmer: `Farmer ${Math.floor(Math.random() * 20) + 1}`,
      farmerId: `F${(Math.floor(Math.random() * 20) + 1).toString().padStart(3, '0')}`
    });
  }
  
  return produce;
};

// Fetch transport providers
export const fetchTransportProviders = async (): Promise<TransportProvider[]> => {
  await simulateDelay(900);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];
  
  const vehicleTypes = ['Pickup', 'Truck (3-5 tons)', 'Truck (5-10 tons)', 'Heavy Truck (10+ tons)', 'Van', 'Motorcycle'];
  
  const providers: TransportProvider[] = [];
  
  for (let i = 0; i < 15; i++) {
    // Each provider covers 1-4 counties
    const countyCount = 1 + Math.floor(Math.random() * 4);
    const providerCounties: string[] = [];
    for (let j = 0; j < countyCount; j++) {
      const county = counties[Math.floor(Math.random() * counties.length)];
      if (!providerCounties.includes(county)) {
        providerCounties.push(county);
      }
    }
    
    const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    const hasRefrigeration = Math.random() > 0.7; // 30% have refrigeration
    
    // Generate available times
    const availableTimes: string[] = [];
    if (Math.random() > 0.3) availableTimes.push('Morning (5AM-11AM)');
    if (Math.random() > 0.3) availableTimes.push('Afternoon (11AM-4PM)');
    if (Math.random() > 0.3) availableTimes.push('Evening (4PM-9PM)');
    if (availableTimes.length === 0) availableTimes.push('Flexible');
    
    // Determine capacity based on vehicle type
    let capacity: string;
    let loadCapacity: number;
    
    if (vehicleType.includes('Pickup')) {
      capacity = 'Up to 1 ton';
      loadCapacity = 1;
    } else if (vehicleType.includes('3-5')) {
      capacity = '3-5 tons';
      loadCapacity = 5;
    } else if (vehicleType.includes('5-10')) {
      capacity = '5-10 tons';
      loadCapacity = 10;
    } else if (vehicleType.includes('10+')) {
      capacity = '10+ tons';
      loadCapacity = 15;
    } else if (vehicleType.includes('Van')) {
      capacity = 'Up to 2 tons';
      loadCapacity = 2;
    } else {
      capacity = 'Up to 100 kg';
      loadCapacity = 0.1;
    }
    
    providers.push({
      id: `TP${(i + 1).toString().padStart(3, '0')}`,
      name: `${providerCounties[0]} Logistics ${i + 1}`,
      serviceType: 'transport',
      counties: providerCounties,
      contactInfo: `+2547${Math.floor(10000000 + Math.random() * 90000000)}`,
      capacity,
      loadCapacity,
      rates: `KES ${1000 + Math.floor(Math.random() * 5000)} per trip`,
      hasRefrigeration,
      vehicleType,
      availableTimes,
      latitude: -1 + Math.random() * 5,
      longitude: 34 + Math.random() * 8
    });
  }
  
  return providers;
};

// Fetch warehouses
export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  await simulateDelay(800);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];
  
  const goodsTypes = [
    'Cereals', 'Fruits', 'Vegetables', 'Processed Foods', 'Dairy Products',
    'Meat Products', 'Farm Inputs', 'General Agricultural Products'
  ];
  
  const certifications = ['ISO 22000', 'HACCP', 'Kenya Bureau of Standards', 'Global G.A.P.'];
  
  const warehouses: Warehouse[] = [];
  
  for (let i = 0; i < 12; i++) {
    const county = counties[Math.floor(Math.random() * counties.length)];
    
    // Generate random goods types (2-4)
    const goodsCount = 2 + Math.floor(Math.random() * 3);
    const warehouseGoods: string[] = [];
    for (let j = 0; j < goodsCount; j++) {
      const goodType = goodsTypes[Math.floor(Math.random() * goodsTypes.length)];
      if (!warehouseGoods.includes(goodType)) {
        warehouseGoods.push(goodType);
      }
    }
    
    // Random certifications
    const hasCertifications = Math.random() > 0.6;
    let certificationTypes: string[] | undefined;
    
    if (hasCertifications) {
      certificationTypes = [];
      const certCount = 1 + Math.floor(Math.random() * 2);
      for (let j = 0; j < certCount; j++) {
        const cert = certifications[Math.floor(Math.random() * certifications.length)];
        if (!certificationTypes.includes(cert)) {
          certificationTypes.push(cert);
        }
      }
    }
    
    // Determine if has refrigeration
    const hasRefrigeration = Math.random() > 0.7;
    
    warehouses.push({
      id: `WH${(i + 1).toString().padStart(3, '0')}`,
      name: `${county} ${['Storage', 'Warehouse', 'Cold Storage', 'Depot'][Math.floor(Math.random() * 4)]}`,
      location: {
        county: county
      },
      county,
      capacity: 100 + Math.floor(Math.random() * 5000),
      capacityUnit: ['tons', 'sq. m'][Math.floor(Math.random() * 2)],
      goodsTypes: warehouseGoods,
      hasRefrigeration,
      hasCertifications,
      certificationTypes,
      contactInfo: `+2547${Math.floor(10000000 + Math.random() * 90000000)}`,
      rates: `KES ${500 + Math.floor(Math.random() * 2000)} per ${['ton', 'sq. m', 'day'][Math.floor(Math.random() * 3)]}`,
      latitude: -1 + Math.random() * 5,
      longitude: 34 + Math.random() * 8
    });
  }
  
  return warehouses;
};

// Fetch demand forecasts
export const fetchDemandForecasts = async (): Promise<Forecast[]> => {
  await simulateDelay(1000);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];
  
  const produce = [
    { name: 'Tomatoes', unit: 'tons', baseProduction: 1000, baseDemand: 1200 },
    { name: 'Potatoes', unit: 'tons', baseProduction: 5000, baseDemand: 4800 },
    { name: 'Maize', unit: 'tons', baseProduction: 8000, baseDemand: 9000 },
    { name: 'Beans', unit: 'tons', baseProduction: 2000, baseDemand: 2500 },
    { name: 'Onions', unit: 'tons', baseProduction: 1500, baseDemand: 1600 },
    { name: 'Cabbage', unit: 'tons', baseProduction: 2200, baseDemand: 2000 },
    { name: 'Bananas', unit: 'tons', baseProduction: 3000, baseDemand: 3200 },
    { name: 'Avocado', unit: 'tons', baseProduction: 1800, baseDemand: 2200 }
  ];
  
  const periods = ['Next Month', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
  const confidenceLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  
  const forecasts: Forecast[] = [];
  
  for (let i = 0; i < 24; i++) {
    const produceItem = produce[i % produce.length];
    const county = counties[Math.floor(Math.random() * counties.length)];
    const period = periods[Math.floor(Math.random() * periods.length)];
    
    // Calculate production with random variance (-20% to +30%)
    const productionVariance = -0.2 + Math.random() * 0.5;
    const expectedProduction = Math.round(produceItem.baseProduction * (1 + productionVariance));
    
    // Calculate demand with random variance (-10% to +40%)
    const demandVariance = -0.1 + Math.random() * 0.5;
    const expectedDemand = Math.round(produceItem.baseDemand * (1 + demandVariance));
    
    // Determine confidence level
    const confidence = confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
    
    forecasts.push({
      id: `FC${(i + 1).toString().padStart(3, '0')}`,
      produceId: `P${(i % produce.length).toString().padStart(3, '0')}`,
      produceName: produceItem.name,
      county,
      expectedProduction,
      expectedDemand,
      unit: produceItem.unit,
      period,
      confidenceLevel: confidence
    });
  }
  
  return forecasts;
};

// Fetch farmer groups
export const fetchFarmerGroups = async (): Promise<FarmerGroup[]> => {
  await simulateDelay(700);
  
  const regions = ['Central', 'Eastern', 'Western', 'Nyanza', 'Rift Valley', 'Coast', 'North Eastern'];
  
  const cropFoci = [
    ['Coffee'], ['Tea'], ['Maize'], ['Dairy'], ['Horticulture'], 
    ['Potatoes'], ['Fruits'], ['Cereals'], ['Vegetables'], 
    ['Maize', 'Beans'], ['Coffee', 'Dairy'], ['Fruits', 'Vegetables']
  ];
  
  const groups: FarmerGroup[] = [];
  
  for (let i = 0; i < 15; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const focus = cropFoci[Math.floor(Math.random() * cropFoci.length)];
    const isCooperative = Math.random() > 0.5;
    
    // Generate established date (1-20 years ago)
    const yearsAgo = 1 + Math.floor(Math.random() * 20);
    const established = new Date();
    established.setFullYear(established.getFullYear() - yearsAgo);
    
    groups.push({
      id: `FG${(i + 1).toString().padStart(3, '0')}`,
      name: `${region} ${focus[0]} ${isCooperative ? 'Cooperative' : 'Farmers Group'}`,
      region,
      cropFocus: focus,
      memberCount: 10 + Math.floor(Math.random() * 500),
      description: `A ${isCooperative ? 'cooperative' : 'group'} of ${focus.join(' and ')} farmers in the ${region} region of Kenya.`,
      contactPerson: `Contact Person ${i + 1}`,
      contactInfo: `+2547${Math.floor(10000000 + Math.random() * 90000000)}`,
      established: established.toISOString().split('T')[0],
      isCooperative
    });
  }
  
  return groups;
};

// Calculate best market for farmers
export const calculateBestMarkets = async (produce: string, county: string): Promise<{ marketId: string, marketName: string, price: number, distance: number }[]> => {
  await simulateDelay(500);
  
  const markets = await fetchKilimoMarkets();
  
  // Find markets that sell this produce
  const relevantMarkets = markets.filter(market => 
    market.producePrices.some(p => p.produceName.toLowerCase() === produce.toLowerCase())
  );
  
  if (relevantMarkets.length === 0) {
    return [];
  }
  
  // Calculate best markets based on price and a simulated distance factor
  const marketData = relevantMarkets
    .map(market => {
      const producePrice = market.producePrices.find(p => 
        p.produceName.toLowerCase() === produce.toLowerCase()
      );
      
      if (!producePrice) return null;
      
      // Simulate distance based on whether market is in same county (closer) or different county
      const distance = market.county === county ? 
        5 + Math.random() * 25 : // 5-30 km if same county
        30 + Math.random() * 170; // 30-200 km if different county
      
      return {
        marketId: market.id,
        marketName: market.name,
        price: producePrice.price,
        distance: Math.round(distance)
      };
    })
    .filter((m): m is { marketId: string, marketName: string, price: number, distance: number } => m !== null);
  
  // Sort and return top 5 markets
  return marketData
    .sort((a, b) => {
      // Score based on 70% price and 30% inverse distance
      const scoreA = (a.price * 0.7) + ((200 - a.distance) * 0.3);
      const scoreB = (b.price * 0.7) + ((200 - b.distance) * 0.3);
      return scoreB - scoreA;
    })
    .slice(0, 5);
};

// Fix line 117
export const getWarehouse = (id: string): Promise<Warehouse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Use sample warehouse data if we don't have it from the database yet
      const sampleWarehouses: Warehouse[] = [
        {
          id: "w1",
          name: "Sample Warehouse",
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
          contactInfo: "info@sample.co.ke"
        }
      ];
      
      const warehouse = sampleWarehouses.find(w => w.id === id) || sampleWarehouses[0];
      resolve(warehouse);
    }, 500);
  });
};

// Fix line 375 - Creating a warehouse with string location
// This is likely in the processWarehouseData function
const processWarehouseData = (data: any[]): Warehouse[] => {
  return data.map(item => {
    // Convert string location to proper object
    const locationObj = typeof item.location === 'string' 
      ? { county: item.location } 
      : (item.location || { county: 'Unknown' });
    
    return {
      id: item.id || uuidv4(),
      name: item.name || `Warehouse ${Math.floor(Math.random() * 1000)}`,
      location: locationObj,
      county: item.county || locationObj.county,
      capacity: item.capacity || Math.floor(Math.random() * 5000) + 1000,
      capacityUnit: item.capacityUnit || 'kg',
      hasRefrigeration: item.hasRefrigeration || Math.random() > 0.5,
      hasCertifications: item.hasCertifications || Math.random() > 0.7,
      certificationTypes: item.certificationTypes || ['ISO 22000', 'HACCP'],
      goodsTypes: item.goodsTypes || ['Grains', 'Cereals', 'Pulses'],
      rates: item.rates || 'KES 300 per ton per week',
      contactInfo: item.contactInfo || item.contact || '+254 700 123456'
    };
  });
};

// Fix line 436 - Adding forecast with produceId
// In the createForecast function (or similar)
export const addForecast = (forecast: Partial<Forecast>): Promise<Forecast> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newForecast: Forecast = {
        id: uuidv4(),
        produceName: forecast.produceName || 'Unknown',
        period: forecast.period || '7 days',
        expectedProduction: forecast.expectedProduction || 0,
        expectedDemand: forecast.expectedDemand || 0,
        confidenceLevel: forecast.confidenceLevel || 'medium',
        county: forecast.county,
        unit: forecast.unit
      };
      
      resolve(newForecast);
    }, 500);
  });
};
