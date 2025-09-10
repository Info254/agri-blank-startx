// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, User, Phone, Mail, MapPin } from 'lucide-react';

const NeedsAssessmentForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    county: '',
    role: '',
    goals: '',
    cropInterest: '',
    budget: '',
    preferredContact: 'phone'
  });

  const counties = [
    'Nairobi', 'Nakuru', 'Kiambu', 'Meru', 'Nyeri', 'Murang\'a',
    'Machakos', 'Makueni', 'Kitui', 'Embu', 'Tharaka Nithi'
  ];

  const roles = [
    'Small-scale Farmer',
    'Commercial Farmer',
    'Agribusiness Owner',
    'Agricultural Input Supplier',
    'Produce Buyer/Trader',
    'Transport Provider',
    'Storage/Warehouse Provider',
    'Agricultural Consultant',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Form sumitted:', formData);
      
      toast({
        title: "Assessment Submitted!",
        description: "We'll connect you with relevant services and partners within 24 hours.",
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        county: '',
        role: '',
        goals: '',
        cropInterest: '',
        budget: '',
        preferredContact: 'phone'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          <span>Quick Needs Assessment</span>
        </CardTitle>
        <CardDescription>
          Tell us about your agricultural needs and we'll connect you with the right services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Full Name *</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>Phone Number *</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+254 XXX XXX XXX"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Submit Assessment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NeedsAssessmentForm;