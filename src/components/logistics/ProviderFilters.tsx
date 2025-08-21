
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ServiceProviderType } from '@/types';
import { Truck, Warehouse, Building, Store, MapPin, Pin } from 'lucide-react';

interface ProviderFiltersProps {
  selectedType: ServiceProviderType | 'all';
  setSelectedType: (value: ServiceProviderType | 'all') => void;
  selectedCounty: string;
  setSelectedCounty: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredProvidersCount: number;
  onResetFilters: () => void;
}

const ProviderFilters: React.FC<ProviderFiltersProps> = ({
  selectedType,
  setSelectedType,
  selectedCounty,
  setSelectedCounty,
  searchTerm,
  setSearchTerm,
  filteredProvidersCount,
  onResetFilters
}) => {
  const providerTypes: Array<{ value: ServiceProviderType | "all"; label: string; icon: any }> = [
    { value: "all", label: "All Providers", icon: MapPin },
    { value: "transport", label: "Transport Services", icon: Truck },
    { value: "storage", label: "Storage Facilities", icon: Warehouse },
    { value: "quality-control", label: "Quality Control", icon: Pin },
    { value: "training", label: "Training Providers", icon: Building },
    { value: "input-supplier", label: "Input Suppliers", icon: Store },
    { value: "inspector", label: "Inspectors", icon: Pin },
    { value: "market-linkage", label: "Market Linkage", icon: MapPin }
  ];
  
  const counties = [
    { value: "all", label: "All Counties" },
    { value: "nairobi", label: "Nairobi" },
    { value: "mombasa", label: "Mombasa" },
    { value: "kisumu", label: "Kisumu" },
    { value: "nakuru", label: "Nakuru" },
    { value: "kiambu", label: "Kiambu" },
    { value: "meru", label: "Meru" },
    { value: "kakamega", label: "Kakamega" },
    { value: "nyeri", label: "Nyeri" },
    { value: "machakos", label: "Machakos" },
    { value: "uasin-gishu", label: "Uasin Gishu" },
    { value: "kilifi", label: "Kilifi" }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Find Service Providers</CardTitle>
        <CardDescription>
          Filter by service type, location, or search by name
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Type of Service</label>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ServiceProviderType | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {providerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">County</label>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger>
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent>
                {counties.map((county) => (
                  <SelectItem key={county.value} value={county.value}>
                    {county.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <Input 
              placeholder="Search by name or service" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Checkbox id="verified" />
            <label htmlFor="verified" className="text-sm">
              Show verified providers only
            </label>
          </div>
          
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Reset Filters
          </Button>
          <div className="text-sm text-muted-foreground">
            Showing {filteredProvidersCount} providers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderFilters;
