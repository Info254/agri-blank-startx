
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Star, Filter, Truck, Warehouse, Users, Package, Building, DollarSign, Factory } from 'lucide-react';
import { getLogisticsStats, getLogisticsProviders, LogisticsStats, LogisticsProvider } from '@/services/logisticsService';
import LogisticsStatsCard from '@/components/LogisticsStatsCard';

const Logistics: React.FC = () => {
  const [stats, setStats] = useState<LogisticsStats>({
    activeTransporters: 0,
    storageFacilities: 0,
    countiesCovered: 0,
    monthlyDeliveries: 0,
    aggregators: 0,
    processors: 0,
    microCreditors: 0,
    p2pLenders: 0
  });
  const [providers, setProviders] = useState<LogisticsProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching logistics data...');
        
        const [statsData, providersData] = await Promise.all([
          getLogisticsStats(),
          getLogisticsProviders()
        ]);

        console.log('Stats data:', statsData);
        console.log('Providers data:', providersData);

        setStats(statsData);
        setProviders(providersData);
      } catch (error) {
        console.error('Error fetching logistics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Kiambu', 'Machakos', 'Meru', 'Embu', 'Nyeri', 'Muranga'
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = !selectedCounty || selectedCounty === 'all' || provider.county === selectedCounty;
    const matchesService = !selectedServiceType || selectedServiceType === 'all' || provider.type === selectedServiceType;
    return matchesSearch && matchesCounty && matchesService;
  });

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'transport': return <Truck className="h-5 w-5" />;
      case 'storage': return <Warehouse className="h-5 w-5" />;
      case 'aggregator': return <Package className="h-5 w-5" />;
      case 'processor': return <Factory className="h-5 w-5" />;
      case 'microcredit': return <Building className="h-5 w-5" />;
      case 'p2p_lending': return <DollarSign className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const getProviderTypeLabel = (type: string) => {
    switch (type) {
      case 'transport': return 'Transport';
      case 'storage': return 'Storage';
      case 'aggregator': return 'Aggregator';
      case 'processor': return 'Processor';
      case 'microcredit': return 'Micro Credit';
      case 'p2p_lending': return 'P2P Lending';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg">Loading logistics data from database...</div>
            <div className="text-sm text-muted-foreground mt-2">Fetching real providers and facilities</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Smart Logistics Network</h1>
          <p className="text-lg text-muted-foreground">
            Connect with verified transport providers, storage facilities, aggregators, processors, and financial services across Kenya
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <LogisticsStatsCard
            label="Transporters"
            value={stats.activeTransporters}
            icon={<Truck className="h-4 w-4 text-primary" />}
          />
          <LogisticsStatsCard
            label="Storage"
            value={stats.storageFacilities}
            icon={<Warehouse className="h-4 w-4 text-primary" />}
          />
          <LogisticsStatsCard
            label="Aggregators"
            value={stats.aggregators}
            icon={<Package className="h-4 w-4 text-primary" />}
          />
          <LogisticsStatsCard
            label="Processors"
            value={stats.processors}
            icon={<Factory className="h-4 w-4 text-primary" />}
          />
          <LogisticsStatsCard
            label="Micro Credit"
            value={stats.microCreditors}
            icon={<Building className="h-4 w-4 text-primary" />}
          />
          <LogisticsStatsCard
            label="P2P Lending"
            value={stats.p2pLenders}
            icon={<DollarSign className="h-4 w-4 text-primary" />}
          />
          <LogisticsStatsCard
            label="Counties"
            value={stats.countiesCovered}
            icon={<Star className="h-5 w-5 text-primary" />}
          />
          <LogisticsStatsCard
            label="Monthly"
            value={stats.monthlyDeliveries}
            icon={<Users className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select County" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  {counties.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="aggregator">Aggregators</SelectItem>
                  <SelectItem value="processor">Processors</SelectItem>
                  <SelectItem value="microcredit">Micro Credit</SelectItem>
                  <SelectItem value="p2p_lending">P2P Lending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedCounty('all');
                setSelectedServiceType('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Providers List */}
        <div className="grid gap-6">
          {filteredProviders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Providers Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCounty || selectedServiceType 
                    ? 'Try adjusting your filters to see more results.'
                    : 'Providers will appear here once they register on the platform.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getProviderIcon(provider.type)}
                        {provider.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {provider.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm">{provider.rating}</span>
                      </div>
                      <Badge variant="secondary">{getProviderTypeLabel(provider.type)}</Badge>
                      {provider.is_verified && (
                        <Badge variant="default">Verified</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{provider.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.services.slice(0, 3).map(service => (
                      <Badge key={service} variant="outline">{service}</Badge>
                    ))}
                    {provider.services.length > 3 && (
                      <Badge variant="outline">+{provider.services.length - 3} more</Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{provider.contact_phone}</span>
                    </div>
                    <Button size="sm">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Logistics;
