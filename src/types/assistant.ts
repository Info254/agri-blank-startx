
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from '@/features/ai-assistant/types';

export interface AssistantDataResult {
  data: {
    markets: Market[];
    forecasts: Forecast[];
    warehouses: Warehouse[];
    transporters: Transporter[];
    amisPrices: any[];
    amisMarkets: any[];
  };
  dataLoading: boolean;
  error: string | null;
  isRealData?: boolean;
}
