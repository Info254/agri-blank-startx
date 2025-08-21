import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Phone, Mail, Globe, Calendar, Star, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useCityMarkets } from '@/hooks/useCityMarkets';
import { CityMarket } from '@/types/cityMarket';

const MarketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [market, setMarket] = useState<CityMarket | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const { getMarket } = useCityMarkets();

  useEffect(() => {
    const fetchMarket = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data } = await getMarket(id);
        setMarket(data);
        
        // Check if market is in favorites
        const favorites = JSON.parse(localStorage.getItem('favoriteMarkets') || '[]');
        setIsFavorite(favorites.includes(id));
      } catch (error) {
        console.error('Error fetching market:', error);
        toast({
          title: 'Error',
          description: 'Failed to load market details. Please try again.',
          variant: 'destructive',
        });
        navigate('/markets');
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, [id, navigate, toast, getMarket]);

  const toggleFavorite = () => {
    if (!id) return;
    
    const favorites = JSON.parse(localStorage.getItem('favoriteMarkets') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((favId: string) => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    localStorage.setItem('favoriteMarkets', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      description: isFavorite 
        ? 'This market has been removed from your favorites.' 
        : 'You can now find this market in your favorites.',
    });
  };

  const shareMarket = async () => {
    if (!market) return;
    
    const shareData = {
      title: market.market_name,
      text: `Check out ${market.market_name} in ${market.city}, ${market.county}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied',
          description: 'Market link has been copied to your clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-6 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Market Not Found</h2>
          <p className="text-muted-foreground mb-6">The market you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/markets')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Markets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFavorite}
              className={isFavorite ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : ''}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-yellow-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={shareMarket}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Market Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {market.market_name}
              </h1>
              <div className="flex items-center mt-1 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span>
                  {market.city}, {market.county}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={market.is_verified ? 'default' : 'outline'}>
                {market.is_verified ? 'Verified' : 'Unverified'}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {market.market_type}
              </Badge>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Traders</p>
                    <p className="text-lg font-semibold">{market.average_daily_traders || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-50 text-green-600 mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Buyers</p>
                    <p className="text-lg font-semibold">{market.average_daily_buyers || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mr-3">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Operating Days</p>
                    <p className="text-lg font-semibold">
                      {market.operating_days?.length || 0} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mr-3">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                      <span className="font-semibold">4.5</span>
                      <span className="text-sm text-muted-foreground ml-1">(24)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-muted-foreground">
                        {market.description || 'No description available for this market.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Operating Hours</h4>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{market.operating_hours || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      {market.operating_days?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Market Days</h4>
                          <div className="flex flex-wrap gap-2">
                            {market.operating_days.map((day) => (
                              <Badge key={day} variant="outline">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {market.facilities?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Facilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {market.facilities.map((facility) => (
                            <Badge key={facility} variant="secondary">
                              {facility.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {market.commodities_traded?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Commodities Traded</h4>
                        <div className="flex flex-wrap gap-2">
                          {market.commodities_traded.map((commodity) => (
                            <Badge key={commodity} variant="outline">
                              {commodity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {market.commodities_traded?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {market.commodities_traded.map((commodity) => (
                          <div key={commodity} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-medium">{commodity}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Available from multiple sellers
                            </p>
                            <Button variant="outline" size="sm" className="mt-3 w-full">
                              View Sellers
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No products listed yet</h3>
                        <p className="text-muted-foreground mt-1">
                          Check back later or contact the market for more information.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Reviews</CardTitle>
                      <Button variant="outline" size="sm">
                        Write a Review
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 mx-auto text-amber-400 fill-amber-100 mb-4" />
                      <h3 className="text-lg font-medium">No reviews yet</h3>
                      <p className="text-muted-foreground mt-1">
                        Be the first to review this market.
                      </p>
                      <Button className="mt-4">Write a Review</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 rounded-lg bg-muted mr-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {market.physical_address || 'Not specified'}
                    </p>
                    {market.coordinates && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {market.coordinates.lat}, {market.coordinates.lng}
                      </p>
                    )}
                  </div>
                </div>

                {market.contact_phone && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-muted mr-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <a 
                        href={`tel:${market.contact_phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {market.contact_phone}
                      </a>
                    </div>
                  </div>
                )}

                {market.contact_email && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-muted mr-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <a 
                        href={`mailto:${market.contact_email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {market.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {market.website_url && (
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-muted mr-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">Website</h4>
                      <a 
                        href={market.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {market.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                <Button className="w-full mt-4">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Market
                </Button>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Map View</p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Similar Markets */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                      <div className="h-12 w-12 bg-muted rounded-lg flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">Market {i}</h4>
                        <p className="text-sm text-muted-foreground">
                          {market.city}, {market.county}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-2">
                  View All Markets
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketDetails;
