
import { SentimentReport, SentimentCluster, SentimentInsight } from '../types/sentiment';
import { 
  mockSentimentReports, 
  mockSentimentClusters, 
  mockSentimentInsights 
} from '../mockData/sentimentData';

export const detectCounterfeitAlert = (productName: string, location: string): string => {
  try {
    // Filter clusters for counterfeit alerts
    const relevantClusters = mockSentimentClusters.filter(cluster => 
      cluster.topic.toLowerCase().includes(productName.toLowerCase()) &&
      cluster.sentiment === 'negative' &&
      cluster.isAlert &&
      cluster.counties.some(county => county.toLowerCase().includes(location.toLowerCase()))
    );
    
    if (relevantClusters.length === 0) {
      return `No counterfeit alerts have been reported for ${productName} in ${location}. However, always verify the authenticity of agricultural inputs by checking for official hologram stickers and purchasing from authorized dealers.`;
    }
    
    const cluster = relevantClusters[0];
    
    return `⚠️ COUNTERFEIT ALERT ⚠️\n\nThere are ${cluster.reportCount} reports suggesting counterfeit ${cluster.topic} products in circulation around ${location} and nearby areas. This alert has a confidence score of ${(cluster.confidenceScore * 100).toFixed(0)}%.\n\nRecommended actions:\n- Purchase only from authorized dealers\n- Check for authentication features (holograms, QR codes)\n- Report suspicious products to authorities\n- If already purchased, document evidence and contact the Kenya Bureau of Standards\n\nWould you like information on how to verify the authenticity of this product?`;
  } catch (error) {
    console.error("Error in detectCounterfeitAlert:", error);
    return "I apologize, but I encountered an error while checking for counterfeit alerts. Would you like information on general best practices for avoiding counterfeit agricultural products?";
  }
};

export const getDiseaseAlert = (crop: string, location: string): string => {
  try {
    // Filter reports for disease mentions for the specific crop
    const relevantReports = mockSentimentReports.filter(report => 
      report.topic === 'disease' &&
      report.text.toLowerCase().includes(crop.toLowerCase()) &&
      (report.county.toLowerCase().includes(location.toLowerCase()) || 
       report.location.toLowerCase().includes(location.toLowerCase()))
    );
    
    // Find relevant insights
    const relevantInsights = mockSentimentInsights.filter(insight =>
      insight.topic.includes('Disease') &&
      insight.affectedCrops.some(c => c.toLowerCase() === crop.toLowerCase()) &&
      insight.affectedCounties.some(c => c.toLowerCase().includes(location.toLowerCase()))
    );
    
    if (relevantReports.length === 0 && relevantInsights.length === 0) {
      return `No disease alerts have been reported for ${crop} in ${location}. However, regular monitoring is essential. Would you like general disease prevention tips for ${crop}?`;
    }
    
    if (relevantInsights.length > 0) {
      const insight = relevantInsights[0];
      
      return `🔬 DISEASE ALERT 🔬\n\n${insight.insight} with ${insight.sourceReportCount} reports from farmers.\n\nActionable advice:\n${insight.actionableAdvice}\n\nThis assessment has a confidence score of ${(insight.confidenceScore * 100).toFixed(0)}%.\n\nWould you like more specific information about this disease or prevention measures?`;
    }
    
    return `🔬 POTENTIAL DISEASE ALERT 🔬\n\nThere are ${relevantReports.length} unverified reports of disease symptoms in ${crop} crops in ${location}. Our system is currently analyzing these reports.\n\nAs a precaution, please inspect your crops for unusual symptoms and consider preventive measures.\n\nWould you like information on common ${crop} diseases in your area?`;
  } catch (error) {
    console.error("Error in getDiseaseAlert:", error);
    return "I apologize, but I encountered an error while checking for disease alerts. Would you like information on general disease prevention for crops?";
  }
};

