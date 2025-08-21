
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import ProgressIndicator from '@/components/transporter/ProgressIndicator';
import BusinessInfoForm from '@/components/transporter/BusinessInfoForm';
import VehicleDetailsForm from '@/components/transporter/VehicleDetailsForm';
import RegistrationSuccess from '@/components/transporter/RegistrationSuccess';
import { validateFormStep1, validateFormStep2 } from '@/components/transporter/TransporterFormValidation';

const TransporterSignUp: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<any>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [businessReg, setBusinessReg] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [description, setDescription] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleCount, setVehicleCount] = useState('');
  const [loadCapacity, setLoadCapacity] = useState('');
  const [rates, setRates] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [specialFeatures, setSpecialFeatures] = useState<string[]>([]);
  
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Meru', 'Kakamega', 
    'Nyeri', 'Machakos', 'Uasin Gishu', 'Kirinyaga', 'Bungoma', 'Bomet'
  ];

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleCountySelection = (county: string) => {
    if (selectedCounties.includes(county)) {
      setSelectedCounties(selectedCounties.filter(c => c !== county));
    } else {
      setSelectedCounties([...selectedCounties, county]);
    }
  };

  const handleAvailableTimeToggle = (time: string) => {
    if (availableTimes.includes(time)) {
      setAvailableTimes(availableTimes.filter(t => t !== time));
    } else {
      setAvailableTimes([...availableTimes, time]);
    }
  };

  const handleSpecialFeatureToggle = (feature: string) => {
    if (specialFeatures.includes(feature)) {
      setSpecialFeatures(specialFeatures.filter(f => f !== feature));
    } else {
      setSpecialFeatures([...specialFeatures, feature]);
    }
  };

  const handleNextStep = () => {
    const { valid, errors } = validateFormStep1(
      businessName,
      phone,
      email,
      selectedCounties,
      businessReg,
      yearsInBusiness,
      description
    );
    
    if (valid) {
      setFormErrors({});
      setFormStep(2);
    } else {
      setFormErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before continuing.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { valid, errors } = validateFormStep2(
      vehicleType,
      vehicleCount,
      loadCapacity,
      rates,
      availableTimes,
      specialFeatures
    );
    
    if (!valid) {
      setFormErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to register as a transporter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare data for insertion
      const transporterData = {
        user_id: user.id,
        name: businessName,
        service_type: "transport",
        counties: selectedCounties,
        contact_info: `${phone} | ${email}`,
        capacity: vehicleCount,
        load_capacity: parseInt(loadCapacity.split('-')[0]) || 1000,
        rates: rates,
        has_refrigeration: specialFeatures.includes('refrigeration'),
        vehicle_type: vehicleType
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('transporters')
        .insert(transporterData)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Registration Successful",
        description: "Your transporter account has been created. You'll start receiving transport requests soon.",
      });
      
      setFormStep(3); // Success step
    } catch (error) {
      console.error("Error submitting transporter data:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Transport Provider Registration</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join our network of transport providers and connect with farmers who need to move their produce to markets
          </p>
        </div>
        
        <ProgressIndicator formStep={formStep} />
        
        <Card className="max-w-4xl mx-auto">
          {formStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Tell us about your transport business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessInfoForm 
                  formErrors={formErrors}
                  businessName={businessName}
                  setBusinessName={setBusinessName}
                  phone={phone}
                  setPhone={setPhone}
                  email={email}
                  setEmail={setEmail}
                  selectedCounties={selectedCounties}
                  handleCountySelection={handleCountySelection}
                  businessReg={businessReg}
                  setBusinessReg={setBusinessReg}
                  yearsInBusiness={yearsInBusiness}
                  setYearsInBusiness={setYearsInBusiness}
                  description={description}
                  setDescription={setDescription}
                  handleNextStep={handleNextStep}
                  user={user}
                  counties={counties}
                />
              </CardContent>
            </>
          )}
          
          {formStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Vehicle & Service Details</CardTitle>
                <CardDescription>
                  Tell us about your transportation capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleDetailsForm 
                  formErrors={formErrors}
                  vehicleType={vehicleType}
                  setVehicleType={setVehicleType}
                  vehicleCount={vehicleCount}
                  setVehicleCount={setVehicleCount}
                  loadCapacity={loadCapacity}
                  setLoadCapacity={setLoadCapacity}
                  rates={rates}
                  setRates={setRates}
                  availableTimes={availableTimes}
                  handleAvailableTimeToggle={handleAvailableTimeToggle}
                  specialFeatures={specialFeatures}
                  handleSpecialFeatureToggle={handleSpecialFeatureToggle}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  setFormStep={setFormStep}
                />
              </CardContent>
            </>
          )}
          
          {formStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-center">Registration Complete!</CardTitle>
                <CardDescription className="text-center">
                  Thank you for joining our transport provider network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegistrationSuccess />
              </CardContent>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default TransporterSignUp;
