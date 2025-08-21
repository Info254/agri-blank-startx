
import React, { Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message } from '@/features/ai-assistant/types';

// Use lazy loading for components that might not be immediately needed
const ChatInterface = lazy(() => import('@/features/ai-assistant/ChatInterface'));
const MessageInput = lazy(() => import('@/components/ai-assistant/MessageInput'));

interface AssistantCardProps {
  title: string;
  description: string;
  messages: Message[];
  isLoading: boolean;
  dataLoading: boolean;
  error: string | null;
  onSendMessage: (input: string) => Promise<() => void> | void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({
  title,
  description,
  messages,
  isLoading,
  dataLoading,
  error,
  onSendMessage
}) => {
  return (
    <Card className="w-full h-full shadow-md border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-background">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
        {dataLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Loading market data from AMIS Kenya and Kilimo Statistics...</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Suspense fallback={
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <ChatInterface messages={messages} isLoading={isLoading} />
        </Suspense>
      </CardContent>
      <CardFooter className="border-t bg-muted/10">
        <Suspense fallback={<div className="w-full h-20 animate-pulse bg-muted rounded-md"></div>}>
          <MessageInput 
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            placeholder="Ask about crops, market prices, forecasts... (Swahili, Kikuyu, Luo & Kalenjin supported)"
          />
        </Suspense>
      </CardFooter>
    </Card>
  );
};

export default AssistantCard;
