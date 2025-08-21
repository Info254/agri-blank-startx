
// Extract keywords and entities from user messages

export const extractCropFromMessage = (message: string): string => {
  const cropMatches = message.match(/tomato|potato|maize|corn|mango|avocado|coffee|tea|beans|peas|wheat|rice|banana|onion|cabbage|carrot|nyanya|viazi|mahindi|embe|kahawa|chai|maharagwe|ngano|mchele|ndizi|kitunguu|kabichi|karoti/g);
  return cropMatches ? cropMatches[0] : '';
};

export const extractLocationFromMessage = (message: string): string => {
  const locationMatches = message.match(/nairobi|mombasa|kisumu|nakuru|eldoret|kitale|meru|nyeri|thika|machakos|garissa|lamu|malindi|kakamega/g);
  return locationMatches ? locationMatches[0] : '';
};

export interface MessageIntent {
  type: string;
  crop?: string;
  location?: string;
  product?: string;
  policy?: string;
  technology?: string;
}

export const detectIntent = (message: string): MessageIntent => {
  const lowerMessage = message.toLowerCase();
  const crop = extractCropFromMessage(lowerMessage);
  const location = extractLocationFromMessage(lowerMessage);
  
  // Check for greetings
  if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i)) {
    return { type: 'greeting' };
  }
  
  // Check for thank you messages
  if (lowerMessage.match(/thank you|thanks|appreciate|helpful/i)) {
    return { type: 'thanks' };
  }
  
  // Check for counterfeit alerts
  if (lowerMessage.includes('counterfeit') || lowerMessage.includes('fake') || 
      lowerMessage.includes('fraud') || lowerMessage.includes('adulterated') || 
      lowerMessage.includes('suspicious')) {
    
    const productMatches = lowerMessage.match(/fertilizer|seed|pesticide|herbicide|fungicide|insecticide|chemical|brand/g);
    const product = productMatches ? productMatches[0] : '';
    
    return { 
      type: 'counterfeit', 
      crop, 
      location, 
      product 
    };
  }
  
  // Check for disease alerts
  if (lowerMessage.includes('disease') || lowerMessage.includes('pest') || 
      lowerMessage.includes('infection') || lowerMessage.includes('symptoms') || 
      lowerMessage.includes('spots') || lowerMessage.includes('wilt')) {
    
    return { 
      type: 'disease', 
      crop, 
      location 
    };
  }
  
  // Check for policy implementation gaps
  if (lowerMessage.includes('policy') || lowerMessage.includes('subsidy') || 
      lowerMessage.includes('program') || lowerMessage.includes('government') ||
      lowerMessage.includes('implementation')) {
    
    const policyMatches = lowerMessage.match(/subsidy|loan|insurance|certification|price control|support program|credit|financing/g);
    const policy = policyMatches ? policyMatches[0] : '';
    
    return { 
      type: 'policy', 
      location,
      policy
    };
  }
  
  // Check for technology sentiment
  if (lowerMessage.includes('technology') || lowerMessage.includes('app') || 
      lowerMessage.includes('tool') || lowerMessage.includes('innovation') ||
      lowerMessage.includes('digital') || lowerMessage.includes('system')) {
    
    const techMatches = lowerMessage.match(/irrigation|sensor|drone|mobile app|solar|mechanization|automation|platform/g);
    const technology = techMatches ? techMatches[0] : '';
    
    return { 
      type: 'technology',
      technology
    };
  }
  
  // Check for general insights
  if (lowerMessage.includes('insights') || lowerMessage.includes('collective intelligence') || 
      lowerMessage.includes('farmer experience') || lowerMessage.includes('community knowledge')) {
    
    return { 
      type: 'insights',
      crop
    };
  }
  
  // Check for forecasts
  if (lowerMessage.includes('forecast') || lowerMessage.includes('predict') || 
      lowerMessage.includes('future price') || lowerMessage.includes('next week') || 
      lowerMessage.includes('next month') || lowerMessage.includes('tomorrow')) {
    
    return { 
      type: 'forecast',
      crop
    };
  }
  
  // Check for market prices
  if (lowerMessage.includes('price') || lowerMessage.includes('market') || 
      lowerMessage.includes('sell') || lowerMessage.includes('where')) {
    
    return { 
      type: 'market',
      crop
    };
  }
  
  // Check for warehouses
  if (lowerMessage.includes('warehouse') || lowerMessage.includes('storage') || 
      lowerMessage.includes('store')) {
    
    return { 
      type: 'warehouse',
      crop
    };
  }
  
  // Check for transporters
  if (lowerMessage.includes('transport') || lowerMessage.includes('logistics') || 
      lowerMessage.includes('deliver') || lowerMessage.includes('pickup')) {
    
    return { 
      type: 'transport',
      location
    };
  }
  
  // Check for buyers
  if (lowerMessage.includes('buyer') || lowerMessage.includes('customer') || 
      lowerMessage.includes('purchaser') || lowerMessage.includes('looking for') || 
      lowerMessage.includes('who needs') || lowerMessage.includes('who wants')) {
    
    return { 
      type: 'buyers',
      crop,
      location
    };
  }
  
  // Check for supply chain
  if (lowerMessage.includes('supply chain') || lowerMessage.includes('value chain') || 
      lowerMessage.includes('distribution') || lowerMessage.includes('logistics network') || 
      lowerMessage.includes('ethical') || lowerMessage.includes('sustainable')) {
    
    return { 
      type: 'supplyChain',
      crop
    };
  }
  
  // Check for quality control
  if (lowerMessage.includes('quality') || lowerMessage.includes('organic') || 
      lowerMessage.includes('certification') || lowerMessage.includes('contract farming') || 
      lowerMessage.includes('buyer')) {
    
    return { 
      type: 'qualityControl',
      crop
    };
  }

  // Check if asking about the AI itself
  if (lowerMessage.includes('which ai') || lowerMessage.includes('what ai') || 
      lowerMessage.includes('ai model') || lowerMessage.includes('what model') || 
      lowerMessage.includes('how do you work')) {
    
    return { type: 'aboutAI' };
  }

  // Default response with any extracted information
  return {
    type: 'general',
    crop,
    location
  };
};
