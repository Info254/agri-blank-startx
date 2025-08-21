
import React, { useEffect, useRef } from 'react';
import { X, Calendar, MapPin, ExternalLink, Tag, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataItem } from '@/types';
import { getCategoryName } from '@/services/api';

interface DetailViewProps {
  item: DataItem;
  onClose: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ item, onClose }) => {
  const detailRef = useRef<HTMLDivElement>(null);

  const categoryColors = {
    'agriculture': 'bg-sage-500 text-white hover:bg-sage-600',
    'tender': 'bg-soil-500 text-white hover:bg-soil-600',
    'supply-chain': 'bg-blue-500 text-white hover:bg-blue-600',
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (detailRef.current && !detailRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    // Add a class to the body to prevent scrolling
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    };
  }, [onClose]);

  // Format content paragraphs if content exists
  const formattedContent = item.content 
    ? item.content
        .split(/\d+\)/)
        .filter(paragraph => paragraph.trim().length > 0)
        .map((paragraph, index) => (
          <p key={index} className="mb-4">
            {index > 0 && <span className="font-medium">{index})</span>}
            {paragraph}
          </p>
        ))
    : [<p key="no-content" className="mb-4">No detailed content available.</p>];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <Card 
        ref={detailRef}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-fade-up"
      >
        <CardHeader className="p-6 flex flex-row justify-between items-start">
          <div>
            <Badge className={(categoryColors[item.category as keyof typeof categoryColors] || "bg-secondary") + " mb-2"}>
              {getCategoryName(item.category)}
            </Badge>
            <h2 className="text-2xl font-bold">{item.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-6 flex-grow overflow-y-auto">
          <div className="flex flex-col gap-5">
            <div className="space-y-1 text-sm mb-2">
              <div className="flex items-center text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Published: {new Date(item.date).toLocaleDateString()}
              </div>
              
              {item.location && (
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location: {item.location}
                </div>
              )}
              
              {item.deadline && (
                <div className="flex items-center text-amber-600 font-medium mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Deadline: {item.deadline}
                </div>
              )}
              
              {item.contact && (
                <div className="flex items-center text-muted-foreground mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact: {item.contact}
                </div>
              )}
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg border border-default-border mb-4">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-3">Details</h3>
              <div className="text-foreground/90">
                {formattedContent}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                  >
                    <Tag className="h-3.5 w-3.5 inline mr-1.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="p-6 flex justify-between items-center bg-muted/20">
          <div className="text-sm">
            Source: <span className="font-medium">{item.source}</span>
          </div>
          {item.url && (
            <Button variant="outline" asChild>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Source <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DetailView;
