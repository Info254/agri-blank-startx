
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, MapPin, Mail, Phone, Globe } from 'lucide-react';
import { AdvertisementService, type BusinessAdvertisement } from '@/services/business/advertisementService';

const BusinessAdvertisementsView: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<BusinessAdvertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdvertisements();
  }, []);

  const loadAdvertisements = async () => {
    setLoading(true);
    try {
      const ads = await AdvertisementService.getActiveAdvertisements();
      setAdvertisements(ads);
    } catch (error) {
      console.error('Error loading advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (ad: BusinessAdvertisement) => {
    if (ad.id) {
      await AdvertisementService.incrementClickCount(ad.id);
      if (ad.website_url) {
        window.open(ad.website_url, '_blank');
      }
    }
  };

  const handleAdView = async (ad: BusinessAdvertisement) => {
    if (ad.id) {
      await AdvertisementService.incrementViewCount(ad.id);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Featured Agricultural Businesses</h2>
        <p className="text-muted-foreground">
          Discover trusted agricultural services and products from verified businesses
        </p>
      </div>

      {advertisements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No active advertisements at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <Card 
              key={ad.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleAdView(ad)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{ad.business_name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {ad.business_category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {ad.views_count || 0}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {ad.business_description}
                </p>
                
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-2">Advertisement:</p>
                  <p className="text-sm line-clamp-4">{ad.ad_content}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{ad.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${ad.contact_email}`}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {ad.contact_email}
                    </a>
                  </div>
                  
                  {ad.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${ad.contact_phone}`}
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {ad.contact_phone}
                      </a>
                    </div>
                  )}
                  
                  {ad.website_url && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdClick(ad);
                        }}
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>

                {ad.target_audience && ad.target_audience.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Target Audience:</p>
                    <div className="flex flex-wrap gap-1">
                      {ad.target_audience.slice(0, 3).map((audience) => (
                        <Badge key={audience} variant="outline" className="text-xs">
                          {audience}
                        </Badge>
                      ))}
                      {ad.target_audience.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ad.target_audience.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(ad.expires_at || '').toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessAdvertisementsView;
