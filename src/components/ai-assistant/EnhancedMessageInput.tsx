
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Loader2, Mic, MicOff, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transcribeAudio, processAudioFile } from '@/services/ai/audioTranscription';

interface EnhancedMessageInputProps {
  onSendMessage: (message: string, language?: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({ 
  onSendMessage, 
  isLoading,
  placeholder = "Ask about market prices, demand, or where to sell tomorrow..."
}) => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSendMessage(input);
    setInput('');
    
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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000 // Optimal for Whisper
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Transcribe using Hugging Face Whisper
          const result = await transcribeAudio(audioBlob);
          
          if (result.text) {
            setInput(result.text);
            toast({
              title: "Voice Transcribed",
              description: `"${result.text}" (${result.language})`,
            });
          } else {
            throw new Error('No text transcribed');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast({
            title: "Transcription Failed",
            description: "Couldn't convert your voice to text. Please try typing instead.",
            variant: "destructive"
          });
        } finally {
          setIsTranscribing(false);
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly. Press the button again to stop.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Couldn't access your microphone. Please check permissions.",
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsTranscribing(true);
    
    try {
      const result = await processAudioFile(file);
      
      if (result.text) {
        setInput(result.text);
        toast({
          title: "Audio File Transcribed",
          description: `"${result.text}" (${result.language})`,
        });
      }
    } catch (error: any) {
      toast({
        title: "File Processing Failed",
        description: error.message || "Couldn't process audio file.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Textarea 
          ref={inputRef}
          placeholder={isRecording ? "Recording voice message..." : 
                      isTranscribing ? "Transcribing audio..." : 
                      placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 resize-none text-sm md:text-base ${
            isRecording ? 'bg-red-50 border-red-200 animate-pulse' : 
            isTranscribing ? 'bg-blue-50 border-blue-200' : ''
          }`}
          rows={2}
          disabled={isLoading || isRecording || isTranscribing}
        />
        <div className="flex flex-col gap-2">
          {/* Voice Recording Button */}
          <Button 
            type="button" 
            size="icon" 
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleRecording}
            disabled={isLoading || isTranscribing}
            title={isRecording ? "Stop recording" : "Record voice message"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          {/* File Upload Button */}
          <Button 
            type="button" 
            size="icon" 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isRecording || isTranscribing}
            title="Upload audio file"
          >
            {isTranscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
          
          {/* Send Button */}
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || isRecording || isTranscribing || !input.trim()}
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
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Status indicators */}
      {isRecording && (
        <div className="text-xs text-red-600 animate-pulse">
          🔴 Recording... Click microphone to stop
        </div>
      )}
      {isTranscribing && (
        <div className="text-xs text-blue-600">
          🔄 Transcribing audio... Please wait
        </div>
      )}
    </form>
  );
};
