
import { simulateDelay } from './apiUtils';
import { fetchAmisKePrices } from './amis-ke';
import { fetchKilimoStats } from './kilimoAPI';

// Simulated database for storing data
let archiveDatabase = {
  amisPriceHistory: [] as any[],
  kilimoStatsHistory: [] as any[],
  lastUpdates: {
    amisPrices: '',
    kilimoStats: '',
    archive: ''
  },
  countyPriceSnapshots: {} as Record<string, any[]>,
  commodityPricesByCounty: {} as Record<string, Record<string, any[]>>,
  headlines: [] as string[]
};

/**
 * Daily job to fetch latest AMIS Kenya prices for all 47 counties
 */
export const fetchDailyAmisPrices = async () => {
  try {
    console.log('Running daily job to fetch AMIS Kenya prices for all 47 counties...');
    const startTime = Date.now();
    
    // Fetch latest prices from AMIS Kenya
    const prices = await fetchAmisKePrices();
    
    // Process and store the prices
    const processedPrices = prices.map(price => ({
      ...price,
      fetchDate: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }));
    
    // Organize prices by county and commodity for easy access
    const countyPrices = {} as Record<string, any[]>;
    const commodityPrices = {} as Record<string, Record<string, any[]>>;
    
    prices.forEach(price => {
      // Group by county
      if (!countyPrices[price.county]) {
        countyPrices[price.county] = [];
      }
      countyPrices[price.county].push(price);
      
      // Group by commodity and then by county
      if (!commodityPrices[price.commodity]) {
        commodityPrices[price.commodity] = {};
      }
      if (!commodityPrices[price.commodity][price.county]) {
        commodityPrices[price.commodity][price.county] = [];
      }
      commodityPrices[price.commodity][price.county].push(price);
    });
    
    // Store in our simulated database
    archiveDatabase.amisPriceHistory.push(...processedPrices);
    archiveDatabase.countyPriceSnapshots = countyPrices;
    archiveDatabase.commodityPricesByCounty = commodityPrices;
    archiveDatabase.lastUpdates.amisPrices = new Date().toISOString();
    
    // Generate multiple headlines from the data for different counties
    const headlines: string[] = [];
    
    // Get 5 random counties for headlines
    const counties = Object.keys(countyPrices);
    const shuffledCounties = [...counties].sort(() => 0.5 - Math.random());
    const selectedCounties = shuffledCounties.slice(0, Math.min(5, shuffledCounties.length));
    
    selectedCounties.forEach(county => {
      const countyData = countyPrices[county];
      if (countyData && countyData.length > 0) {
        const randomIndex = Math.floor(Math.random() * countyData.length);
        const priceData = countyData[randomIndex];
        headlines.push(`${county}: ${priceData.commodity} selling at KES ${priceData.price} per ${priceData.unit} at ${priceData.market}`);
      }
    });
    
    // Generate overall stat headline
    const totalCounties = Object.keys(countyPrices).length;
    const totalCommodities = Object.keys(commodityPrices).length;
    headlines.push(`Today's update: Prices for ${totalCommodities} commodities across ${totalCounties} counties of Kenya`);
    
    archiveDatabase.headlines = headlines;
    
    console.log(`AMIS Kenya data fetch completed. Processed ${prices.length} price records across ${totalCounties} counties.`);
    console.log(`Generated ${headlines.length} headlines`);
    
    return {
      success: true,
      recordsProcessed: prices.length,
      countiesCovered: totalCounties,
      commoditiesCovered: totalCommodities,
      executionTime: Date.now() - startTime,
      headlines,
      lastUpdate: archiveDatabase.lastUpdates.amisPrices
    };
  } catch (error) {
    console.error('Error in daily AMIS Kenya job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdate: archiveDatabase.lastUpdates.amisPrices
    };
  }
};

/**
 * Weekly job to update Kilimo statistics
 */
