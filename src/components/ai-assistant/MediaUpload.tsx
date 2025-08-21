
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploadProps {
  onMediaUpload: (url: string, type: string) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaUpload }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const timestamp = new Date().toISOString();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('farmer_media')
        .upload(fileName, file);

      if (error) throw error;

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('farmer_media')
          .getPublicUrl(data.path);

        onMediaUpload(publicUrl, file.type);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload media. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      const canvasElement = document.createElement('canvas');
      
      videoElement.srcObject = stream;
      await videoElement.play();

      // Set canvas size to match video dimensions
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // Capture frame from video
      const context = canvasElement.getContext('2d');
      context?.drawImage(videoElement, 0, 0);

      // Convert to blob
      canvasElement.toBlob(async (blob) => {
        if (blob) {
          await handleFileUpload(
            new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
          );
        }
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Couldn't access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={handleCapture}
        disabled={isUploading}
      >
        <Camera className="h-4 w-4" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
    </div>
  );
};

export default MediaUpload;
