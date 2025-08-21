
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  title: string;
  text: string;
  url?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'buttons' | 'dropdown' | 'card';
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  title, 
  text, 
  url = window.location.href,
  size = 'md',
  variant = 'buttons'
}) => {
  const { toast } = useToast();

  const shareText = `${title}\n\n${text}\n\nShared via AgriConnect: ${url}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Shared via WhatsApp",
      description: "Opening WhatsApp to share this content.",
    });
  };

  const shareViaTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title + '\n\n' + text)}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Shared via Telegram",
      description: "Opening Telegram to share this content.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Content copied! You can now paste it anywhere.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Couldn't copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  if (variant === 'card') {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="h-4 w-4" />
            <h3 className="font-medium">Share this content</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={shareViaWhatsApp}
              size={buttonSize}
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button
              onClick={shareViaTelegram}
              size={buttonSize}
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Send className="h-5 w-5 text-blue-600" />
              <span className="text-xs">Telegram</span>
            </Button>
            <Button
              onClick={copyToClipboard}
              size={buttonSize}
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Copy</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={shareViaWhatsApp}
        size={buttonSize}
        variant="outline"
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4 text-green-600" />
        {size !== 'sm' && 'WhatsApp'}
      </Button>
      <Button
        onClick={shareViaTelegram}
        size={buttonSize}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Send className="h-4 w-4 text-blue-600" />
        {size !== 'sm' && 'Telegram'}
      </Button>
      {variant === 'buttons' && (
        <Button
          onClick={copyToClipboard}
          size={buttonSize}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          {size !== 'sm' && 'Copy'}
        </Button>
      )}
    </div>
  );
};

export default SocialShare;