export const getPolicyImplementationGap = (policy: string, location: string): string => {
  try {
    // Filter reports for policy mentions
    const relevantReports = mockSentimentReports.filter(report => 
      report.topic === 'policy' &&
      report.text.toLowerCase().includes(policy.toLowerCase()) &&
      (report.county.toLowerCase().includes(location.toLowerCase()) || 
       report.location.toLowerCase().includes(location.toLowerCase()))
    );
    
    if (relevantReports.length === 0) {
      return `I don't have specific feedback on the implementation of ${policy} in ${location}. Would you like to share your experience or learn more about this policy?`;
    }
    
    const negativeReports = relevantReports.filter(report => report.sentiment === 'negative');
    const positiveReports = relevantReports.filter(report => report.sentiment === 'positive');
    
    const totalReports = relevantReports.length;
    const negativePercentage = (negativeReports.length / totalReports) * 100;
    
    if (negativePercentage > 70) {
      return `📊 POLICY IMPLEMENTATION GAP DETECTED 📊\n\n${negativePercentage.toFixed(0)}% of farmer reports indicate that the ${policy} is not being effectively implemented in ${location}. Common issues mentioned include delays in rollout, lack of information, and bureaucratic challenges.\n\nThis feedback is based on ${totalReports} farmer reports.\n\nWould you like to learn about alternative resources or support systems available to farmers in your area?`;
    } else if (negativePercentage > 30) {
      return `📊 POLICY IMPLEMENTATION MIXED RESULTS 📊\n\nFarmer feedback on ${policy} in ${location} shows mixed results with ${negativePercentage.toFixed(0)}% reporting challenges. Some areas appear to have better implementation than others.\n\nThis assessment is based on ${totalReports} farmer reports.\n\nWould you like more specific information about implementation in your particular sub-location?`;
    } else {
      return `📊 POLICY IMPLEMENTATION POSITIVE 📊\n\nThe majority of farmers (${(100 - negativePercentage).toFixed(0)}%) report that ${policy} is being effectively implemented in ${location}.\n\nThis assessment is based on ${totalReports} farmer reports.\n\nWould you like to learn more about how to maximize benefits from this policy?`;
    }
  } catch (error) {
    console.error("Error in getPolicyImplementationGap:", error);
    return "I apologize, but I encountered an error while analyzing policy implementation feedback. Would you like general information about agricultural policies?";
  }
};

export const getTechnologyAdoptionSentiment = (technology: string): string => {
  try {
    // Filter reports for technology mentions
    const relevantReports = mockSentimentReports.filter(report => 
      report.topic === 'technology' &&
      report.text.toLowerCase().includes(technology.toLowerCase())
    );
    
    if (relevantReports.length === 0) {
      return `I don't have specific sentiment data about ${technology} adoption among farmers. Would you like information about popular agricultural technologies in Kenya?`;
    }
    
    const positiveReports = relevantReports.filter(report => report.sentiment === 'positive');
    const negativeReports = relevantReports.filter(report => report.sentiment === 'negative');
    
    const totalReports = relevantReports.length;
    const positivePercentage = (positiveReports.length / totalReports) * 100;
    
    const commonTags = relevantReports
      .flatMap(report => report.tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const topTags = Object.entries(commonTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);
    
    const sentimentCategory = positivePercentage > 70 ? 'POSITIVE' : 
                             positivePercentage > 30 ? 'MIXED' : 'NEGATIVE';
    
    return `⚙️ TECHNOLOGY ADOPTION SENTIMENT: ${sentimentCategory} ⚙️\n\n${positivePercentage.toFixed(0)}% of farmers report positive experiences with ${technology}.\n\nKey aspects mentioned: ${topTags.join(', ')}\n\n${negativeReports.length > 0 ? `Common adoption barriers: cost, technical knowledge, maintenance requirements.` : `No significant adoption barriers reported.`}\n\nThis assessment is based on feedback from ${totalReports} farmers.\n\nWould you like to learn more about best practices for implementing this technology or available support programs?`;
  } catch (error) {
    console.error("Error in getTechnologyAdoptionSentiment:", error);
    return "I apologize, but I encountered an error while analyzing technology adoption sentiment. Would you like information about popular agricultural technologies instead?";
  }
};

export const generateSentimentBasedInsight = (topic: string, crop: string = ''): string => {
  try {
    // Find existing insights
    let relevantInsights = mockSentimentInsights;
    
    if (topic) {
      relevantInsights = relevantInsights.filter(insight => 
        insight.topic.toLowerCase().includes(topic.toLowerCase())
      );
    }
    
    if (crop) {
      relevantInsights = relevantInsights.filter(insight => 
        insight.affectedCrops.some(c => c.toLowerCase().includes(crop.toLowerCase()))
      );
    }
    
    if (relevantInsights.length === 0) {
      return `I don't have specific collective insights on ${topic} ${crop ? `for ${crop}` : ''} at the moment. As more farmers contribute their experiences, I'll be able to provide more targeted intelligence. Would you like to contribute your experience or knowledge on this topic?`;
    }
    
    const insight = relevantInsights[0];
    
    return `💡 COLLECTIVE INTELLIGENCE INSIGHT 💡\n\n${insight.insight}\n\nActionable advice:\n${insight.actionableAdvice}\n\nThis insight is based on reports from ${insight.sourceReportCount} farmers across ${insight.affectedCounties.join(', ')}.\n\nWould you like to learn more about this topic or contribute your own experience?`;
  } catch (error) {
    console.error("Error in generateSentimentBasedInsight:", error);
    return "I apologize, but I encountered an error while generating insights. Would you like information on another agricultural topic?";
  }
};
