
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from './types';
import { detectLanguage, handleLanguageResponse } from './utils/languageSupport';
import { detectIntent, extractCropFromMessage, extractLocationFromMessage } from './utils/messageParser';
import { getResponseForIntent } from './utils/responseHandlers';
import { marketDataProcessor } from '@/services/langchain/market-data-processor';

export const generateResponse = (
  userMessage: string,
  markets: Market[],
  forecasts: Forecast[],
  warehouses: Warehouse[],
  transporters: Transporter[]
): string => {
  try {
    const message = userMessage.toLowerCase();
    const detectedLanguage = detectLanguage(message);
    
    console.log(`User message: "${userMessage}"`);
    console.log(`Detected language: ${detectedLanguage}`);
    
    // Extract important entities from the message
    const crop = extractCropFromMessage(message);
    const location = extractLocationFromMessage(message);
    
    // Process market data for more accurate responses
    const processedMarkets = marketDataProcessor.processMarketData(markets);
    const processedForecasts = marketDataProcessor.processForecasts(forecasts);
    
    // If crop is mentioned, find relevant data
    let relevantMarkets: Market[] = [];
    let relevantWarehouses: Warehouse[] = [];
    
    if (crop) {
      relevantMarkets = marketDataProcessor.findBestMarketsForCrop(markets, crop);
      relevantWarehouses = marketDataProcessor.findWarehousesForCrop(warehouses, crop);
    }
    
    // PRIORITY 1: Handle local languages first
    if (detectedLanguage !== 'english') {
      console.log(`Processing in local language: ${detectedLanguage}`);
      const languageResponse = handleLanguageResponse(message, detectedLanguage);
      
      if (languageResponse) {
        // Enhance with market data if available and relevant
        if (crop && relevantMarkets.length > 0) {
          const enhancedResponse = enhanceResponseWithMarketData(
            languageResponse, 
            detectedLanguage, 
            crop, 
            relevantMarkets
          );
          return enhancedResponse;
        }
        return languageResponse;
      }
    }
    
    // PRIORITY 2: English responses with intent detection
    const intent = detectIntent(message);
    
    const contextData = {
      crop,
      location,
      relevantMarkets,
      relevantWarehouses,
      processedMarkets,
      processedForecasts
    };
    
    return getResponseForIntent(intent, markets, forecasts, warehouses, transporters, contextData);
    
  } catch (error) {
    console.error("Error in generateResponse:", error);
    
    // Return error message in detected language
    const detectedLanguage = detectLanguage(userMessage);
    if (detectedLanguage === 'swahili') {
      return "Samahani, nimepata tatizo katika kuchakata ombi lako. Tafadhali jaribu tena.";
    } else if (detectedLanguage === 'kikuyu') {
      return "Nĩndagũthima, no ndiragwerire na matatĩko. Tafadhali geria rĩngĩ.";
    } else if (detectedLanguage === 'luo') {
      return "Akwayo tweyo, agoyo kod chandruok. Tem kendo.";
    }
    
    return "I apologize, but I encountered an unexpected error. Could you please rephrase your question or try asking about a different topic?";
  }
};

// Helper function to enhance responses with market data
const enhanceResponseWithMarketData = (
  baseResponse: string, 
  language: string, 
  crop: string, 
  markets: Market[]
): string => {
  if (markets.length === 0) return baseResponse;
  
  const marketInfo = markets[0];
  const priceInfo = marketInfo.producePrices?.find(p => 
    p.produceName.toLowerCase().includes(crop.toLowerCase())
  );
  
  if (!priceInfo) return baseResponse;
  
  const enhancements = {
    swahili: `\n\nTaarifa za soko: ${crop} katika ${marketInfo.county} bei ya sasa ni KES ${priceInfo.price} kwa ${priceInfo.unit}.`,
    kikuyu: `\n\nŨhoro wa thoko: ${crop} ${marketInfo.county} thogora wa rĩu nĩ KES ${priceInfo.price} kwa ${priceInfo.unit}.`,
    luo: `\n\nWeche mag chiro: ${crop} e ${marketInfo.county} nengo sani en KES ${priceInfo.price} kuom ${priceInfo.unit}.`,
    kalenjin: `\n\nImbarek ab sukik: ${crop} ko ${marketInfo.county} oret sait en KES ${priceInfo.price} ak ${priceInfo.unit}.`
  };
  
  const enhancement = enhancements[language as keyof typeof enhancements];
  return enhancement ? baseResponse + enhancement : baseResponse;
};
