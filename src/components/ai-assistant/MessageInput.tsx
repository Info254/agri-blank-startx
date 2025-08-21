
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Loader2, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (message: string, mediaUrl?: string, mediaType?: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading,
  placeholder = "Ask about market prices, demand, or where to sell tomorrow..."
}) => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !mediaUrl) return;
    
    onSendMessage(input, mediaUrl || undefined, mediaType || undefined);
    setInput('');
    setMediaUrl(null);
    setMediaType(null);
    
    // Re-focus on input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          // In a production app, we would send this to an API for transcription
          // For now, we'll just set a placeholder message
          const transcribedText = "Voice message recorded. (Voice-to-text processing)";
          setInput(transcribedText);
        } catch (error) {
          console.error('Error transcribing audio:', error);
          toast({
            title: "Transcription Failed",
            description: "Couldn't convert your voice to text. Please try typing instead.",
            variant: "destructive"
          });
        } finally {
          // Always stop tracks
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly and press the button again to stop recording.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Couldn't access your microphone. Please check permissions or try using text input instead.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Processing your voice message...",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Textarea 
          ref={inputRef}
          placeholder={isRecording ? "Recording voice message..." : placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 resize-none text-sm md:text-base ${isRecording ? 'bg-primary/5 animate-pulse' : ''}`}
          rows={2}
          disabled={isLoading || isRecording}
        />
        <div className="flex flex-col gap-2">
          <Button 
            type="button" 
            size="icon" 
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleRecording}
            disabled={isLoading}
            aria-label={isRecording ? "Stop recording" : "Start voice recording"}
            className="transition-all"
            title={isRecording ? "Stop recording" : "Record voice message"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || isRecording || (!input.trim() && !mediaUrl)}
            aria-label="Send message"
            title="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
