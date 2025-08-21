import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Gavel, Calendar, MapPin, Users, AlertCircle, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { format, isAfter, isBefore, addDays, differenceInHours, differenceInMinutes } from 'date-fns';

type AuctionStatus = 'live' | 'upcoming' | 'completed';

type Auction = {
  id: string;
  title: string;
  description: string;
  status: AuctionStatus;
  startTime: Date;
  endTime: Date;
  currentBid: number;
  startingBid: number;
  bidIncrement: number;
  bidCount: number;
  image: string;
  livestock: {
    id: string;
    type: string;
    breed: string;
    age: number;
    weight: number;
    gender: string;
  };
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  location: string;
  participants: number;
  timeLeft: string;
  timeLeftPercentage: number;
};

export default function LivestockAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AuctionStatus>('live');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadAuctions = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockAuctions: Auction[] = [
          {
            id: 'auction-1',
            title: 'Premium Boran Heifers',
            description: 'High-quality Boran heifers, 18-24 months old, vaccinated and dewormed. Perfect for breeding.',
            status: 'live',
            startTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
            currentBid: 45000,
            startingBid: 40000,
            bidIncrement: 500,
            bidCount: 12,
            image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            livestock: {
              id: 'ls-1',
              type: 'Cattle',
              breed: 'Boran',
              age: 20,
              weight: 320,
              gender: 'Female'
            },
            seller: {
              id: 'seller-1',
              name: 'Green Pastures Farm',
              rating: 4.8
            },
            location: 'Nakuru, Kenya',
            participants: 24,
            timeLeft: '1h 59m',
            timeLeftPercentage: 85
          },
          {
            id: 'auction-2',
            title: 'Pure Sahiwal Bull',
            description: 'Premium quality Sahiwal bull, 3 years old, excellent genetics for milk production.',
            status: 'live',
            startTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
            currentBid: 68000,
            startingBid: 60000,
            bidIncrement: 1000,
            bidCount: 8,
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80',
            livestock: {
              id: 'ls-2',
              type: 'Cattle',
              breed: 'Sahiwal',
              age: 36,
              weight: 450,
              gender: 'Male'
            },
            seller: {
              id: 'seller-2',
              name: 'Sahiwal Genetics Ltd',
              rating: 4.9
            },
            location: 'Eldoret, Kenya',
            participants: 18,
            timeLeft: '2h 59m',
            timeLeftPercentage: 75
          },
          {
            id: 'auction-3',
            title: 'Galla Goats (Lot of 5)',
            description: 'Healthy Galla goats, 12-15 months old, perfect for meat production.',
            status: 'upcoming',
            startTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
            currentBid: 0,
            startingBid: 35000,
            bidIncrement: 500,
            bidCount: 0,
            image: 'https://images.unsplash.com/photo-1550338861-45164a0fbf92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            livestock: {
              id: 'ls-3',
              type: 'Goat',
              breed: 'Galla',
              age: 14,
              weight: 35,
              gender: 'Mixed'
            },
            seller: {
              id: 'seller-3',
              name: 'Northern Rangelands Goats',
              rating: 4.6
            },
            location: 'Isiolo, Kenya',
            participants: 0,
            timeLeft: 'Starts in 2h',
            timeLeftPercentage: 0
          },
          {
            id: 'auction-4',
            title: 'Kienyeji Chicken (100 Birds)',
            description: 'Free-range Kienyeji chickens, 6-8 months old, ready for egg production.',
            status: 'upcoming',
            startTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 26), // 26 hours from now
            currentBid: 0,
            startingBid: 120000,
            bidIncrement: 2000,
            bidCount: 0,
            image: 'https://images.unsplash.com/photo-1548550023-2b5f1b0f7a1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            livestock: {
              id: 'ls-4',
              type: 'Poultry',
              breed: 'Kienyeji',
              age: 7,
              weight: 1.8,
              gender: 'Mixed'
            },
            seller: {
              id: 'seller-4',
              name: 'Happy Hens Poultry',
              rating: 4.7
            },
            location: 'Thika, Kenya',
            participants: 0,
            timeLeft: 'Starts in 1d',
            timeLeftPercentage: 0
          },
          {
            id: 'auction-5',
            title: 'Dorper Rams (2)',
            description: 'Pure Dorper rams, 2 years old, excellent genetics for meat production.',
            status: 'completed',
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
            currentBid: 85000,
            startingBid: 70000,
            bidIncrement: 1000,
            bidCount: 15,
            image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
            livestock: {
              id: 'ls-5',
              type: 'Sheep',
              breed: 'Dorper',
              age: 24,
              weight: 85,
              gender: 'Male'
            },
            seller: {
              id: 'seller-5',
              name: 'Dorper Breeders Kenya',
              rating: 4.9
            },
            location: 'Nakuru, Kenya',
            participants: 22,
            timeLeft: 'Ended',
            timeLeftPercentage: 100
          },
        ];
        
        setAuctions(mockAuctions);
        setFilteredAuctions(mockAuctions.filter(a => a.status === 'live'));
      } catch (error) {
        console.error('Error loading auctions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load auctions. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, [toast]);

  useEffect(() => {
    let filtered = [...auctions];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        auction =>
          auction.title.toLowerCase().includes(term) ||
          auction.livestock.breed.toLowerCase().includes(term) ||
          auction.livestock.type.toLowerCase().includes(term) ||
          auction.seller.name.toLowerCase().includes(term)
      );
    }
    
    // Filter by active tab
    if (activeTab === 'live') {
      filtered = filtered.filter(a => a.status === 'live');
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(a => a.status === 'upcoming');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(a => a.status === 'completed');
    }
    
    setFilteredAuctions(filtered);
  }, [searchTerm, activeTab, auctions]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as AuctionStatus);
  };

  const handlePlaceBid = (auctionId: string) => {
    // In a real app, this would open a bid modal or navigate to the auction page
    navigate(`/livestock/auctions/${auctionId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAuctionBadge = (status: AuctionStatus) => {
    const statusMap = {
      live: { label: 'Live Now', className: 'bg-red-100 text-red-800' },
      upcoming: { label: 'Upcoming', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', className: 'bg-gray-100 text-gray-800' }
    };
    
    const { label, className } = statusMap[status];
    return <Badge className={`${className} text-xs`}>{label}</Badge>;
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Livestock Auctions</h1>
            <p className="text-gray-600">Bid on premium livestock from trusted sellers across Kenya</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Gavel className="mr-2 h-4 w-4" /> Create Auction
          </Button>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search auctions by livestock type, breed, or seller..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="live" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Live
              <Badge variant="secondary" className="ml-1">
                {auctions.filter(a => a.status === 'live').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Upcoming
              <Badge variant="secondary" className="ml-1">
                {auctions.filter(a => a.status === 'upcoming').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" /> Completed
              <Badge variant="secondary" className="ml-1">
                {auctions.filter(a => a.status === 'completed').length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredAuctions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No {activeTab} auctions found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm
                    ? 'Try adjusting your search or filter criteria.'
                    : `There are currently no ${activeTab} auctions. Please check back later.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuctions.map((auction) => (
                  <Card key={auction.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {getAuctionBadge(auction.status)}
                      </div>
                      {auction.status === 'live' && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Time Left: {auction.timeLeft}</span>
                            <span>{auction.participants} <Users className="inline h-3 w-3" /></span>
                          </div>
                          <Progress value={auction.timeLeftPercentage} className="h-1.5" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{auction.title}</CardTitle>
                          <CardDescription className="line-clamp-1">
                            {auction.livestock.breed} {auction.livestock.type} • {auction.livestock.age} months • {auction.livestock.weight}kg
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Current Bid:</span>
                          <span className="font-medium">
                            {auction.currentBid > 0 ? formatCurrency(auction.currentBid) : 'No bids yet'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Starting Bid:</span>
                          <span>{formatCurrency(auction.startingBid)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Bid Increment:</span>
                          <span>{formatCurrency(auction.bidIncrement)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Bids:</span>
                          <span>{auction.bidCount}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="truncate">{auction.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/sellers/${auction.seller.id}`)}
                      >
                        {auction.seller.name}
                      </Button>
                      <Button 
                        size="sm" 
                        disabled={auction.status !== 'live'}
                        onClick={() => handlePlaceBid(auction.id)}
                      >
                        {auction.status === 'live' ? 'Place Bid' : auction.status === 'upcoming' ? 'Notify Me' : 'View Details'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Want to sell your livestock through auction?</h3>
          <p className="text-blue-700 mb-4">Reach more buyers and get the best prices with our auction platform.</p>
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            Learn How It Works
          </Button>
        </div>
      </div>
    </div>
  );
}
