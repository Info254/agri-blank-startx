
// Utility functions for the barter system

// Define commodity equivalency rates (relative values)
interface EquivalencyRates {
  [key: string]: {
    [key: string]: number;
  };
}

// This represents the relative value of commodities
// Example: 1kg of coffee = 5kg of maize
export const commodityEquivalencyRates: EquivalencyRates = {
  'Maize': {
    'Beans': 0.6,        // 1kg of maize = 0.6kg of beans
    'Rice': 0.4,         // 1kg of maize = 0.4kg of rice
    'Coffee': 0.2,       // 1kg of maize = 0.2kg of coffee
    'Potatoes': 1.5,     // 1kg of maize = 1.5kg of potatoes
    'Wheat': 0.9,        // 1kg of maize = 0.9kg of wheat
  },
  'Beans': {
    'Maize': 1.67,       // 1kg of beans = 1.67kg of maize
    'Rice': 0.67,        // 1kg of beans = 0.67kg of rice
    'Coffee': 0.33,      // 1kg of beans = 0.33kg of coffee
    'Potatoes': 2.5,     // 1kg of beans = 2.5kg of potatoes
    'Wheat': 1.5,        // 1kg of beans = 1.5kg of wheat
  },
  'Rice': {
    'Maize': 2.5,        // 1kg of rice = 2.5kg of maize
    'Beans': 1.5,        // 1kg of rice = 1.5kg of beans
    'Coffee': 0.5,       // 1kg of rice = 0.5kg of coffee
    'Potatoes': 3.75,    // 1kg of rice = 3.75kg of potatoes
    'Wheat': 2.25,       // 1kg of rice = 2.25kg of wheat
  },
  'Coffee': {
    'Maize': 5,          // 1kg of coffee = 5kg of maize
    'Beans': 3,          // 1kg of coffee = 3kg of beans
    'Rice': 2,           // 1kg of coffee = 2kg of rice
    'Potatoes': 7.5,     // 1kg of coffee = 7.5kg of potatoes
    'Wheat': 4.5,        // 1kg of coffee = 4.5kg of wheat
  },
  'Potatoes': {
    'Maize': 0.67,       // 1kg of potatoes = 0.67kg of maize
    'Beans': 0.4,        // 1kg of potatoes = 0.4kg of beans
    'Rice': 0.27,        // 1kg of potatoes = 0.27kg of rice
    'Coffee': 0.13,      // 1kg of potatoes = 0.13kg of coffee
    'Wheat': 0.6,        // 1kg of potatoes = 0.6kg of wheat
  },
  'Wheat': {
    'Maize': 1.11,       // 1kg of wheat = 1.11kg of maize
    'Beans': 0.67,       // 1kg of wheat = 0.67kg of beans
    'Rice': 0.44,        // 1kg of wheat = 0.44kg of rice
    'Coffee': 0.22,      // 1kg of wheat = 0.22kg of coffee
    'Potatoes': 1.67,    // 1kg of wheat = 1.67kg of potatoes
  }
};

// Get all the supported commodities for barter
export const getSupportedCommodities = (): string[] => {
  return Object.keys(commodityEquivalencyRates);
};

// Calculate how much of commodityB someone would get for a given amount of commodityA
export const calculateBarterExchange = (
  commodityA: string,
  quantityA: number,
  commodityB: string
): number | null => {
  if (!commodityA || !commodityB || !commodityEquivalencyRates[commodityA]) {
    return null;
  }

  // If trying to exchange for the same commodity
  if (commodityA === commodityB) {
    return quantityA;
  }

  // If direct rate exists
  if (commodityEquivalencyRates[commodityA][commodityB]) {
    return quantityA * commodityEquivalencyRates[commodityA][commodityB];
  }

  // If inverse rate exists, we calculate the reciprocal
  if (commodityEquivalencyRates[commodityB][commodityA]) {
    return quantityA / commodityEquivalencyRates[commodityB][commodityA];
  }

  return null; // No exchange rate found
};

// Verify if a barter exchange is fair
export const isBarterFair = (
  commodityA: string,
  quantityA: number,
  commodityB: string,
  quantityB: number
): boolean => {
  const calculatedQuantityB = calculateBarterExchange(commodityA, quantityA, commodityB);
  
  if (calculatedQuantityB === null) {
    return false;
  }
  
  // Allow a 5% tolerance for fair trades
  const tolerance = 0.05;
  const lowerBound = calculatedQuantityB * (1 - tolerance);
  const upperBound = calculatedQuantityB * (1 + tolerance);
  
  return quantityB >= lowerBound && quantityB <= upperBound;
};
