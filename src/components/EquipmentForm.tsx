// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { createEquipmentListing } from '@/services/equipmentMarketplaceService';
import { useAuth } from '@/hooks/useAuth';

interface EquipmentFormProps {
  onSubmit?: (equipmentData: any) => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [equipmentData, setEquipmentData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    location: '',
    county: '',
    contact_phone: '',
    contact_email: '',
    available_for: [] as string[],
    is_active: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Tractors',
    'Harvesters',
    'Planting Equipment',
    'Irrigation Systems',
    'Processing Equipment',
    'Storage Equipment',
    'Hand Tools',
    'Power Tools',
    'Livestock Equipment',
    'Other'
  ];

  const availabilityOptions = [
    'Sale',
    'Rent',
    'Lease'
  ];

  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
    'Kitale', 'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho',
    'Embu', 'Migori', 'Homa Bay', 'Naivasha', 'Voi', 'Wajir', 'Marsabit',
    'Isiolo', 'Maralal', 'Kapenguria', 'Bungoma', 'Webuye', 'Busia', 'Siaya',
    'Kisii', 'Keroka', 'Kilifi', 'Lamu', 'Taveta', 'Loitokitok', 'Kajiado',
    'Namanga', 'Magadi', 'Kiambu', 'Limuru', 'Kikuyu', 'Ruiru', 'Githunguri',
    'Muranga', 'Kenol', 'Makuyu', 'Kirinyaga', 'Kutus', 'Sagana', 'Nanyuki',
    'Maua', 'Chuka', 'Makindu', 'Mtito Andei', 'Kibwezi', 'Makueni', 'Wote'
  ];

  const handleInputChange = (field: string, value: any) => {
    setEquipmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityChange = (option: string, checked: boolean) => {
    setEquipmentData(prev => ({
      ...prev,
      available_for: checked
        ? [...prev.available_for, option]
        : prev.available_for.filter(item => item !== option)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to add equipment listings.',
        variant: 'destructive'
      });
      return;
    }

    if (!equipmentData.name || !equipmentData.category || !equipmentData.available_for.length) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const equipmentPayload = {
        ...equipmentData,
        owner_id: user.id,
        price: equipmentData.price ? parseFloat(equipmentData.price) : null,
        contact_email: equipmentData.contact_email || user.email
      };

      const { data, error } = await createEquipmentListing(equipmentPayload);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Success!',
        description: 'Your equipment has been listed successfully.',
      });

      // Reset form
      setEquipmentData({
        name: '',
        category: '',
        description: '',
        price: '',
        location: '',
        county: '',
        contact_phone: '',
        contact_email: '',
        available_for: [],
        is_active: true
      });

      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create equipment listing.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add Equipment Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div>
              <Label htmlFor="name">Equipment Name *</Label>
              <Input
                id="name"
                value={equipmentData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., John Deere 5075E Tractor"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={equipmentData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={equipmentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the equipment condition, specifications, and any additional details..."
                rows={4}
              />
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Availability *</h3>
            <div className="flex flex-wrap gap-4">
              {availabilityOptions.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={equipmentData.available_for.includes(option)}
                    onCheckedChange={(checked) => handleAvailabilityChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <Label htmlFor="price">Price (KES)</Label>
            <Input
              id="price"
              type="number"
              value={equipmentData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price (leave empty if negotiable)"
            />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>
            
            <div>
              <Label htmlFor="county">County</Label>
              <Select value={equipmentData.county} onValueChange={(value) => handleInputChange('county', value)}>
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

            <div>
              <Label htmlFor="location">Specific Location</Label>
              <Input
                id="location"
                value={equipmentData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Kiambu Town, near ABC Farm"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div>
              <Label htmlFor="contact_phone">Phone Number</Label>
              <Input
                id="contact_phone"
                value={equipmentData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="e.g., +254712345678"
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Email (optional)</Label>
              <Input
                id="contact_email"
                type="email"
                value={equipmentData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="Your email address"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Adding Equipment...' : 'Add Equipment Listing'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EquipmentForm;