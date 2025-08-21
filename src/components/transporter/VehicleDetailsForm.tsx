
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleDetailsFormProps {
  formErrors: Record<string, string>;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  vehicleCount: string;
  setVehicleCount: (value: string) => void;
  loadCapacity: string;
  setLoadCapacity: (value: string) => void;
  rates: string;
  setRates: (value: string) => void;
  availableTimes: string[];
  handleAvailableTimeToggle: (time: string) => void;
  specialFeatures: string[];
  handleSpecialFeatureToggle: (feature: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  setFormStep: (step: number) => void;
}

const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  formErrors,
  vehicleType,
  setVehicleType,
  vehicleCount,
  setVehicleCount,
  loadCapacity,
  setLoadCapacity,
  rates,
  setRates,
  availableTimes,
  handleAvailableTimeToggle,
  specialFeatures,
  handleSpecialFeatureToggle,
  handleSubmit,
  isSubmitting,
  setFormStep
}) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="vehicleType" className={formErrors.vehicleType ? "text-destructive" : ""}>
              Vehicle Type*
            </Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger className={formErrors.vehicleType ? "border-destructive" : ""}>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="truck-small">Truck (3-5 tons)</SelectItem>
                <SelectItem value="truck-medium">Truck (5-10 tons)</SelectItem>
                <SelectItem value="truck-large">Heavy Truck (10+ tons)</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.vehicleType && (
              <p className="text-xs text-destructive">{formErrors.vehicleType}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleCount" className={formErrors.vehicleCount ? "text-destructive" : ""}>
              Number of Vehicles*
            </Label>
            <Select value={vehicleCount} onValueChange={setVehicleCount}>
              <SelectTrigger className={formErrors.vehicleCount ? "border-destructive" : ""}>
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2-5">2-5</SelectItem>
                <SelectItem value="6-10">6-10</SelectItem>
                <SelectItem value="10+">More than 10</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.vehicleCount && (
              <p className="text-xs text-destructive">{formErrors.vehicleCount}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="loadCapacity" className={formErrors.loadCapacity ? "text-destructive" : ""}>
              Load Capacity*
            </Label>
            <Select value={loadCapacity} onValueChange={setLoadCapacity}>
              <SelectTrigger className={formErrors.loadCapacity ? "border-destructive" : ""}>
                <SelectValue placeholder="Select capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<1">Less than 1 ton</SelectItem>
                <SelectItem value="1-3">1-3 tons</SelectItem>
                <SelectItem value="3-5">3-5 tons</SelectItem>
                <SelectItem value="5-10">5-10 tons</SelectItem>
                <SelectItem value="10+">More than 10 tons</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.loadCapacity && (
              <p className="text-xs text-destructive">{formErrors.loadCapacity}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rates" className={formErrors.rates ? "text-destructive" : ""}>
              Average Rates*
            </Label>
            <Input 
              id="rates" 
              value={rates}
              onChange={(e) => setRates(e.target.value)}
              placeholder="e.g., KES 5,000 per trip"
              className={formErrors.rates ? "border-destructive" : ""}
            />
            {formErrors.rates && (
              <p className="text-xs text-destructive">{formErrors.rates}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label 
              htmlFor="availableTimes" 
              className={formErrors.availableTimes ? "text-destructive" : ""}
            >
              Available Times*
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="morning" 
                  checked={availableTimes.includes('morning')}
                  onCheckedChange={() => handleAvailableTimeToggle('morning')}
                />
                <label htmlFor="morning" className="text-sm">Morning (5AM-11AM)</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="afternoon" 
                  checked={availableTimes.includes('afternoon')}
                  onCheckedChange={() => handleAvailableTimeToggle('afternoon')}
                />
                <label htmlFor="afternoon" className="text-sm">Afternoon (11AM-4PM)</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="evening" 
                  checked={availableTimes.includes('evening')}
                  onCheckedChange={() => handleAvailableTimeToggle('evening')}
                />
                <label htmlFor="evening" className="text-sm">Evening (4PM-9PM)</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="night" 
                  checked={availableTimes.includes('night')}
                  onCheckedChange={() => handleAvailableTimeToggle('night')}
                />
                <label htmlFor="night" className="text-sm">Night (9PM-5AM)</label>
              </div>
            </div>
            {formErrors.availableTimes && (
              <p className="text-xs text-destructive">{formErrors.availableTimes}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Special Features</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="refrigeration" 
                  checked={specialFeatures.includes('refrigeration')}
                  onCheckedChange={() => handleSpecialFeatureToggle('refrigeration')}
                />
                <label htmlFor="refrigeration" className="text-sm">Refrigerated Transport</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tracking" 
                  checked={specialFeatures.includes('tracking')}
                  onCheckedChange={() => handleSpecialFeatureToggle('tracking')}
                />
                <label htmlFor="tracking" className="text-sm">GPS Tracking</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="insurance" 
                  checked={specialFeatures.includes('insurance')}
                  onCheckedChange={() => handleSpecialFeatureToggle('insurance')}
                />
                <label htmlFor="insurance" className="text-sm">Cargo Insurance</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="loading" 
                  checked={specialFeatures.includes('loading')}
                  onCheckedChange={() => handleSpecialFeatureToggle('loading')}
                />
                <label htmlFor="loading" className="text-sm">Loading/Unloading Service</label>
              </div>
            </div>
          </div>
        </div>
      </form>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setFormStep(1)}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Complete Registration"}
        </Button>
      </div>
    </>
  );
};

export default VehicleDetailsForm;
