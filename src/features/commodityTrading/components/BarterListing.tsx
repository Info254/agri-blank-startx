
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Share2 } from 'lucide-react';
import SocialShare from '@/components/common/SocialShare';

interface BarterListingProps {
  listing: any;
  isSelected: boolean;
  onSelect: (listing: any) => void;
}

const BarterListing: React.FC<BarterListingProps> = ({ listing, isSelected, onSelect }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Render rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : i < rating ? 'text-yellow-500 fill-yellow-500 opacity-50' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const shareText = `Check out this barter listing: ${listing.commodity} (${listing.quantity} ${listing.unit}) available in ${listing.location}. Looking to trade for: ${listing.seekingCommodities.join(', ')}.`;

  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 bg-muted">
          <div className="aspect-square relative">
            <img 
              src={listing.imageUrl} 
              alt={listing.commodity} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="p-4 md:w-3/4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1" onClick={() => onSelect(listing)}>
              <h3 className="text-lg font-semibold cursor-pointer">{listing.commodity}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {listing.location}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {listing.quantity} {listing.unit} available
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareOptions(!showShareOptions)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{listing.owner.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{listing.owner}</span>
            </div>
            <div className="ml-3">
              {renderRating(listing.ownerRating)}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {listing.description}
          </p>
          
          <div className="mb-4">
            <div className="text-sm font-medium mb-1">Seeking:</div>
            <div className="flex flex-wrap gap-2">
              {listing.seekingCommodities.map((item: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Listed: {listing.listedDate}
            </div>
          </div>

          {showShareOptions && (
            <div className="mt-4 pt-4 border-t">
              <SocialShare
                title={`Barter Opportunity: ${listing.commodity}`}
                text={shareText}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BarterListing;
