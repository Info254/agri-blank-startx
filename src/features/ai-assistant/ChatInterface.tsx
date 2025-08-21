
import React, { useRef, useEffect, useState } from 'react';
import { Bot, User, AlertCircle, Loader2 } from 'lucide-react';
import { Message } from './types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isVisible) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isVisible]);

  // Handle visibility change for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Performance optimization: Adjust max-width based on device
  const getMessageMaxWidth = () => {
    return isMobile ? 'max-w-[85%]' : 'max-w-[80%] md:max-w-[70%]';
  };

  // Handle empty messages state
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No conversation history yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start by asking about crop prices, market demand, or storage options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-[300px] overflow-y-auto p-2 sm:p-3">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div 
            className={`flex ${getMessageMaxWidth()} items-start gap-2 ${
              message.role === 'assistant' 
                ? 'bg-muted rounded-lg p-2 sm:p-3' 
                : 'bg-primary text-primary-foreground rounded-lg p-2 sm:p-3'
            }`}
          >
            {message.role === 'assistant' && <Bot className="h-5 w-5 mt-0.5 shrink-0" />}
            <div>
              <p className="whitespace-pre-line text-sm md:text-base break-words">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            {message.role === 'user' && <User className="h-5 w-5 mt-0.5 shrink-0" />}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg p-2 sm:p-3 flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty div for scrolling to bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
