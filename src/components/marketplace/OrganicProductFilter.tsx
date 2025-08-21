import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Leaf, 
  Award, 
  MapPin, 
  Calendar,
  Filter,
  X,
  Search
} from 'lucide-react';

interface OrganicFilters {
  organicOnly: boolean;
  certificationTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  location: string;
  harvestDate: string;
  qualityGrade: string[];
  searchTerm: string;
}

interface OrganicProductFilterProps {
  filters: OrganicFilters;
  onFiltersChange: (filters: OrganicFilters) => void;
  onClearFilters: () => void;
  productCount: number;
}

const CERTIFICATION_TYPES = [
  { id: 'kbs', name: 'Kenya Bureau of Standards (KBS)', icon: '🇰🇪' },
  { id: 'usda', name: 'USDA Organic', icon: '🇺🇸' },
  { id: 'eu', name: 'EU Organic', icon: '🇪🇺' },
  { id: 'jis', name: 'JAS Organic (Japan)', icon: '🇯🇵' },
  { id: 'ifoam', name: 'IFOAM Accredited', icon: '🌍' },
  { id: 'rainforest', name: 'Rainforest Alliance', icon: '🐸' },
  { id: 'fairtrade', name: 'Fairtrade Organic', icon: '⚖️' }
];

const QUALITY_GRADES = [
  'Premium Grade A',
  'Grade A',
  'Grade B',
  'Export Quality',
  'Local Market'
];

const KENYAN_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
  'Kitale', 'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho',
  'Embu', 'Migori', 'Homa Bay', 'Naivasha', 'Voi', 'Wajir'
];

const OrganicProductFilter: React.FC<OrganicProductFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  productCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (updates: Partial<OrganicFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleCertification = (certId: string) => {
    const updatedCerts = filters.certificationTypes.includes(certId)
      ? filters.certificationTypes.filter(id => id !== certId)
      : [...filters.certificationTypes, certId];
    
    updateFilters({ certificationTypes: updatedCerts });
  };

  const toggleQualityGrade = (grade: string) => {
    const updatedGrades = filters.qualityGrade.includes(grade)
      ? filters.qualityGrade.filter(g => g !== grade)
      : [...filters.qualityGrade, grade];
    
    updateFilters({ qualityGrade: updatedGrades });
  };

  const hasActiveFilters = 
    filters.organicOnly ||
    filters.certificationTypes.length > 0 ||
    filters.location ||
    filters.harvestDate ||
    filters.qualityGrade.length > 0 ||
    filters.searchTerm ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 10000;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Organic Product Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {productCount} products
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organic products..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Organic Only Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="organic-only"
            checked={filters.organicOnly}
            onCheckedChange={(checked) => updateFilters({ organicOnly: !!checked })}
          />
          <Label htmlFor="organic-only" className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            Certified Organic Only
          </Label>
        </div>

        {isExpanded && (
          <>
            <Separator />

            {/* Certification Types */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certification Types
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {CERTIFICATION_TYPES.map((cert) => (
                  <div key={cert.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert.id}
                      checked={filters.certificationTypes.includes(cert.id)}
                      onCheckedChange={() => toggleCertification(cert.id)}
                    />
                    <Label htmlFor={cert.id} className="text-sm flex items-center gap-2">
                      <span>{cert.icon}</span>
                      {cert.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range (KES per kg)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                    Min Price
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => updateFilters({
                      priceRange: {
                        ...filters.priceRange,
                        min: parseInt(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                    Max Price
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="10000"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => updateFilters({
                      priceRange: {
                        ...filters.priceRange,
                        max: parseInt(e.target.value) || 10000
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Select
                value={filters.location}
                onValueChange={(value) => updateFilters({ location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {KENYAN_COUNTIES.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Quality Grade */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quality Grade</Label>
              <div className="grid grid-cols-1 gap-2">
                {QUALITY_GRADES.map((grade) => (
                  <div key={grade} className="flex items-center space-x-2">
                    <Checkbox
                      id={grade}
                      checked={filters.qualityGrade.includes(grade)}
                      onCheckedChange={() => toggleQualityGrade(grade)}
                    />
                    <Label htmlFor={grade} className="text-sm">
                      {grade}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Harvest Date */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Harvest Period
              </Label>
              <Select
                value={filters.harvestDate}
                onValueChange={(value) => updateFilters({ harvestDate: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select harvest period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="last-week">Last week</SelectItem>
                  <SelectItem value="last-month">Last month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 months</SelectItem>
                  <SelectItem value="current-season">Current season</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Active Filters</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.organicOnly && (
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic Only
                  </Badge>
                )}
                {filters.certificationTypes.map((certId) => {
                  const cert = CERTIFICATION_TYPES.find(c => c.id === certId);
                  return cert ? (
                    <Badge key={certId} variant="secondary">
                      {cert.icon} {cert.name}
                    </Badge>
                  ) : null;
                })}
                {filters.location && (
                  <Badge variant="secondary">
                    <MapPin className="h-3 w-3 mr-1" />
                    {filters.location}
                  </Badge>
                )}
                {filters.qualityGrade.map((grade) => (
                  <Badge key={grade} variant="secondary">
                    {grade}
                  </Badge>
                ))}
                {(filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
                  <Badge variant="secondary">
                    KES {filters.priceRange.min}-{filters.priceRange.max}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganicProductFilter;
