
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Scale, Star, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarterDetailsProps {
  listing: any;
  onClose: () => void;
}

const BarterDetails: React.FC<BarterDetailsProps> = ({ listing, onClose }) => {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  const [barterQuantity, setBarterQuantity] = useState<string>('');
  const [barterCommodity, setBarterCommodity] = useState<string>(listing.seekingCommodities[0]);
  
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

  // Calculate barter exchange rate
  const calculateBarterExchange = (commodity: string, quantity: string) => {
    if (!commodity || !quantity || !listing.equivalencyRates[commodity]) return null;
    
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) return null;
    
    const rate = listing.equivalencyRates[commodity];
    const equivalent = quantityNum / rate;
    
    return {
      offerQuantity: quantityNum,
      offerCommodity: commodity,
      receiveQuantity: equivalent,
      receiveCommodity: listing.commodity
    };
  };

  // Handle sending a barter message
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${listing.owner}`
    });
    setMessageText('');
  };

  // Handle proposing a barter
  const handleProposeBarter = () => {
    if (!barterCommodity || !barterQuantity) {
      toast({
        title: "Incomplete information",
        description: "Please specify both commodity and quantity for the barter",
        variant: "destructive"
      });
      return;
    }

    const exchange = calculateBarterExchange(barterCommodity, barterQuantity);
    if (!exchange) {
      toast({
        title: "Invalid exchange",
        description: "Please enter a valid quantity for the barter",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Barter proposed",
      description: `Proposed trade: ${exchange.offerQuantity} ${exchange.offerCommodity} for ${exchange.receiveQuantity.toFixed(2)} ${exchange.receiveCommodity}`
    });
  };

  // Check if there is an exchange calculation
  const barterExchange = barterCommodity && barterQuantity 
    ? calculateBarterExchange(barterCommodity, barterQuantity) 
    : null;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{listing.commodity}</CardTitle>
            <div className="flex items-center mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {listing.location}
            </div>
          </div>
          <Badge className="bg-green-50 text-green-700 border-green-200">
            {listing.quantity} {listing.unit} available
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{listing.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Owner</h3>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>{listing.owner.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{listing.owner}</div>
                  {renderRating(listing.ownerRating)}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Quality</h3>
              <Badge variant="outline" className="mr-2">{listing.quality}</Badge>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Seeking</h3>
              <div className="flex flex-wrap gap-2">
                {listing.seekingCommodities.map((item: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Contact Seller</h3>
              <div className="space-y-3">
                <Textarea 
                  placeholder="Write your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="resize-none"
                />
                <Button onClick={handleSendMessage} className="w-full flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Scale className="mr-2 h-5 w-5" />
                  Barter Exchange
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="barter-commodity">What you're offering</Label>
                  <Select value={barterCommodity} onValueChange={setBarterCommodity}>
                    <SelectTrigger id="barter-commodity">
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {listing.seekingCommodities.map((commodity: string) => (
                        <SelectItem key={commodity} value={commodity}>
                          {commodity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="barter-quantity">Quantity ({barterCommodity ? barterCommodity : 'item'})</Label>
                  <Input 
                    id="barter-quantity"
                    type="number"
                    min="1"
                    value={barterQuantity}
                    onChange={(e) => setBarterQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>
                
                {barterExchange && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="text-sm font-medium mb-1">Exchange Rate:</div>
                    <div className="flex items-center justify-between">
                      <div>{barterExchange.offerQuantity} {barterExchange.offerCommodity}</div>
                      <div>↔</div>
                      <div>{barterExchange.receiveQuantity.toFixed(2)} {barterExchange.receiveCommodity}</div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <Button 
                  onClick={handleProposeBarter} 
                  className="w-full"
                  disabled={!barterCommodity || !barterQuantity || !barterExchange}
                >
                  Propose Barter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  );
};

export default BarterDetails;
