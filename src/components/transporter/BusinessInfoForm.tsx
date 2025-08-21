
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface BusinessInfoFormProps {
  formErrors: Record<string, string>;
  businessName: string;
  setBusinessName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  selectedCounties: string[];
  handleCountySelection: (county: string) => void;
  businessReg: string;
  setBusinessReg: (value: string) => void;
  yearsInBusiness: string;
  setYearsInBusiness: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  handleNextStep: () => void;
  user: any;
  counties: string[];
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  formErrors,
  businessName,
  setBusinessName,
  phone,
  setPhone,
  email,
  setEmail,
  selectedCounties,
  handleCountySelection,
  businessReg,
  setBusinessReg,
  yearsInBusiness,
  setYearsInBusiness,
  description,
  setDescription,
  handleNextStep,
  user,
  counties
}) => {
  return (
    <>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessName" className={formErrors.businessName ? "text-destructive" : ""}>
              Business Name*
            </Label>
            <Input 
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your transport company name"
              className={formErrors.businessName ? "border-destructive" : ""}
            />
            {formErrors.businessName && (
              <p className="text-xs text-destructive">{formErrors.businessName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className={formErrors.phone ? "text-destructive" : ""}>
              Phone Number*
            </Label>
            <Input 
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254..."
              className={formErrors.phone ? "border-destructive" : ""}
            />
            {formErrors.phone && (
              <p className="text-xs text-destructive">{formErrors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className={formErrors.email ? "text-destructive" : ""}>
              Email Address*
            </Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@yourcompany.com"
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && (
              <p className="text-xs text-destructive">{formErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className={formErrors.counties ? "text-destructive" : ""}>Counties Served*</Label>
            <div className="grid grid-cols-2 gap-2">
              {counties.map((county) => (
                <div key={county} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`county-${county}`} 
                    checked={selectedCounties.includes(county)}
                    onCheckedChange={() => handleCountySelection(county)}
                  />
                  <label 
                    htmlFor={`county-${county}`} 
                    className="text-sm cursor-pointer"
                  >
                    {county}
                  </label>
                </div>
              ))}
            </div>
            {formErrors.counties && (
              <p className="text-xs text-destructive">{formErrors.counties}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessReg">
              Business Registration Number (Optional)
            </Label>
            <Input 
              id="businessReg"
              value={businessReg}
              onChange={(e) => setBusinessReg(e.target.value)}
              placeholder="KE12345678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsInBusiness" className={formErrors.yearsInBusiness ? "text-destructive" : ""}>
              Years in Business*
            </Label>
            <Select value={yearsInBusiness} onValueChange={setYearsInBusiness}>
              <SelectTrigger className={formErrors.yearsInBusiness ? "border-destructive" : ""}>
                <SelectValue placeholder="Select years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<1">Less than 1 year</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5+">More than 5 years</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.yearsInBusiness && (
              <p className="text-xs text-destructive">{formErrors.yearsInBusiness}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className={formErrors.description ? "text-destructive" : ""}>
            Business Description*
          </Label>
          <Textarea 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us more about your transport services..."
            rows={4}
            className={formErrors.description ? "border-destructive" : ""}
          />
          {formErrors.description && (
            <p className="text-xs text-destructive">{formErrors.description}</p>
          )}
        </div>
      </form>
      
      {!user && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            You are not logged in. Please <a href="/login" className="text-primary font-medium">sign in</a> or 
            <a href="/signup" className="text-primary font-medium"> create an account</a> to register as a transporter.
          </p>
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleNextStep} disabled={!user}>
          Continue
        </Button>
      </div>
    </>
  );
};

export default BusinessInfoForm;
