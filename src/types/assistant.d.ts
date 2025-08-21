
import { Message } from '@/features/ai-assistant/types';
import { Market, Forecast, Warehouse } from '@/types';

export interface AssistantDataResult {
  data: {
    markets: Market[];
    forecasts: Forecast[];
    warehouses: Warehouse[];
    transporters: any[];
    amisPrices: any[];
    amisMarkets: any[];
  };
  dataLoading: boolean;
  error: string | null;
}

export interface AssistantMessagesResult {
  messages: Message[];
  isLoading: boolean;
  handleSendMessage: (input: string) => Promise<() => void> | void;
}
