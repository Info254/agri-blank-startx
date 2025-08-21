import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, MapPin, Scale, Heart, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LivestockMarket, LivestockType, LivestockForSale, AnimalGender, LivestockBreed } from '@/types/livestock';
import { LivestockMarketService } from '@/services/livestockMarketService';

type FilterValue = LivestockType | string | number | AnimalGender | boolean | [number, number];

type LivestockFilter = {
  type?: LivestockType;
  breed?: string;
  minAge?: number;
  maxAge?: number;
  minWeight?: number;
  maxWeight?: number;
  gender?: AnimalGender;
  isHalal?: boolean;
  priceRange?: [number, number];
};

const LivestockMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState<LivestockMarket[]>([]);
  const [animals, setAnimals] = useState<LivestockForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<LivestockFilter>({});
  const [breeds, setBreeds] = useState<LivestockBreed[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>('');

  // Fetch markets and initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [marketsData, breedsData] = await Promise.all([
          LivestockMarketService.listMarkets(),
          LivestockMarketService.listBreeds(),
        ]);
        setMarkets(marketsData as unknown as LivestockMarket[]);
        setBreeds(breedsData as unknown as LivestockBreed[]);
        
        // Load animals based on initial filters
        const animalsData = await LivestockMarketService.listAnimalsForSale({
          ...filters,
          marketId: selectedMarket || undefined,
        });
        setAnimals(animalsData as unknown as LivestockForSale[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, selectedMarket]);

    const handleFilterChange = (key: keyof LivestockFilter, value: FilterValue | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleMarketSelect = (marketId: string) => {
    setSelectedMarket(marketId === selectedMarket ? '' : marketId);
  };

  const getFilteredAnimals = () => {
    return animals.filter(animal => {
      if (activeTab !== 'all' && animal.type !== activeTab) return false;
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Livestock Marketplace</h1>
        <p className="text-muted-foreground">
          Buy and sell livestock with confidence. All animals are verified and meet health standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Market</label>
                <Select
                  value={selectedMarket}
                  onValueChange={setSelectedMarket}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Markets</SelectItem>
                    {markets.map(market => (
                      <SelectItem key={market.id} value={market.id}>
                        {market.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Animal Type</label>
                <Select
                  value={filters.type || ''}
                  onValueChange={(value) => handleFilterChange('type', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="cattle">Cattle</SelectItem>
                    <SelectItem value="poultry">Poultry</SelectItem>
                    <SelectItem value="sheep_goats">Sheep & Goats</SelectItem>
                    <SelectItem value="pigs">Pigs</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filters.type && (
                <div>
                  <label className="block text-sm font-medium mb-1">Breed</label>
                  <Select
                    value={filters.breed || ''}
                    onValueChange={(value) => handleFilterChange('breed', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Breeds</SelectItem>
                      {breeds
                        .filter((b: LivestockBreed) => b.type === filters.type)
                        .map((breed: LivestockBreed) => (
                          <SelectItem key={breed.id} value={breed.id}>
                            {breed.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <Select
                  value={filters.gender || ''}
                  onValueChange={(value) => handleFilterChange('gender', value as AnimalGender || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="castrated_male">Castrated Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="halal-only"
                  checked={filters.isHalal || false}
                  onCheckedChange={(checked) => handleFilterChange('isHalal', checked || undefined)}
                />
                <label
                  htmlFor="halal-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Halal Certified Only
                </label>
              </div>

              <Button className="w-full" onClick={() => setFilters({})}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Markets Near You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {markets.slice(0, 5).map(market => (
                <div
                  key={market.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedMarket === market.id ? 'bg-accent' : 'hover:bg-muted'}`}
                  onClick={() => handleMarketSelect(market.id)}
                >
                  <div className="font-medium">{market.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {market.county || 'Location not specified'}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    {market.halalCertified && (
                      <Badge variant="secondary" className="mr-2">
                        Halal Certified
                      </Badge>
                    )}
                    {market.hasVeterinaryServices && (
                      <Badge variant="secondary">Vet Available</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="cattle">Cattle</TabsTrigger>
                <TabsTrigger value="poultry">Poultry</TabsTrigger>
                <TabsTrigger value="sheep_goats">Sheep & Goats</TabsTrigger>
                <TabsTrigger value="pigs">Pigs</TabsTrigger>
                <TabsTrigger value="fish">Fish</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredAnimals().length > 0 ? (
              getFilteredAnimals().map(animal => (
                <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-muted">
                    {animal.images && animal.images.length > 0 ? (
                      <img
                        src={animal.images[0]}
                        alt={animal.breed}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image available</span>
                      </div>
                    )}
                    {animal.isHalal && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Halal
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary">
                        {animal.breed}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">
                        {animal.gender === 'male' ? '♂' : animal.gender === 'female' ? '♀' : '⚲'} {animal.breed}
                      </h3>
                      <div className="text-lg font-bold text-primary">
                        KSh {animal.price?.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Scale className="h-4 w-4 mr-1" />
                        {animal.weight} kg
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {animal.age} months
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {animal.marketId ? markets.find(m => m.id === animal.marketId)?.name || 'N/A' : 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(animal.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <Button variant="outline" size="sm" className="flex-1 mr-2">
                        <Heart className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => navigate(`/livestock/${animal.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No animals found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockMarketplace;
