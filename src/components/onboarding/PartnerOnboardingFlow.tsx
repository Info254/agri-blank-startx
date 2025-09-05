// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createPartner } from '@/services/partnerService';
import { Partner, PartnerType } from '@/types/partner';

const partnerTypes: { value: PartnerType; label: string }[] = [
  { value: 'logistics', label: 'Logistics Provider' },
  { value: 'financial', label: 'Financial Institution' },
  { value: 'input_supplier', label: 'Input Supplier' },
  { value: 'processor', label: 'Processor' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'extension_service', label: 'Extension Service' },
  { value: 'government', label: 'Government Agency' },
  { value: 'other', label: 'Other' },
];

const serviceCategories = [
  'Transportation',
  'Warehousing',
  'Cold Storage',
  'Processing',
  'Packaging',
  'Certification',
  'Insurance',
  'Financing',
  'Training',
  'Consulting',
  'Input Supply',
  'Equipment Rental',
  'Other',
];

const PartnerOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Partner>>({
    services: [],
    isVerified: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    'Business Information',
    'Services & Coverage',
    'Contact Details',
    'Review & Submit',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const services = prev.services || [];
      return {
        ...prev,
        services: services.includes(service)
          ? services.filter(s => s !== service)
          : [...services, service],
      };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await createPartner({
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Omit<Partner, 'id' | 'created_at' | 'updated_at'>);

      if (error) throw error;

      toast({
        title: 'Partner Profile Created',
        description: 'Your partner profile has been created successfully!',
      });

      navigate('/partner/dashboard');
    } catch (err: any) {
      console.error('Error creating partner:', err);
      setError(err.message || 'Failed to create partner profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter your organization name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Organization Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value as PartnerType)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {partnerTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Briefly describe your organization and its role in the agricultural value chain"
                rows={4}
                required
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Services Offered *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceCategories.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={formData.services?.includes(service) || false}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <Label htmlFor={`service-${service}`}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="coverage_areas">Coverage Areas</Label>
              <Textarea
                id="coverage_areas"
                name="coverage_areas"
                value={Array.isArray(formData.coverage_areas) ? formData.coverage_areas.join(', ') : ''}
                onChange={(e) => {
                  const areas = e.target.value.split(',').map(area => area.trim()).filter(Boolean);
                  handleSelectChange('coverage_areas', areas);
                }}
                placeholder="List the regions, counties, or areas you operate in (comma-separated)"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact_email">Email Address *</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email || ''}
                onChange={handleChange}
                placeholder="contact@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Phone Number *</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone || ''}
                onChange={handleChange}
                placeholder="+254 700 000000"
                required
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website || ''}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Physical Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="123 Business St, City, Country"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Business Information</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p><strong>Organization Name:</strong> {formData.name}</p>
                <p><strong>Type:</strong> {partnerTypes.find(t => t.value === formData.type)?.label}</p>
                <p><strong>Description:</strong> {formData.description}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Services & Coverage</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p><strong>Services:</strong> {formData.services?.join(', ') || 'None selected'}</p>
                <p><strong>Coverage Areas:</strong> {Array.isArray(formData.coverage_areas) && formData.coverage_areas.length > 0 
                  ? formData.coverage_areas.join(', ')
                  : 'Not specified'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Contact Details</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p><strong>Email:</strong> {formData.contact_email}</p>
                <p><strong>Phone:</strong> {formData.contact_phone}</p>
                <p><strong>Website:</strong> {formData.website || 'Not specified'}</p>
                <p><strong>Address:</strong> {formData.address}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="updates" defaultChecked />
                <Label htmlFor="updates">
                  I want to receive updates and newsletters
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Become a Partner</CardTitle>
          <CardDescription>
            Join our network of agricultural service providers and expand your reach in the value chain.
          </CardDescription>
          
          <div className="pt-4">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center">{step}</span>
                </div>
              ))}
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === steps.length - 1) {
              handleSubmit();
            } else {
              handleNext();
            }
          }}>
            <div className="space-y-6 mb-8">
              {renderStep()}
              {error && (
                <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
              >
                Back
              </Button>
              
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  'Submit Application'
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerOnboardingFlow;
