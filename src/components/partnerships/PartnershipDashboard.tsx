import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter, RefreshCw, Check, X, Clock, User, ArrowRight, BarChart3 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { 
  getMyPartner, 
  getPartnershipRequests, 
  getSupplyChainPartners,
  requestPartnership,
  getPartnerServices,
  getPartnerAnalytics,
  getValueChainInsights
} from '@/services/partnerService';
import { Partner, PartnerType } from '@/types/partner';

const PartnershipDashboard: React.FC = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<PartnerType | 'all'>('all');
  const [analytics, setAnalytics] = useState<any>(null);
  const [valueChainInsights, setValueChainInsights] = useState<any>(null);

  // Load partner data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load partner profile
        const { data: partnerData } = await getMyPartner();
        if (partnerData) {
          setPartner(partnerData);
          
          // Load partnership requests
          const { data: requestsData } = await getPartnershipRequests(partnerData.id);
          if (requestsData) setRequests(requestsData);
          
          // Load analytics if on overview tab
          if (activeTab === 'overview') {
            const { data: analyticsData } = await getPartnerAnalytics(partnerData.id);
            if (analyticsData) setAnalytics(analyticsData);
            
            const { data: insightsData } = await getValueChainInsights(partnerData.id);
            if (insightsData) setValueChainInsights(insightsData);
          }
        }
        
        // Load potential partners
        const { data: partnersData } = await getSupplyChainPartners({
          partnerTypes: [],
          services: [],
          location: ''
        });
        if (partnersData) setPartners(partnersData);
        
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load partnership data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [activeTab]);

  const handleRequestPartnership = async (targetPartnerId: string) => {
    try {
      await requestPartnership({
        partner_id: targetPartnerId,
        requester_id: partner?.id || '',
        notes: 'Requesting partnership to collaborate on supply chain opportunities'
      });
      
      toast({
        title: 'Partnership Requested',
        description: 'Your partnership request has been sent successfully',
      });
      
    } catch (error) {
      console.error('Error requesting partnership:', error);
      toast({
        title: 'Error',
        description: 'Failed to send partnership request',
        variant: 'destructive',
      });
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Partnerships</CardTitle>
            <CardTitle className="text-3xl">{analytics?.activePartnerships || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            <CardTitle className="text-3xl">{analytics?.pendingRequests || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Supply Chain Impact</CardTitle>
            <CardTitle className="text-3xl">
              {valueChainInsights?.impactScore ? `${Math.round(valueChainInsights.impactScore * 100)}%` : 'N/A'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Value Chain Insights</CardTitle>
          <CardDescription>Key metrics and insights about your supply chain impact</CardDescription>
        </CardHeader>
        <CardContent>
          {valueChainInsights ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Top Commodities</h4>
                <div className="space-y-2">
                  {valueChainInsights.topCommodities?.map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.volume} kg</span>
                    </div>
                  )) || <p>No data available</p>}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>On-time Delivery</span>
                    <span className="font-medium">
                      {valueChainInsights.onTimeDelivery ? `${Math.round(valueChainInsights.onTimeDelivery * 100)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Partner Satisfaction</span>
                    <span className="font-medium">
                      {valueChainInsights.satisfactionScore ? `${Math.round(valueChainInsights.satisfactionScore * 100)}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading insights...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPartnersTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={(value) => setFilterType(value as PartnerType | 'all')}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="logistics">Logistics</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="input_supplier">Input Supplier</SelectItem>
            <SelectItem value="processor">Processor</SelectItem>
            <SelectItem value="buyer">Buyer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners
              .filter(p => 
                (filterType === 'all' || p.type === filterType) &&
                (searchTerm === '' || 
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.services?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase())))
              )
              .map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{partner.type.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {partner.services?.slice(0, 2).map((service: string) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {partner.services?.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{partner.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {partner.partnership_status || 'Not Connected'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {partner.partnership_status === 'connected' ? (
                      <Button size="sm" variant="outline" onClick={() => navigate(`/partners/${partner.id}`)}>
                        View
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleRequestPartnership(partner.id)}
                        disabled={partner.partnership_status === 'pending'}
                      >
                        {partner.partnership_status === 'pending' ? 'Requested' : 'Connect'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const renderRequestsTab = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Requested On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.partners?.name || 'Unknown'}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {request.partners?.type?.replace('_', ' ') || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(request.requested_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={request.status === 'approved' ? 'default' : 'outline'}
                    className={request.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.status === 'pending' && request.partner_id === partner?.id && (
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline" className="h-8">
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" className="h-8">
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                  {request.status !== 'pending' && (
                    <Button size="sm" variant="ghost" className="h-8">
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <User className="h-8 w-8" />
                  <p>No partnership requests found</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect with Partners
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );

  if (loading && !partner) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Partner Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">You need to set up your partner profile first</p>
        <Button onClick={() => navigate('/partner/onboarding')}>
          Set Up Partner Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partnership Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your supply chain partnerships and collaborations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setActiveTab('partners')}>
            <Plus className="h-4 w-4 mr-2" />
            Find Partners
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="partners">
            Partners
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center">
                {requests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requests.length > 0 && (
              <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center">
                {requests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverviewTab()}
        </TabsContent>
        
        <TabsContent value="partners">
          {renderPartnersTab()}
        </TabsContent>
        
        <TabsContent value="requests">
          {renderRequestsTab()}
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Analytics</CardTitle>
              <CardDescription>Detailed analytics about your partnerships and supply chain performance</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium">Analytics Dashboard Coming Soon</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We're working on detailed analytics to help you track your supply chain performance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnershipDashboard;
