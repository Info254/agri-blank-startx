
// Types for AI Assistant Feature

export type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  media?: {
    url: string;
    type: string;
  };
}

export interface Transporter {
  id: string;
  name: string;
  counties: string[];
  contactInfo: string;
  hasRefrigeration: boolean;
  vehicleType: string;
  loadCapacity: number;
  rates: string;
  serviceType?: string;
  capacity?: string;
  availableTimes?: string[];
  latitude?: number;
  longitude?: number;
}

export interface ChatCompletionParams {
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
  model: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: MessageRole;
      content: string;
    };
  }>;
}

export interface AgricultureContext {
  crop?: string;
  location?: string;
  marketPrices?: Record<string, number>;
  demandTrends?: Record<string, string>;
  seasonality?: Record<string, string>;
}
