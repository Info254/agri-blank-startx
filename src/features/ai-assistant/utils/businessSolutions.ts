
export const getPotentialBuyers = (crop: string, location: string): string => {
  try {
    // Simulating buyer data since we don't have an actual buyers database
    const buyers = [
      { name: "EcoHarvest Distributors", location: "Nairobi", crops: ["Tomatoes", "Potatoes", "Maize"], volume: "Medium", price: "Competitive", ethicalStandards: "High" },
      { name: "FreshDirect Markets", location: "Mombasa", crops: ["Mangoes", "Bananas", "Vegetables"], volume: "Large", price: "Premium", ethicalStandards: "Medium" },
      { name: "Kenya Food Processing", location: "Nakuru", crops: ["Tomatoes", "Maize", "Wheat"], volume: "Large", price: "Fair", ethicalStandards: "High" },
      { name: "Local Schools Initiative", location: "Kisumu", crops: ["Vegetables", "Fruits", "Cereals"], volume: "Small", price: "Fixed", ethicalStandards: "High" }
    ];
    
    const relevantBuyers = buyers.filter(buyer => 
      buyer.crops.some(c => c.toLowerCase().includes(crop.toLowerCase())) &&
      buyer.location.toLowerCase().includes(location.toLowerCase())
    );
    
    if (relevantBuyers.length === 0) {
      return `I don't have information on buyers looking for ${crop} in ${location} at the moment. Would you like me to check other locations or suggest alternative markets?`;
    }
    
    const buyersList = relevantBuyers.map(buyer => 
      `${buyer.name} in ${buyer.location}: Looking for ${buyer.volume} volumes, offers ${buyer.price} pricing, Ethical standards: ${buyer.ethicalStandards}`
    ).join('\n- ');
    
    return `Here are potential buyers looking for ${crop} in or near ${location}:\n- ${buyersList}\n\nWould you like me to suggest how to approach these buyers or provide information about their procurement processes?`;
  } catch (error) {
    console.error("Error in getPotentialBuyers:", error);
    return "I apologize, but I encountered an error while searching for potential buyers. Would you like to try a different approach?";
  }
};

export const getSupplyChainSolutions = (crop: string): string => {
  try {
    const solutions = `For ethical and sustainable ${crop} supply chains, I recommend:

1. **Direct Farm-to-Market Connections**: Reduce intermediaries to ensure farmers receive fair prices
2. **Cooperative Transport**: Share transportation costs with other farmers to reduce expenses and environmental impact
3. **Sustainable Packaging**: Use biodegradable or reusable packaging to reduce waste
4. **Digital Tracking**: Implement simple tracking systems to provide transparency to buyers
5. **Fair Labor Practices**: Ensure all workers receive fair wages and safe working conditions
6. **Waste Reduction**: Implement storage and handling practices that minimize food waste
7. **Local Market Prioritization**: Reduce food miles by focusing on closer markets when possible

These approaches can help you build a more ethical and sustainable business while potentially accessing premium markets and prices.`;
    
    return solutions;
  } catch (error) {
    console.error("Error in getSupplyChainSolutions:", error);
    return "I apologize, but I encountered an error while retrieving supply chain solutions. Is there a specific aspect of the supply chain you're interested in?";
  }
};

export const getQualityControlAdvice = (crop: string): string => {
  try {
    const organicAdvice = `For organic ${crop} production:\n- Consider organic certification from KEBS or international bodies\n- Document all inputs and practices\n- Implement crop rotation and natural pest control\n- Maintain buffer zones from conventional farms`;
    
    const contractFarmingAdvice = `For contract farming of ${crop}:\n- Engage with exporters looking for consistent quality\n- Check for quality specifications in contracts\n- Request input support and technical assistance\n- Ensure fair price mechanisms are included`;
  
    const qualityControlInfo = `Quality control measures for ${crop}:\n- Regular soil testing for optimal nutrition\n- Integrated pest management to reduce chemical use\n- Proper post-harvest handling to maintain freshness\n- Grading system to categorize produce by quality\n- Record-keeping for traceability`;
    
    return `${organicAdvice}\n\n${contractFarmingAdvice}\n\n${qualityControlInfo}\n\nWould you like more specific information about any of these quality control aspects?`;
  } catch (error) {
    console.error("Error in getQualityControlAdvice:", error);
    return "I apologize, but I encountered an error while retrieving quality control advice. Is there another farming topic I can help you with?";
  }
};

