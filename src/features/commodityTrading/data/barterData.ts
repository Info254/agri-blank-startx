
// Mock data for barter trade
export const mockBarterListings = [
  { 
    id: 1, 
    commodity: 'Maize', 
    quantity: 200, 
    unit: 'kg',
    quality: 'Grade A',
    location: 'Nakuru County', 
    owner: 'John Kamau', 
    ownerRating: 4.8,
    seekingCommodities: ['Beans', 'Rice', 'Fertilizer'],
    equivalencyRates: {
      'Beans': 0.6, // 1kg Maize = 0.6kg Beans
      'Rice': 0.75, // 1kg Maize = 0.75kg Rice
      'Fertilizer': 2.5 // 1kg Maize = 2.5kg Fertilizer
    },
    description: 'High quality maize harvest, dried and ready for storage. Looking to trade for beans, rice or fertilizer for next season.',
    listedDate: '2023-11-15',
    imageUrl: 'https://source.unsplash.com/random/?maize'
  },
  { 
    id: 2, 
    commodity: 'Coffee Beans', 
    quantity: 50, 
    unit: 'kg',
    quality: 'Premium',
    location: 'Kiambu County', 
    owner: 'Mary Wanjiku', 
    ownerRating: 4.5,
    seekingCommodities: ['Maize', 'Vegetables', 'Dairy'],
    equivalencyRates: {
      'Maize': 3, // 1kg Coffee = 3kg Maize
      'Vegetables': 2, // 1kg Coffee = 2kg Vegetables
      'Dairy': 1.5 // 1kg Coffee = 1.5kg Dairy
    },
    description: 'Freshly harvested arabica coffee beans. Looking to trade for food supplies.',
    listedDate: '2023-11-18',
    imageUrl: 'https://source.unsplash.com/random/?coffee'
  },
  { 
    id: 3, 
    commodity: 'Potatoes', 
    quantity: 300, 
    unit: 'kg',
    quality: 'Grade B',
    location: 'Nyandarua County', 
    owner: 'James Mwangi', 
    ownerRating: 4.2,
    seekingCommodities: ['Maize', 'Beans', 'Seeds'],
    equivalencyRates: {
      'Maize': 0.9, // 1kg Potatoes = 0.9kg Maize
      'Beans': 0.5, // 1kg Potatoes = 0.5kg Beans
      'Seeds': 5, // 1kg Potatoes = 5kg Seeds
    },
    description: 'Fresh potatoes harvested last week. Looking to exchange for planting materials or grains.',
    listedDate: '2023-11-20',
    imageUrl: 'https://source.unsplash.com/random/?potatoes'
  }
];

export const mockBarterHistory = [
  {
    id: 1,
    date: '2023-11-10',
    gaveItem: 'Maize',
    gaveQuantity: 100,
    gaveUnit: 'kg',
    receivedItem: 'Beans',
    receivedQuantity: 60,
    receivedUnit: 'kg',
    partner: 'David Omondi',
    partnerRating: 4.7,
    locationMet: 'Nakuru Central Market',
    status: 'completed'
  },
  {
    id: 2,
    date: '2023-11-05',
    gaveItem: 'Rice',
    gaveQuantity: 50,
    gaveUnit: 'kg',
    receivedItem: 'Potatoes',
    receivedQuantity: 80,
    receivedUnit: 'kg',
    partner: 'Jane Wairimu',
    partnerRating: 4.3,
    locationMet: 'Kiambu Farmers Market',
    status: 'completed'
  }
];

export const mockCommunityPosts = [
  {
    id: 1,
    author: 'John Kamau',
    authorRating: 4.8,
    date: '2023-11-18',
    title: 'Seeking potato seed varieties',
    content: 'Looking for Dutch Robjin and Shangi potato seed varieties to exchange with my maize harvest. Located in Nakuru.',
    replies: 3,
    region: 'Nakuru',
    commodity: 'Potatoes'
  },
  {
    id: 2,
    author: 'Mary Wanjiku',
    authorRating: 4.5,
    date: '2023-11-17',
    title: 'Coffee trade group in Kiambu',
    content: 'Forming a coffee traders group in Kiambu to coordinate barters with grain farmers in neighboring counties. Join if interested!',
    replies: 5,
    region: 'Kiambu',
    commodity: 'Coffee'
  }
];
