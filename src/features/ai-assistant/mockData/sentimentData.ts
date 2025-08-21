
import { SentimentReport, SentimentCluster, DiseaseMapMarker, SentimentInsight } from '../types/sentiment';

export const mockSentimentReports: SentimentReport[] = [
  {
    id: '1',
    farmerId: 'farmer-001',
    farmerName: 'John Kimani',
    county: 'Nakuru',
    location: 'Molo',
    sentiment: 'negative',
    topic: 'counterfeit',
    text: 'I bought fertilizer from Brand X and my crops are not growing well. I suspect it might be counterfeit.',
    timestamp: new Date('2025-04-15'),
    verified: true,
    tags: ['fertilizer', 'Brand X', 'growth issues']
  },
  {
    id: '2',
    farmerId: 'farmer-002',
    farmerName: 'Alice Wanjiku',
    county: 'Nakuru',
    location: 'Njoro',
    sentiment: 'negative',
    topic: 'counterfeit',
    text: 'The Brand X fertilizer I purchased last month seems ineffective. Others in my area have the same issue.',
    timestamp: new Date('2025-04-18'),
    verified: true,
    tags: ['fertilizer', 'Brand X', 'ineffective']
  },
  {
    id: '3',
    farmerId: 'farmer-003',
    farmerName: 'Robert Odhiambo',
    county: 'Kisumu',
    location: 'Ahero',
    sentiment: 'negative',
    topic: 'disease',
    text: 'There are unusual spots on my maize leaves. I think it might be a new disease spreading in our area.',
    imageUrl: 'https://example.com/maize-disease.jpg',
    timestamp: new Date('2025-04-10'),
    verified: true,
    tags: ['maize', 'leaf spots', 'disease']
  },
  {
    id: '4',
    farmerId: 'farmer-004',
    farmerName: 'Sarah Njeri',
    county: 'Kiambu',
    location: 'Limuru',
    sentiment: 'positive',
    topic: 'technology',
    text: 'The new drip irrigation system has significantly improved my water usage efficiency.',
    timestamp: new Date('2025-04-05'),
    verified: true,
    tags: ['drip irrigation', 'water efficiency', 'technology']
  },
  {
    id: '5',
    farmerId: 'farmer-005',
    farmerName: 'David Mutua',
    county: 'Machakos',
    location: 'Kangundo',
    sentiment: 'negative',
    topic: 'policy',
    text: 'The new subsidy program announced last month is still not available in our area despite official claims.',
    timestamp: new Date('2025-04-20'),
    verified: true,
    tags: ['subsidy', 'policy implementation', 'government']
  }
];

export const mockSentimentClusters: SentimentCluster[] = [
  {
    id: '1',
    topic: 'Brand X Fertilizer',
    sentiment: 'negative',
    keywords: ['counterfeit', 'ineffective', 'poor quality', 'fake'],
    reportCount: 23,
    counties: ['Nakuru', 'Uasin Gishu', 'Trans Nzoia'],
    confidenceScore: 0.85,
    lastUpdated: new Date('2025-04-20'),
    isAlert: true
  },
  {
    id: '2',
    topic: 'Maize Leaf Disease',
    sentiment: 'negative',
    keywords: ['spots', 'yellowing', 'wilting', 'disease'],
    reportCount: 15,
    counties: ['Kisumu', 'Siaya', 'Homabay'],
    confidenceScore: 0.78,
    lastUpdated: new Date('2025-04-18'),
    isAlert: true
  },
  {
    id: '3',
    topic: 'Drip Irrigation Technology',
    sentiment: 'positive',
    keywords: ['water efficiency', 'cost saving', 'easy to use'],
    reportCount: 31,
    counties: ['Kiambu', 'Muranga', 'Kirinyaga'],
    confidenceScore: 0.92,
    lastUpdated: new Date('2025-04-15'),
    isAlert: false
  }
];

export const mockDiseaseMapMarkers: DiseaseMapMarker[] = [
  {
    id: '1',
    location: 'Kisumu - Ahero',
    latitude: -0.1672,
    longitude: 34.9042,
    diseaseName: 'Maize Leaf Blight',
    cropAffected: 'Maize',
    reportCount: 12,
    severity: 'medium',
    spreadPrediction: 'Likely to spread to neighboring areas within 2 weeks',
    firstReported: new Date('2025-04-10'),
    lastReported: new Date('2025-04-20')
  },
  {
    id: '2',
    location: 'Nakuru - Molo',
    latitude: -0.2505,
    longitude: 35.7324,
    diseaseName: 'Potato Late Blight',
    cropAffected: 'Potato',
    reportCount: 8,
    severity: 'high',
    spreadPrediction: 'High risk of rapid spread due to weather conditions',
    firstReported: new Date('2025-04-15'),
    lastReported: new Date('2025-04-21')
  }
];

export const mockSentimentInsights: SentimentInsight[] = [
  {
    id: '1',
    topic: 'Counterfeit Fertilizers',
    insight: 'Multiple reports of ineffective Brand X fertilizer across Nakuru county suggest potential counterfeit products in circulation',
    actionableAdvice: 'Purchase fertilizers only from authorized dealers and check for authentication features. Report suspicious products to the Kenya Bureau of Standards.',
    affectedCrops: ['Maize', 'Potatoes', 'Wheat'],
    affectedCounties: ['Nakuru', 'Uasin Gishu', 'Trans Nzoia'],
    confidenceScore: 0.85,
    generatedAt: new Date('2025-04-21'),
    sourceReportCount: 23
  },
  {
    id: '2',
    topic: 'Emerging Crop Disease',
    insight: 'Early signs of a new maize leaf disease spreading in Kisumu and neighboring counties',
    actionableAdvice: 'Apply preventive fungicides, particularly after rain. Monitor crops daily for symptoms and isolate affected plants.',
    affectedCrops: ['Maize'],
    affectedCounties: ['Kisumu', 'Siaya', 'Homabay'],
    confidenceScore: 0.78,
    generatedAt: new Date('2025-04-19'),
    sourceReportCount: 15
  }
];
