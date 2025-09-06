import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserCheck, Smartphone, Mail, MapPin } from 'lucide-react';

interface FormData {
  name: string;
  role: string;
  phone: string;
  email: string;
  county: string;
  goals: string;
  crop_interest: string[];
  budget: string;
  preferred_contact: string;
  referral_source: string;
}

const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta',
  'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga',
  'Wajir', 'West Pokot'
];

const CROPS = [
  'Maize', 'Wheat', 'Rice', 'Beans', 'Potatoes', 'Sweet Potatoes', 'Tomatoes', 
  'Onions', 'Carrots', 'Cabbages', 'Spinach', 'Bananas', 'Mangoes', 'Avocados',
  'Coffee', 'Tea', 'Cotton', 'Sunflower', 'Groundnuts', 'Sorghum', 'Millet',
  'Cassava', 'Yams', 'Pineapples', 'Oranges', 'Lemons', 'Passion Fruit'
];

export default function NeedsAssessmentForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    phone: '',
    email: '',
    county: '',
    goals: '',
    crop_interest: [],
    budget: '',
    preferred_contact: '',
    referral_source: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCropChange = (crop: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      crop_interest: checked
        ? [...prev.crop_interest, crop]
        : prev.crop_interest.filter(c => c !== crop)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error('Please fill in your name and role');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('client_needs_assessments')
        .insert({
          name: formData.name,
          role: formData.role,
          phone: formData.phone || null,
          email: formData.email || null,
          county: formData.county || null,
          goals: formData.goals || null,
          crop_interest: formData.crop_interest.length > 0 ? formData.crop_interest : null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          preferred_contact: formData.preferred_contact || null,
          referral_source: formData.referral_source || null
        });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Assessment submitted successfully! We\'ll connect you with relevant services.');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
          <p className="text-muted-foreground mb-6">
            Your needs assessment has been submitted successfully. Our team will analyze your requirements 
            and connect you with the most relevant agricultural services and opportunities.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• We'll match you with suitable partners and services</p>
            <p>• Expect a response within 24-48 hours</p>
            <p>• Check your preferred contact method for updates</p>
          </div>
          <Button 
            onClick={() => setIsSuccess(false)} 
            variant="outline" 
            className="mt-6"
          >
            Submit Another Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
          Tell Us About Your Agricultural Needs
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Help us connect you with the right services, partners, and opportunities
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="role">Your Role *</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="exporter">Exporter</SelectItem>
                  <SelectItem value="logistics">Logistics Provider</SelectItem>
                  <SelectItem value="partner">Service Partner</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="county" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                County
              </Label>
              <Select value={formData.county} onValueChange={(value) => handleInputChange('county', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your county" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {KENYAN_COUNTIES.map(county => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Goals and Interests */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="goals">What are your main agricultural goals?</Label>
              <Textarea
                id="goals"
                placeholder="e.g., Increase crop yield, find reliable buyers, access export markets, improve farm management..."
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                rows={3}
                className="mt-1 resize-none"
              />
            </div>

            <div>
              <Label>Crops/Products of Interest (select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {CROPS.map(crop => (
                  <div key={crop} className="flex items-center space-x-2">
                    <Checkbox
                      id={crop}
                      checked={formData.crop_interest.includes(crop)}
                      onCheckedChange={(checked) => handleCropChange(crop, !!checked)}
                    />
                    <Label htmlFor={crop} className="text-sm font-normal">{crop}</Label>
                  </div>
                ))}
              </div>
              {formData.crop_interest.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.crop_interest.map(crop => (
                    <Badge key={crop} variant="secondary" className="text-xs">
                      {crop}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="budget">Approximate Budget (KES)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 50000"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Helps us recommend appropriate services
              </p>
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="space-y-4">
            <div>
              <Label>Preferred Contact Method</Label>
              <RadioGroup 
                value={formData.preferred_contact} 
                onValueChange={(value) => handleInputChange('preferred_contact', value)}
                className="flex flex-row gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="contact-phone" />
                  <Label htmlFor="contact-phone" className="font-normal">Phone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="contact-email" />
                  <Label htmlFor="contact-email" className="font-normal">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="contact-whatsapp" />
                  <Label htmlFor="contact-whatsapp" className="font-normal">WhatsApp</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="referral">How did you hear about us?</Label>
              <Select value={formData.referral_source} onValueChange={(value) => handleInputChange('referral_source', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="friend_referral">Friend/Family Referral</SelectItem>
                  <SelectItem value="agricultural_officer">Agricultural Officer</SelectItem>
                  <SelectItem value="cooperative">Farmer Cooperative</SelectItem>
                  <SelectItem value="workshop">Workshop/Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium"
            disabled={isSubmitting || !formData.name || !formData.role}
          >
            {isSubmitting ? 'Submitting Assessment...' : 'Submit Needs Assessment'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your information is secure and will only be used to match you with relevant agricultural services.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}