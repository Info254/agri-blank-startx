
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePerformance } from '@/hooks/use-performance';
import { Message } from '@/features/ai-assistant/types';
import { generateResponse } from '@/features/ai-assistant/responseGenerator';
import { Market, Forecast, Warehouse } from '@/types';

export function useAssistantMessages(
  markets: Market[],
  forecasts: Forecast[],
  warehouses: Warehouse[],
  transporters: any[]
) {
  const { toast } = useToast();
  const { measureInteraction } = usePerformance('assistantMessages');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Habari! Naweza kukusaidia kupata masoko kwa mazao yako, kuelewa mienendo ya mahitaji, kubashiri bei pamoja na viwango vya makosa, na kupendekeza wakati bora wa kuuza. Pia naweza kupendekeza maghala na wasafirishaji. Je, unakulima zao gani? (Hello! I can help you find markets for your produce, understand demand trends, forecast prices with error margins, and suggest the best time to sell. I can also recommend warehouses and transporters. What crop are you growing?)',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (input: string) => {
    // Don't allow empty messages
    if (!input.trim()) return;

    // Check if data is available before proceeding
    if (markets.length === 0 || forecasts.length === 0 || warehouses.length === 0) {
      toast({
        title: "Limited Functionality",
        description: "Some data couldn't be loaded. Responses may be incomplete.",
        variant: "destructive"
      });
    }

    const endMeasure = measureInteraction('messageResponse');
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Generate AI response
    try {
      // Using a stable timeout to prevent flickering
      const timer = setTimeout(() => {
        const responseContent = generateResponse(
          userMessage.content,
          markets,
          forecasts,
          warehouses,
          transporters
        );
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          role: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
        endMeasure();
      }, 800);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error processing your request. Could you try asking in a different way?",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
      endMeasure();
      
      toast({
        title: "Response Error",
        description: "There was a problem generating a response.",
        variant: "destructive"
      });
    }
  };

  return {
    messages,
    isLoading,
    handleSendMessage
  };
}
