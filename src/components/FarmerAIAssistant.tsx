
import React, { useEffect, useState } from 'react';
import { useAssistantData } from '@/hooks/use-assistant-data';
import AssistantCard from '@/components/ai-assistant/AssistantCard';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, WifiOff, Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Message } from '@/features/ai-assistant/types';
import { detectLanguageAdvanced, generateMultilingualResponse } from '@/services/ai/multilingualAssistant';
import { EnhancedMessageInput } from '@/components/ai-assistant/EnhancedMessageInput';
import { detectLanguage } from '@/features/ai-assistant/utils/languageSupport';
import { generateResponse } from '@/features/ai-assistant/responseGenerator';

const FarmerAIAssistant: React.FC = () => {
  // Fetch all agricultural data from Supabase
  const { data, dataLoading, error, isRealData } = useAssistantData();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Habari! Ninaweza kukusaidia kupata masoko ya mazao yako, kuelewa mienendo ya mahitaji, kubashiri bei na kupendekeza wakati bora wa kuuza. Pia ninaweza kupendekeza maghala na wasafirishaji. Unakulima mazao gani? 🌾\n\nHello! I can help you find markets for your crops, understand demand trends, forecast prices and suggest the best time to sell. I can also recommend warehouses and transporters. What crops are you growing? 🌾',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDetectedLanguage, setLastDetectedLanguage] = useState<string>('english');

  // Show toast notification when there's an error with data loading
  useEffect(() => {
    if (error) {
      toast({
        title: "Data Loading Issue",
        description: error + " Using fallback data instead.",
        variant: "destructive",
        duration: 8000,
      });
    }
  }, [error, toast]);

  const handleSendMessage = async (input: string, detectedLanguage?: string) => {
    // Don't allow empty messages
    if (!input.trim()) return;

    // Detect language from the message
    const messageLanguage = detectedLanguage || detectLanguage(input);
    setLastDetectedLanguage(messageLanguage);

    // Check if data is available before proceeding
    if (data.markets.length === 0 && data.forecasts.length === 0 && data.warehouses.length === 0) {
      toast({
        title: "Limited Functionality",
        description: "Some data couldn't be loaded. Responses may be incomplete.",
        variant: "destructive"
      });
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Generate response using the enhanced response generator
      console.log(`Processing message in ${messageLanguage}: "${input}"`);
      
      const responseContent = generateResponse(
        input,
        data.markets,
        data.forecasts,
        data.warehouses,
        data.transporters
      );
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Show language detection feedback
      if (messageLanguage !== 'english') {
        toast({
          title: "Language Detected",
          description: `Responding in ${messageLanguage.charAt(0).toUpperCase() + messageLanguage.slice(1)}`,
          duration: 3000,
        });
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response in detected language
      const fallbackResponses = {
        swahili: "Samahani, nimepata tatizo katika kuchakata ombi lako. Tafadhali jaribu tena kwa njia tofauti.",
        kikuyu: "Nĩndagũthima, no ndiragwerire na matatĩko. Tafadhali geria rĩngĩ.",
        luo: "Akwayo tweyo, agoyo kod chandruok. Tem kendo.",
        kalenjin: "Sabarei, kokolto alokisyek. Saayi kaite.",
        english: "I apologize, but I encountered an error processing your request. Could you try asking in a different way?"
      };
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponses[messageLanguage as keyof typeof fallbackResponses] || fallbackResponses.english,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Response Error",
        description: "There was a problem generating a response. Using fallback.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Status badges */}
      <div className="absolute top-0 right-0 mr-4 mt-4 z-10 flex gap-2">
        {dataLoading ? (
          <Badge variant="outline">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading live data...
          </Badge>
        ) : isRealData ? (
          <Badge variant="secondary">
            Using Live Market Data
          </Badge>
        ) : (
          <Badge className="bg-amber-200 text-amber-800 border-amber-300" variant="outline">
            <WifiOff className="h-3 w-3 mr-1" /> 
            Connection Issue - Retry
          </Badge>
        )}
        
        {lastDetectedLanguage !== 'english' && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Globe className="h-3 w-3 mr-1" />
            {lastDetectedLanguage.charAt(0).toUpperCase() + lastDetectedLanguage.slice(1)}
          </Badge>
        )}
      </div>
      
      {error && !dataLoading && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Issue</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <p className="text-xs opacity-80">We're experiencing difficulties connecting to our data sources. Please check your internet connection and try again.</p>
            <Button 
              size="sm" 
              variant="outline"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        {/* Enhanced AI Assistant Card */}
        <div className="bg-white rounded-lg shadow-md border-primary/20 border">
          <div className="bg-gradient-to-r from-primary/5 to-background p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Agricultural Market Assistant</h2>
            <p className="text-muted-foreground">
              Ask about market demand, prices, forecasts, and the best places to sell your produce
              <br />
              <span className="text-sm">Uliza kuhusu mahitaji ya soko, bei, utabiri, na maeneo bora ya kuuza mazao yako</span>
            </p>
            {dataLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading market data from AMIS Kenya and Kilimo Statistics...</span>
              </div>
            )}
          </div>
          
          {/* Chat Interface */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating response...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Message Input */}
          <div className="border-t bg-muted/10 p-4">
            <EnhancedMessageInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask about crops, market prices, forecasts... (Swahili, Kikuyu, Luo & Kalenjin supported) / Uliza kuhusu mazao, bei za soko, utabiri..."
            />
          </div>
        </div>
        
        {/* Language Support Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h3 className="font-medium text-blue-900 mb-2">Language Support / Lugha Zinazotumika</h3>
          <p className="text-sm text-blue-800">
            🗣️ <strong>Supported Languages:</strong> English, Kiswahili, Kikuyu, Dholuo, Kalenjin, Kikamba, Maa, Kimeru
            <br />
            🤖 <strong>AI Features:</strong> Automatic language detection, contextual responses, market data integration
            <br />
            🎤 <strong>Voice Input:</strong> Speak in any supported language for transcription and response
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerAIAssistant;
