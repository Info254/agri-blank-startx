import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus } from 'lucide-react';
import { fetchLivestockListings, fetchLivestockMarkets, fetchLivestockBreeds } from '@/services/livestockMarketService';
import { LivestockListing } from '@/types/livestock';

export default function MarketplacePage() {
  const [listings, setListings] = useState<LivestockListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    breed: '',
    county: '',
    minPrice: '',
    maxPrice: '',
    isHalal: false,
  });
  const [markets, setMarkets] = useState<any[]>([]);
  const [breeds, setBreeds] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadListings();
    loadMarkets();
    loadBreeds();
  }, [filters]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await fetchLivestockListings({
        type: filters.type || undefined,
        breed: filters.breed || undefined,
        county: filters.county || undefined,
        min_price: filters.minPrice ? Number(filters.minPrice) : undefined,
        max_price: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        is_halal: filters.isHalal || undefined,
      });
      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarkets = async () => {
    try {
      const data = await fetchLivestockMarkets();
      setMarkets(data || []);
    } catch (error) {
      console.error('Error loading markets:', error);
    }
  };

  const loadBreeds = async () => {
    try {
      const data = await fetchLivestockBreeds(filters.type || undefined);
      setBreeds(data || []);
    } catch (error) {
      console.error('Error loading breeds:', error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      type: '',
      breed: '',
      county: '',
      minPrice: '',
      maxPrice: '',
      isHalal: false,
    });
  };

  const navigateToCreate = () => {
    navigate('/livestock/sell');
  };

  const navigateToDetail = (id: string) => {
    navigate(`/livestock/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Livestock Marketplace</h1>
        <Button onClick={navigateToCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Sell Livestock
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Filters</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select 
              value={filters.type} 
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Animal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cattle">Cattle</SelectItem>
                <SelectItem value="goat">Goat</SelectItem>
                <SelectItem value="sheep">Sheep</SelectItem>
                <SelectItem value="poultry">Poultry</SelectItem>
                <SelectItem value="pigs">Pigs</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.breed} 
              onValueChange={(value) => handleFilterChange('breed', value)}
              disabled={!filters.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Breed" />
              </SelectTrigger>
              <SelectContent>
                {breeds.map((breed) => (
                  <SelectItem key={breed.id} value={breed.name}>
                    {breed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.county} 
              onValueChange={(value) => handleFilterChange('county', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select County" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(new Set(markets.map(m => m.county))).map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Input 
                type="number" 
                placeholder="Min Price" 
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span>to</span>
              <Input 
                type="number" 
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="halal" 
                checked={filters.isHalal}
                onChange={(e) => handleFilterChange('isHalal', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="halal" className="text-sm font-medium">
                Halal Certified Only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card 
              key={listing.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigateToDetail(listing.id)}
            >
              <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {listing.images?.[0] ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.type}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {listing.breed} {listing.type}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {listing.market?.name || 'N/A'}, {listing.market?.county || 'N/A'}
                    </p>
                  </div>
                  <Badge variant={listing.is_halal ? 'default' : 'outline'}>
                    {listing.is_halal ? 'Halal Certified' : 'Non-Halal'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">KSh {listing.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {listing.weight} kg • {listing.age} months old
                    </p>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {listings.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium">No listings found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
