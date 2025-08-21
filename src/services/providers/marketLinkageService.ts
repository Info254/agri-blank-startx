
import { MarketLinkage } from '@/types';
import { simulateDelay } from '../apiUtils';
import { marketLinkages } from '../mockData/marketLinkages';

export const fetchMarketLinkages = async (type?: 'vertical' | 'horizontal'): Promise<MarketLinkage[]> => {
  await simulateDelay(800);
  
  if (type) {
    return marketLinkages.filter(linkage => linkage.type === type);
  }
  
  return marketLinkages;
};
