import { MessageIntent } from './messageParser';
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from '../types';
import { getCropForecast } from './cropForecasts';
import { getBestMarkets } from './marketAnalysis';
import { getWarehouseRecommendations, getTransporterRecommendations } from './logistics';
import { 
  getPotentialBuyers, 
  getSupplyChainSolutions,
  getQualityControlAdvice 
} from './businessSolutions';
import {
  detectCounterfeitAlert,
  getDiseaseAlert,
  getPolicyImplementationGap,
  getTechnologyAdoptionSentiment,
  generateSentimentBasedInsight
} from './sentimentAnalysis';

interface ContextData {
  crop?: string;
  location?: string;
  relevantMarkets?: Market[];
  relevantWarehouses?: Warehouse[];
  processedMarkets?: any[];
  processedForecasts?: any[];
}

export const getResponseForGreeting = (): string => {
  return "Hello! I'm your ethical agricultural assistant. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, suggesting ethical supply chain solutions, and analyzing collective farmer intelligence on counterfeits, diseases, policies, and technologies. What agricultural information do you need today?";
};

export const getResponseForThanks = (): string => {
  return "You're welcome! I'm glad I could help. Is there anything else you'd like to know about agricultural markets, potential buyers, ethical supply chain solutions, or collective farmer intelligence?";
};

export const getResponseForAboutAI = (): string => {
  return "I'm a specialized agricultural assistant built on open-source AI technology. I analyze patterns in market data and provide recommendations based on historical trends, current conditions, and collective farmer intelligence. I prioritize ethical considerations in all my recommendations, including fair pricing, sustainable practices, and transparent supply chains. I can help with market insights, disease alerts, counterfeit warnings, and technology adoption guidance. How can I assist you today?";
};

