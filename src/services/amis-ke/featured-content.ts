
import { AmisKeApiHandler, AmisKeApiResponse } from './api-handler';

export interface FeaturedItem {
  id: number | string;
  title: string;
  source: string;
  date: string;
  tags: string[];
  location: string;
  summary: string;
  url: string;
  price?: string;
  provider?: string;
}

/**
 * Fetch featured news from the Ministry's API
 */
export const fetchFeaturedNews = async (): Promise<FeaturedItem[]> => {
  console.log("Fetching real featured news from Ministry API");
  
  const data = await AmisKeApiHandler.get<any>('news/', undefined, { results: [] });
  console.log("Received news data:", data);
  
  // Transform the API response to match our expected format
  const newsItems: FeaturedItem[] = data.results.map((item: any, index: number) => ({
    id: item.id || index + 1,
    title: item.title || item.headline || "News update",
    source: item.source || "Ministry of Agriculture",
    date: item.published_date || new Date().toISOString().split('T')[0],
    tags: item.tags ? 
          (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : item.tags) : 
          ["agriculture"],
    location: item.location || "Kenya",
    summary: item.summary || item.content || item.description || "No description available",
    url: item.url || `${window.location.origin}/news/${item.id}/`
  }));
  
  console.log(`Successfully fetched ${newsItems.length} news items`);
  return newsItems;
};

/**
 * Fetch featured services from the Ministry's API
 */
export const fetchFeaturedServices = async (): Promise<FeaturedItem[]> => {
  console.log("Fetching real services data from Ministry API");
  
  const data = await AmisKeApiHandler.get<any>('services/', undefined, { results: [] });
  console.log("Received services data:", data);
  
  // Transform the API response to match our expected format
  const servicesItems: FeaturedItem[] = data.results.map((item: any, index: number) => ({
    id: item.id || index + 1,
    title: item.name || item.title || "Service",
    provider: item.provider || item.organization || "Service Provider",
    source: item.provider || item.organization || "Service Provider",
    date: item.date_added || new Date().toISOString().split('T')[0],
    tags: item.tags ? 
          (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : item.tags) : 
          ["service"],
    location: item.locations || item.coverage || "Kenya",
    summary: item.description || item.summary || "No description available",
    url: item.url || item.website || `${window.location.origin}/services/${item.id}/` 
  }));
  
  console.log(`Successfully fetched ${servicesItems.length} services`);
  return servicesItems;
};

/**
 * Fetch featured products from the Ministry's API
 */
export const fetchFeaturedProducts = async (): Promise<FeaturedItem[]> => {
  console.log("Fetching real products data from Ministry API");
  
  const data = await AmisKeApiHandler.get<any>('products/', undefined, { results: [] });
  console.log("Received products data:", data);
  
  // Transform the API response to match our expected format
  const productsItems: FeaturedItem[] = data.results.map((item: any, index: number) => ({
    id: item.id || index + 1,
    title: item.name || item.title || "Product",
    provider: item.provider || item.seller || item.organization || "Provider",
    source: item.provider || item.seller || item.organization || "Provider",
    date: item.date_listed || item.date_added || new Date().toISOString().split('T')[0],
    tags: item.tags ?
          (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : item.tags) : 
          ["product"],
    location: item.location || "Kenya",
    summary: item.description || item.summary || "No description available",
    price: item.price ? `KES ${item.price}` : undefined,
    url: item.url || `${window.location.origin}/products/${item.id}/`
  }));
  
  console.log(`Successfully fetched ${productsItems.length} products`);
  return productsItems;
};

/**
 * Submit news item to the Ministry's API
 */
export const submitNewsItem = async (newsItem: Omit<FeaturedItem, 'id'>): Promise<boolean> => {
  console.log("Submitting news item to Ministry API", newsItem);
  
  // Format the data according to what the API expects
  const formattedData = {
    title: newsItem.title,
    source: newsItem.source,
    tags: Array.isArray(newsItem.tags) ? newsItem.tags.join(', ') : newsItem.tags,
    location: newsItem.location,
    content: newsItem.summary,
    url: newsItem.url,
    published_date: new Date().toISOString().split('T')[0]
  };
  
  try {
    await AmisKeApiHandler.post<any>('news/submit/', formattedData);
    console.log("News item submitted successfully");
    return true;
  } catch (error) {
    console.error("Failed to submit news item:", error);
    throw error;
  }
};
