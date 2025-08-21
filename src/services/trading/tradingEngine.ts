
import { supabase } from '@/integrations/supabase/client';
import { cacheService } from '@/services/performance/cacheService';

export interface Trade {
  id: string;
  buyerId: string;
  sellerId: string;
  commodityId: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  location: string;
  qualityGrade: string;
  deliveryDate: Date;
  paymentTerms: string;
}

export interface MarketOrder {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  commodityId: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  status: 'active' | 'filled' | 'cancelled' | 'expired';
  validUntil: Date;
  location: string;
  qualityRequirements: string[];
  createdAt: Date;
}

export interface PriceData {
  commodityId: string;
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  lastUpdated: Date;
}

class TradingEngine {
  private readonly CACHE_TTL = 60000; // 1 minute

  async createMarketOrder(order: Omit<MarketOrder, 'id' | 'createdAt'>): Promise<MarketOrder> {
    try {
      const newOrder: MarketOrder = {
        ...order,
        id: crypto.randomUUID(),
        createdAt: new Date()
      };

      // In production, this would save to database
      console.log('Creating market order:', newOrder);
      
      // Clear relevant caches
      cacheService.delete(`orders_${order.userId}`);
      cacheService.delete(`market_orders_${order.commodityId}`);
      
      return newOrder;
    } catch (error) {
      console.error('Failed to create market order:', error);
      throw new Error('Failed to create market order');
    }
  }

  async matchOrders(commodityId: string): Promise<Trade[]> {
    const cacheKey = `matched_orders_${commodityId}`;
    const cached = cacheService.get<Trade[]>(cacheKey);
    
    if (cached) return cached;

    try {
      // Simulate order matching logic
      const buyOrders = await this.getBuyOrders(commodityId);
      const sellOrders = await this.getSellOrders(commodityId);
      
      const matches: Trade[] = [];
      
      // Simple matching algorithm - match highest buy price with lowest sell price
      buyOrders.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
      sellOrders.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
      
      for (const buyOrder of buyOrders) {
        for (const sellOrder of sellOrders) {
          if (buyOrder.pricePerUnit >= sellOrder.pricePerUnit && 
              buyOrder.quantity <= sellOrder.quantity) {
            
            const trade: Trade = {
              id: crypto.randomUUID(),
              buyerId: buyOrder.userId,
              sellerId: sellOrder.userId,
              commodityId,
              quantity: buyOrder.quantity,
              pricePerUnit: sellOrder.pricePerUnit, // Use sell price
              totalAmount: buyOrder.quantity * sellOrder.pricePerUnit,
              status: 'pending',
              createdAt: new Date(),
              updatedAt: new Date(),
              location: sellOrder.location,
              qualityGrade: 'A', // Default grade
              deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              paymentTerms: 'payment_on_delivery'
            };
            
            matches.push(trade);
            break; // Move to next buy order
          }
        }
      }
      
      cacheService.set(cacheKey, matches, this.CACHE_TTL);
      return matches;
    } catch (error) {
      console.error('Failed to match orders:', error);
      return [];
    }
  }

  async getPriceData(commodityId: string): Promise<PriceData | null> {
    const cacheKey = `price_data_${commodityId}`;
    const cached = cacheService.get<PriceData>(cacheKey);
    
    if (cached) return cached;

    try {
      // In production, this would fetch from real price feed
      const mockPriceData: PriceData = {
        commodityId,
        currentPrice: 45 + Math.random() * 10, // Mock price between 45-55
        dayChange: (Math.random() - 0.5) * 5, // Random change ±2.5
        dayChangePercent: (Math.random() - 0.5) * 10, // Random % change ±5%
        volume: Math.floor(Math.random() * 10000), // Random volume
        high24h: 50 + Math.random() * 5,
        low24h: 40 + Math.random() * 5,
        lastUpdated: new Date()
      };
      
      mockPriceData.dayChangePercent = (mockPriceData.dayChange / mockPriceData.currentPrice) * 100;
      
      cacheService.set(cacheKey, mockPriceData, this.CACHE_TTL);
      return mockPriceData;
    } catch (error) {
      console.error('Failed to get price data:', error);
      return null;
    }
  }

  async getUserTrades(userId: string): Promise<Trade[]> {
    const cacheKey = `user_trades_${userId}`;
    const cached = cacheService.get<Trade[]>(cacheKey);
    
    if (cached) return cached;

    try {
      // In production, fetch from database
      const trades: Trade[] = []; // Mock empty array
      
      cacheService.set(cacheKey, trades, this.CACHE_TTL);
      return trades;
    } catch (error) {
      console.error('Failed to get user trades:', error);
      return [];
    }
  }

  async cancelOrder(orderId: string, userId: string): Promise<boolean> {
    try {
      // In production, update in database
      console.log(`Cancelling order ${orderId} for user ${userId}`);
      
      // Clear relevant caches
      cacheService.delete(`orders_${userId}`);
      
      return true;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  }

  private async getBuyOrders(commodityId: string): Promise<MarketOrder[]> {
    // Mock implementation
    return [];
  }

  private async getSellOrders(commodityId: string): Promise<MarketOrder[]> {
    // Mock implementation
    return [];
  }

  // Real-time price subscription
  subscribeToPrice(commodityId: string, callback: (price: PriceData) => void): () => void {
    const interval = setInterval(async () => {
      const priceData = await this.getPriceData(commodityId);
      if (priceData) {
        callback(priceData);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }
}

export const tradingEngine = new TradingEngine();
