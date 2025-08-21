import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { createFarmerCollaboration, getFarmerCollaborations, getExporterProfiles } from '@/services/farmerExporterService';
import type { FarmerExporterCollaboration as FarmerExporterCollaborationType, ExporterProfile } from '@/services/farmerExporterService';
import { Globe, MapPin, Phone, Mail, Package, Calendar, User, Building2 } from 'lucide-react';
import { useEffect } from 'react';

const FarmerExporterCollaboration = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [collaborations, setCollaborations] = useState<FarmerExporterCollaborationType[]>([]);
  const [exporters, setExporters] = useState<ExporterProfile[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    farmer_name: '',
    farmer_phone: '',
    farmer_email: '',
    farmer_location: '',
    farmer_county: '',
    farm_size_acres: '',
    commodity_name: '',
    commodity_variety: '',
    estimated_quantity: '',
    unit: 'kg',
    quality_grade: '',
    harvest_date: '',
    availability_period: '',
    farmer_experience_years: '',
    has_export_documentation: false,
    documentation_needs: [] as string[],
    farmer_profile_description: '',
    collaboration_type: 'supply_partnership',
    target_markets: [] as string[],
    pricing_expectations: '',
    special_requirements: [] as string[],
    farmer_certifications: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [collaborationsData, exportersData] = await Promise.all([
        getFarmerCollaborations(),
        getExporterProfiles()
      ]);
      setCollaborations(collaborationsData);
      setExporters(exportersData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.farmer_name || !formData.farmer_phone || !formData.commodity_name || !formData.estimated_quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const collaboration = {
        ...formData,
        estimated_quantity: parseFloat(formData.estimated_quantity),
        farm_size_acres: formData.farm_size_acres ? parseFloat(formData.farm_size_acres) : undefined,
        farmer_experience_years: formData.farmer_experience_years ? parseInt(formData.farmer_experience_years) : undefined,
        collaboration_status: 'seeking_exporter',
        is_active: true
      };

      await createFarmerCollaboration(collaboration);
      
      toast({
        title: "Success",
        description: "Your collaboration request has been created successfully",
      });

      // Reset form
      setFormData({
        farmer_name: '',
        farmer_phone: '',
        farmer_email: '',
        farmer_location: '',
        farmer_county: '',
        farm_size_acres: '',
        commodity_name: '',
        commodity_variety: '',
        estimated_quantity: '',
        unit: 'kg',
        quality_grade: '',
        harvest_date: '',
        availability_period: '',
        farmer_experience_years: '',
        has_export_documentation: false,
        documentation_needs: [],
        farmer_profile_description: '',
        collaboration_type: 'supply_partnership',
        target_markets: [],
        pricing_expectations: '',
        special_requirements: [],
        farmer_certifications: [],
      });

      loadData();
    } catch (error) {
      console.error('Error creating collaboration:', error);
      toast({
        title: "Error",
        description: "Failed to create collaboration request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const counties = [
    'Nairobi', 'Kiambu', 'Nakuru', 'Kisumu', 'Machakos', 'Uasin Gishu', 'Meru', 'Nyeri',
    'Murang\'a', 'Kakamega', 'Bungoma', 'Trans Nzoia', 'Nandi', 'Kericho', 'Bomet'
  ];

  const commodities = [
    'Maize', 'Wheat', 'Rice', 'Beans', 'Potatoes', 'Sweet Potatoes', 'Tomatoes', 
    'Onions', 'Carrots', 'Cabbages', 'Spinach', 'Bananas', 'Mangoes', 'Avocados',
    'Coffee', 'Tea', 'Pyrethrum', 'Cotton', 'Sunflower', 'Groundnuts'
  ];

  const targetMarkets = [
    'East Africa', 'Europe', 'Middle East', 'Asia', 'North America', 'Australia'
  ];

  const documentationNeeds = [
    'Export License', 'Phytosanitary Certificate', 'Certificate of Origin',
    'Quality Certificates', 'Organic Certification', 'Fair Trade Certification'
  ];

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Farmer-Exporter Collaboration</h1>
        <p className="text-muted-foreground mt-2">
          Connect with exporters to access international markets and get help with documentation
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Request</TabsTrigger>
          <TabsTrigger value="browse">Browse Requests</TabsTrigger>
          <TabsTrigger value="exporters">Find Exporters</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Collaboration Request</CardTitle>
              <CardDescription>
                Tell exporters about your produce and what kind of collaboration you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Farmer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Farmer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmer_name">Full Name *</Label>
                      <Input
                        id="farmer_name"
                        value={formData.farmer_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, farmer_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmer_phone">Phone Number *</Label>
                      <Input
                        id="farmer_phone"
                        value={formData.farmer_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, farmer_phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmer_email">Email Address</Label>
                      <Input
                        id="farmer_email"
                        type="email"
                        value={formData.farmer_email}
                        onChange={(e) => setFormData(prev => ({ ...prev, farmer_email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmer_county">County *</Label>
                      <Select value={formData.farmer_county} onValueChange={(value) => setFormData(prev => ({ ...prev, farmer_county: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {counties.map(county => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="farmer_location">Specific Location *</Label>
                      <Input
                        id="farmer_location"
                        value={formData.farmer_location}
                        onChange={(e) => setFormData(prev => ({ ...prev, farmer_location: e.target.value }))}
                        placeholder="e.g., Kiambu Town, near ABC Market"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Commodity Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Commodity Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="commodity_name">Commodity *</Label>
                      <Select value={formData.commodity_name} onValueChange={(value) => setFormData(prev => ({ ...prev, commodity_name: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select commodity" />
                        </SelectTrigger>
                        <SelectContent>
                          {commodities.map(commodity => (
                            <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="commodity_variety">Variety</Label>
                      <Input
                        id="commodity_variety"
                        value={formData.commodity_variety}
                        onChange={(e) => setFormData(prev => ({ ...prev, commodity_variety: e.target.value }))}
                        placeholder="e.g., H614 for maize"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated_quantity">Estimated Quantity *</Label>
                      <Input
                        id="estimated_quantity"
                        type="number"
                        value={formData.estimated_quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimated_quantity: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="crates">Crates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Documentation Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Documentation & Requirements</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_export_documentation"
                      checked={formData.has_export_documentation}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_export_documentation: !!checked }))}
                    />
                    <Label htmlFor="has_export_documentation">I already have export documentation</Label>
                  </div>
                  
                  {!formData.has_export_documentation && (
                    <div>
                      <Label>What documentation do you need help with?</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {documentationNeeds.map(doc => (
                          <div key={doc} className="flex items-center space-x-2">
                            <Checkbox
                              id={doc}
                              checked={formData.documentation_needs.includes(doc)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({ ...prev, documentation_needs: [...prev.documentation_needs, doc] }));
                                } else {
                                  setFormData(prev => ({ ...prev, documentation_needs: prev.documentation_needs.filter(d => d !== doc) }));
                                }
                              }}
                            />
                            <Label htmlFor={doc} className="text-sm">{doc}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Description */}
                <div>
                  <Label htmlFor="farmer_profile_description">About Your Farm</Label>
                  <Textarea
                    id="farmer_profile_description"
                    value={formData.farmer_profile_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmer_profile_description: e.target.value }))}
                    placeholder="Tell exporters about your farming experience, practices, and what makes your produce special..."
                    rows={4}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Create Collaboration Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid gap-6">
            {collaborations.map(collaboration => (
              <Card key={collaboration.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {collaboration.commodity_name}
                        {collaboration.commodity_variety && ` (${collaboration.commodity_variety})`}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {collaboration.farmer_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {collaboration.farmer_county}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {collaboration.estimated_quantity} {collaboration.unit}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant={collaboration.collaboration_status === 'seeking_exporter' ? 'default' : 'secondary'}>
                      {collaboration.collaboration_status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collaboration.farmer_profile_description && (
                      <p className="text-sm text-muted-foreground">{collaboration.farmer_profile_description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 text-sm">
                        <Phone className="h-4 w-4" />
                        {collaboration.farmer_phone}
                      </span>
                      {collaboration.farmer_email && (
                        <span className="flex items-center gap-1 text-sm">
                          <Mail className="h-4 w-4" />
                          {collaboration.farmer_email}
                        </span>
                      )}
                      {collaboration.harvest_date && (
                        <span className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          Harvest: {new Date(collaboration.harvest_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {!collaboration.has_export_documentation && collaboration.documentation_needs && collaboration.documentation_needs.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Documentation Needs:</p>
                        <div className="flex flex-wrap gap-1">
                          {collaboration.documentation_needs.map(need => (
                            <Badge key={need} variant="outline" className="text-xs">{need}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Posted {new Date(collaboration.created_at).toLocaleDateString()}
                      </span>
                      <Button size="sm">
                        Contact Farmer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exporters" className="space-y-6">
          <div className="grid gap-6">
            {exporters.map(exporter => (
              <Card key={exporter.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {exporter.company_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {exporter.contact_person_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exporter.office_county}
                        </span>
                        {exporter.years_in_business && (
                          <span className="text-sm">
                            {exporter.years_in_business} years in business
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{exporter.rating.toFixed(1)}/5</div>
                      <div className="text-sm text-muted-foreground">{exporter.total_collaborations} collaborations</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exporter.company_description && (
                      <p className="text-sm text-muted-foreground">{exporter.company_description}</p>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Export Markets:</p>
                      <div className="flex flex-wrap gap-1">
                        {exporter.export_markets.map(market => (
                          <Badge key={market} variant="outline" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            {market}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Commodities Handled:</p>
                      <div className="flex flex-wrap gap-1">
                        {exporter.commodities_handled.map(commodity => (
                          <Badge key={commodity} variant="secondary" className="text-xs">{commodity}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Services Offered:</p>
                      <div className="flex flex-wrap gap-1">
                        {exporter.services_offered.map(service => (
                          <Badge key={service} variant="outline" className="text-xs">{service}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {exporter.contact_phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {exporter.contact_email}
                        </span>
                      </div>
                      <Button size="sm">
                        Contact Exporter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerExporterCollaboration;
