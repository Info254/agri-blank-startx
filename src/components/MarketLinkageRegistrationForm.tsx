
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createMarketLinkage, MarketLinkageFormData } from '@/services/marketLinkageService';

interface MarketLinkageRegistrationFormProps {
  onSuccess?: () => void;
}

const MarketLinkageRegistrationForm: React.FC<MarketLinkageRegistrationFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MarketLinkageFormData>({
    title: '',
    description: '',
    linkage_type: 'buyer_seller',
    crops_involved: [],
    counties: [],
    requirements: [],
    benefits: [],
    contact_info: '',
    application_deadline: '',
    start_date: '',
    duration_months: undefined,
    minimum_quantity: undefined,
    price_range: '',
    max_participants: undefined,
  });

  const [newCrop, setNewCrop] = useState('');
  const [newCounty, setNewCounty] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Kiambu', 
    'Machakos', 'Meru', 'Embu', 'Nyeri', 'Muranga', 'Kakamega', 'Kisii', 
    'Nyamira', 'Kericho', 'Bomet', 'Narok', 'Kajiado', 'Makueni'
  ];

  const commonCrops = [
    'Maize', 'Beans', 'Rice', 'Wheat', 'Potatoes', 'Sweet Potatoes', 'Cassava',
    'Bananas', 'Coffee', 'Tea', 'Sugarcane', 'Cotton', 'Tomatoes', 'Onions',
    'Cabbages', 'Kales', 'Spinach', 'Avocado', 'Mangoes', 'Oranges'
  ];

  const addItem = (item: string, field: keyof MarketLinkageFormData, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (item.trim()) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(item.trim())) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentArray, item.trim()]
        }));
      }
      setter('');
    }
  };

  const removeItem = (item: string, field: keyof MarketLinkageFormData) => {
    const currentArray = formData[field] as string[];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter(i => i !== item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.contact_info) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await createMarketLinkage(formData);
      
      toast({
        title: 'Success',
        description: 'Market linkage registered successfully!',
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        linkage_type: 'buyer_seller',
        crops_involved: [],
        counties: [],
        requirements: [],
        benefits: [],
        contact_info: '',
        application_deadline: '',
        start_date: '',
        duration_months: undefined,
        minimum_quantity: undefined,
        price_range: '',
        max_participants: undefined,
      });
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error creating market linkage:', error);
      toast({
        title: 'Error',
        description: 'Failed to register market linkage. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Register New Market Linkage</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Avocado Export Partnership"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Linkage Type *</label>
              <Select 
                value={formData.linkage_type} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, linkage_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer_seller">Buyer-Seller</SelectItem>
                  <SelectItem value="contract_farming">Contract Farming</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                  <SelectItem value="export_opportunity">Export Opportunity</SelectItem>
                  <SelectItem value="processing_partnership">Processing Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Information *</label>
              <Input
                value={formData.contact_info}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
                placeholder="Phone: +254..., Email: ..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the market linkage opportunity..."
              rows={4}
              required
            />
          </div>

          {/* Crops */}
          <div>
            <label className="block text-sm font-medium mb-2">Crops Involved</label>
            <div className="flex gap-2 mb-2">
              <Select value={newCrop} onValueChange={setNewCrop}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {commonCrops.map(crop => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                onClick={() => addItem(newCrop, 'crops_involved', setNewCrop)}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.crops_involved.map(crop => (
                <Badge key={crop} variant="secondary" className="flex items-center gap-1">
                  {crop}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItem(crop, 'crops_involved')}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Counties */}
          <div>
            <label className="block text-sm font-medium mb-2">Counties</label>
            <div className="flex gap-2 mb-2">
              <Select value={newCounty} onValueChange={setNewCounty}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {kenyanCounties.map(county => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                onClick={() => addItem(newCounty, 'counties', setNewCounty)}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.counties.map(county => (
                <Badge key={county} variant="secondary" className="flex items-center gap-1">
                  {county}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItem(county, 'counties')}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium mb-2">Requirements</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add requirement..."
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={() => addItem(newRequirement, 'requirements', setNewRequirement)}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map(req => (
                <Badge key={req} variant="outline" className="flex items-center gap-1">
                  {req}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItem(req, 'requirements')}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium mb-2">Benefits</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add benefit..."
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={() => addItem(newBenefit, 'benefits', setNewBenefit)}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map(benefit => (
                <Badge key={benefit} variant="outline" className="flex items-center gap-1">
                  {benefit}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItem(benefit, 'benefits')}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Application Deadline</label>
              <Input
                type="date"
                value={formData.application_deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Duration (months)</label>
              <Input
                type="number"
                value={formData.duration_months || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_months: parseInt(e.target.value) || undefined }))}
                placeholder="e.g., 12"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Max Participants</label>
              <Input
                type="number"
                value={formData.max_participants || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || undefined }))}
                placeholder="e.g., 50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Quantity (tons)</label>
              <Input
                type="number"
                value={formData.minimum_quantity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, minimum_quantity: parseFloat(e.target.value) || undefined }))}
                placeholder="e.g., 10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <Input
                value={formData.price_range}
                onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
                placeholder="e.g., 50-80 KES per kg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Market Linkage'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MarketLinkageRegistrationForm;
