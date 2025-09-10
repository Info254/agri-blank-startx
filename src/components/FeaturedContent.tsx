// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

const FeaturedContent: React.FC = () => {
  const featuredItems = [
    {
      id: 1,
      title: 'New Market Prices for Maize in Central Kenya',
      type: 'Market Update',
      date: '2024-01-10',
      location: 'Nairobi, Kenya',
      description: 'Latest pricing trends show increased demand for quality maize with prices ranging from KES 45-65 per kg.',
      tags: ['Maize', 'Prices', 'Central Kenya']
    },
    {
      id: 2,
      title: 'Transport Coordination Service Launch',
      type: 'Service',
      date: '2024-01-08',
      location: 'Nakuru, Kenya',
      description: 'New Bluetooth mesh network for coordinating shared transport reduces costs by up to 40%.',
      tags: ['Transport', 'Technology', 'Cost Savings']
    },
    {
      id: 3,
      title: 'Weather Alert: Heavy Rains Expected',
      type: 'Weather',
      date: '2024-01-12',
      location: 'Western Kenya',
      description: 'Prepare for heavy rainfall in the coming week. Secure your crops and plan accordingly.',
      tags: ['Weather', 'Alert', 'Farming']
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
          <p className="text-lg text-muted-foreground">
            Stay informed with the latest agricultural news and market updates
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {item.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Read More
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;