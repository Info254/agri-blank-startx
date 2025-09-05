import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Star, 
  Leaf, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Calendar,
  Package,
  Shield
} from 'lucide-react';

interface MatchingProfile {
  id: string;
  name: string;
  type: 'buyer' | 'seller';
  avatar: string;
  rating: number;
  location: string;
  verified: boolean;
  organicCertified: boolean;
  specialties: string[];
  description: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  preferences: {
    commodities: string[];
    priceRange: { min: number; max: number };
    volume: string;
    deliveryRadius: number;
  };
  matchScore: number;
  lastActive: string;
}

const BuyerSellerMatching: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buyers' | 'sellers'>('buyers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);

  // Mock data for demonstration
  const buyers: MatchingProfile[] = [
    {
      id: 'b1',
      name: 'Fresh Harvest Ltd',
      type: 'buyer',
      avatar: '/avatars/company1.jpg',
      rating: 4.8,
      location: 'Nairobi',
      verified: true,
      organicCertified: true,
      specialties: ['Organic Vegetables', 'Export Quality', 'Bulk Orders'],
      description: 'Leading organic produce buyer with 15+ years experience. Looking for consistent suppliers of certified organic vegetables.',
      contactInfo: {
        phone: '+254 700 123 456',
        email: 'procurement@freshharvest.co.ke'
      },
      preferences: {
        commodities: ['tomatoes', 'kale', 'spinach', 'carrots'],
        priceRange: { min: 50, max: 150 },
        volume: '500-2000 kg/week',
        deliveryRadius: 100
      },
      matchScore: 95,
      lastActive: '2 hours ago'
    },
    {
      id: 'b2',
      name: 'Green Valley Supermarkets',
      type: 'buyer',
      avatar: '/avatars/company2.jpg',
      rating: 4.6,
      location: 'Mombasa',
      verified: true,
      organicCertified: false,
      specialties: ['Retail Chain', 'Regular Orders', 'Quality Standards'],
      description: 'Regional supermarket chain seeking reliable suppliers for fresh produce across coastal region.',
      contactInfo: {
        phone: '+254 700 234 567',
        email: 'supply@greenvalley.co.ke'
      },
      preferences: {
        commodities: ['french-beans', 'capsicum', 'cucumber', 'lettuce'],
        priceRange: { min: 40, max: 120 },
        volume: '1000-5000 kg/week',
        deliveryRadius: 150
      },
      matchScore: 87,
      lastActive: '1 day ago'
    }
  ];

  const sellers: MatchingProfile[] = [
    {
      id: 's1',
      name: 'Meru Organic Farmers Co-op',
      type: 'seller',
      avatar: '/avatars/coop1.jpg',
      rating: 4.9,
      location: 'Meru',
      verified: true,
      organicCertified: true,
      specialties: ['Certified Organic', 'Group Farming', 'Consistent Supply'],
      description: 'Cooperative of 200+ certified organic farmers producing high-quality vegetables year-round.',
      contactInfo: {
        phone: '+254 700 345 678',
        email: 'sales@meruorganic.co.ke'
      },
      preferences: {
        commodities: ['tomatoes', 'kale', 'spinach', 'onions'],
        priceRange: { min: 60, max: 140 },
        volume: '2000-8000 kg/week',
        deliveryRadius: 200
      },
      matchScore: 92,
      lastActive: '30 minutes ago'
    },
    {
      id: 's2',
      name: 'Nakuru Fresh Farms',
      type: 'seller',
      avatar: '/avatars/farm1.jpg',
      rating: 4.7,
      location: 'Nakuru',
      verified: true,
      organicCertified: false,
      specialties: ['Greenhouse Farming', 'Export Quality', 'Technology Driven'],
      description: 'Modern greenhouse operation specializing in premium vegetables with advanced farming techniques.',
      contactInfo: {
        phone: '+254 700 456 789',
        email: 'orders@nakurufresh.co.ke'
      },
      preferences: {
        commodities: ['capsicum', 'cucumber', 'lettuce', 'herbs'],
        priceRange: { min: 80, max: 200 },
        volume: '500-3000 kg/week',
        deliveryRadius: 250
      },
      matchScore: 89,
      lastActive: '4 hours ago'
    }
  ];

  const commodities = [
    'all', 'tomatoes', 'kale', 'spinach', 'carrots', 'french-beans', 
    'capsicum', 'cucumber', 'lettuce', 'onions', 'herbs'
  ];

  const locations = ['all', 'Nairobi', 'Mombasa', 'Meru', 'Nakuru', 'Kisumu', 'Eldoret'];

  const currentProfiles = activeTab === 'buyers' ? buyers : sellers;

  const filteredProfiles = currentProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCommodity = selectedCommodity === 'all' || 
                           profile.preferences.commodities.includes(selectedCommodity);
    const matchesLocation = locationFilter === 'all' || profile.location === locationFilter;
    const matchesOrganic = !organicOnly || profile.organicCertified;
    
    return matchesSearch && matchesCommodity && matchesLocation && matchesOrganic;
  });

  const initiateContact = (profile: MatchingProfile) => {
    // Mock contact initiation
    alert(`Initiating contact with ${profile.name}. In a real app, this would open a messaging interface or contact form.`);
  };

  const requestMatch = (profile: MatchingProfile) => {
    // Mock match request
    alert(`Match request sent to ${profile.name}. They will be notified and can respond to your request.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Buyer-Seller Matching</h2>
          <p className="text-muted-foreground">
            Connect with verified {activeTab === 'buyers' ? 'buyers' : 'sellers'} for organic and conventional produce
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Leaf className="h-3 w-3 mr-1" />
            Organic Certified Available
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            <Shield className="h-3 w-3 mr-1" />
            Verified Partners Only
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger>
                <SelectValue placeholder="Commodity" />
              </SelectTrigger>
              <SelectContent>
                {commodities.map(commodity => (
                  <SelectItem key={commodity} value={commodity}>
                    {commodity === 'all' ? 'All Commodities' : commodity.charAt(0).toUpperCase() + commodity.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant={organicOnly ? "default" : "outline"}
              onClick={() => setOrganicOnly(!organicOnly)}
              className="justify-start"
            >
              <Leaf className="h-4 w-4 mr-2" />
              Organic Only
            </Button>
            
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Best Matches
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buyers' | 'sellers')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buyers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Buyers ({buyers.length})
          </TabsTrigger>
          <TabsTrigger value="sellers" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Sellers ({sellers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buyers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback>
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{profile.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{profile.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="text-green-600">
                        {profile.matchScore}% Match
                      </Badge>
                      {profile.organicCertified && (
                        <Badge variant="outline" className="text-green-600">
                          <Leaf className="h-3 w-3 mr-1" />
                          Organic
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {profile.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Volume:</span>
                        <div className="font-medium">{profile.preferences.volume}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price Range:</span>
                        <div className="font-medium">
                          KES {profile.preferences.priceRange.min}-{profile.preferences.priceRange.max}/kg
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground text-sm">Interested in:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile.preferences.commodities.slice(0, 4).map((commodity) => (
                          <Badge key={commodity} variant="secondary" className="text-xs">
                            {commodity}
                          </Badge>
                        ))}
                        {profile.preferences.commodities.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{profile.preferences.commodities.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Active {profile.lastActive}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => initiateContact(profile)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => requestMatch(profile)}
                        >
                          Request Match
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback>
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{profile.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{profile.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="text-green-600">
                        {profile.matchScore}% Match
                      </Badge>
                      {profile.organicCertified && (
                        <Badge variant="outline" className="text-green-600">
                          <Leaf className="h-3 w-3 mr-1" />
                          Organic
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {profile.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Capacity:</span>
                        <div className="font-medium">{profile.preferences.volume}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price Range:</span>
                        <div className="font-medium">
                          KES {profile.preferences.priceRange.min}-{profile.preferences.priceRange.max}/kg
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground text-sm">Produces:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile.preferences.commodities.slice(0, 4).map((commodity) => (
                          <Badge key={commodity} variant="secondary" className="text-xs">
                            {commodity}
                          </Badge>
                        ))}
                        {profile.preferences.commodities.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{profile.preferences.commodities.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Active {profile.lastActive}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => initiateContact(profile)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => requestMatch(profile)}
                        >
                          Request Match
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredProfiles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to find more {activeTab === 'buyers' ? 'buyers' : 'sellers'}.
            </p>
            <Button variant="outline">Clear Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuyerSellerMatching;
