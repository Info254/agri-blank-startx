import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, User, ArrowLeft, Phone, Mail, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/lib/UserContext';

type ContractFarmingOpportunity = {
  id: string;
  title: string;
  description: string;
  crop: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  location: string;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  opportunity_type: 'buy' | 'sell';
  requirements?: string[];
  benefits?: string[];
  contact_email?: string;
  contact_phone?: string;
  delivery_terms?: string;
  payment_terms?: string;
  quality_standards?: string;
  created_by_name?: string;
};

const ContractFarmingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<ContractFarmingOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('export_opportunities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Fetch user profile for the creator
      if (data.created_by) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.created_by)
          .single();
          
        if (userData) {
          data.created_by_name = userData.full_name;
        }
      }
      
      setOpportunity(data);
    } catch (error) {
      console.error('Error fetching contract farming opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contract farming opportunity',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!user) {
      navigate('/auth?redirectTo=' + encodeURIComponent(`/contract-farming/${id}`));
      return;
    }

    try {
      // In a real app, you would create a new record in a 'contract_interests' table
      // and notify the opportunity creator
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: opportunity?.created_by,
          title: 'New Interest in Your Contract',
          message: `${user.user_metadata?.full_name || 'A user'} is interested in your contract: ${opportunity?.title}`,
          type: 'contract_interest',
          reference_id: id,
        }]);

      if (error) throw error;

      setIsInterested(true);
      
      toast({
        title: 'Interest Expressed!',
        description: 'The contract owner has been notified of your interest.',
      });
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: 'Error',
        description: 'Failed to express interest. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Contract Not Found</h2>
        <p className="text-muted-foreground mb-6">The contract farming opportunity you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/contract-farming')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contract Farming
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === opportunity.created_by;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  <span>{opportunity.created_by_name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted on {new Date(opportunity.created_at).toLocaleDateString()}</span>
                </div>
                {getStatusBadge(opportunity.status)}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat('en-KE', {
                  style: 'currency',
                  currency: 'KES',
                }).format(opportunity.price_per_unit)}
                <span className="text-sm font-normal text-muted-foreground"> / {opportunity.unit}</span>
              </span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line mb-6">{opportunity.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                      <h3 className="font-medium mb-2">Key Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Crop</span>
                          <span className="font-medium">{opportunity.crop}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity</span>
                          <span className="font-medium">{opportunity.quantity} {opportunity.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price per {opportunity.unit}</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('en-KE', {
                              style: 'currency',
                              currency: 'KES',
                            }).format(opportunity.price_per_unit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Value</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('en-KE', {
                              style: 'currency',
                              currency: 'KES',
                            }).format(opportunity.quantity * opportunity.price_per_unit)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Timeline</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Start Date</span>
                          <span className="font-medium">{new Date(opportunity.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">End Date</span>
                          <span className="font-medium">{new Date(opportunity.end_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          {getStatusBadge(opportunity.status)}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Location</h3>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{opportunity.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {opportunity.requirements && opportunity.requirements.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Requirements</h3>
                      <ul className="space-y-2">
                        {opportunity.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {opportunity.benefits && opportunity.benefits.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Benefits</h3>
                      <ul className="space-y-2">
                        {opportunity.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {opportunity.quality_standards && (
                    <div>
                      <h3 className="font-medium mb-2">Quality Standards</h3>
                      <p className="whitespace-pre-line">{opportunity.quality_standards}</p>
                    </div>
                  )}
                  
                  {opportunity.delivery_terms && (
                    <div>
                      <h3 className="font-medium mb-2">Delivery Terms</h3>
                      <p className="whitespace-pre-line">{opportunity.delivery_terms}</p>
                    </div>
                  )}
                  
                  {opportunity.payment_terms && (
                    <div>
                      <h3 className="font-medium mb-2">Payment Terms</h3>
                      <p className="whitespace-pre-line">{opportunity.payment_terms}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    {isOwner 
                      ? "This is how potential partners will contact you."
                      : "Contact the contract owner for more information or to express interest."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Contact Person</h3>
                    <p>{opportunity.created_by_name || 'Not specified'}</p>
                  </div>
                  
                  {opportunity.contact_phone && (
                    <div>
                      <h3 className="font-medium mb-2">Phone Number</h3>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`tel:${opportunity.contact_phone}`} className="hover:underline">
                          {opportunity.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {opportunity.contact_email && (
                    <div>
                      <h3 className="font-medium mb-2">Email Address</h3>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`mailto:${opportunity.contact_email}`} className="hover:underline">
                          {opportunity.contact_email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 mt-4 border-t">
                    <h3 className="font-medium mb-2">Location</h3>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span>{opportunity.location || 'Location not specified'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Express Interest</CardTitle>
              <CardDescription>
                {isOwner 
                  ? "You created this contract opportunity"
                  : "Interested in this contract farming opportunity?"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOwner ? (
                <div className="space-y-4">
                  <Button className="w-full" onClick={() => navigate(`/contract-farming/${id}/edit`)}>
                    Edit Contract
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Applications
                  </Button>
                  {opportunity.status === 'open' && (
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                      Close Opportunity
                    </Button>
                  )}
                </div>
              ) : isInterested ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="font-medium mb-2">Interest Expressed!</p>
                  <p className="text-sm text-muted-foreground">The contract owner has been notified and will contact you soon.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleExpressInterest}
                  >
                    Express Interest
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By expressing interest, your contact information will be shared with the contract owner.
                  </p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-3">Need help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is here to help you with any questions about contract farming.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Always verify the identity of the other party before entering into any agreement.</span>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Ensure all contract terms are clearly documented and signed by both parties.</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Be aware of key dates and deadlines mentioned in the contract.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractFarmingDetails;