export const updateWeeklyKilimoStats = async () => {
  try {
    console.log('Running weekly job to update Kilimo statistics...');
    const startTime = Date.now();
    
    // Fetch latest statistics from Kilimo
    const stats = await fetchKilimoStats();
    
    // Process and store the statistics
    const processedStats = stats.map(stat => ({
      ...stat,
      fetchDate: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }));
    
    // Store in our simulated database
    archiveDatabase.kilimoStatsHistory.push(...processedStats);
    archiveDatabase.lastUpdates.kilimoStats = new Date().toISOString();
    
    // Generate a headline from the data
    const categories = [...new Set(stats.map(s => s.category).filter(Boolean))];
    const headline = categories.length > 0 
      ? `Updated ${categories.length} agricultural categories covering ${[...new Set(stats.map(s => s.county))].length} counties`
      : 'No new Kilimo statistics available this week';
    
    console.log(`Kilimo stats update completed. Processed ${stats.length} statistical records.`);
    console.log(`HEADLINE: ${headline}`);
    
    return {
      success: true,
      recordsProcessed: stats.length,
      categoriesUpdated: categories.length,
      executionTime: Date.now() - startTime,
      headline,
      lastUpdate: archiveDatabase.lastUpdates.kilimoStats
    };
  } catch (error) {
    console.error('Error in weekly Kilimo stats job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdate: archiveDatabase.lastUpdates.kilimoStats
    };
  }
};

/**
 * Monthly job to archive historical data for long-term trend analysis
 */
export const archiveMonthlyHistoricalData = async () => {
  try {
    console.log('Running monthly archiving job for historical data...');
    const startTime = Date.now();
    
    // In a real implementation, this would:
    // 1. Aggregate daily/weekly data
    // 2. Compress and optimize for long-term storage
    // 3. Generate trend analysis
    // 4. Store in a data warehouse or analytics database
    
    // Simulate the archiving process
    await simulateDelay(2000);
    
    const amisRecords = archiveDatabase.amisPriceHistory.length;
    const kilimoRecords = archiveDatabase.kilimoStatsHistory.length;
    
    // Update archive timestamp
    archiveDatabase.lastUpdates.archive = new Date().toISOString();
    
    const headline = `Monthly archive complete: Processed ${amisRecords} AMIS Kenya records and ${kilimoRecords} Kilimo statistics for long-term trend analysis`;
    console.log(headline);
    
    return {
      success: true,
      amisRecordsArchived: amisRecords,
      kilimoRecordsArchived: kilimoRecords,
      executionTime: Date.now() - startTime,
      headline,
      lastUpdate: archiveDatabase.lastUpdates.archive
    };
  } catch (error) {
    console.error('Error in monthly archiving job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdate: archiveDatabase.lastUpdates.archive
    };
  }
};

/**
 * Run all cron jobs in sequence
 */
export const runAllCronJobs = async () => {
  const results = {
    amisJob: await fetchDailyAmisPrices(),
    kilimoJob: await updateWeeklyKilimoStats(),
    archiveJob: await archiveMonthlyHistoricalData()
  };
  
  console.log('All cron jobs completed:', results);
  return results;
};

/**
 * Get archived data for analysis
 */
export const getArchivedData = () => {
  return {
    amisPriceHistory: archiveDatabase.amisPriceHistory,
    kilimoStatsHistory: archiveDatabase.kilimoStatsHistory,
    lastUpdates: archiveDatabase.lastUpdates
  };
};

/**
 * Get all current commodity prices by county
 */
export const getAllCommodityPrices = () => {
  return {
    countyPrices: archiveDatabase.countyPriceSnapshots,
    commodityPrices: archiveDatabase.commodityPricesByCounty,
    headlines: archiveDatabase.headlines,
    lastUpdate: archiveDatabase.lastUpdates.amisPrices
  };
};

/**
 * Test data extraction from both services
 */
export const testDataExtraction = async () => {
  console.log('Testing data extraction from Kilimo API and AMIS Kenya...');
  
  try {
    // Test Kilimo Stats API
    console.log('Fetching data from Kilimo API...');
    const kilimoStart = Date.now();
    const kilimoData = await fetchKilimoStats();
    const kilimoTime = Date.now() - kilimoStart;
    
    console.log(`Kilimo API returned ${kilimoData.length} records in ${kilimoTime}ms`);
    console.log('Sample Kilimo data:', kilimoData.slice(0, 2));
    
    // Test AMIS Kenya (which would be a scraper in production)
    console.log('Fetching data from AMIS Kenya...');
    const amisStart = Date.now();
    const amisData = await fetchAmisKePrices();
    const amisTime = Date.now() - amisStart;
    
    console.log(`AMIS Kenya returned ${amisData.length} records in ${amisTime}ms`);
    console.log('Sample AMIS Kenya data:', amisData.slice(0, 2));
    
    return {
      success: true,
      kilimo: {
        recordCount: kilimoData.length,
        executionTime: kilimoTime,
        sample: kilimoData.slice(0, 3)
      },
      amis: {
        recordCount: amisData.length,
        executionTime: amisTime,
        sample: amisData.slice(0, 3)
      }
    };
  } catch (error) {
    console.error('Error during data extraction test:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
