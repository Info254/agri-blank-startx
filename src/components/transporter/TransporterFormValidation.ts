
import { z } from 'zod';

// Form validation schema
export const transporterSchema = z.object({
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  counties: z.array(z.string()).min(1, "Please select at least one county"),
  businessReg: z.string().optional(),
  yearsInBusiness: z.string().min(1, "Please select years in business"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  vehicleType: z.string().min(1, "Please select a vehicle type"),
  vehicleCount: z.string().min(1, "Please select number of vehicles"),
  loadCapacity: z.string().min(1, "Please select load capacity"),
  rates: z.string().min(3, "Please provide your rates"),
  availableTimes: z.array(z.string()).min(1, "Please select at least one available time"),
  specialFeatures: z.array(z.string()).optional(),
});

export const validateFormStep1 = (
  businessName: string,
  phone: string,
  email: string,
  selectedCounties: string[],
  businessReg: string,
  yearsInBusiness: string,
  description: string
) => {
  try {
    const step1Data = {
      businessName,
      phone,
      email,
      counties: selectedCounties,
      businessReg,
      yearsInBusiness,
      description
    };
    
    // Partial validation for step 1 fields only
    const step1Schema = transporterSchema.pick({
      businessName: true,
      phone: true,
      email: true,
      counties: true,
      yearsInBusiness: true,
      description: true
    });
    
    step1Schema.parse(step1Data);
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const newErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      return { valid: false, errors: newErrors };
    }
    return { valid: false, errors: { form: "Validation failed" } };
  }
};

export const validateFormStep2 = (
  vehicleType: string,
  vehicleCount: string,
  loadCapacity: string,
  rates: string,
  availableTimes: string[],
  specialFeatures: string[]
) => {
  try {
    const step2Data = {
      vehicleType,
      vehicleCount,
      loadCapacity,
      rates,
      availableTimes,
      specialFeatures
    };
    
    // Partial validation for step 2 fields only
    const step2Schema = transporterSchema.pick({
      vehicleType: true,
      vehicleCount: true,
      loadCapacity: true,
      rates: true,
      availableTimes: true,
      specialFeatures: true
    });
    
    step2Schema.parse(step2Data);
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const newErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      return { valid: false, errors: newErrors };
    }
    return { valid: false, errors: { form: "Validation failed" } };
  }
};
