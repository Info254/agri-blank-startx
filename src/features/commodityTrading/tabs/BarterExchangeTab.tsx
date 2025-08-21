
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus } from 'lucide-react';
import BarterListing from '../components/BarterListing';
import { fetchBarterListings, BarterListing as BarterListingType } from '../services/barterService';
import { useToast } from '@/hooks/use-toast';

interface BarterExchangeTabProps {
  searchTerm?: string;
  selectedCategory?: string;
  selectedLocation?: string;
  isLoading?: boolean;
}

const BarterExchangeTab: React.FC<BarterExchangeTabProps> = ({
  searchTerm: initialSearchTerm = '',
  selectedCategory: initialCategory = '',
  selectedLocation: initialLocation = '',
  isLoading: parentLoading = false
}) => {
  const [listings, setListings] = useState<BarterListingType[]>([]);
  const [filteredListings, setFilteredListings] = useState<BarterListingType[]>([]);
  const [selectedListing, setSelectedListing] = useState<BarterListingType | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm, filterCategory]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await fetchBarterListings();
      setListings(data);
    } catch (error) {
      console.error('Error loading barter listings:', error);
      toast({
        title: "Error",
        description: "Failed to load barter listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all' && filterCategory) {
      filtered = filtered.filter(listing => 
        listing.commodity.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  };

  const categories = ['all', 'cereals', 'vegetables', 'fruits', 'livestock', 'seeds'];

  if (loading || parentLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading barter listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Browse Barter Listings</span>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by commodity, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={filterCategory === category ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setFilterCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to create a barter listing!'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredListings.map((listing) => (
            <BarterListing
              key={listing.id}
              listing={listing}
              isSelected={selectedListing?.id === listing.id}
              onSelect={setSelectedListing}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BarterExchangeTab;
