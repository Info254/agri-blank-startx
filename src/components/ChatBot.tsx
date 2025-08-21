
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Hello! I\'m the AgriTender Connect assistant. How can I help you today? You can ask me about agricultural issues, tender opportunities, or supply chain information.',
    sender: 'bot',
    timestamp: new Date().toISOString(),
  },
];

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, we're just using static responses
      // In a real application, this would call an API
      const botResponses: Record<string, string> = {
        default: "I'm sorry, I don't have specific information about that. Can I help you with agricultural issues, tender opportunities, or supply chain information?",
        agriculture: "Agriculture in Kenya is a major economic sector, contributing approximately 33% of the GDP. The country produces crops such as tea, coffee, corn, wheat, sugarcane, and various fruits and vegetables.",
        tender: "Tender opportunities in Kenya are published by various government agencies and private organizations. You can search for current opportunities on our platform.",
        markets: "Market prices for agricultural produce vary by region and season. The most recent data shows that tomatoes are selling for KES 80-120 per kg in major urban markets.",
        farmers: "Farmers can register on our platform to connect with buyers, access market information, and find logistics providers.",
      };

      // Simple keyword matching for demo responses
      let responseText = botResponses.default;
      const lowerInput = userMessage.text.toLowerCase();
      
      if (lowerInput.includes('agriculture') || lowerInput.includes('farming')) {
        responseText = botResponses.agriculture;
      } else if (lowerInput.includes('tender') || lowerInput.includes('contract')) {
        responseText = botResponses.tender;
      } else if (lowerInput.includes('market') || lowerInput.includes('price')) {
        responseText = botResponses.markets;
      } else if (lowerInput.includes('farmer') || lowerInput.includes('register')) {
        responseText = botResponses.farmers;
      }

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background rounded-lg shadow-lg border border-default-border w-80 md:w-96 h-96 flex flex-col overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium">AgriTender Assistant</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0 text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </Button>
          </div>
          
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-primary text-primary-foreground ml-2' : 'bg-muted mr-2'}`}>
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start max-w-[80%]">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                      <Bot size={16} />
                    </div>
                    <div className="p-3 rounded-lg bg-muted flex items-center space-x-1">
                      <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-default-border">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input 
                placeholder="Type your message..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim() || isLoading}
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)} 
          variant="default" 
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </Button>
      )}
    </div>
  );
};

export default ChatBot;
