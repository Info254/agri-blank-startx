// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { createPartner } from '@/services/partnerService';
import { Partner } from '@/types/partner';
import PartnerBasicInfoForm from '@/components/partnerships/PartnerBasicInfoForm';
import PartnerServicesForm from '@/components/partnerships/PartnerServicesForm';
import PartnerLocationForm from '@/components/partnerships/PartnerLocationForm';
import PartnerVerificationForm from '@/components/partnerships/PartnerVerificationForm';
import { onboardingSchema, type OnboardingFormData } from '@/lib/validations/partner';

type FormStep = 'basic' | 'services' | 'location' | 'verification';

export default function PartnerOnboardingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps: { id: FormStep; title: string; description: string }[] = [
    { id: 'basic', title: 'Company Info', description: 'Basic information about your business' },
    { id: 'services', title: 'Services', description: 'What services do you offer?' },
    { id: 'location', title: 'Location', description: 'Where do you operate?' },
    { id: 'verification', title: 'Verification', description: 'Verify your business' },
  ];

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      // Basic Info
      companyName: '',
      businessRegistrationNumber: '',
      yearEstablished: new Date().getFullYear(),
      companyDescription: '',
      companyLogo: '',
      
      // Services
      serviceCategories: [],
      serviceDescription: '',
      serviceAreas: [],
      
      // Location
      address: {
        street: '',
        city: '',
        state: '',
        country: 'Kenya',
        postalCode: '',
        coordinates: null,
      },
      operatingCountries: ['Kenya'],
      hasMultipleLocations: false,
      additionalLocations: [],
      
      // Verification
      contactPerson: {
        name: '',
        email: '',
        phone: '',
        position: '',
      },
      documents: [],
      termsAccepted: false,
    },
  });

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const goToNextStep = async () => {
    // Validate current step before proceeding
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < steps.length) {
        setCurrentStep(steps[nextStepIndex].id as FormStep);
      }
    }
  };

  const goToPrevStep = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id as FormStep);
    }
  };

  const getFieldsForStep = (step: FormStep): string[] => {
    switch (step) {
      case 'basic':
        return ['companyName', 'businessRegistrationNumber', 'yearEstablished', 'companyDescription'];
      case 'services':
        return ['serviceCategories', 'serviceDescription'];
      case 'location':
        return ['address', 'operatingCountries'];
      case 'verification':
        return ['contactPerson', 'termsAccepted'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    if (!data.termsAccepted) {
      toast({
        title: 'Accept Terms',
        description: 'Please accept the terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'> = {
        name: data.companyName,
        description: data.companyDescription,
        registration_number: data.businessRegistrationNumber,
        year_established: data.yearEstablished,
        logo_url: data.companyLogo,
        services: data.serviceCategories,
        service_description: data.serviceDescription,
        address: data.address,
        coverage_areas: data.operatingCountries,
        contact_person: data.contactPerson,
        is_verified: false, // Will be verified by admin
        status: 'pending_review',
        documents: data.documents,
        rating: 0,
        review_count: 0,
      };

      const { data: partner, error } = await createPartner(partnerData);
      
      if (error) throw error;
      
      toast({
        title: 'Application Submitted',
        description: 'Your partner application has been submitted for review. We\'ll get back to you soon!',
      });
      
      navigate('/partner/dashboard');
    } catch (error) {
      console.error('Error submitting partner application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return <PartnerBasicInfoForm form={form} />;
      case 'services':
        return <PartnerServicesForm form={form} />;
      case 'location':
        return <PartnerLocationForm form={form} />;
      case 'verification':
        return <PartnerVerificationForm form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Become a Partner</h1>
          <p className="text-muted-foreground">
            Join our network of agricultural service providers and reach more customers
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center ${index < currentStepIndex ? 'text-primary' : 
                  index === currentStepIndex ? 'font-semibold' : 'text-muted-foreground'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index < currentStepIndex 
                    ? 'bg-primary text-primary-foreground' 
                    : index === currentStepIndex 
                      ? 'bg-primary/10 text-primary border-2 border-primary' 
                      : 'bg-muted'
                }`}>
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <span className="text-sm text-center">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStepIndex].title}</CardTitle>
            <CardDescription>{steps[currentStepIndex].description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}
              
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={currentStepIndex === 0 || isSubmitting}
                >
                  Back
                </Button>
                
                {currentStepIndex < steps.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={goToNextStep}
                    disabled={isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
