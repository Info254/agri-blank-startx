
import { AmisKePriceData, AmisKeMarket } from './types';
import { AmisKeApiHandler, AmisKeApiResponse } from './api-handler';

/**
 * Fetch market prices from AMIS Kenya
 */
export const fetchAmisKePrices = async (): Promise<AmisKePriceData[]> => {
  console.log("Fetching real pricing data from Ministry of Agriculture API");
  
  const data = await AmisKeApiHandler.get<any>('commodity-prices/', undefined, { results: [] });
  console.log("Received real commodity price data:", data);
  
  // Transform the API response to match our expected format
  const prices: AmisKePriceData[] = data.results.map((item: any) => ({
    id: item.id.toString(),
    commodity: item.commodity_name || "Unknown commodity",
    market: item.market_name || "Unknown market",
    price: parseFloat(item.price) || 0,
    unit: item.unit || "Kg",
    date: item.date_recorded || new Date().toISOString().split('T')[0],
    county: item.county_name || "Unknown county"
  }));
  
  console.log(`Successfully fetched ${prices.length} real price records from Ministry API`);
  return prices;
};

/**
 * Fetch markets information from AMIS Kenya
 */
export const fetchAmisKeMarkets = async (): Promise<AmisKeMarket[]> => {
  console.log("Fetching real market data from Ministry of Agriculture API");
  
  const data = await AmisKeApiHandler.get<any>('markets/', undefined, { results: [] });
  console.log("Received real market data:", data);
  
  // Transform the API response to match our expected format
  const marketsData: AmisKeMarket[] = data.results.map((item: any) => ({
    id: item.id.toString(),
    name: item.name || "Unnamed market",
    county: item.county_name || "Unknown county",
    type: item.market_type || "N/A",
    coordinates: item.latitude && item.longitude ? {
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude)
    } : undefined
  }));
  
  console.log(`Successfully fetched ${marketsData.length} real market records from Ministry API`);
  return marketsData;
};

/**
 * Get price history for a commodity across all markets
 * @param commodity The commodity to get price history for
 */
export const getAmisKePriceHistory = async (commodity: string): Promise<any[]> => {
  console.log(`Fetching real price history data for ${commodity} from Ministry API`);
  
  // Encode the commodity name for URL use
  const encodedCommodity = encodeURIComponent(commodity);
  
  const data = await AmisKeApiHandler.get<any>(`price-history/`, { commodity: encodedCommodity }, { results: [] });
  console.log(`Received real price history data for ${commodity}:`, data);
  
  // Transform the API response to match our expected format
  const historyData = data.results.map((item: any) => ({
    date: item.date_recorded,
    price: parseFloat(item.price) || 0,
    commodity: item.commodity_name || commodity,
    market: item.market_name || "Unknown market",
    county: item.county_name || "Unknown county"
  }));
  
  console.log(`Successfully fetched ${historyData.length} real price history records`);
  return historyData;
};
