
/**
 * Application Configuration
 * Central configuration for production-ready deployment
 */

export const APP_CONFIG = {
  // Application metadata
  name: 'AgriTender Connect',
  version: '2.0.0',
  description: 'Comprehensive Agricultural Platform for Kenya',
  
  // API Configuration
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.agritender.co.ke/v1' 
      : 'http://localhost:3001/api/v1',
    timeout: 10000,
    retryAttempts: 3,
    rateLimit: {
      requests: 100,
      window: 60000 // 1 minute
    }
  },
  
  // Database Configuration
  database: {
    maxConnections: 100,
    connectionTimeout: 30000,
    queryTimeout: 15000,
    retryAttempts: 3
  },
  
  // Cache Configuration
  cache: {
    defaultTTL: 300000, // 5 minutes
    maxSize: 1000,
    enableCompression: true
  },
  
  // Performance Configuration
  performance: {
    enableLazyLoading: true,
    chunkSize: 50,
    prefetchDistance: 2,
    virtualScrolling: true
  },
  
  // Security Configuration
  security: {
    enableCSP: true,
    enableHSTS: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // Feature Flags
  features: {
    realTimeUpdates: true,
    advancedAnalytics: true,
    mobileApp: true,
    offlineMode: false,
    betaFeatures: false
  },
  
  // External Services
  services: {
    amis: {
      baseUrl: 'https://amis.kilimo.go.ke/en/api',
      timeout: 5000,
      retryAttempts: 2
    },
    weather: {
      enabled: true,
      provider: 'openweather'
    },
    maps: {
      enabled: true,
      provider: 'mapbox'
    }
  }
};

export const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

export const COMMODITIES = [
  'Maize', 'Wheat', 'Rice', 'Beans', 'Potatoes', 'Sweet Potatoes',
  'Cassava', 'Bananas', 'Tea', 'Coffee', 'Sugarcane', 'Cotton',
  'Tomatoes', 'Onions', 'Cabbages', 'Kales', 'Spinach', 'Carrots',
  'French Beans', 'Avocados', 'Mangoes', 'Pineapples', 'Oranges',
  'Passion Fruits', 'Watermelons', 'Milk', 'Eggs', 'Beef', 'Chicken',
  'Fish', 'Honey'
];
