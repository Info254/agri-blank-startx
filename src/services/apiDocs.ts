
/**
 * API Documentation and Access Information
 * 
 * This file provides information about the API endpoints and how they can be accessed
 * by external applications.
 */

export interface ApiEndpoint {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responseFormat: string;
  exampleResponse: string;
}

export const API_BASE_URL = 'https://api.agritender.co.ke/v1';

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    name: 'Farmers',
    path: '/farmers',
    method: 'GET',
    description: 'Get a list of all registered farmers or filter by county',
    parameters: [
      {
        name: 'county',
        type: 'string',
        required: false,
        description: 'Filter farmers by county name'
      }
    ],
    responseFormat: 'JSON array of Farmer objects',
    exampleResponse: `[
  {
    "id": "f1",
    "name": "John Kamau",
    "county": "Nakuru",
    "contacts": "jkamau@example.com | +254712345678",
    "products": ["Maize", "Beans", "Potatoes"],
    "farmSize": "5 acres",
    "certifications": ["Organic", "GlobalGAP"]
  }
]`
  },
  {
    name: 'Produce',
    path: '/produce',
    method: 'GET',
    description: 'Get a list of all available agricultural produce or filter by county',
    parameters: [
      {
        name: 'county',
        type: 'string',
        required: false,
        description: 'Filter produce by county name'
      },
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'Filter produce by category (e.g., Cereals, Cash Crops)'
      }
    ],
    responseFormat: 'JSON array of Produce objects',
    exampleResponse: `[
  {
    "id": "p1",
    "name": "Maize",
    "category": "Cereals",
    "county": "Nakuru",
    "quantity": 500,
    "unit": "kg",
    "qualityGrade": "A",
    "availableFrom": "2023-11-20",
    "farmer": "John Kamau",
    "farmerId": "f1"
  }
]`
  },
  {
    name: 'Markets',
    path: '/markets',
    method: 'GET',
    description: 'Get a list of all markets or filter by county',
    parameters: [
      {
        name: 'county',
        type: 'string',
        required: false,
        description: 'Filter markets by county name'
      }
    ],
    responseFormat: 'JSON array of Market objects',
    exampleResponse: `[
  {
    "id": "m1",
    "name": "Nakuru Central Market",
    "county": "Nakuru",
    "location": "Central Business District",
    "producePrices": [
      {
        "produceId": "p1",
        "produceName": "Maize",
        "price": 50,
        "unit": "kg",
        "date": "2023-11-15"
      }
    ],
    "demand": "High",
    "operatingHours": "6am - 6pm, Monday to Saturday"
  }
]`
  },
  {
    name: 'Logistics',
    path: '/logistics',
    method: 'GET',
    description: 'Get a list of all logistics providers or filter by county',
    parameters: [
      {
        name: 'county',
        type: 'string',
        required: false,
        description: 'Filter logistics providers by county name'
      },
      {
        name: 'serviceType',
        type: 'string',
        required: false,
        description: 'Filter by service type (transport, storage, both)'
      }
    ],
    responseFormat: 'JSON array of LogisticsProvider objects',
    exampleResponse: `[
  {
    "id": "l1",
    "name": "Fast Track Transport",
    "serviceType": "transport",
    "counties": ["Nakuru", "Nairobi", "Kiambu"],
    "contactInfo": "info@fasttrack.co.ke | +254712345678",
    "capacity": "up to 10 tons",
    "rates": "KES 5,000 - 15,000 depending on distance and load",
    "hasRefrigeration": true
  }
]`
  },
  {
    name: 'Forecasts',
    path: '/forecasts',
    method: 'GET',
    description: 'Get a list of all production and demand forecasts or filter by county',
    parameters: [
      {
        name: 'county',
        type: 'string',
        required: false,
        description: 'Filter forecasts by county name'
      },
      {
        name: 'product',
        type: 'string',
        required: false,
        description: 'Filter forecasts by product name'
      }
    ],
    responseFormat: 'JSON array of Forecast objects',
    exampleResponse: `[
  {
    "id": "fc1",
    "produceId": "p1",
    "produceName": "Maize",
    "county": "Nakuru",
    "expectedProduction": 2500,
    "expectedDemand": 2200,
    "unit": "tons",
    "period": "Dec 2023 - Feb 2024",
    "confidenceLevel": "high"
  }
]`
  }
];

/**
 * Information about how to access the API
 */
export const apiAccessInformation = {
  authentication: {
    type: 'API Key',
    description: 'All API requests require an API key sent in the X-API-Key header',
    example: 'curl -H "X-API-Key: your_api_key" https://api.agritender.co.ke/v1/farmers'
  },
  rateLimit: '1000 requests per day per API key',
  cors: 'Enabled for all origins',
  formats: ['JSON', 'CSV (add ?format=csv to the URL)'],
  documentation: 'Full API documentation available at https://api.agritender.co.ke/docs'
};

/**
 * How to register for API access
 */
export const apiRegistrationSteps = [
  'Create an account on AgriTender Connect',
  'Navigate to your profile and select "Developer Settings"',
  'Click on "Generate API Key"',
  'Store your API key securely - it won\'t be shown again',
  'Use the API key in all requests in the X-API-Key header'
];

/**
 * Example code for accessing the API in different languages
 */
export const apiExampleCode = {
  javascript: `// JavaScript/Node.js example using Fetch API
const fetchFarmers = async (county) => {
  const url = county 
    ? \`https://api.agritender.co.ke/v1/farmers?county=\${encodeURIComponent(county)}\` 
    : 'https://api.agritender.co.ke/v1/farmers';
    
  const response = await fetch(url, {
    headers: {
      'X-API-Key': 'your_api_key'
    }
  });
  
  if (!response.ok) {
    throw new Error(\`API request failed: \${response.status}\`);
  }
  
  return await response.json();
};`,
  python: `# Python example using requests
import requests

def fetch_farmers(county=None):
    url = 'https://api.agritender.co.ke/v1/farmers'
    params = {'county': county} if county else {}
    
    headers = {
        'X-API-Key': 'your_api_key'
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    
    return response.json()`,
  php: `<?php
// PHP example using curl
function fetchFarmers($county = null) {
    $url = 'https://api.agritender.co.ke/v1/farmers';
    if ($county) {
        $url .= '?county=' . urlencode($county);
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-API-Key: your_api_key'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        throw new Exception("API request failed: " . $httpCode);
    }
    
    return json_decode($response, true);
}`
};
