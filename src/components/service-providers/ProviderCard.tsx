
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceProvider } from "@/types";
import { ExternalLink, MapPin, Phone, Star } from "lucide-react";

interface ProviderCardProps {
  provider: ServiceProvider;
  providerTypes: Array<{ value: string; label: string; }>;
}

export const ProviderCard = ({ provider, providerTypes }: ProviderCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{provider.name}</CardTitle>
            <CardDescription>
              {providerTypes.find(t => t.value === provider.businessType)?.label}
            </CardDescription>
          </div>
          {provider.verified && (
            <Badge variant="secondary">Verified</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">{provider.description}</p>
        
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>{provider.location.county}, {provider.location.specificLocation}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="line-clamp-1">{provider.contactInfo}</span>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
            <span className="ml-1 mr-1 font-medium">{provider.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {provider.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Profile
        </Button>
        {provider.website && (
          <Button variant="ghost" size="sm" asChild>
            <a href={provider.website} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Website
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
