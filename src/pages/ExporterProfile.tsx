
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { createExporterProfile, getExporterProfiles, ExporterProfile } from '@/services/farmerExporterService';
import { Building2, Globe, Package, CheckCircle } from 'lucide-react';

const ExporterProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<ExporterProfile | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company_name: '',
    company_registration_number: '',
    business_license_number: '',
    export_license_number: '',
    company_description: '',
    contact_person_name: '',
    contact_phone: '',
    contact_email: '',
    office_location: '',
    office_county: '',
    website_url: '',
    years_in_business: '',
    export_markets: [] as string[],
    commodities_handled: [] as string[],
    services_offered: [] as string[],
    minimum_quantity_tons: '',
    maximum_quantity_tons: '',
    certifications: [] as string[],
    documentation_services: true,
    logistics_services: false,
    quality_assurance_services: false,
    financing_services: false,
    is_active: true
  });

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const profiles = await getExporterProfiles();
      // In a real app, you'd filter by current user
      if (profiles.length > 0) {
        setExistingProfile(profiles[0]);
        // Load existing data into form
      }
    } catch (error) {
      console.error('Error checking existing profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.contact_person_name || !formData.contact_phone || !formData.contact_email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const profileData = {
        ...formData,
        years_in_business: formData.years_in_business ? parseInt(formData.years_in_business) : undefined,
        minimum_quantity_tons: formData.minimum_quantity_tons ? parseFloat(formData.minimum_quantity_tons) : undefined,
        maximum_quantity_tons: formData.maximum_quantity_tons ? parseFloat(formData.maximum_quantity_tons) : undefined,
      };

      await createExporterProfile(profileData);
      
      toast({
        title: "Success",
        description: "Your exporter profile has been created successfully",
      });

      checkExistingProfile();
    } catch (error) {
      console.error('Error creating exporter profile:', error);
      toast({
        title: "Error",
        description: "Failed to create exporter profile",
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

  const exportMarkets = [
    'East Africa', 'Europe', 'Middle East', 'Asia', 'North America', 'Australia',
    'South Africa', 'West Africa', 'South America'
  ];

  const commodityOptions = [
    'Maize', 'Wheat', 'Rice', 'Beans', 'Potatoes', 'Sweet Potatoes', 'Tomatoes', 
    'Onions', 'Carrots', 'Cabbages', 'Spinach', 'Bananas', 'Mangoes', 'Avocados',
    'Coffee', 'Tea', 'Pyrethrum', 'Cotton', 'Sunflower', 'Groundnuts'
  ];

  const serviceOptions = [
    'Documentation Support', 'Quality Certification', 'Logistics Coordination',
    'Market Access', 'Price Negotiation', 'Payment Processing', 'Insurance',
    'Storage Services', 'Transport Arrangement', 'Customs Clearance'
  ];

  const certificationOptions = [
    'ISO 9001', 'ISO 22000', 'HACCP', 'BRC', 'SQF', 'Organic Certification',
    'Fair Trade', 'Rainforest Alliance', 'UTZ', 'Global GAP'
  ];

  if (existingProfile) {
    return (
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Exporter Profile</h1>
          <p className="text-muted-foreground mt-2">
            Your exporter profile is active and visible to farmers
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8" />
                <div>
                  <CardTitle>{existingProfile.company_name}</CardTitle>
                  <CardDescription>{existingProfile.contact_person_name}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">Active Profile</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Export Markets</h3>
                <div className="flex flex-wrap gap-1">
                  {existingProfile.export_markets.map(market => (
                    <Badge key={market} variant="outline">
                      <Globe className="h-3 w-3 mr-1" />
                      {market}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Commodities Handled</h3>
                <div className="flex flex-wrap gap-1">
                  {existingProfile.commodities_handled.map(commodity => (
                    <Badge key={commodity} variant="secondary">
                      <Package className="h-3 w-3 mr-1" />
                      {commodity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Services Offered</h3>
              <div className="flex flex-wrap gap-1">
                {existingProfile.services_offered.map(service => (
                  <Badge key={service} variant="outline">{service}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{existingProfile.rating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{existingProfile.total_collaborations}</div>
                <div className="text-sm text-muted-foreground">Collaborations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{existingProfile.successful_exports}</div>
                <div className="text-sm text-muted-foreground">Successful Exports</div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Exporter Profile</h1>
        <p className="text-muted-foreground mt-2">
          Create your profile to connect with farmers who need export services
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exporter Information</CardTitle>
          <CardDescription>
            Provide detailed information about your export business to help farmers find you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company_registration_number">Registration Number</Label>
                  <Input
                    id="company_registration_number"
                    value={formData.company_registration_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_registration_number: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="business_license_number">Business License</Label>
                  <Input
                    id="business_license_number"
                    value={formData.business_license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_license_number: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="export_license_number">Export License</Label>
                  <Input
                    id="export_license_number"
                    value={formData.export_license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, export_license_number: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company_description">Company Description</Label>
                <Textarea
                  id="company_description"
                  value={formData.company_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_description: e.target.value }))}
                  placeholder="Describe your company, experience, and what sets you apart..."
                  rows={4}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_person_name">Contact Person *</Label>
                  <Input
                    id="contact_person_name"
                    value={formData.contact_person_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Phone Number *</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email Address *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website_url">Website</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Export Markets */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Export Markets</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {exportMarkets.map(market => (
                  <div key={market} className="flex items-center space-x-2">
                    <Checkbox
                      id={market}
                      checked={formData.export_markets.includes(market)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ ...prev, export_markets: [...prev.export_markets, market] }));
                        } else {
                          setFormData(prev => ({ ...prev, export_markets: prev.export_markets.filter(m => m !== market) }));
                        }
                      }}
                    />
                    <Label htmlFor={market} className="text-sm">{market}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Commodities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Commodities Handled</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {commodityOptions.map(commodity => (
                  <div key={commodity} className="flex items-center space-x-2">
                    <Checkbox
                      id={commodity}
                      checked={formData.commodities_handled.includes(commodity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ ...prev, commodities_handled: [...prev.commodities_handled, commodity] }));
                        } else {
                          setFormData(prev => ({ ...prev, commodities_handled: prev.commodities_handled.filter(c => c !== commodity) }));
                        }
                      }}
                    />
                    <Label htmlFor={commodity} className="text-sm">{commodity}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Services Offered</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {serviceOptions.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services_offered.includes(service)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({ ...prev, services_offered: [...prev.services_offered, service] }));
                        } else {
                          setFormData(prev => ({ ...prev, services_offered: prev.services_offered.filter(s => s !== service) }));
                        }
                      }}
                    />
                    <Label htmlFor={service} className="text-sm">{service}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Profile...' : 'Create Exporter Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExporterProfilePage;
