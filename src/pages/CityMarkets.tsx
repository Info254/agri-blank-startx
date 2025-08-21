import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Users, Package, Clock, Building2, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useCityMarkets } from '@/hooks/useCityMarkets';
import { COUNTIES, MARKET_TYPES, FACILITIES } from '@/config/markets';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CityMarket } from '@/types/cityMarket';

interface MarketFormData extends Omit<CityMarket, 'id' | 'created_at' | 'updated_at' | 'coordinates'> {
  coordinates: string; // Format: "lat,lng"
}

const CityMarkets: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [showAddMarket, setShowAddMarket] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarketFormData>();
  
  const {
    markets,
    loading,
    filters,
    setFilters,
    createCityMarket,
    refresh,
  } = useCityMarkets({
    searchTerm: searchTerm,
    county: selectedCounty === 'all' ? undefined : selectedCounty,
  });
  
  const onSubmit: SubmitHandler<MarketFormData> = async (data) => {
    try {
      await createCityMarket({
        ...data,
        commodities_traded: data.commodities_traded || [],
        operating_days: data.operating_days || [],
        facilities: data.facilities || [],
        is_active: true,
        is_verified: false,
        average_daily_traders: Number(data.average_daily_traders) || 0,
        average_daily_buyers: Number(data.average_daily_buyers) || 0,
      });
      
      toast({
        title: 'Success',
        description: 'Market added successfully!',
      });
      
      setShowAddMarket(false);
      reset();
      refresh();
    } catch (error) {
      console.error('Error creating market:', error);
      toast({
        title: 'Error',
        description: 'Failed to add market. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">City Markets</h1>
            <p className="text-muted-foreground mt-2">
              {loading ? 'Loading markets...' : `Found ${markets.length} markets`}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowAddMarket(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Market
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, city, or commodity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select 
              value={selectedCounty} 
              onValueChange={(value) => {
                setSelectedCounty(value);
                setFilters({
                  ...filters,
                  county: value === 'all' ? undefined : value,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by county" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {COUNTIES.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Markets Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading markets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market) => market && (
              <Card key={market.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-2">
                  <Link to={`/markets/${market.id}`} className="block hover:opacity-90">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {market.market_name}
                      </CardTitle>
                      <Badge variant={market.is_active ? "default" : "secondary"}>
                        {market.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </Link>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link to={`/markets/${market.id}`} className="block hover:opacity-90">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">
                        {market.city}, {market.county}
                        {market.coordinates && (
                          <span className="text-xs text-muted-foreground block">
                            {market.coordinates.lat?.toFixed(4)}, {market.coordinates.lng?.toFixed(4)}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{market.physical_address}</p>
                        {market.market_type && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {market.market_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.operating_hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="text-sm">
                        <span>{market.average_daily_traders || 0} daily traders</span>
                        {market.average_daily_buyers > 0 && (
                          <span className="text-muted-foreground"> • {market.average_daily_buyers} buyers</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex flex-wrap gap-1">
                        {market.commodities_traded?.slice(0, 3).map((commodity) => (
                          <Badge key={commodity} variant="outline" className="text-xs">
                            {commodity}
                          </Badge>
                        ))}
                        {market.commodities_traded?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{market.commodities_traded.length - 3} more
                          </Badge>
                        )}
                      </div>
                      {market.facilities && market.facilities.length > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
                          <span>Facilities:</span>
                          {market.facilities.slice(0, 3).map((facility, i) => (
                            <span key={i} className="inline-flex items-center">
                              {facility.replace(/_/g, ' ')}
                              {i < market.facilities!.length - 1 && i < 2 && ','}
                            </span>
                          ))}
                          {market.facilities.length > 3 && '...'}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link to={`/markets/${market.id}`} className="flex-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full"
                        >
                          <Package className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle view on map
                        }}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Market Dialog */}
        <Dialog open={showAddMarket} onOpenChange={setShowAddMarket}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Market</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="market_name">Market Name *</Label>
                  <Input
                    id="market_name"
                    placeholder="Enter market name"
                    {...register('market_name', { required: 'Market name is required' })}
                  />
                  {errors.market_name && (
                    <p className="text-sm text-red-500 mt-1">{errors.market_name.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      {...register('city', { required: 'City is required' })}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Select
                      onValueChange={(value) => {
                        register('county', { required: 'County is required' });
                        return value;
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.county && (
                      <p className="text-sm text-red-500 mt-1">{errors.county.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="market_type">Market Type *</Label>
                  <Select
                    onValueChange={(value) => {
                      register('market_type', { required: 'Market type is required' });
                      return value;
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select market type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARKET_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.market_type && (
                    <p className="text-sm text-red-500 mt-1">{errors.market_type.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="physical_address">Physical Address *</Label>
                  <Input
                    id="physical_address"
                    placeholder="Enter physical address"
                    {...register('physical_address', { required: 'Address is required' })}
                  />
                  {errors.physical_address && (
                    <p className="text-sm text-red-500 mt-1">{errors.physical_address.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="coordinates">Coordinates (lat,lng) *</Label>
                  <Input
                    id="coordinates"
                    placeholder="e.g., -1.2921,36.8219"
                    {...register('coordinates', {
                      required: 'Coordinates are required',
                      pattern: {
                        value: /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/,
                        message: 'Please enter valid coordinates in format: lat,lng',
                      },
                    })}
                  />
                  {errors.coordinates && (
                    <p className="text-sm text-red-500 mt-1">{errors.coordinates.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="operating_hours">Operating Hours *</Label>
                  <Input
                    id="operating_hours"
                    placeholder="e.g., 8:00 AM - 6:00 PM"
                    {...register('operating_hours', { required: 'Operating hours are required' })}
                  />
                  {errors.operating_hours && (
                    <p className="text-sm text-red-500 mt-1">{errors.operating_hours.message}</p>
                  )}
                </div>
                
                <div>
                  <Label>Facilities</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {FACILITIES.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`facility-${facility}`}
                          value={facility}
                          {...register('facilities')}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`facility-${facility}`} className="text-sm">
                          {facility.replace(/_/g, ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="commodities_traded">Commodities (comma-separated)</Label>
                  <Input
                    id="commodities_traded"
                    placeholder="e.g., maize, beans, potatoes"
                    {...register('commodities_traded')}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="average_daily_traders">Daily Traders</Label>
                    <Input
                      id="average_daily_traders"
                      type="number"
                      min="0"
                      {...register('average_daily_traders')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="average_daily_buyers">Daily Buyers</Label>
                    <Input
                      id="average_daily_buyers"
                      type="number"
                      min="0"
                      {...register('average_daily_buyers')}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setShowAddMarket(false);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Market
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default CityMarkets;