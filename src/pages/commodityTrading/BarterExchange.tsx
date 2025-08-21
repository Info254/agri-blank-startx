
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, MapPin, Calendar } from 'lucide-react';

const BarterExchange: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sampleBarterListings = [
    {
      id: '1',
      title: 'Trade Maize for Fertilizer',
      offeredItem: 'Maize - 10 bags (90kg each)',
      requestedItem: 'NPK Fertilizer - 5 bags (50kg each)',
      location: 'Nakuru County',
      farmerName: 'John Maina',
      contact: '+254 700 123456',
      postedDate: '2024-01-15',
      category: 'Grains'
    },
    {
      id: '2',
      title: 'Beans for Transport Services',
      offeredItem: 'Green Beans - 20 bags (50kg each)',
      requestedItem: 'Transport to Nairobi Market',
      location: 'Meru County',
      farmerName: 'Mary Wanjiku',
      contact: '+254 701 234567',
      postedDate: '2024-01-14',
      category: 'Legumes'
    },
    {
      id: '3',
      title: 'Equipment Exchange',
      offeredItem: 'Tractor Use - 2 days per month',
      requestedItem: 'Harvester Use - 1 day',
      location: 'Uasin Gishu County',
      farmerName: 'Peter Kiprotich',
      contact: '+254 702 345678',
      postedDate: '2024-01-13',
      category: 'Equipment'
    }
  ];

  const filteredListings = sampleBarterListings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.offeredItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.requestedItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Barter Exchange</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Trade agricultural goods and services directly with other farmers without using money
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search barter opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>Post Barter Offer</Button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{listing.title}</CardTitle>
                    <Badge variant="secondary">{listing.category}</Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(listing.postedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-semibold text-green-800 mb-2">Offering:</h4>
                    <p className="text-green-700">{listing.offeredItem}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-2">Looking for:</h4>
                    <p className="text-blue-700">{listing.requestedItem}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{listing.farmerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                  <Button>Contact Farmer</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No barter opportunities found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or be the first to post a barter offer!
              </p>
              <Button>Post Your First Barter Offer</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BarterExchange;
