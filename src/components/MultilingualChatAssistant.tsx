// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Globe, Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'ki', name: 'Kikuyu', nativeName: 'Gĩkũyũ' },
  { code: 'luo', name: 'Luo', nativeName: 'Dholuo' },
  { code: 'kam', name: 'Kamba', nativeName: 'Kikamba' },
  { code: 'luy', name: 'Luhya', nativeName: 'Luluhya' },
  { code: 'mer', name: 'Meru', nativeName: 'Kimîîru' },
  { code: 'kln', name: 'Kalenjin', nativeName: 'Kalenjin' },
];

const SAMPLE_RESPONSES = {
  en: {
    greeting: "Hello! I'm your agricultural assistant. How can I help you today?",
    priceInfo: "Current maize prices in Nakuru are KES 45 per kg. Prices have been stable this week.",
    weatherInfo: "Today's weather: 24°C, partly cloudy with 60% chance of rain. Good conditions for planting.",
    marketInfo: "Kijabe Market operates on Tuesdays and Fridays. Best time to sell vegetables is early morning."
  },
  sw: {
    greeting: "Hujambo! Mimi ni msaidizi wako wa kilimo. Naweza kukusaidiaje leo?",
    priceInfo: "Bei za mahindi za sasa Nakuru ni KES 45 kwa kilo. Bei zimekuwa thabiti wiki hii.",
    weatherInfo: "Hali ya hewa ya leo: 24°C, mawingu kidogo na uwezekano wa 60% wa mvua. Mazingira mazuri kwa kupanda.",
    marketInfo: "Soko la Kijabe linafanya kazi Jumanne na Ijumaa. Wakati mzuri wa kuuza mboga ni mapema asubuhi."
  }
};

export function MultilingualChatAssistant() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    // Initialize with greeting message
    const greeting = SAMPLE_RESPONSES[selectedLanguage as keyof typeof SAMPLE_RESPONSES]?.greeting || SAMPLE_RESPONSES.en.greeting;
    setMessages([{
      id: '1',
      text: greeting,
      sender: 'assistant',
      timestamp: new Date(),
      language: selectedLanguage
    }]);
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = selectedLanguage === 'sw' ? 'sw-KE' : 'en-US';

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };
    }
  }, [selectedLanguage, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on keywords
    const message = userMessage.toLowerCase();
    const responses = SAMPLE_RESPONSES[selectedLanguage as keyof typeof SAMPLE_RESPONSES] || SAMPLE_RESPONSES.en;
    
    if (message.includes('price') || message.includes('bei')) {
      return responses.priceInfo;
    } else if (message.includes('weather') || message.includes('hali ya hewa')) {
      return responses.weatherInfo;
    } else if (message.includes('market') || message.includes('soko')) {
      return responses.marketInfo;
    } else {
      return responses.greeting;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(async () => {
      const responseText = await generateResponse(inputText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if (!recognition.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'sw' ? 'sw-KE' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Agricultural Assistant</CardTitle>
        </div>
        
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.sender === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => speakText(message.text)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 pt-4 border-t">
          <div className="flex-1 flex space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={selectedLanguage === 'sw' ? 'Andika ujumbe wako...' : 'Type your message...'}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              className={isListening ? 'bg-red-100 text-red-600' : ''}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button onClick={handleSendMessage} disabled={!inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            Market Prices
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Weather Info
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Transport Coordination
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Food Rescue
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default MultilingualChatAssistant;