
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AdvertisementService, type BusinessAdvertisement } from '@/services/business/advertisementService';
import { DollarSign, Upload, CreditCard } from 'lucide-react';

const BUSINESS_CATEGORIES = [
  'Agriculture Equipment',
  'Seeds & Fertilizers', 
  'Transport & Logistics',
  'Farm Consulting',
  'Crop Processing',
  'Agricultural Finance',
  'Technology Solutions',
  'Market Access',
  'Other Services'
];

const TARGET_AUDIENCES = [
  'Small Scale Farmers',
  'Large Scale Farmers',
  'Cooperatives',
  'Agribusiness',
  'Transporters',
  'Processors',
  'Government Agencies',
  'NGOs'
];

interface BusinessAdvertisementFormProps {
  onSuccess?: () => void;
}

const BusinessAdvertisementForm: React.FC<BusinessAdvertisementFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [advertisementId, setAdvertisementId] = useState<string>('');
  
  const [formData, setFormData] = useState<BusinessAdvertisement>({
    business_name: '',
    business_description: '',
    business_category: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    website_url: '',
    image_url: '',
    ad_content: '',
    target_audience: [],
  });

  const handleInputChange = (field: keyof BusinessAdvertisement, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTargetAudienceChange = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      target_audience: prev.target_audience.includes(audience)
        ? prev.target_audience.filter(a => a !== audience)
        : [...prev.target_audience, audience]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.business_name || !formData.business_description || !formData.business_category || 
          !formData.contact_email || !formData.location || !formData.ad_content) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const result = await AdvertisementService.createAdvertisement(formData);
      
      if (result.success && result.id) {
        setAdvertisementId(result.id);
        setShowPayment(true);
        toast({
          title: "Advertisement Created",
          description: "Please complete payment to activate your advertisement",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create advertisement",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast({
        title: "Error",
        description: "Failed to create advertisement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "Your advertisement is now active!",
    });
    setShowPayment(false);
    onSuccess?.();
  };

  if (showPayment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment
          </CardTitle>
          <CardDescription>
            Pay $20 to activate your business advertisement for 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Advertisement Summary</h3>
              <p><strong>Business:</strong> {formData.business_name}</p>
              <p><strong>Category:</strong> {formData.business_category}</p>
              <p><strong>Duration:</strong> 30 days</p>
              <p><strong>Amount:</strong> $20.00 USD</p>
            </div>
            
            <div className="text-center">
              <div id="paypal-button-container" className="mt-4"></div>
              <p className="text-sm text-muted-foreground mt-2">
                Secure payment processed by PayPal
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPayment(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePaymentSuccess}
                className="flex-1"
                disabled={!advertisementId}
              >
                Complete Payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Advertise Your Business
        </CardTitle>
        <CardDescription>
          Reach thousands of farmers and agricultural businesses. $20 for 30 days of visibility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder="Your business name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_category">Category *</Label>
              <Select 
                value={formData.business_category} 
                onValueChange={(value) => handleInputChange('business_category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description *</Label>
            <Textarea
              id="business_description"
              value={formData.business_description}
              onChange={(e) => handleInputChange('business_description', e.target.value)}
              placeholder="Briefly describe your business"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ad_content">Advertisement Content *</Label>
            <Textarea
              id="ad_content"
              value={formData.ad_content}
              onChange={(e) => handleInputChange('ad_content', e.target.value)}
              placeholder="Write your advertisement content here"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email *</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="+254..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, County"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                value={formData.website_url || ''}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="flex flex-wrap gap-2">
              {TARGET_AUDIENCES.map(audience => (
                <Badge
                  key={audience}
                  variant={formData.target_audience.includes(audience) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTargetAudienceChange(audience)}
                >
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing Information
            </h3>
            <ul className="text-sm space-y-1">
              <li>• $20 USD for 30 days of advertisement</li>
              <li>• Visible to thousands of farmers and agribusiness</li>
              <li>• Analytics dashboard included</li>
              <li>• Payment processed securely via PayPal</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Advertisement...' : 'Create Advertisement - $20'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessAdvertisementForm;
