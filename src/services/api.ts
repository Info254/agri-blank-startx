
// Helper function to simulate API delay
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Re-export everything from the individual API modules

// Utils and common functionality
export { 
  simulateDelay, 
  formatApiUrl,
  validateApiKey,
  getCategoryName
} from './apiUtils';

// API Documentation
export {
  API_BASE_URL,
  API_ENDPOINTS,
  apiAccessInformation,
  apiRegistrationSteps,
  apiExampleCode
} from './apiDocs';

// Supply Chain API - now using enhanced kilimoAPI
export {
  fetchKilimoStats,
  fetchKilimoMarkets as fetchMarkets,
  fetchKilimoFarmers as fetchFarmers,
  fetchKilimoProduce as fetchProduce,
  fetchTransportProviders as fetchLogistics,
  fetchDemandForecasts as fetchForecasts,
  fetchWarehouses,
  fetchFarmerGroups,
  calculateBestMarkets
} from './kilimoAPI';

// Search API functionality
export { fetchData, fetchItemById } from './searchAPI';

// AmisKe Data API
export { 
  fetchAmisKePrices,
  fetchAmisKeMarkets,
  getAmisKePriceHistory
} from './amis-ke';

// Featured content API
export {
  fetchFeaturedNews,
  fetchFeaturedServices,
  fetchFeaturedProducts,
  submitNewsItem
} from './amis-ke/featured-content';

// Cron Jobs for data automation
export {
  fetchDailyAmisPrices,
  updateWeeklyKilimoStats,
  archiveMonthlyHistoricalData,
  runAllCronJobs,
  getArchivedData,
  testDataExtraction,
  getAllCommodityPrices
} from './cronJobs';

// Authentication Services
export {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getCurrentUserProfile,
  updateUserProfile
} from './authService';

// Service Provider Services
export {
  createServiceProvider,
  getServiceProviders,
  updateServiceProvider
} from './serviceProviderService';

// Warehouse Services
export {
  createWarehouse,
  getWarehouses,
  createWarehouseBooking,
  getUserWarehouseBookings
} from './warehouseService';

// Transport Services
export {
  createTransportRequest,
  getTransportRequests,
  updateTransportRequest,
  getUserTransportRequests
} from './transportService';

// Produce Services
export {
  createProduceListing,
  getProduceListings,
  updateProduceListing,
  getUserProduceListings
} from './produceService';

// Training Services
export {
  createTrainingEvent,
  getTrainingEvents,
  registerForTraining
} from './trainingService';

// Market Linkage Services
export {
  createMarketLinkage,
  getMarketLinkages,
  applyToMarketLinkage
} from './marketLinkageService';

// Service Provider Registration (legacy compatibility)
export const registerServiceProvider = async (serviceProvider: any) => {
  console.log('Registering service provider:', serviceProvider);
  
  try {
    const { createServiceProvider } = await import('./serviceProviderService');
    const result = await createServiceProvider({
      businessName: serviceProvider.businessName || serviceProvider.name,
      serviceType: serviceProvider.serviceType || serviceProvider.businessType,
      description: serviceProvider.description,
      location: serviceProvider.location?.specificLocation || serviceProvider.location,
      contactPhone: serviceProvider.contactInfo?.phone || serviceProvider.phone,
      contactEmail: serviceProvider.contactInfo?.email || serviceProvider.email,
      websiteUrl: serviceProvider.website,
      countiesServed: serviceProvider.counties || [],
      servicesOffered: serviceProvider.services || [],
      certifications: serviceProvider.certifications || [],
      experienceYears: serviceProvider.experienceYears || 0,
      hourlyRate: serviceProvider.rates ? parseFloat(serviceProvider.rates) : undefined,
    });
    
    return { success: true, id: result.id, data: result };
  } catch (error) {
    console.error('Error registering service provider:', error);
    throw error;
  }
};
