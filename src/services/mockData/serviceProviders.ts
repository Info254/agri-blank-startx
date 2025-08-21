// Add missing rates property to ServiceProvider objects
export const serviceProviders = [
  {
    id: 'sp1',
    name: 'KenStore Warehousing',
    businessType: 'storage' as const,
    description: 'Modern storage solutions for agricultural produce with temperature control facilities.',
    services: ['Dry Storage', 'Cold Storage', 'Fumigation', 'Quality Monitoring'],
    location: {
      county: 'Nairobi County',
      specificLocation: 'Industrial Area',
      coordinates: {
        latitude: -1.3031934,
        longitude: 36.8719419
      }
    },
    contactInfo: 'info@kenstore.co.ke | +254 712 345 678',
    rates: 'KES 300-500 per ton/month',
    verified: true,
    rating: 4.7,
    reviewCount: 28,
    tags: ['warehouse', 'cold-chain', 'fumigation'],
    createdAt: '2023-01-15T08:40:00Z',
    updatedAt: '2023-08-20T14:30:00Z'
  },
  {
    id: 'sp2',
    name: 'AgriTransport Logistics',
    businessType: 'transport' as const,
    description: 'Reliable transportation services for agricultural goods across East Africa.',
    services: ['Refrigerated Transport', 'Bulk Transport', 'Real-time Tracking'],
    location: {
      county: 'Mombasa County',
      specificLocation: 'Port Area',
      coordinates: {
        latitude: -4.052052,
        longitude: 39.6662227
      }
    },
    contactInfo: 'logistics@agritransport.com | +254 722 000 111',
    rates: 'KES 5000-8000 per trip',
    verified: true,
    rating: 4.5,
    reviewCount: 35,
    tags: ['transport', 'logistics', 'refrigerated'],
    createdAt: '2023-02-20T10:00:00Z',
    updatedAt: '2023-09-10T16:00:00Z'
  },
  {
    id: 'sp3',
    name: 'CropSure Quality Control',
    businessType: 'quality-control' as const,
    description: 'Ensuring the quality of your produce with certified inspection and testing services.',
    services: ['Soil Testing', 'Crop Inspection', 'Certification', 'Training'],
    location: {
      county: 'Nakuru County',
      specificLocation: 'Agricultural Center',
      coordinates: {
        latitude: -0.274744,
        longitude: 36.0759359
      }
    },
    contactInfo: 'quality@cropsure.co.ke | +254 733 999 888',
    rates: 'KES 1000-2000 per test',
    verified: true,
    rating: 4.8,
    reviewCount: 42,
    tags: ['quality-control', 'testing', 'inspection'],
    createdAt: '2023-03-10T12:30:00Z',
    updatedAt: '2023-07-25T09:15:00Z'
  },
  {
    id: 'sp4',
    name: 'FarmLink Market Access',
    businessType: 'market-linkage' as const,
    description: 'Connecting farmers with reliable markets for their produce.',
    services: ['Market Information', 'Buyer Connections', 'Contract Negotiation'],
    location: {
      county: 'Kisumu County',
      specificLocation: 'Market Square',
      coordinates: {
        latitude: -0.0917325,
        longitude: 34.7557352
      }
    },
    contactInfo: 'markets@farmlink.org | +254 744 555 666',
    rates: '5% commission on sales',
    verified: true,
    rating: 4.6,
    reviewCount: 30,
    tags: ['market-linkage', 'sales', 'farmers'],
    createdAt: '2023-04-01T15:00:00Z',
    updatedAt: '2023-08-15T11:45:00Z'
  },
  {
    id: 'sp5',
    name: 'AgriTrain Training Services',
    businessType: 'training' as const,
    description: 'Providing farmers with the knowledge and skills they need to improve their yields and incomes.',
    services: ['Crop Management', 'Pest Control', 'Financial Literacy'],
    location: {
      county: 'Uasin Gishu County',
      specificLocation: 'Eldoret Town',
      coordinates: {
        latitude: 0.516667,
        longitude: 35.266667
      }
    },
    contactInfo: 'training@agritrain.co.ke | +254 755 777 888',
    rates: 'KES 2000 per course',
    verified: true,
    rating: 4.9,
    reviewCount: 50,
    tags: ['training', 'skills', 'farmers'],
    createdAt: '2023-05-10T09:00:00Z',
    updatedAt: '2023-09-01T13:30:00Z'
  },
  {
    id: 'sp6',
    name: 'SeedCo Input Supplies',
    businessType: 'input-supplier' as const,
    description: 'Supplying farmers with high-quality seeds and fertilizers to maximize their yields.',
    services: ['Seeds', 'Fertilizers', 'Pesticides', 'Equipment'],
    location: {
      county: 'Kiambu County',
      specificLocation: 'Thika Town',
      coordinates: {
        latitude: -1.0374365,
        longitude: 37.0937757
      }
    },
    contactInfo: 'supplies@seedco.com | +254 766 888 999',
    rates: 'Market rates',
    verified: true,
    rating: 4.7,
    reviewCount: 38,
    tags: ['seeds', 'fertilizers', 'equipment'],
    createdAt: '2023-06-01T11:00:00Z',
    updatedAt: '2023-08-25T10:00:00Z'
  },
  {
    id: 'sp7',
    name: 'AgriSure Insurance Services',
    businessType: 'inspector' as const,
    description: 'Providing insurance services to farmers to protect them against crop losses.',
    services: ['Crop Insurance', 'Livestock Insurance', 'Weather Index Insurance'],
    location: {
      county: 'Nyeri County',
      specificLocation: 'Town Center',
      coordinates: {
        latitude: -0.420833,
        longitude: 36.951111
      }
    },
    contactInfo: 'insurance@agrisure.co.ke | +254 777 999 000',
    rates: 'Varies based on coverage',
    verified: true,
    rating: 4.5,
    reviewCount: 25,
    tags: ['insurance', 'protection', 'farmers'],
    createdAt: '2023-07-01T14:00:00Z',
    updatedAt: '2023-09-15T17:00:00Z'
  }
];

export default serviceProviders;
