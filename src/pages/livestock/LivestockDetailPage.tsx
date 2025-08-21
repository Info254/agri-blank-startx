import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, Heart, Share2 } from 'lucide-react';
import { fetchLivestockListing } from '@/services/livestockMarketService';
import { LivestockListing } from '@/types/livestock';

export default function LivestockDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<LivestockListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (id) {
      loadListing();
    }
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const data = await fetchLivestockListing(id!);
      setListing(data);
      
      // Check if current user is the owner
      // const user = supabase.auth.user();
      // setIsOwner(user?.id === data.seller_id);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!listing?.seller) return;
    
    // Implement contact logic (e.g., open chat, email, or phone call)
    if (listing.seller.phone) {
      window.location.href = `tel:${listing.seller.phone}`;
    } else if (listing.seller.email) {
      window.location.href = `mailto:${listing.seller.email}`;
    }
  };

  const handleEdit = () => {
    if (listing) {
      navigate(`/livestock/edit/${listing.id}`);
    }
  };

  const handleDelete = async () => {
    if (!listing) return;
    
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        // await deleteLivestockListing(listing.id);
        navigate('/livestock');
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
        <Button onClick={() => navigate('/livestock')}>Back to Marketplace</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-6">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
              {listing.images?.[currentImageIndex] ? (
                <img 
                  src={listing.images[currentImageIndex]} 
                  alt={`${listing.breed} ${listing.type}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No Image Available</span>
                </div>
              )}
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {listing.images?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full ${currentImageIndex === index ? 'bg-primary' : 'bg-gray-300'}`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {listing.images && listing.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {listing.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${currentImageIndex === index ? 'ring-2 ring-primary' : ''}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold">
                      {listing.breed} {listing.type}
                    </h1>
                    {listing.is_halal && (
                      <Badge variant="default">Halal Certified</Badge>
                    )}
                  </div>
                  <CardDescription className="text-lg">
                    {listing.market?.name}, {listing.market?.county}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl font-bold">KSh {listing.price.toLocaleString()}</p>
                  {listing.price_per_kg && (
                    <p className="text-sm text-gray-500">
                      KSh {listing.price_per_kg.toLocaleString()} / kg
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity Available</p>
                  <p className="text-xl font-semibold">{listing.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-lg">{listing.age} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-lg">{listing.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-lg capitalize">{listing.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Health Status</p>
                  <p className="text-lg capitalize">{listing.health_status}</p>
                </div>
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="seller">Seller Info</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <p className="whitespace-pre-line">
                    {listing.description || 'No description provided.'}
                  </p>
                </TabsContent>
                <TabsContent value="specifications" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Special Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {listing.special_features?.length ? (
                          listing.special_features.map((feature, i) => (
                            <Badge key={i} variant="secondary">
                              {feature}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No special features listed</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Vaccination Records</h4>
                      {listing.vaccination_records?.length ? (
                        <div className="space-y-2">
                          {listing.vaccination_records.map((record, i) => (
                            <div key={i} className="p-3 border rounded-md">
                              <p className="font-medium">{record.vaccine_name}</p>
                              <p className="text-sm text-gray-500">
                                Administered: {new Date(record.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Next Due: {record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No vaccination records available</p>
                      )}
                    </div>

                    {listing.breeding_history && (
                      <div>
                        <h4 className="font-medium mb-2">Breeding History</h4>
                        <p className="whitespace-pre-line">{listing.breeding_history}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="seller" className="pt-4">
                  {listing.seller ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-medium">
                            {listing.seller.full_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{listing.seller.full_name || 'Anonymous Seller'}</h4>
                          <p className="text-sm text-gray-500">
                            Member since {new Date(listing.seller.created_at).getFullYear()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {listing.seller.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <a href={`tel:${listing.seller.phone}`} className="hover:underline">
                              {listing.seller.phone}
                            </a>
                          </div>
                        )}
                        {listing.seller.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            <a href={`mailto:${listing.seller.email}`} className="hover:underline">
                              {listing.seller.email}
                            </a>
                          </div>
                        )}
                        {listing.market?.location && (
                          <div className="flex items-start text-sm">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                            <span>{listing.market.name}, {listing.market.county}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>Seller information not available</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Make an Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Price per unit</p>
                  <p className="text-2xl font-bold">KSh {listing.price.toLocaleString()}</p>
                  {listing.price_per_kg && (
                    <p className="text-sm text-gray-500">
                      KSh {listing.price_per_kg.toLocaleString()} / kg
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>{listing.quantity} available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" disabled={listing.quantity <= 1}>
                      -
                    </Button>
                    <span className="px-4">1</span>
                    <Button variant="outline" size="icon">
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContactSeller}
                  >
                    Contact Seller
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>or</p>
                  <p>Make an offer to the seller</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Your offer price" 
                      type="number"
                      className="flex-1"
                    />
                    <Button variant="outline">Offer</Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter your best price. Seller will respond within 24 hours.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Market Location</span>
                    <span className="font-medium">{listing.market?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">County</span>
                    <span className="font-medium">{listing.market?.county || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Listed</span>
                    <span className="font-medium">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isOwner && (
            <div className="mt-4 space-x-2 flex">
              <Button variant="outline" onClick={handleEdit} className="flex-1">
                Edit Listing
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="flex-1"
              >
                Delete Listing
              </Button>
            </div>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Market Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {listing.market?.auction_days?.length > 0 && (
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Auction Days</p>
                    <p className="text-sm text-gray-600">
                      Every {listing.market.auction_days.join(', ')}
                    </p>
                  </div>
                </div>
              )}
              
              {listing.market?.market_hours && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Market Hours</p>
                    <p className="text-sm text-gray-600">
                      {listing.market.market_hours.weekdays || 'N/A'}
                    </p>
                    {listing.market.market_hours.weekends && (
                      <p className="text-sm text-gray-600">
                        Weekends: {listing.market.market_hours.weekends}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
                {/* Map would go here */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Map View
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
