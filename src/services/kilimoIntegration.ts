
import { KilimoStats } from '@/types';
import { simulateDelay } from './apiUtils';

/**
 * Fetch and transform data from the Kilimo statistics API
 * @returns Transformed Kilimo statistics
 */
export const fetchKilimoStats = async (): Promise<KilimoStats[]> => {
  try {
    const response = await fetch("https://statistics.kilimo.go.ke/en/api/apputils/", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch Kilimo stats: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    console.log("Successfully fetched Kilimo data:", data);
    
    // Transform the county data from the API
    if (data && data.county && Array.isArray(data.county)) {
      return data.county.map((county: any) => ({
        id: county.id?.toString() || Math.random().toString(36).substring(2, 9),
        name: county.name || 'Unknown County',
        value: `County Code: ${county.code}`,
        category: 'Counties',
        county: county.name || 'Unknown',
        unit: 'county',
        source: 'Kilimo Statistics API - Kenya Counties',
        verified: true
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching Kilimo stats:", error);
    return [];
  }
};

/**
 * Transform raw Kilimo data into a format usable for charts
 * @param data Raw Kilimo statistics
 * @param groupBy Property to group by (e.g., 'category', 'county')
 * @returns Grouped data for visualization
 */
export const transformKilimoDataForCharts = (data: KilimoStats[], groupBy: 'category' | 'county' = 'category') => {
  const grouped = data.reduce((acc, curr) => {
    const key = curr[groupBy]?.toString() || 'Unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, KilimoStats[]>);
  
  return grouped;
};

/**
 * Get unique categories from Kilimo data
 * @param data Kilimo statistics
 * @returns Array of unique categories
 */
export const getKilimoCategories = (data: KilimoStats[]): string[] => {
  const categories = new Set<string>();
  data.forEach(item => {
    if (item.category) {
      categories.add(item.category);
    }
  });
  return Array.from(categories);
};

/**
 * Get unique counties from Kilimo data
 * @param data Kilimo statistics
 * @returns Array of unique counties
 */
export const getKilimoCounties = (data: KilimoStats[]): string[] => {
  const counties = new Set<string>();
  data.forEach(item => {
    if (item.county) {
      counties.add(item.county);
    }
  });
  return Array.from(counties);
};
