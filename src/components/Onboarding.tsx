
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package, Truck, BarChart, UserCheck, AlertCircle, Tractor, TrendingUp, Users, MapPin, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OnboardingProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
}

const onboardingSteps = [
  {
    title: "Welcome to AgriTender Connect",
    description: "The complete agricultural platform connecting farmers, buyers, and service providers across Kenya for efficient trade and supply chain management.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 relative">
        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
          <Tractor className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-l-transparent animate-spin-slow"></div>
      </div>
    )
  },
  {
    title: "Comprehensive Farm Management",
    description: "Manage your entire farm operation with land management, crop tracking, inventory control, and financial analytics - all in one integrated platform.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-slow">
        <BarChart className="w-12 h-12 text-primary" />
      </div>
    ),
    features: [
      "Land & Parcel Management with GPS mapping",
      "Crop Yield Tracking & Performance Analytics", 
      "Inventory & Stock Management with alerts",
      "Financial Management & Profit Analysis"
    ]
  },
  {
    title: "Direct Trading & Market Access",
    description: "Buy, sell, and barter agricultural commodities directly with verified farmers and buyers across Kenya, eliminating middlemen and maximizing profits.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <Package className="w-12 h-12 text-primary animate-bounce-slow" />
      </div>
    ),
    features: [
      "Real-time commodity trading platform",
      "Direct farmer-to-buyer connections",
      "Barter exchange for resource sharing",
      "Quality verification & certification"
    ]
  },
  {
    title: "Smart Logistics & Supply Chain",
    description: "Access an integrated network of transporters, warehouses, and storage facilities with route optimization and real-time tracking.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <Truck className="w-12 h-12 text-primary animate-slide-right" />
      </div>
    ),
    features: [
      "GPS-enabled transporter network",
      "Warehouse & storage facility mapping",
      "Route optimization & cost calculation",
      "Real-time shipment tracking"
    ]
  },
  {
    title: "Market Intelligence & Analytics", 
    description: "Make informed decisions with AI-powered market analysis, price forecasting, and real-time agricultural data from across Kenya.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <TrendingUp className="w-12 h-12 text-primary animate-pulse" />
      </div>
    ),
    features: [
      "Real-time market prices from AMIS Kenya",
      "AI-powered price forecasting",
      "Supply chain problem identification",
      "Performance benchmarking & KPIs"
    ]
  },
  {
    title: "Community & Knowledge Sharing",
    description: "Connect with fellow farmers, agricultural experts, and service providers. Share knowledge, solve problems, and grow together.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <Users className="w-12 h-12 text-primary animate-pulse" />
      </div>
    ),
    features: [
      "Community forums & discussions",
      "Expert agricultural advice & support",
      "Success stories & best practices",
      "Training events & workshops"
    ]
  },
  {
    title: "Start Your Agricultural Journey",
    description: "Join thousands of Kenyan farmers already using AgriTender Connect to increase their profits, reduce losses, and grow their agricultural business.",
    icon: (
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <UserCheck className="w-12 h-12 text-primary animate-pulse" />
      </div>
    ),
    actionItems: [
      {
        title: "Create Your Farmer Profile",
        description: "Set up your profile and list your crops and commodities"
      },
      {
        title: "Explore the Farm Management Portal",
        description: "Track your land, crops, inventory, and finances"
      },
      {
        title: "Connect With Buyers & Markets",
        description: "Start trading directly and access better prices"
      },
      {
        title: "Join the Community",
        description: "Learn from other farmers and share your experiences"
      }
    ]
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ 
  currentStep, 
  setCurrentStep, 
  completeOnboarding 
}) => {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setError(null);
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    try {
      setOpen(false);
      completeOnboarding();
    } catch (err) {
      setError("There was a problem completing the onboarding. Please try again.");
      console.error("Onboarding completion error:", err);
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  
  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) return;
      setOpen(value);
    }}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">Onboarding - {currentStepData.title}</DialogTitle>
        <div className="p-6 animate-fade-up">
          {currentStepData.icon}
          
          <h2 className="text-2xl font-bold text-center mb-2">
            {currentStepData.title}
          </h2>
          
          <p className="text-center text-muted-foreground mb-6">
            {currentStepData.description}
          </p>

          {currentStepData.features && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-center">Key Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-start bg-muted/40 p-3 rounded-lg">
                    <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-primary font-semibold text-xs">{index + 1}</span>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStepData.actionItems && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-center">Get Started:</h3>
              {currentStepData.actionItems.map((item, index) => (
                <div key={index} className="flex items-start mb-3 bg-muted/40 p-3 rounded-lg">
                  <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex space-x-1">
              {onboardingSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button onClick={handleNext}>
              {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Start Farming'}
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" size="sm" onClick={handleComplete}>
              Skip Introduction
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;