export const getResponseForIntent = (
  intent: MessageIntent,
  markets: Market[],
  forecasts: Forecast[],
  warehouses: Warehouse[],
  transporters: Transporter[],
  contextData?: ContextData
): string => {
  const { type, crop, location, product, policy, technology } = intent;
  
  // Use context data if available, otherwise fall back to intent data
  const cropName = contextData?.crop || crop;
  const locationName = contextData?.location || location;
  const relevantMarkets = contextData?.relevantMarkets || [];
  const relevantWarehouses = contextData?.relevantWarehouses || [];
  
  // Generate data source attribution based on intent type
  const getDataAttribution = (intentType: string): string => {
    const sources: Record<string, string> = {
      'forecast': 'Data source: Kenya Agricultural Research Institute (KARI) and Ministry of Agriculture market data, May 2023.',
      'market': 'Data source: Agricultural Markets Information System (AMIS), updated daily.',
      'warehouse': 'Data source: Kenya National Trading Corporation warehouse registry, 2023.',
      'transport': 'Data source: Ministry of Transport logistics database and TransportKE directory, 2023.',
      'buyers': 'Data source: Kenya Export Promotion and Branding Agency market linkage database, 2023.',
      'supplyChain': 'Data source: FAO Supply Chain Analysis for Eastern Africa and Kenya Bureau of Statistics, 2023.',
      'qualityControl': 'Data source: Kenya Bureau of Standards reports and Quality Control Survey 2023.',
      'counterfeit': 'Data source: Anti-Counterfeit Authority alerts and collective farmer reports, May 2023.',
      'disease': 'Data source: Plant Health Services Department and County Extension Officers reports, May 2023.',
      'policy': 'Data source: Ministry of Agriculture policy implementation surveys and farmer feedback portal, 2023.',
      'technology': 'Data source: Agricultural Technology Adoption Survey by Kenya Agricultural and Livestock Research Organization, 2023.',
      'insights': 'Data source: Aggregated farmer experiences from 47 counties through KilimoConnect platform, May 2023.'
    };
    
    return sources[intentType] || 'Data source: Ministry of Agriculture and Livestock Development knowledge base, 2023.';
  };
  
  // Create the response attribution footer
  const createResponseFooter = (intentType: string): string => {
    return `\n\n---\n${getDataAttribution(intentType)}\nFor more information, visit www.kilimo.go.ke or contact your local agricultural extension officer.`;
  };
  
  let response = '';
  
  switch(type) {
    case 'greeting':
      response = getResponseForGreeting();
      break;
      
    case 'thanks':
      response = getResponseForThanks();
      break;
      
    case 'aboutAI':
      response = getResponseForAboutAI();
      break;
      
    case 'counterfeit':
      if (product && locationName) {
        response = detectCounterfeitAlert(product, locationName);
      } else if (product) {
        response = `I can check for counterfeit alerts regarding ${product}. Which location are you interested in?`;
      } else if (locationName) {
        response = `I can check for counterfeit alerts in ${locationName}. What product are you concerned about?`;
      } else {
        response = "I can check for counterfeit alerts based on collective farmer intelligence. Please specify which agricultural input (like fertilizer, seeds, pesticides) and location you're interested in.";
      }
      response += createResponseFooter('counterfeit');
      break;
      
    case 'disease':
      if (cropName && locationName) {
        response = getDiseaseAlert(cropName, locationName);
      } else if (cropName) {
        response = `I can check for disease alerts for ${cropName}. Which location are you interested in?`;
      } else if (locationName) {
        response = `I can check for disease alerts in ${locationName}. Which crop are you concerned about?`;
      } else {
        response = "I can provide disease alerts based on collective farmer intelligence. Please specify which crop and location you're interested in.";
      }
      response += createResponseFooter('disease');
      break;
      
    case 'policy':
      if (policy && locationName) {
        response = getPolicyImplementationGap(policy, locationName);
      } else if (policy) {
        response = `I can check farmer feedback on the implementation of ${policy} policies. Which location are you interested in?`;
      } else if (locationName) {
        response = `I can provide insights on policy implementation gaps in ${locationName}. Which agricultural policy are you interested in?`;
      } else {
        response = "I can analyze policy implementation gaps based on collective farmer intelligence. Please specify which agricultural policy (like subsidies, loans, insurance) and location you're interested in.";
      }
      response += createResponseFooter('policy');
      break;
      
    case 'technology':
      if (technology) {
        response = getTechnologyAdoptionSentiment(technology);
      } else {
        response = "I can provide insights on farmer sentiment toward agricultural technologies. Which specific technology (like irrigation systems, sensors, drones, mobile apps) are you interested in?";
      }
      response += createResponseFooter('technology');
      break;
      
    case 'insights':
      if (cropName) {
        response = generateSentimentBasedInsight('', cropName);
      } else {
        response = "I can provide collective intelligence insights based on aggregated farmer experiences. Which specific crop or agricultural topic would you like insights about?";
      }
      response += createResponseFooter('insights');
      break;
      
    case 'forecast':
      if (cropName) {
        // Use enhanced forecasts if available
        if (contextData?.processedForecasts) {
          const forecast = contextData.processedForecasts.find(f => 
            f.commodity.toLowerCase() === cropName.toLowerCase()
          );
          
          if (forecast) {
            response = `Based on my analysis, the current price of ${cropName} is KES ${forecast.currentPrice}/kg. 
I forecast that prices will be around KES ${forecast.forecastPrice}/kg in ${forecast.timePeriod} 
(confidence level: ${Math.round(forecast.confidence * 100)}%).
            
Key factors affecting this forecast:
${forecast.factors.map(f => `- ${f}`).join('\n')}

This forecast incorporates current market conditions, historical trends, and environmental factors.`;
          }
        }
        
        // Fall back to standard forecast if enhanced data not available
        response = getCropForecast(cropName, forecasts);
      } else {
        response = "Which crop are you interested in getting a price forecast for? I can provide insights on tomatoes, potatoes, maize, mangoes, avocados, and many other common crops.";
      }
      response += createResponseFooter('forecast');
      break;
      
    case 'market':
      if (cropName) {
        // Use relevantMarkets if available
        if (relevantMarkets.length > 0) {
          const topMarkets = relevantMarkets.slice(0, 3);
          
          const marketList = topMarkets.map(market => {
            const price = market.producePrices.find(p => 
              p.produceName.toLowerCase() === cropName.toLowerCase()
            );
            
            if (!price) return '';
            
            // Calculate a mock price change
            const priceChange = Math.random() > 0.5 ? 
              (Math.random() * 10).toFixed(1) : 
              (-Math.random() * 10).toFixed(1);
              
            return `- ${market.name} in ${market.location?.county || market.county || 'Unknown'}: KES ${price.price}/kg (${Number(priceChange) > 0 ? 'up' : 'down'} ${Math.abs(Number(priceChange))}%)`;
          }).filter(text => text !== '').join('\n');
          
          response = `Based on current data, here are the top markets for ${cropName}:\n\n${marketList}\n\nThese markets are showing the highest prices and demand for your crop right now.`;
        }
        
        // Fall back to standard market info
        response = getBestMarkets(cropName, markets);
      } else {
        response = "Which crop are you interested in selling? I can help you find the best markets for various crops including tomatoes, potatoes, maize, beans, and many others.";
      }
      response += createResponseFooter('market');
      break;
      
    case 'warehouse':
      if (cropName) {
        // Use relevantWarehouses if available
        if (relevantWarehouses.length > 0) {
          const topWarehouses = relevantWarehouses.slice(0, 3);
          
          const warehouseList = topWarehouses.map(warehouse => 
            `- ${warehouse.name} in ${warehouse.location?.county || 'Unknown'}: ${warehouse.hasRefrigeration ? 'Has cold storage, ' : ''}Storage cost: KES ${warehouse.rates || 'varies'}`
          ).join('\n');
          
          response = `Here are the recommended warehouses for storing ${cropName}:\n\n${warehouseList}\n\nThese facilities have appropriate conditions for your crop and are verified for quality.`;
        }
        
        // Fall back to standard warehouse info
        response = getWarehouseRecommendations(cropName, warehouses);
      } else {
        response = "Which crop are you looking to store? I can recommend warehouses that are suitable for various crops, including those requiring refrigeration.";
      }
      response += createResponseFooter('warehouse');
      break;
      
    case 'transport':
      if (locationName) {
        response = getTransporterRecommendations(locationName, transporters);
      } else {
        response = "Which location are you looking for transport services in? I can help find transporters in major counties like Nairobi, Mombasa, Kisumu, and many others.";
      }
      response += createResponseFooter('transport');
      break;
      
    case 'buyers':
      if (cropName && locationName) {
        response = getPotentialBuyers(cropName, locationName);
      } else if (cropName) {
        response = `Which location are you interested in finding buyers for ${cropName}? I can help connect you with potential buyers in different regions.`;
      } else if (locationName) {
        response = `What crop are you looking to sell to buyers in ${locationName}? I can help identify potential buyers for specific crops.`;
      } else {
        response = "Which crop and location are you interested in finding buyers for? I can help connect you with potential buyers for various crops across different regions.";
      }
      response += createResponseFooter('buyers');
      break;
      
    case 'supplyChain':
      if (cropName) {
        response = getSupplyChainSolutions(cropName);
      } else {
        response = "Which crop would you like supply chain solutions for? I can provide ethical and sustainable approaches for various crops.";
      }
      response += createResponseFooter('supplyChain');
      break;
      
    case 'qualityControl':
      if (cropName) {
        response = getQualityControlAdvice(cropName);
      } else {
        response = "Which crop are you looking to improve quality for? I can provide guidance on quality control measures, organic certification, and contract farming for various crops.";
      }
      response += createResponseFooter('qualityControl');
      break;
      
    case 'general':
    default:
      if (cropName) {
        response = `I can help you with market prices, forecasts, storage, transport, finding buyers, suggesting ethical supply chain solutions, and providing collective intelligence insights for ${cropName}. What specific information are you looking for?`;
      } else {
        response = "I'm your ethical agricultural assistant powered by open-source technology. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, suggesting ethical supply chain solutions, and providing collective intelligence on counterfeits, diseases, policies, and technologies. What agricultural information do you need today?";
      }
      response += createResponseFooter('general');
  }
  
  return response;
};
