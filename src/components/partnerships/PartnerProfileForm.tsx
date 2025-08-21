import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Partner } from '@/services/partnerService';
import { toast } from '@/components/ui/use-toast';
import { updatePartner } from '@/services/partnerService';

const partnerProfileSchema = z.object({
  companyName: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  companyEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phoneNumber: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  website: z.string().url({
    message: 'Please enter a valid URL.',
  }).optional().or(z.literal('')),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  partnerType: z.string({
    required_error: 'Please select a partner type.',
  }),
  address: z.string().min(5, {
    message: 'Please enter a valid address.',
  }),
  city: z.string().min(2, {
    message: 'Please enter a valid city.',
  }),
  country: z.string().min(2, {
    message: 'Please enter a valid country.',
  }),
  postalCode: z.string().min(3, {
    message: 'Please enter a valid postal code.',
  }),
  contactPerson: z.string().min(2, {
    message: 'Please enter a contact person name.',
  }),
  contactPersonRole: z.string().min(2, {
    message: 'Please enter a valid role.',
  }),
  isVerified: z.boolean().default(false),
  services: z.array(z.string()).optional(),
  coverageAreas: z.array(z.string()).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  bannerUrl: z.string().url().optional().or(z.literal('')),
  socialMedia: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

type PartnerProfileFormValues = z.infer<typeof partnerProfileSchema>;

interface PartnerProfileFormProps {
  initialData?: Partial<Partner>;
  onSuccess: (partner: Partner) => void;
  onCancel?: () => void;
}

export function PartnerProfileForm({ 
  initialData, 
  onSuccess,
  onCancel 
}: PartnerProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(initialData?.logoUrl || '');
  const [bannerPreview, setBannerPreview] = useState(initialData?.bannerUrl || '');

  const form = useForm<PartnerProfileFormValues>({
    resolver: zodResolver(partnerProfileSchema),
    defaultValues: {
      companyName: initialData?.companyName || '',
      companyEmail: initialData?.companyEmail || '',
      phoneNumber: initialData?.phoneNumber || '',
      website: initialData?.website || '',
      description: initialData?.description || '',
      partnerType: initialData?.partnerType || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      country: initialData?.country || 'Kenya',
      postalCode: initialData?.postalCode || '',
      contactPerson: initialData?.contactPerson || '',
      contactPersonRole: initialData?.contactPersonRole || '',
      isVerified: initialData?.isVerified || false,
      services: initialData?.services || [],
      coverageAreas: initialData?.coverageAreas || [],
      logoUrl: initialData?.logoUrl || '',
      bannerUrl: initialData?.bannerUrl || '',
      socialMedia: {
        facebook: initialData?.socialMedia?.facebook || '',
        twitter: initialData?.socialMedia?.twitter || '',
        linkedin: initialData?.socialMedia?.linkedin || '',
        instagram: initialData?.socialMedia?.instagram || '',
      },
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PartnerProfileFormValues) => {
    try {
      setLoading(true);
      // In a real app, you would upload the files to a storage service here
      // and update the data with the returned URLs before saving to the database
      
      const updatedPartner = await updatePartner({
        ...data,
        id: initialData?.id,
        logoUrl: logoPreview || data.logoUrl,
        bannerUrl: bannerPreview || data.bannerUrl,
      });
      
      onSuccess(updatedPartner);
      
      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating partner profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Information</h3>
            
            {/* Banner Image */}
            <div className="space-y-2">
              <FormLabel>Banner Image</FormLabel>
              <div className="flex items-center gap-4">
                <div className="w-full h-32 bg-muted rounded-md overflow-hidden">
                  {(bannerPreview || form.getValues('bannerUrl')) && (
                    <img 
                      src={bannerPreview || form.getValues('bannerUrl')} 
                      alt="Banner preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                  <label
                    htmlFor="banner-upload"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                  >
                    {bannerPreview || form.getValues('bannerUrl') ? 'Change' : 'Upload'}
                  </label>
                </div>
              </div>
              <FormDescription>
                Recommended size: 1200x300px. Max file size: 2MB.
              </FormDescription>
              <FormMessage />
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <FormLabel>Company Logo</FormLabel>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted overflow-hidden">
                  {(logoPreview || form.getValues('logoUrl')) && (
                    <img 
                      src={logoPreview || form.getValues('logoUrl')} 
                      alt="Logo preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                  >
                    {logoPreview || form.getValues('logoUrl') ? 'Change' : 'Upload'}
                  </label>
                </div>
              </div>
              <FormDescription>
                Recommended size: 200x200px. Max file size: 1MB.
              </FormDescription>
              <FormMessage />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partnerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select partner type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="logistics">Logistics Provider</SelectItem>
                        <SelectItem value="financial">Financial Institution</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="government">Government Agency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your company..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your company and services.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPersonRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role/Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sales Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+254 700 000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Nairobi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Kenya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="00100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="socialMedia.facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                          <span className="text-sm">fb.com/</span>
                        </div>
                        <Input 
                          placeholder="yourpage" 
                          className="rounded-l-none" 
                          {...field} 
                          value={field.value?.replace('https://facebook.com/', '') || ''}
                          onChange={(e) => field.onChange(`https://facebook.com/${e.target.value}`)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialMedia.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                          <span className="text-sm">twitter.com/</span>
                        </div>
                        <Input 
                          placeholder="yourhandle" 
                          className="rounded-l-none" 
                          {...field} 
                          value={field.value?.replace('https://twitter.com/', '') || ''}
                          onChange={(e) => field.onChange(`https://twitter.com/${e.target.value}`)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialMedia.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                          <span className="text-sm">linkedin.com/company/</span>
                        </div>
                        <Input 
                          placeholder="yourcompany" 
                          className="rounded-l-none" 
                          {...field} 
                          value={field.value?.replace('https://linkedin.com/company/', '') || ''}
                          onChange={(e) => field.onChange(`https://linkedin.com/company/${e.target.value}`)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialMedia.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                          <span className="text-sm">instagram.com/</span>
                        </div>
                        <Input 
                          placeholder="yourprofile" 
                          className="rounded-l-none" 
                          {...field} 
                          value={field.value?.replace('https://instagram.com/', '') || ''}
                          onChange={(e) => field.onChange(`https://instagram.com/${e.target.value}`)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Verification */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verification</h3>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Verified Partner</h4>
                <p className="text-sm text-muted-foreground">
                  Verified partners receive a badge on their profile and are more trusted by users.
                </p>
              </div>
              <FormField
                control={form.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled // Only admins can verify partners
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {form.getValues('isVerified') && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Your partner account is verified.</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
