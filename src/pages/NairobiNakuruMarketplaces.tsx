// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Clock, Users, Car, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Marketplace {
  id: string;
  name: string;
  location: string;
  route: string;
  kmFromNairobi: number;
  kmFromNakuru: number;
  coordinates: { lat: number; lng: number };
  operatingDays: string[];
  operatingHours: string;
  specialties: string[];
  facilities: string[];
  averageVisitors: number;
  transportRoutes: string[];
  contact: string;
  priceRange: 'Budget' | 'Mid-Range' | 'Premium';
  coordination: {
    transportCoordinator: string;
    groupBuyingAvailable: boolean;
    sharedTransportSchedule: string[];
  };
}

const NairobiNakuruMarketplaces: React.FC = () => {
  const { toast } = useToast();
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [filteredMarketplaces, setFilteredMarketplaces] = useState<Marketplace[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    // Initialize marketplace data for A1-A9 routes between Nairobi and Nakuru
    const marketData: Marketplace[] = [
      {
        id: '1',
        name: 'Kijabe Soko Mjinga',
        location: 'Kijabe Town Center',
        route: 'A104',
        kmFromNairobi: 52,
        kmFromNakuru: 108,
        coordinates: { lat: -0.9167, lng: 36.5833 },
        operatingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        operatingHours: '6:00 AM - 6:00 PM',
        specialties: ['Fresh Vegetables', 'Dairy Products', 'Local Fruits', 'Cereals'],
        facilities: ['Cold Storage', 'Parking', 'Loading Bay', 'Banking Services'],
        averageVisitors: 500,
        transportRoutes: ['Nairobi-Kijabe', 'Nakuru-Kijabe', 'Local Matatu'],
        contact: '+254 712 345 678',
        priceRange: 'Mid-Range',
        coordination: {
          transportCoordinator: 'Kijabe Farmers Cooperative',
          groupBuyingAvailable: true,
          sharedTransportSchedule: ['7:00 AM', '2:00 PM', '5:00 PM']
        }
      },
      {
        id: '2',
        name: 'Uplands Market',
        location: 'Uplands Trading Center',
        route: 'A104',
        kmFromNairobi: 45,
        kmFromNakuru: 115,
        coordinates: { lat: -0.8833, lng: 36.5500 },
        operatingDays: ['Tuesday', 'Thursday', 'Saturday'],
        operatingHours: '5:30 AM - 7:00 PM',
        specialties: ['Coffee', 'Tea', 'Vegetables', 'Poultry', 'Honey'],
        facilities: ['Weighing Scales', 'Quality Testing', 'Storage', 'Restaurant'],
        averageVisitors: 350,
        transportRoutes: ['Nairobi-Uplands', 'Nakuru-Uplands', 'Kikuyu-Uplands'],
        contact: '+254 720 456 789',
        priceRange: 'Premium',
        coordination: {
          transportCoordinator: 'Uplands Agricultural Society',
          groupBuyingAvailable: true,
          sharedTransportSchedule: ['6:30 AM', '1:00 PM', '4:30 PM']
        }
      },
      {
        id: '3',
        name: 'Makutano Junction Market',
        location: 'Makutano Junction',
        route: 'A104/A1',
        kmFromNairobi: 38,
        kmFromNakuru: 122,
        coordinates: { lat: -0.8500, lng: 36.5167 },
        operatingDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
        operatingHours: '6:00 AM - 8:00 PM',
        specialties: ['Livestock', 'Cereals', 'Construction Materials', 'Secondhand Goods'],
        facilities: ['Livestock Pens', 'Veterinary Services', 'Fuel Station', 'Lodging'],
        averageVisitors: 800,
        transportRoutes: ['Nairobi-Makutano', 'Nakuru-Makutano', 'Nyandarua-Makutano'],
        contact: '+254 733 567 890',
        priceRange: 'Budget',
        coordination: {
          transportCoordinator: 'Makutano Traders Association',
          groupBuyingAvailable: true,
          sharedTransportSchedule: ['7:00 AM', '11:00 AM', '3:00 PM', '6:00 PM']
        }
      },
      {
        id: '4',
        name: 'Limuru Central Market',
        location: 'Limuru Town',
        route: 'A104',
        kmFromNairobi: 35,
        kmFromNakuru: 125,
        coordinates: { lat: -1.1167, lng: 36.6500 },
        operatingDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
        operatingHours: '5:00 AM - 6:30 PM',
        specialties: ['Tea', 'Coffee', 'Irish Potatoes', 'Cabbages', 'Carrots'],
        facilities: ['Processing Plant', 'Export Hub', 'Banking', 'Insurance Services'],
        averageVisitors: 600,
        transportRoutes: ['Nairobi-Limuru', 'Nakuru-Limuru', 'Kiambu-Limuru'],
        contact: '+254 741 678 901',
        priceRange: 'Premium',
        coordination: {
          transportCoordinator: 'Limuru Tea & Coffee Growers',
          groupBuyingAvailable: true,
          sharedTransportSchedule: ['6:00 AM', '12:00 PM', '4:00 PM']
        }
      },
      {
        id: '5',
        name: 'Naivasha Fresh Produce Market',
        location: 'Naivasha Town',
        route: 'A104',
        kmFromNairobi: 90,
        kmFromNakuru: 70,
        coordinates: { lat: -0.7167, lng: 36.4333 },
        operatingDays: ['Daily'],
        operatingHours: '4:00 AM - 9:00 PM',
        specialties: ['Flowers', 'Vegetables', 'Fruits', 'Fish', 'Geothermal Products'],
        facilities: ['Cold Chain', 'Export Processing', 'Hotels', 'Conference Facilities'],
        averageVisitors: 1200,
        transportRoutes: ['Nairobi-Naivasha', 'Nakuru-Naivasha', 'Eldoret-Naivasha'],
        contact: '+254 750 789 012',
        priceRange: 'Mid-Range',
        coordination: {
          transportCoordinator: 'Naivasha Horticultural Cooperative',
          groupBuyingAvailable: true,
          sharedTransportSchedule: ['5:00 AM', '9:00 AM', '1:00 PM', '5:00 PM', '7:00 PM']
        }
      },
      {
        id: '6',
        name: 'Gilgil Agricultural Hub',
        location: 'Gilgil Township',
        route: 'A104',
        kmFromNairobi: 110,
        kmFromNakuru: 50,
        coordinates: { lat: -0.5000, lng: 36.3167 },
        operatingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        operatingHours: '6:00 AM - 6:00 PM',
        specialties: ['Wheat', 'Barley', 'Livestock Feed', 'Dairy Equipment'],
        facilities: ['Grain Silos', 'Milling Services', 'Equipment Repair', 'Training Center'],
        averageVisitors: 400,
        transportRoutes: ['Nakuru-Gilgil', 'Nairobi-Gilgil', 'Nyahururu-Gilgil'],
        contact: '+254 762 890 123',
        priceRange: 'Mid-Range',
        coordination: {
          transportCoordinator: 'Gilgil Grain Farmers Union',
          groupBuyingAvailable: true,
          sharedTransportSchedule: ['7:30 AM', '2:00 PM', '5:30 PM']
        }
      }
    ];

    setMarketplaces(marketData);
    setFilteredMarketplaces(marketData);
  }, []);

  useEffect(() => {
    let filtered = marketplaces;

    if (searchTerm) {
      filtered = filtered.filter(market => 
        market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedRoute !== 'all') {
      filtered = filtered.filter(market => market.route === selectedRoute);
    }

    if (selectedDay) {
      filtered = filtered.filter(market => 
        market.operatingDays.includes(selectedDay) || 
        market.operatingDays.includes('Daily')
      );
    }

    setFilteredMarketplaces(filtered);
  }, [searchTerm, selectedRoute, selectedDay, marketplaces]);

  const handleCoordinateTransport = (marketplace: Marketplace) => {
    toast({
      title: "Transport Coordination",
      description: `Connecting you with ${marketplace.coordination.transportCoordinator} for shared transport to ${marketplace.name}`,
    });
  };

  const handleGroupBuying = (marketplace: Marketplace) => {
    toast({
      title: "Group Buying Opportunity",
      description: `Joining group buying initiative at ${marketplace.name}. You'll save on transport and get better prices!`,
    });
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case 'Budget': return 'bg-green-100 text-green-800';
      case 'Mid-Range': return 'bg-yellow-100 text-yellow-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <MainNav />
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nairobi-Nakuru Corridor Marketplaces
          </h1>
          <p className="text-gray-600">
            Discover marketplaces along the A1-A9 routes with coordinated transport and group buying opportunities
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search marketplaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Routes</option>
                <option value="A104">A104 Route</option>
                <option value="A104/A1">A104/A1 Junction</option>
              </select>
            </div>
            <div>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Days</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {filteredMarketplaces.length} marketplaces found
            </div>
          </div>
        </div>

        {/* Transport Coordination Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Car className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <h3 className="font-semibold text-blue-900">Shared Transport Available</h3>
              <p className="text-blue-700 text-sm">
                Save money by coordinating transport with other farmers and buyers. 
                Reduce individual transport costs by up to 70%!
              </p>
            </div>
          </div>
        </div>

        {/* Marketplaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarketplaces.map((marketplace) => (
            <Card key={marketplace.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{marketplace.name}</CardTitle>
                  <Badge className={getPriceRangeColor(marketplace.priceRange)}>
                    {marketplace.priceRange}
                  </Badge>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {marketplace.location} • {marketplace.route}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">From Nairobi:</span>
                    <br />
                    {marketplace.kmFromNairobi} km
                  </div>
                  <div>
                    <span className="font-medium">From Nakuru:</span>
                    <br />
                    {marketplace.kmFromNakuru} km
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {marketplace.operatingHours}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Days:</strong> {marketplace.operatingDays.join(', ')}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Specialties:</div>
                  <div className="flex flex-wrap gap-1">
                    {marketplace.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {marketplace.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{marketplace.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Users className="h-4 w-4 mr-1" />
                    Avg. {marketplace.averageVisitors} visitors/day
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    {marketplace.contact}
                  </div>
                </div>

                {/* Coordination Features */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm font-medium mb-2">Transport Coordination</div>
                  <div className="text-xs text-gray-600 mb-2">
                    Coordinator: {marketplace.coordination.transportCoordinator}
                  </div>
                  <div className="text-xs text-gray-600 mb-3">
                    Next departures: {marketplace.coordination.sharedTransportSchedule.slice(0, 2).join(', ')}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleCoordinateTransport(marketplace)}
                      className="flex-1 text-xs"
                    >
                      <Car className="h-3 w-3 mr-1" />
                      Join Transport
                    </Button>
                    {marketplace.coordination.groupBuyingAvailable && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleGroupBuying(marketplace)}
                        className="flex-1 text-xs"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Group Buy
                      </Button>
                    )}
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <div className="text-sm font-medium mb-1">Facilities:</div>
                  <div className="text-xs text-gray-600">
                    {marketplace.facilities.slice(0, 2).join(' • ')}
                    {marketplace.facilities.length > 2 && ` • +${marketplace.facilities.length - 2} more`}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMarketplaces.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No marketplaces found matching your criteria</div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedRoute('all');
                setSelectedDay('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NairobiNakuruMarketplaces;