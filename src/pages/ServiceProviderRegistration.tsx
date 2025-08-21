
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ServiceProviderRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState([
    'Storage', 'Transport', 'Quality Control', 'Market Linkage', 'Training', 'Input Supplier', 'Inspector'
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [county, setCounty] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [website, setWebsite] = useState('');
  const [tags, setTags] = useState([
    'Organic', 'Fair Trade', 'Affordable', 'Reliable', 'Certified'
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos', 'Kiambu',
    'Nyeri', 'Kakamega', 'Kisii', 'Thika', 'Garissa', 'Lamu', 'Turkana'
  ];

  const handleServiceChange = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newServiceProvider = {
      name,
      businessType,
      description,
      services: selectedServices,
      location: {
        county: county,
        specificLocation: specificLocation,
      },
      contactInfo,
      website,
      tags: selectedTags,
      rates: "Contact for rates", // Adding the required rates field
      verified: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Use Supabase client to add the service provider
    // This would be implemented in a real API service
    console.log('Submitting service provider:', newServiceProvider);
    
    // Show toast notification
    toast({
      title: "Service registered",
      description: "Your service has been submitted for verification.",
    });
    
    setShowSuccess(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold tracking-tight">Service Provider Registration</h1>
        <p className="text-muted-foreground mb-4">
          Register your agricultural service to connect with farmers in need.
        </p>

        {showSuccess && (
          <div className="rounded-md bg-green-50 p-4 mb-4">
            <h3 className="text-sm font-medium text-green-800">
              Registration Successful!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              Your service has been registered and is awaiting verification.
            </div>
            <Button variant="link" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <Select value={businessType} onValueChange={setBusinessType} required>
              <SelectTrigger id="businessType">
                <SelectValue placeholder="Select a business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="quality-control">Quality Control</SelectItem>
                <SelectItem value="market-linkage">Market Linkage</SelectItem>
		            <SelectItem value="training">Training</SelectItem>
                <SelectItem value="input-supplier">Input Supplier</SelectItem>
                <SelectItem value="inspector">Inspector</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Services Offered</Label>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <div key={service} className="space-x-2">
                  <Checkbox
                    id={`service-${service}`}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={() => handleServiceChange(service)}
                  />
                  <Label htmlFor={`service-${service}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="county">County</Label>
            <Select value={county} onValueChange={setCounty} required>
              <SelectTrigger id="county">
                <SelectValue placeholder="Select a county" />
              </SelectTrigger>
              <SelectContent>
                {counties.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="specificLocation">Specific Location</Label>
            <Input
              id="specificLocation"
              type="text"
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Input
              id="contactInfo"
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag} className="space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagChange(tag)}
                  />
                  <Label htmlFor={`tag-${tag}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit">Register Service</Button>
        </form>
      </main>
    </div>
  );
};

export default ServiceProviderRegistration;
