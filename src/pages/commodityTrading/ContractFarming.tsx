import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ArrowRight, Search, Filter } from 'lucide-react';
import { useContractFarming } from '@/hooks/useContractFarming';
import type { ContractFarming } from '@/types/database.types';

type FilterStatus = 'all' | 'active' | 'completed';

const ContractFarming: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const navigate = useNavigate();
  
  // Use the custom hook for data fetching and filtering
  const {
    opportunities,
    isLoading,
    filterOptions,
    filterOpportunities
  } = useContractFarming();
  
  // Apply filters to get the displayed opportunities with proper typing
  const displayedOpportunities = useMemo(() => {
    return filterOpportunities({
      searchTerm,
      cropType: selectedCrop,
      status: selectedStatus
    }) as ContractFarming[];
  }, [filterOpportunities, searchTerm, selectedCrop, selectedStatus]);
  
  // Define status filter options with proper typing
  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  const handleOpportunityClick = useCallback((id: string) => {
    navigate(`/contract-farming/${id}`);
  }, [navigate]);
  
  const handleCropChange = (value: string) => {
    setSelectedCrop(value);
  };
  
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as FilterStatus);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-blue-300 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-300 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contract farming opportunities...</p>
        </div>
      </div>
    );
  }
  
  if (opportunities.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No contract farming opportunities found</h2>
        <p className="text-muted-foreground">Check back later or try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold mb-2">Contract Farming Opportunities</h1>
        <p className="text-muted-foreground">Connect with buyers and sellers for guaranteed markets and supply</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, crop, company, or location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Select
          value={selectedCrop}
          onValueChange={handleCropChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select crop type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            {filterOptions.crops.map(crop => (
              <SelectItem key={crop} value={crop}>
                {crop}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={selectedStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col space-y-4 mb-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All Opportunities</TabsTrigger>
            <TabsTrigger value="my">My Contracts</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            {displayedOpportunities.length} {displayedOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          {displayedOpportunities.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="h-full">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{opportunity.company_name}</p>
                        </div>
                        {getStatusBadge(opportunity.status)}
                      </div>
                      <CardDescription className="mt-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {opportunity.expires_at ? new Date(opportunity.expires_at).toLocaleDateString() : 'No expiry date'}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm line-clamp-3">{opportunity.description}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Crop Type:</span>
                          <span className="text-sm">{opportunity.crop_type || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Price:</span>
                          <span className="text-sm">
                            {opportunity.price_per_unit 
                              ? `${opportunity.price_per_unit.toLocaleString()} / ${opportunity.unit || 'unit'}` 
                              : 'Negotiable'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Quantity:</span>
                          <span className="text-sm">
                            {opportunity.minimum_quantity && opportunity.maximum_quantity 
                              ? `${opportunity.minimum_quantity.toLocaleString()} - ${opportunity.maximum_quantity.toLocaleString()} ${opportunity.unit || 'units'}`
                              : 'Flexible'}
                          </span>
                        </div>
                      </div>
                      
                      {opportunity.average_rating !== null && (
                        <div className="mt-4 flex items-center">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(opportunity.average_rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                              {opportunity.average_rating.toFixed(1)} ({opportunity.review_count} reviews)
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Documents:</span>
                          <div className="flex items-center">
                            {opportunity.documents.slice(0, 3).map((doc, index) => (
                              <a 
                                key={index}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {doc.name.length > 15 ? `${doc.name.substring(0, 15)}...` : doc.name}
                              </a>
                            ))}
                            {opportunity.documents.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{opportunity.documents.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 mt-auto">
                        <div className="text-xs text-muted-foreground mb-1">Contact:</div>
                        <div className="text-sm">
                          <div className="truncate" title={opportunity.contact_person}>
                            {opportunity.contact_person}
                          </div>
                          <div className="truncate text-muted-foreground" title={opportunity.contact_phone || opportunity.contact_email}>
                            {opportunity.contact_phone || opportunity.contact_email}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t pt-3 justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpportunityClick(opportunity.id)}
                      >
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        asChild
                      >
                        <a 
                          href={`mailto:${opportunity.contact_email || ''}?subject=Inquiry about ${encodeURIComponent(opportunity.title)}`}
                          className="whitespace-nowrap"
                        >
                          Contact
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No contract farming opportunities found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later or try adjusting your filters.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your contracts will appear here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your applications will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>

      {displayedOpportunities.length > 0 && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              // TODO: Implement load more functionality
              console.log('Load more clicked');
            }}
          >
            Load More
          </Button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          onClick={() => navigate('/contract-farming/new')}
          className="bg-green-600 hover:bg-green-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Contract Farming Opportunity
        </Button>
      </div>
    </div>
  );
};

export default ContractFarming;
