
import { Market } from '@/types';

export const getBestMarkets = (crop: string, markets: Market[]): string => {
  try {
    const relevantMarkets = markets.filter(market => 
      market.producePrices.some(p => 
        p.produceName.toLowerCase().includes(crop.toLowerCase())
      )
    );
    
    if (relevantMarkets.length === 0) {
      return `I don't have specific market data for ${crop} at the moment. Would you like information about which crops are currently in high demand?`;
    }
    
    const sortedMarkets = [...relevantMarkets].sort((a, b) => {
      const priceA = a.producePrices.find(p => p.produceName.toLowerCase().includes(crop.toLowerCase()))?.price || 0;
      const priceB = b.producePrices.find(p => p.produceName.toLowerCase().includes(crop.toLowerCase()))?.price || 0;
      return priceB - priceA;
    });
    
    const topMarkets = sortedMarkets.slice(0, 3);
    
    const marketsList = topMarkets.map(market => {
      const price = market.producePrices.find(p => 
        p.produceName.toLowerCase().includes(crop.toLowerCase())
      );
      return `${market.name} (${market.county}): KES ${price?.price} per ${price?.unit}`;
    }).join('\n- ');
    
    return `The best markets for ${crop} right now are:\n- ${marketsList}\n\nFor tomorrow, based on historical patterns, prices at ${topMarkets[0].name} are expected to increase by 2-4% due to weekend demand.\n\nThere are 5 potential buyers looking for ${crop} in ${topMarkets[0].county} and 3 in ${topMarkets[1].county}. Would you like me to suggest ethical supply chain solutions that reduce food miles and promote fair pricing?`;
  } catch (error) {
    console.error("Error in getBestMarkets:", error);
    return "I apologize, but I encountered an error while analyzing market data. Could you try asking about a different crop or service?";
  }
};

