
export interface SentimentReport {
  id: string;
  farmerId: string;
  farmerName: string;
  county: string;
  location: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  topic: 'counterfeit' | 'disease' | 'policy' | 'technology' | 'other';
  text: string;
  imageUrl?: string;
  timestamp: Date;
  verified: boolean;
  tags: string[];
}

export interface SentimentCluster {
  id: string;
  topic: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  reportCount: number;
  counties: string[];
  confidenceScore: number;
  lastUpdated: Date;
  isAlert: boolean;
}

export interface DiseaseMapMarker {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  diseaseName: string;
  cropAffected: string;
  reportCount: number;
  severity: 'low' | 'medium' | 'high';
  spreadPrediction: string;
  firstReported: Date;
  lastReported: Date;
}

export interface SentimentInsight {
  id: string;
  topic: string;
  insight: string;
  actionableAdvice: string;
  affectedCrops: string[];
  affectedCounties: string[];
  confidenceScore: number;
  generatedAt: Date;
  sourceReportCount: number;
}
