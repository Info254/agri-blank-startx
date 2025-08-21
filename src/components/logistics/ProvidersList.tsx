
import React from 'react';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Truck, Warehouse, Building, Store, MapPin, Pin, CircleHelp } from 'lucide-react';

interface ProvidersListProps {
  providers: ServiceProvider[];
  isLoading: boolean;
  resetFilters: () => void;
}

const ProvidersList: React.FC<ProvidersListProps> = ({ providers, isLoading, resetFilters }) => {
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

  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-32 bg-muted" />
            <CardContent className="pt-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-4" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-5/6 mb-2" />
              <div className="h-3 bg-muted rounded w-4/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <CircleHelp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No providers found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search or filters
        </p>
        <Button onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.slice(0, 9).map((provider) => {
        const typeInfo = providerTypes.find(t => t.value === provider.businessType) || providerTypes[0];
        const TypeIcon = typeInfo.icon;
        
        return (
          <Card key={provider.id} className="overflow-hidden">
            <div className={`h-2 w-full ${provider.businessType === 'transport' ? 'bg-blue-500' : 
              provider.businessType === 'storage' ? 'bg-green-500' : 
              provider.businessType === 'training' ? 'bg-purple-500' : 
              provider.businessType === 'quality-control' ? 'bg-red-500' : 
              provider.businessType === 'input-supplier' ? 'bg-amber-500' : 
              'bg-teal-500'}`} />
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TypeIcon className="h-5 w-5 text-muted-foreground" />
                    {provider.name}
                  </CardTitle>
                  <CardDescription>
                    {typeInfo.label}
                  </CardDescription>
                </div>
                {provider.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary">Verified</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This provider has been verified by our team</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{provider.location.county}, {provider.location.specificLocation}</span>
              </div>
              
              <p className="line-clamp-2 text-sm text-muted-foreground">{provider.description}</p>
              
              <div className="flex flex-wrap gap-1 pt-2">
                {provider.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
                {provider.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{provider.tags.length - 3} more</Badge>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-0">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default ProvidersList;
